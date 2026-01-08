function drawRoad() {
    push();
    noStroke();
    
    for (let y = PERSPECTIVE_START_Y; y < GAME_HEIGHT; y += 5) {
        let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        let roadWidth = lerp(LANE_WIDTH_TOP * NUM_LANES, LANE_WIDTH_BOTTOM * NUM_LANES, progress);
        fill(50, 50, 70, 100);
        rect(GAME_WIDTH / 2 - roadWidth / 2, y, roadWidth, 5);
    }
    
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
    let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
    progress = constrain(progress, 0, 1);
    
    let currentLaneWidth = lerp(LANE_WIDTH_TOP, LANE_WIDTH_BOTTOM, progress);
    let totalWidth = currentLaneWidth * NUM_LANES;
    let startX = GAME_WIDTH / 2 - totalWidth / 2;
    
    return startX + currentLaneWidth * (laneIndex + 0.5);
}
