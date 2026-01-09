// Configuration du jeu
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 900;
const NUM_LANES = 3;
const LANE_WIDTH_BOTTOM = 800;
const LANE_WIDTH_TOP = 80;
const PERSPECTIVE_START_Y = 100;

let gameSpeed = 5;
let score = 0;
let spawnInterval = 80; // Intervalle de spawn initial
let lastSpawnFrame = 0; // Dernier frame où un obstacle a spawné
let gameState = 'loading'; // 'loading', 'menu', 'playing', 'paused', 'gameover'
let modelsLoaded = {
    handPose: false,
    bodyPose: false
};

// Variable pour la musique de fond
let backgroundMusic;

function areModelsLoaded() {
    return modelsLoaded.handPose && modelsLoaded.bodyPose;
}

// Physique du saut en Z
let playerZ = 0; // Hauteur du joueur (0 = sol)
let playerVz = 0; // Vélocité Z (montée/descente)
const GRAVITY = 0.9; // Accélération vers le bas
const JUMP_FORCE = 20; // Force du saut initial (réduit pour sauter moins haut)

// Fonction pour initialiser et jouer la musique en boucle
function initMusic() {
    backgroundMusic = new Audio('assets/ThemePrincipal.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.25;
    backgroundMusic.play().catch(err => {
        console.log("La musique nécessite une interaction utilisateur pour démarrer");
    });
}

function setup() {
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    world.gravity.y = 0;

    initVideo();
    initPlayer();
    initObstacles();
    initMusic(); // Démarre la musique
    
    const modeBtn = document.getElementById('modeToggle');
    modeBtn.addEventListener('click', (e) => {
        switchMode();
        e.target.blur(); // Retirer le focus après le clic
    });
    
    // Empêcher la barre espace d'activer le bouton
    modeBtn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
        }
    });
}

function draw() {
    if (gameState === 'loading') {
        background(20, 20, 40);
        displayLoadingScreen();
        
        // Vérifier si les modèles sont chargés
        if (areModelsLoaded()) {
            gameState = 'menu';
        }
    }
    
    else if (gameState === 'menu') {
        background(20, 20, 40);
        drawRoad();
        player.visible = false;
        displayMenuStart();
    } 

    else if (gameState === 'paused') {
        // Afficher le menu de pause
    }

    else if (gameState === 'gameover') {
        background(20, 20, 40);
        drawRoad();
        // Afficher le menu de fin de jeu
        displayMenuEnd();
    }
    
    
    else if (gameState === 'playing') {
        player.visible = true; // Activer le rendu auto pour afficher le sprite animé
        drawVideo();
        drawRoad();
        updatePlayer();

        // Vérifier les collisions
        PlayerLoose();

        moveObstacles();
    
        // Système de difficulté progressive - réduire l'intervalle de spawn
        // Score 100 = intervalle 70, Score 500 = intervalle 50, Score 1000 = intervalle 35, etc.
        spawnInterval = max(30, 80 - floor(score / 100) * 2); // Min 30 frames, réduit de 2 frames tous les 100 points
        
        if (frameCount - lastSpawnFrame >= spawnInterval) {
            spawnRandomObstacle();
            lastSpawnFrame = frameCount;
        }
    
        score += 0.1;
        
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

function displayLoadingScreen() {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text('CHARGEMENT...', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
    
    textSize(24);
    textStyle(NORMAL);
    let loadingText = 'Initialisation des modèles IA:\n';
    loadingText += modelsLoaded.handPose ? '✓ HandPose chargé' : '⏳ HandPose en cours...';
    loadingText += '\n';
    loadingText += modelsLoaded.bodyPose ? '✓ BodyPose chargé' : '⏳ BodyPose en cours...';
    
    text(loadingText, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    
    // Animation de chargement
    let dotCount = floor((frameCount / 30) % 4);
    let dots = '.'.repeat(dotCount);
    textSize(32);
    text(dots, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150);
}