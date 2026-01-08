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
        player.visible = true;
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