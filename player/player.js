let player;
let currentLane = 1;

function initPlayer() {
     player = new Sprite();
    player.width = 50;
    player.color = 'blue';
    player.rotation = 0;
    player.visible = false; // Caché au démarrage
    player.y = GAME_HEIGHT - 400;
}

function updatePlayer() {
    player.y = GAME_HEIGHT - 400;
    
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
    // Positionner le joueur au centre de sa lane
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

    if (kb.pressed('w') || kb.pressed('ArrowUp')) {
        if (readyToJump){
            readyToJump = false;
            jump();
        }

    }
}
