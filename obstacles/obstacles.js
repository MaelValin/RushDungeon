let obstacles;

let obstacles1;
let obstacles2;
let obstacles3;

// Animation du corbeau
let corbeauAni;

//obstacle dimensions
let obstacle1Width = 120;
let obstacle1Height = 120;

let obstacle2Width = 70;
let obstacle2Height = 70;

let obstacle3Width = 120;
let obstacle3Height = 180;

function initObstacles() {
    // Créer le groupe parent
    obstacles = new Group();
    
    // Charger l'animation du corbeau (spritesheet 4 images de 800x800)
    corbeauAni = loadAni('./assets/corbeau.png', {
        width: 800,
        height: 800,
        frames: 4
    });
    
   // Groupes d'obstacles - Carrés rouges au sol
    obstacles1 = new obstacles.Group();
    obstacles1.color = 'red';
    obstacles1.collider = 'kinematic';
    obstacles1.type = 1;
    
    // Ronds bleus en l'air (corbeaux)
    obstacles2 = new obstacles.Group();
    obstacles2.collider = 'kinematic';
    obstacles2.type = 2;
    
    // Rectangles verts (ni haut ni bas)
    obstacles3 = new obstacles.Group();
    obstacles3.color = 'green';
    obstacles3.collider = 'kinematic';
    obstacles3.type = 3;
}

function spawnRandomObstacle() {
    let lane = floor(random(NUM_LANES));
    let obstacleType = floor(random(3)); // 0, 1, ou 2
    
    if (obstacleType === 0) {
        spawnObstacle1(lane); // Carré rouge au sol
    } else if (obstacleType === 1) {
        spawnObstacle2(lane); // Rond bleu en l'air
    } else {
        spawnObstacle3(lane); // Rectangle vert moyen
    }
}

function spawnObstacle1(lane) {
    // Carré rouge au sol (on peut sauter ou esquiver)
    let obstacle = new obstacles1.Sprite();
    obstacle.width = obstacle1Width;
    obstacle.height = obstacle1Height;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'red';
    obstacle.type = 1;
    obstacle.layer = 0; // Derrière le joueur
}

function spawnObstacle2(lane) {
    // Corbeau en l'air (on passe en dessous ou esquive)
    let obstacle = new obstacles2.Sprite();
    obstacle.w = obstacle2Width;
    obstacle.h = obstacle2Height;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.type = 2;
    obstacle.layer = 0; // Derrière le joueur
    obstacle.addAni('fly', corbeauAni);
    obstacle.changeAni('fly');
    obstacle.ani.frameDelay = 8; // Vitesse de l'animation
}

function spawnObstacle3(lane) {
    // Rectangle vert (on ne peut qu'esquiver)
    let obstacle = new obstacles3.Sprite();
    obstacle.width = obstacle3Width;
    obstacle.height = obstacle3Height;
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'green';
    obstacle.type = 3;
    obstacle.layer = 0; // Derrière le joueur
}

function moveObstacles() {
    // Déplacer tous les types d'obstacles
    let allObstacles = [...obstacles1, ...obstacles2, ...obstacles3];
    
    for (let obs of allObstacles) {
        obs.y += gameSpeed;
        
        // Ajuster la position X selon l'effet de perspective
        obs.x = getLaneX(obs.lane, obs.y);
        
        // Ajuster la taille selon la distance (effet 3D)
        let progress = (obs.y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
        progress = constrain(progress, 0, 1);
        let scale = lerp(0.5, 1, progress);
        
        if (obs.type === 1) {
            obs.width = obstacle1Width * scale;
            obs.height = obstacle1Height * scale;
        } else if (obs.type === 2) {
            obs.w = obstacle2Width * scale;
            obs.h = obstacle2Height * scale;
        } else if (obs.type === 3) {
            obs.width = obstacle3Width * scale;
            obs.height = obstacle3Height * scale;
        }
        
        // Supprimer si hors écran
        if (obs.y > GAME_HEIGHT + 50) {
            obs.remove();
        }
    }
}