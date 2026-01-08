function drawRoad() {
    push();
    noStroke();
    
    // Appliquer l'opacité si le jeu est lancé et la caméra active
    let opacity = (gameState === 'playing' && video) ? 0.8 : 1.0;
    
    // Dessiner les murs noirs sur les côtés
    fill(20, 20, 30, 255 * opacity);
    
    // Mur gauche - s'étend de tout en haut de l'écran
    let topLeftX = GAME_WIDTH / 2 - (LANE_WIDTH_TOP * NUM_LANES) / 2;
    let bottomLeftX = GAME_WIDTH / 2 - (LANE_WIDTH_BOTTOM * NUM_LANES) / 2;
    beginShape();
    vertex(0, 0);
    vertex(topLeftX, 0); // Commence en haut de l'écran
    vertex(topLeftX, PERSPECTIVE_START_Y);
    vertex(bottomLeftX, GAME_HEIGHT);
    vertex(0, GAME_HEIGHT);
    endShape(CLOSE);
    
    // Mur droit - s'étend de tout en haut de l'écran
    let topRightX = GAME_WIDTH / 2 + (LANE_WIDTH_TOP * NUM_LANES) / 2;
    let bottomRightX = GAME_WIDTH / 2 + (LANE_WIDTH_BOTTOM * NUM_LANES) / 2;
    beginShape();
    vertex(GAME_WIDTH, 0);
    vertex(topRightX, 0); // Commence en haut de l'écran
    vertex(topRightX, PERSPECTIVE_START_Y);
    vertex(bottomRightX, GAME_HEIGHT);
    vertex(GAME_WIDTH, GAME_HEIGHT);
    endShape(CLOSE);
    
    // Mur du fond (horizontal en haut)
fill(15, 15, 25, 255 * opacity); // Couleur légèrement différente
rect(topLeftX, 0, topRightX - topLeftX, PERSPECTIVE_START_Y);

    // Dessiner la route
    for (let y = PERSPECTIVE_START_Y; y < GAME_HEIGHT; y += 5) {
        let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        let roadWidth = lerp(LANE_WIDTH_TOP * NUM_LANES, LANE_WIDTH_BOTTOM * NUM_LANES, progress);
        fill(0, 0, 0, 250 * opacity);
        rect(GAME_WIDTH / 2 - roadWidth / 2, y, roadWidth, 5);
    }
    
    // Dessiner les lignes de séparation des lanes
    stroke(255, 255, 255, 150 * opacity);
    strokeWeight(2);
    
    for (let i = 1; i < NUM_LANES; i++) {
        let topX = getLaneX(i, PERSPECTIVE_START_Y) - LANE_WIDTH_TOP / 2;
        let bottomX = getLaneX(i, GAME_HEIGHT) - LANE_WIDTH_BOTTOM / 2;
        line(topX, PERSPECTIVE_START_Y, bottomX, GAME_HEIGHT);
    }
    
    // Dessiner les bordures de la route (lignes entre route et murs)
    stroke(255, 255, 255, 200 * opacity);
    strokeWeight(3);
    line(topLeftX, PERSPECTIVE_START_Y, bottomLeftX, GAME_HEIGHT);
    line(topRightX, PERSPECTIVE_START_Y, bottomRightX, GAME_HEIGHT);
    
    pop();
}

function getLaneX(laneIndex, y) {
    let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let startX = GAME_WIDTH / 2 - totalWidth / 2;
    
    return startX + currentLaneWidth * (laneIndex + 0.5);
}
