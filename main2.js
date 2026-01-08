// Configuration du jeu
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 900;
const NUM_LANES = 3;
const LANE_WIDTH_BOTTOM = 800;
const LANE_WIDTH_TOP = 80;
const PERSPECTIVE_START_Y = 100;

let gameSpeed = 5;
let score = 0;
let gameState = 'menu'; // 'menu' ou 'playing' ou 'paused' ou 'gameover'

// Physique du saut en Z
let playerZ = 0; // Hauteur du joueur (0 = sol)
let playerVz = 0; // Vélocité Z (montée/descente)
const GRAVITY = 0.9; // Accélération vers le bas
const JUMP_FORCE = 25; // Force du saut initial
let readyToJump = true; // Pour contrôler le saut

function setup() {
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    world.gravity.y = 0;

    initVideo();
    initPlayer();
    initObstacles();
    
    document.getElementById('modeToggle').addEventListener('click', () => {
        switchMode();
    });
}

function draw() {
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
        player.visible = false; // Désactiver le rendu auto
        drawVideo();
        drawRoad();
        updatePlayer();
        movePlayer();

        // Vérifier les collisions
        PlayerLoose();

        moveObstacles();
    
        if (frameCount % 80 === 0) {
            spawnRandomObstacle();
        }
    
        score += 0.1;
        
        // Redessiner le joueur en dernier pour qu'il soit toujours au-dessus
        push();
        fill(player.color);
        let scale = 1 + (playerZ / 300);
        rect(player.x - (player.width/2)*scale, player.y - (player.height/2)*scale, player.width*scale, player.height*scale);
        pop();
        
        displayUI();
    }
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