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

function StartGame() {
    gameState = 'playing';
    score = 0;
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