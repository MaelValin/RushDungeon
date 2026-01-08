let obstacles;

function initObstacles() {
    obstacles = new Group();
    obstacles.color = 'red';
    obstacles.collider = 'kinematic';
}

function spawnObstacle() {
    let lane = floor(random(NUM_LANES));
    let obstacle = new obstacles.Sprite();
    obstacle.width = 40;
    obstacle.height = 50;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = color(random(200, 255), 0, random(100, 200));
}

function updateObstacles() {
    for (let obs of obstacles) {
        obs.y += gameSpeed;
        obs.x = getLaneX(obs.lane, obs.y);
        
        let progress = (obs.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        progress = constrain(progress, 0, 1);
        let scale = lerp(0.5, 1, progress);
        obs.width = 40 * scale;
        obs.height = 50 * scale;
        
        if (obs.y > GAME_HEIGHT + 50) {
            obs.remove();
        }
    }
}
