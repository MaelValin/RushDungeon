let logoImage;
let chevalierImage
let pierreImage;
let arbreImage;

function initMenu() {
    logoImage = loadImage('./assets/Logo.png');
    chevalierImage = loadImage('./assets/chevalier.png');
    pierreImage = loadImage('./assets/pierre.png');
    arbreImage = loadImage('./assets/arbre1.png');
    arbremortImage = loadImage('./assets/arbre2.png');
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
            spawnInterval = 80; // Réinitialiser l'intervalle de spawn
            lastSpawnFrame = 0; // Réinitialiser le dernier frame de spawn
        }
    }
}

function StartGame() {
    gameState = 'playing';
    score = 0;
    spawnInterval = 80; // Réinitialiser l'intervalle de spawn
    lastSpawnFrame = 0; // Réinitialiser le dernier frame de spawn
    obstacles.removeAll();
    currentLane = 1;
    player.x = getLaneX(currentLane, player.y);
    player.y = GAME_HEIGHT - 400;
}

function PlayerLoose(){
    // Vérifier les collisions selon le type d'obstacle et l'état du joueur
    for (let obs of obstacles) {
        if (player.overlaps(obs)) {
            // Obstacle 1 (rouge au sol) : collision seulement si le joueur ne saute pas
            if (obs.type === 1 && playerZ === 0) {
                EndGame();
                return;
            }
            
            // Obstacle 2 (corbeau en l'air) : collision seulement si le joueur saute
            if (obs.type === 2 && playerZ > 0) {
                EndGame();
                return;
            }
            
            // Obstacle 3 (arbre) : collision toujours, sauf si le joueur saute assez haut
            if (obs.type === 3 && playerZ < 100) {
                EndGame();
                return;
            }
        }
    }
}

function EndGame(){
    gameState = 'gameover';
    player.visible = false;
    obstacles.removeAll();
    
    // Sauvegarder le mode actuel dans localStorage
    localStorage.setItem('gameMode', currentMode);
}

function PauseGame(){}

function ResumeGame(){}

function RestartGame(){}

function displayMenuStart() {
    // Afficher le logo au lieu du titre
   

    if(chevalierImage) {
        imageMode(CENTER);
        let chevalierWidth = 400;
        let chevalierHeight = chevalierWidth * (chevalierImage.height / chevalierImage.width);
        image(chevalierImage, GAME_WIDTH / 2-500, GAME_HEIGHT / 2 + 50, chevalierWidth, chevalierHeight);
    }

    if(arbreImage) {
        imageMode(CENTER);
        let arbreWidth = 1500;
        let arbreHeight = arbreWidth * (arbreImage.height / arbreImage.width);
        image(arbreImage, GAME_WIDTH / 2 + 500, GAME_HEIGHT / 2 - 100, arbreWidth, arbreHeight);
    }
    

    if(pierreImage) {
        imageMode(CENTER);
        let pierreWidth = 300;
        let pierreHeight = pierreWidth * (pierreImage.height / pierreImage.width);
        image(pierreImage, GAME_WIDTH / 2 + 350, GAME_HEIGHT / 2 + 250, pierreWidth, pierreHeight);
    }

     if (logoImage) {
        imageMode(CENTER);
        let logoWidth = 800;
        let logoHeight = logoWidth * (logoImage.height / logoImage.width);
        image(logoImage, GAME_WIDTH / 2, GAME_HEIGHT / 2 -100, logoWidth, logoHeight);
    }

    
    // Afficher les instructions avec effet de clignotement doux
    textAlign(CENTER, CENTER);
    textSize(48);
    textStyle(NORMAL);
    
    // Effet de clignotement doux avec une fonction sinusoïdale
    let alpha = map(sin(frameCount * 5), -1, 1, 100, 255);
    fill(255, 255, 255, alpha);
    
    text('ESPACE', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 250);
}

function displayMenuEnd() {

    if(pierreImage) {
        imageMode(CENTER);
        let pierreWidth = 300;
        let pierreHeight = pierreWidth * (pierreImage.height / pierreImage.width);
        image(pierreImage, GAME_WIDTH / 2 + 450, GAME_HEIGHT / 2 + 250, pierreWidth, pierreHeight);
    }
    if(pierreImage) {
        imageMode(CENTER);
        let pierreWidth = 200;
        let pierreHeight = pierreWidth * (pierreImage.height / pierreImage.width);
        image(pierreImage, GAME_WIDTH / 2 + 280, GAME_HEIGHT / 2 + 300, pierreWidth, pierreHeight);
    }

    if(arbremortImage) {
        imageMode(CENTER);
        let arbremortWidth = 400;
        let arbremortHeight = arbremortWidth * (arbremortImage.height / arbremortImage.width);
        image(arbremortImage, GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 300, arbremortWidth, arbremortHeight);
    }
    // Afficher le titre
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(200);
    textStyle(BOLD);
    text('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 200);
    
    // Afficher le score
    textSize(36);
    fill(200, 200, 100);
    text(`Score: ${floor(score)}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
    
    // Effet de clignotement doux avec une fonction sinusoïdale
    let alpha = map(sin(frameCount * 5), -1, 1, 100, 255);
    fill(255, 255, 255, alpha);
    
    text('ESPACE', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 250);
}