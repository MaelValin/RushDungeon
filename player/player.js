let player;
let currentLane = 1;

function initPlayer() {
     player = new Sprite();
    player.width = 50;
    player.color = 'blue';
    player.rotation = 0;
    player.visible = false; // Caché au démarrage
    player.layer = 10; // Toujours au-dessus des obstacles
}

function updatePlayer() {
    player.layer = 10; // Toujours au-dessus des obstacles

    
    let handPos = getHandPosition();
    let bodyPos = getBodyPosition();
    
    if (handPos !== null) {
        currentLane = floor(handPos * NUM_LANES);
        currentLane = constrain(currentLane, 0, NUM_LANES - 1);
    } else if (bodyPos !== null) {
        currentLane = floor(bodyPos * NUM_LANES);
        currentLane = constrain(currentLane, 0, NUM_LANES - 1);
    } else {
        if (kb.pressed('a') || kb.pressed('ArrowLeft')) {
            if (currentLane > 0) currentLane--;
        }
        if (kb.pressed('d') || kb.pressed('ArrowRight')) {
            if (currentLane < NUM_LANES - 1) currentLane++;
        }
    }
    
    let targetX = getLaneX(currentLane, player.y);
    player.x = lerp(player.x, targetX, 0.2);
    
    let progress = (player.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let minX = GAME_WIDTH / 2 - totalWidth / 2 + player.width / 2;
    let maxX = GAME_WIDTH / 2 + totalWidth / 2 - player.width / 2;
    player.x = constrain(player.x, minX, maxX);
}

function getCurrentLane() {
    return currentLane;
}


function movePlayer() {
    // Changer de colonne avec les touches (une seule fois par appui)
    if (kb.presses('a') || kb.presses('ArrowLeft')) {
        if (currentLane > 0) currentLane--;
    }
    if (kb.presses('d') || kb.presses('ArrowRight')) {
        if (currentLane < NUM_LANES - 1) currentLane++;
    }
    
    // Positionner le joueur au centre de sa lane
    let targetX = getLaneX(currentLane, player.y);
    player.x = lerp(player.x, targetX, 0.3); // 0.3 = transition plus rapide
    
    // Limiter le joueur dans les bordes de la route
    let progress = (player.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let minX = GAME_WIDTH / 2 - totalWidth / 2 + player.width / 2;
    let maxX = GAME_WIDTH / 2 + totalWidth / 2 - player.width / 2;
    player.x = constrain(player.x, minX, maxX);

    if (kb.presses('w') || kb.presses('ArrowUp')) {
        if (readyToJump){
            readyToJump = false;
            playerVz = JUMP_FORCE; // Initier le saut
        }
    }
    
    // Appliquer la physique du saut
    jump();
}

function jump() {
    if (playerZ > 0 || (playerZ === 0 && playerVz > 0)) {
        // Appliquer la gravité
        playerVz -= GRAVITY;
        playerZ += playerVz;
        
        // Désactiver les colliders des obstacles type 1 quand en l'air
        for (let obs of obstacles1) {
            obs.collider = 'none';
        }
        
        // Si le joueur touche le sol
        if (playerZ <= 0) {
            playerZ = 0;
            playerVz = 0;
            readyToJump = true; // Peut sauter de nouveau
            
            // Réactiver les colliders des obstacles type 1
            for (let obs of obstacles1) {
                obs.collider = 'kinematic';
            }
        }
    } else {
        readyToJump = true; // Peut sauter s'il est au sol
    }
    
    // Appliquer la hauteur Z à la position Y visuelle
    player.y = (GAME_HEIGHT - 200) - playerZ;
    // Scale augmente en l'air
    player.scale = 1 + (playerZ / 300);
}
