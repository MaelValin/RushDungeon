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
let gameState = 'menu'; // 'menu' ou 'playing' ou 'paused' ou 'gameover'

function setup() {
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    world.gravity.y = 0; // Pas de gravité pour un runner

    //joueur
    player = new Sprite();
    player.width = 50;
    player.color = 'blue';
    player.rotation = 0;
    player.visible = false; // Caché au démarrage
    
    
   
    
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
    
    if (gameState === 'menu') {
        player.visible = false;
        displayMenuStart();
    } 

    else if (gameState === 'paused') {
        // Afficher le menu de pause
    }

    else if (gameState === 'gameover') {
        // Afficher le menu de fin de jeu
        displayMenuEnd();
    }
    
    
    else if (gameState === 'playing') {
        player.visible = true;
        
        // Dessiner la route avec effet 3D
        drawRoad();
        
        // Déplacer et gérer les obstacles
        moveObstacles();

        // Déplacer le joueur vers la colonne actuelle
        movePlayer();

        // Vérifier les collisions
        PlayerLoose();

        
        // Générer de nouveaux obstacles
        if (frameCount % 80 === 0) {
            spawnObstacle();
        }
        
        
        
        // Score
        score += 0.1;
        
        // Interface
        displayUI();
    }
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

function movePlayer() {
    // Positionner le joueur au centre de sa lane
    player.y = GAME_HEIGHT - 400;
    let targetX = getLaneX(currentLane, player.y);
    player.x = lerp(player.x, targetX, 0.1); // ici le 0.1 est la vitesse de transition (plus c'est élévé plus c'est rapide)
    
    // Limiter le joueur dans les bordes de la route (en gros ça vas s'adapter a la perspective)
    let progress = (player.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let minX = GAME_WIDTH / 2 - totalWidth / 2 + player.width / 2;
    let maxX = GAME_WIDTH / 2 + totalWidth / 2 - player.width / 2;
    player.x = constrain(player.x, minX, maxX);
    
    if (kb.pressed('a') || kb.pressed('ArrowLeft')) {
        if (currentLane > 0) currentLane--;
    }
    if (kb.pressed('d') || kb.pressed('ArrowRight')) {
        if (currentLane < NUM_LANES - 1) currentLane++;
    }
}

function keyPressed() {
    if (key === ' ') { // ESPACE
        if (gameState === 'menu') {
            StartGame();
        } else if (gameState === 'gameover') {
            StartGame();
        }
        return false; // Empêcher le scroll
    }
    if (key === 'm' || key === 'M') { // M pour retour au menu
        if (gameState === 'gameover') {
            gameState = 'menu';
            score = 0;
        }
    }
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

function StartGame() {
    gameState = 'playing';
    score = 0;
    obstacles.removeAll();
    currentLane = 1;
    rotation = 0;
    player.x = getLaneX(currentLane, player.y);
    player.y = GAME_HEIGHT - 400;
}

function PlayerLoose(){
    if (player.collides(obstacles)){
        EndGame();
    }
    
}

function EndGame(){
    gameState = 'gameover';
    player.visible = false;
    obstacles.removeAll();
}

function PauseGame(){}

function ResumeGame(){}

function RestartGame(){}

function displayMenuStart() {
    // Afficher le titre
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(72);
    textStyle(BOLD);
    text('RushDungeon', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 200);
    
    // Afficher les instructions
    textSize(24);
    textStyle(NORMAL);
    fill(150, 200, 255);
    text('Appuyez sur le bouton START pour commencer', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);
    text('ou appuyez sur ESPACE', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150);
}

function displayMenuEnd() {
    // Afficher le titre
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(72);
    textStyle(BOLD);
    text('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 200);
    
    // Afficher le score
    textSize(36);
    fill(200, 200, 100);
    text(`Score: ${floor(score)}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
    
    // Afficher les instructions
    textSize(24);
    fill(150, 200, 255);
    text('Appuyez sur ESPACE pour rejouer', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
    text('ou appuyez sur M pour retour au menu', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130);
}

function displayScore() {
    fill(255);
    noStroke();
    textSize(24);
    textStyle(NORMAL);
    textAlign(RIGHT, TOP);
    text(`Score: ${floor(score)}`, GAME_WIDTH - 200, 20);
}



 

function displayUI() {
    displayScore();
}