let obstacles;

let obstacles1;
let obstacles2;
let obstacles3;
let obstacles4;

// Animation du corbeau
let corbeauAni;

// Animation de l'épée
let epeeAni;

// Images des arbres
let arbreImages = [];

//obstacle dimensions
let obstacle1Width = 120;
let obstacle1Height = 120;

let obstacle2Width = 150;  
let obstacle2Height = 150; 

let obstacle3Width = 180;  // Arbres - augmenté
let obstacle3Height = 280; // Arbres - augmenté

let obstacle4Width = 80;   // Bonus - petit
let obstacle4Height = 80;  // Bonus - petit

function initObstacles() {
    // Créer le groupe parent
    obstacles = new Group();
    
    // Charger l'animation du corbeau (spritesheet 4 images de 800x800)
    corbeauAni = loadAni('./assets/corbeau.png', {
        width: 800,
        height: 800,
        frames: 4
    });

    //chatger l'animation de l'épée
    epeeAni = loadAni('./assets/épée.png', {
        width: 800,
        height: 800,
        frames: 4
    });
    
    // Charger les 3 images d'arbres
    arbreImages[0] = loadImage('./assets/arbre1.png');
    arbreImages[1] = loadImage('./assets/arbre2.png');
    arbreImages[2] = loadImage('./assets/arbre3.png');
    
   // Groupes d'obstacles - Carrés rouges au sol
    obstacles1 = new obstacles.Group();
    obstacles1.color = 'red';
    obstacles1.collider = 'kinematic';
    obstacles1.type = 1;
    obstacles1.layer = 10;
    obstacles1.debug = true; // Afficher le contour
    
    // Ronds bleus en l'air (corbeaux)
    obstacles2 = new obstacles.Group();
    obstacles2.collider = 'kinematic';
    obstacles2.type = 2;
    obstacles2.layer = 20;
    obstacles2.debug = true; // Afficher le contour
    
    // Rectangles verts (ni haut ni bas)
    obstacles3 = new obstacles.Group();
    obstacles3.color = 'green';
    obstacles3.collider = 'kinematic';
    obstacles3.type = 3;
    obstacles3.layer = 10;
    obstacles3.debug = true; // Afficher le contour

    // Bonus (étoile jaune/dorée)
    obstacles4 = new obstacles.Group();
    obstacles4.color = 'gold';
    obstacles4.collider = 'kinematic';
    obstacles4.type = 4;
    obstacles4.layer = 10;
    obstacles4.debug = true; // Afficher le contour
    
    
    }

function spawnRandomObstacle() {
    let lane = floor(random(NUM_LANES));
    let obstacleType = floor(random(4)); // 0, 1, 2, ou 3
    
    if (obstacleType === 0) {
        spawnObstacle1(lane); // Carré rouge au sol
    } else if (obstacleType === 1) {
        spawnObstacle2(lane); // Rond bleu en l'air
    } else if (obstacleType === 2) {
        spawnObstacle3(lane); // Rectangle vert moyen
    } else {
        spawnObstacle4(lane); // Bonus doré
    }
}

function spawnObstacle1(lane) {
    // Carré rouge au sol (on peut sauter ou esquiver)
    let obstacle = new obstacles1.Sprite();
    obstacle.scale = 1.8;
    
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.color = 'red';
    obstacle.type = 1;
    obstacle.layer = 10; // Derrière le joueur
}

function spawnObstacle2(lane) {
    // Corbeau en l'air (on passe en dessous ou esquive)
    let obstacle = new obstacles2.Sprite();
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.type = 2;
    obstacle.layer = 20; // Au-dessus du joueur
    obstacle.addAni('fly', corbeauAni);
    obstacle.changeAni('fly');
    obstacle.ani.frameDelay = 8; // Vitesse de l'animation
    // Définir la taille du collider/hitbox
    obstacle.w = obstacle2Width;
    obstacle.h = obstacle2Height;
}

function spawnObstacle3(lane) {
    // Rectangle vert (on ne peut qu'esquiver) - Arbre aléatoire
    let obstacle = new obstacles3.Sprite();
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.type = 3;
    obstacle.layer = 10; // Derrière le joueur
    
    // Choisir un arbre aléatoire parmi les 3
    let randomArbre = floor(random(3));
    obstacle.img = arbreImages[randomArbre];
    // Définir la taille après avoir assigné l'image
    obstacle.width = obstacle3Width;
    obstacle.height = obstacle3Height;
}

function spawnObstacle4(lane) {
    // Bonus doré (le joueur peut le récupérer pour gagner des points)
    let obstacle = new obstacles4.Sprite();
    obstacle.x = getLaneX(lane, PERSPECTIVE_START_Y);
    obstacle.y = PERSPECTIVE_START_Y;
    obstacle.lane = lane;
    obstacle.type = 4;
    obstacle.layer = 10; // Derrière le joueur
    obstacle.color = 'gold';
    obstacle.width = obstacle4Width;
    obstacle.height = obstacle4Height;
}

function moveObstacles() {
    // Déplacer tous les types d'obstacles
    let allObstacles = [...obstacles1, ...obstacles2, ...obstacles3, ...obstacles4];
    
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
            // Pour le corbeau, ajuster la taille du sprite avec l'effet 3D
            obs.w = obstacle2Width * scale;
            obs.h = obstacle2Height * scale;
        } else if (obs.type === 3) {
            obs.width = obstacle3Width * scale;
            obs.height = obstacle3Height * scale;
        } else if (obs.type === 4) {
            obs.width = obstacle4Width * scale;
            obs.height = obstacle4Height * scale;
        }
        
        // Supprimer si hors écran
        if (obs.y > GAME_HEIGHT + 50) {
            obs.remove();
        }
    }
}