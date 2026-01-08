// Configuration du jeu
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 900;

// Configuration des colonnes (type Subway Surfers)
const NUM_LANES = 3;
const LANE_WIDTH_BOTTOM = 800;  // Largeur d'une colonne en bas
const LANE_WIDTH_TOP = 80;      // Largeur d'une colonne en haut (effet 3D)
const PERSPECTIVE_START_Y = 100; // Où commence l'effet de perspective

// Variables globales
let player;
let obstacles;
let grounds;
let currentLane = 1; // Lane du milieu (0, 1, 2)
let gameSpeed = 5;
let score = 0;

function setup() {
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    world.gravity.y = 0; // Pas de gravité pour un runner
    
   
    
    // Groupes d'obstacles
    obstacles = new Group();
    obstacles.color = 'red';
    obstacles.collider = 'kinematic';
    
    // Groupe pour le sol visuel
    grounds = new Group();
    grounds.collider = 'none';
}

function draw() {
    background(20, 20, 40);
    
    // Dessiner la route avec effet 3D
    drawRoad();
    
    // Déplacer et gérer les obstacles
    moveObstacles();
    
    // Générer de nouveaux obstacles
    if (frameCount % 80 === 0) {
        spawnObstacle();
    }
    
    
    
    // Score
    score += 0.1;
    
    // Interface
    displayUI();
}

function drawRoad() {
    push();
    noStroke();
    
    // Fond de route avec dégradé
    for (let y = PERSPECTIVE_START_Y; y < GAME_HEIGHT; y += 5) {
        let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        let roadWidth = lerp(LANE_WIDTH_TOP * NUM_LANES, LANE_WIDTH_BOTTOM * NUM_LANES, progress);
        
        fill(50, 50, 70, 100);
        rect(GAME_WIDTH / 2 - roadWidth / 2, y, roadWidth, 5);
    }
    
    // Lignes de séparation des colonnes
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    
    for (let i = 1; i < NUM_LANES; i++) {
        let topX = getLaneX(i, PERSPECTIVE_START_Y) - LANE_WIDTH_TOP / 2;
        let bottomX = getLaneX(i, GAME_HEIGHT) - LANE_WIDTH_BOTTOM / 2;
        line(topX, PERSPECTIVE_START_Y, bottomX, GAME_HEIGHT);
    }
    
    
    
    pop();
}

function getLaneX(laneIndex, y) {
    // Calcule la position X d'une colonne avec effet de perspective
    let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let startX = GAME_WIDTH / 2 - totalWidth / 2;
    
    return startX + currentLaneWidth * (laneIndex + 0.5);
}



function spawnObstacle() {
    let lane = floor(random(NUM_LANES));
    let obstacle = new obstacles.Sprite();
    obstacle.width = 40;
    obstacle.height = 50;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = color(random(200, 255), 0, random(100, 200));
}

function moveObstacles() {
    for (let obs of obstacles) {
        obs.y += gameSpeed;
        
        // Ajuster la position X selon l'effet de perspective
        obs.x = getLaneX(obs.lane, obs.y);
        
        // Ajuster la taille selon la distance (effet 3D)
        let progress = (obs.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        progress = constrain(progress, 0, 1);
        let scale = lerp(0.5, 1, progress);
        obs.width = 40 * scale;
        obs.height = 50 * scale;
        
        // Supprimer si hors écran
        if (obs.y > GAME_HEIGHT + 50) {
            obs.remove();
        }
    }
}



function displayUI() {
    fill(255);
    noStroke();
    textSize(20);
    // textAlign(LEFT);
    // text(`Score: ${floor(score)}`, 20, 30);
    // text(`Vitesse: ${gameSpeed}`, 20, 55);
    // text(`Colonne: ${currentLane + 1}`, 20, 80);
    
    // textSize(14);
    // text(`Q/D ou Flèches: Changer de colonne`, 20, GAME_HEIGHT - 20);
}