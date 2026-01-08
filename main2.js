// Configuration du jeu
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 900;
const NUM_LANES = 3;
const LANE_WIDTH_BOTTOM = 800;
const LANE_WIDTH_TOP = 80;
const PERSPECTIVE_START_Y = 100;

let gameSpeed = 5;
let score = 0;

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
    drawVideo();
    drawRoad();
    updateObstacles();
    updatePlayer();

    if (frameCount % 80 === 0) {
        spawnObstacle();
    }

    score += 0.1;
    drawUI(score);
}