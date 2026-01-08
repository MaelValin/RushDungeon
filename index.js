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
let obstacles1;  // Carrés rouges au sol
let obstacles2;  // Ronds bleus en l'air
let obstacles3;  // Rectangles verts (moyens)
let grounds;
let currentLane = 1; // Lane du milieu (0, 1, 2)
let gameSpeed = 5;
let score = 0;
let isJumping = false;
let isDucking = false;


//obstacle dimensions
let obstacle1Width = 120;
let obstacle1Height = 120;

let obstacle2Width = 90;
let obstacle2Height = 90;

let obstacle3Width = 120;
let obstacle3Height = 180;

function setup() {
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    world.gravity.y = 0;
    
    // Créer le joueur
    player = new Sprite();
    player.width = 60;
    player.height = 100;
    player.normalHeight = 100;
    player.duckHeight = 50;
    player.groundY = GAME_HEIGHT - 150;
    player.y = player.groundY;
    player.color = 'dodgerblue';
    player.rotationLock = true;
    player.collider = 'kinematic';
    updatePlayerPosition();
    
    // Groupes d'obstacles - Carrés rouges au sol
    obstacles1 = new Group();
    obstacles1.color = 'red';
    obstacles1.collider = 'kinematic';
    
    // Ronds bleus en l'air
    obstacles2 = new Group();
    obstacles2.color = 'blue';
    obstacles2.collider = 'kinematic';
    
    // Rectangles verts (ni haut ni bas)
    obstacles3 = new Group();
    obstacles3.color = 'green';
    obstacles3.collider = 'kinematic';
    
    // Groupe pour le sol visuel
    grounds = new Group();
    grounds.collider = 'none';
}

function draw() {
    background(20, 20, 40);
    
    // Dessiner la route avec effet 3D
    drawRoad();
    
    // Déplacer et gérer tous les obstacles
    moveObstacles();
    
    // Générer de nouveaux obstacles
    if (frameCount % 80 === 0) {
        spawnRandomObstacle();
    }
    
    // Contrôles du joueur
    handlePlayerMovement();
    
    // Gérer le saut et l'accroupissement
    updatePlayerState();
    
    // Vérifier les collisions
    checkCollisions();
    
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
    
function updatePlayerPosition() {
    // Positionne le joueur dans la bonne colonne avec effet 3D
    player.x = getLaneX(currentLane, player.y);
}

function handlePlayerMovement() {
    // Changement de colonne avec Q/D ou flèches
    if (kb.presses('left') || kb.presses('q')) {
        if (currentLane > 0) {
            currentLane--;
            updatePlayerPosition();
        }
    }
    if (kb.presses('right') || kb.presses('d')) {
        if (currentLane < NUM_LANES - 1) {
            currentLane++;
            updatePlayerPosition();
        }
    }
    
    // Saut (Espace ou Z)
    if ((kb.presses('space') || kb.presses('z') || kb.presses('up')) && !isJumping && !isDucking) {
        isJumping = true;
        player.jumpStartY = player.y;
        player.jumpVelocity = -15;
    }
    
    // S'accroupir (S ou Bas)
    if ((kb.pressing('s') || kb.pressing('down')) && !isJumping) {
        isDucking = true;
        player.height = player.duckHeight;
    } else if (!isJumping) {
        isDucking = false;
        player.height = player.normalHeight;
    }
}

function updatePlayerState() {
    // Gestion du saut
    if (isJumping) {
        player.y += player.jumpVelocity;
        player.jumpVelocity += 0.8; // Gravité
        
        // Retour au sol
        if (player.y >= player.groundY) {
            player.y = player.groundY;
            isJumping = false;
            player.height = player.normalHeight;
        }
    }
    
    updatePlayerPosition();
}


function restartGame() {
    // Réinitialiser le jeu
    score = 0;
    gameSpeed = 5;
    currentLane = 1;
    isJumping = false;
    isDucking = false;
    
    // Supprimer tous les obstacles
    obstacles1.removeAll();
    obstacles2.removeAll();
    obstacles3.removeAll();
    
    // Repositionner le joueur
    player.y = player.groundY;
    updatePlayerPosition();
    
    loop();
}

function spawnRandomObstacle() {
    let lane = floor(random(NUM_LANES));
    let obstacleType = floor(random(3)); // 0, 1, ou 2
    
    if (obstacleType === 0) {
        spawnObstacle1(lane); // Carré rouge au sol
    } else if (obstacleType === 1) {
        spawnObstacle2(lane); // Rond bleu en l'air
    } else {
        spawnObstacle3(lane); // Rectangle vert moyen
    }
}

function spawnObstacle1(lane) {
    // Carré rouge au sol (on peut sauter ou esquiver)
    let obstacle = new obstacles1.Sprite();
    obstacle.width = obstacle1Width;
    obstacle.height = obstacle1Height;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'red';
    obstacle.type = 1;
}

function spawnObstacle2(lane) {
    // Rond bleu en l'air (on passe en dessous ou esquive)
    let obstacle = new obstacles2.Sprite();
    obstacle.diameter = obstacle2Width;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'blue';
    obstacle.type = 2;
}

function spawnObstacle3(lane) {
    // Rectangle vert (on ne peut qu'esquiver)
    let obstacle = new obstacles3.Sprite();
    obstacle.width = obstacle3Width;
    obstacle.height = obstacle3Height;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'green';
    obstacle.type = 3;
}

function moveObstacles() {
    // Déplacer tous les types d'obstacles
    let allObstacles = [...obstacles1, ...obstacles2, ...obstacles3];
    
    for (let obs of allObstacles) {
        obs.y += gameSpeed;
        
        // Ajuster la position X selon l'effet de perspective
        obs.x = getLaneX(obs.lane, obs.y);
        
        // Ajuster la taille selon la distance (effet 3D)
        let progress = (obs.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        progress = constrain(progress, 0, 1);
        let scale = lerp(0.5, 1, progress);
        
        if (obs.type === 1) {
            obs.width = obstacle1Width * scale;
            obs.height = obstacle1Height * scale;
        } else if (obs.type === 2) {
            obs.diameter = obstacle2Width * scale;
        } else if (obs.type === 3) {
            obs.width = obstacle3Width * scale;
            obs.height = obstacle3Height * scale;
        }
        
        // Supprimer si hors écran
        if (obs.y > GAME_HEIGHT + 50) {
            obs.remove();
        }
    }
}

function checkCollisions() {
    let allObstacles = [...obstacles1, ...obstacles2, ...obstacles3];
    
    for (let obs of allObstacles) {
        if (player.overlaps(obs)) {
            // Game over
            gameSpeed = 0;
            fill(255, 0, 0);
            textSize(80);
            textAlign(CENTER, CENTER);
            text('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2);
            textSize(40);
            text(`Score: ${floor(score)}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
            textSize(30);
            text('Appuyez sur R pour recommencer', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130);
            noLoop();
            
            // Touche R pour restart
            if (kb.presses('r')) {
             
        }
    }
}
}



function displayUI() {
    fill(255);
    noStroke();
    textSize(24);
    // textAlign(LEFT);
    // text(`Score: ${floor(score)}`, 20, 35);
    // text(`Vitesse: ${gameSpeed}`, 20, 65);
    
    // textSize(16);
    // text(`Q/D: Changer de colonne`, 20, GAME_HEIGHT - 60);
    // text(`Espace/Z: Sauter (carrés rouges)`, 20, GAME_HEIGHT - 40);
    // text(`S/Bas: S'accroupir (ronds bleus)`, 20, GAME_HEIGHT - 20);
    

}
