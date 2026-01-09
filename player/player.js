let player;
let currentLane = 1;
let readyToJump = true;
let soundSwitch, soundJump, soundBonus, soundKillMob, soundDeath;
let hasWeapon = false;
let wasLeftPressed = false;
let wasRightPressed = false;

function initPlayer() {
  player = new Sprite();
  player.width = 60;
  player.height = 90;
  player.rotation = 0;
  player.rotationLock = true;
  player.visible = false;
  player.layer = 20;
  
  // Réinitialiser l'épée
  hasWeapon = false;
  
  // Charger les sons
  soundSwitch = loadSound('assets/switchRightLeft.mp3');
  soundJump = loadSound('assets/jump.mp3');
  soundBonus = loadSound('assets/bonus.mp3');
  soundKillMob = loadSound('assets/killMob.mp3');
  soundDeath = loadSound('assets/death.mp3');
  
  // Load run animations
  player.addAni("run", "player/player-spritesheet.png", {
    frameSize: [565, 1440],
    frames: 4,
  });
  
  // Load jump animation
  player.addAni("jump", [
    "player/jump_anim/jump_1.png",
    "player/jump_anim/jump_2.png",
    "player/jump_anim/jump_3.png",
    "player/jump_anim/jump_4.png",
    "player/jump_anim/jump_5.png"
  ]);
  
  // Load attack animation
  player.addAni("attack", "player/attack_anim/chevalierAttack.png", {
    frameSize: [306, 408],
    frames: 2
  });
  
  player.ani = "run";
  player.ani.frameDelay = 8;
  player.ani.scale = 0.6;
  player.ani.rotation = 0;
}

function updatePlayer() {
  player.y = GAME_HEIGHT - 200;
  player.layer = 20; // Layer très élevé pour passer devant tout
  
  let previousLane = currentLane;

  let handPos = getHandPosition();
  let bodyPos = getBodyPosition();

  if (handPos !== null) {
    currentLane = floor(handPos * NUM_LANES);
    currentLane = constrain(currentLane, 0, NUM_LANES - 1);    
    // Détecter si la main est fermée (poing) pour sauter
    if (isHandClosed() && readyToJump) {
      readyToJump = false;
      playerVz = JUMP_FORCE;
      soundJump.play();
    }  } else if (bodyPos !== null) {
    currentLane = floor(bodyPos * NUM_LANES);
    currentLane = constrain(currentLane, 0, NUM_LANES - 1);
  } else {
    if (kb.pressed("a") || kb.pressed("ArrowLeft")) {
      if (!wasLeftPressed) {
        if (currentLane > 0) currentLane--;
        wasLeftPressed = true;
      }
    } else {
      wasLeftPressed = false;
    }
    
    if (kb.pressed("d") || kb.pressed("ArrowRight")) {
      if (!wasRightPressed) {
        if (currentLane < NUM_LANES - 1) currentLane++;
        wasRightPressed = true;
      }
    } else {
      wasRightPressed = false;
    }
  }
  
  // Jouer le son si la lane a changé
  if (currentLane !== previousLane) {
    soundSwitch.play();
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

  if (kb.pressed("w") || kb.pressed("ArrowUp")) {
    if (readyToJump) {
      readyToJump = false;
      playerVz = JUMP_FORCE;
      soundJump.play();
    }
  }

  // Gestion des collisions avec les obstacles
  checkObstacleCollisions();

  jump();
}

function getCurrentLane() {
  return currentLane;
}

function checkObstacleCollisions() {
  // Vérifier les collisions avec les bonus (type 4) - mais seulement si on n'a pas d'épée
  if (!hasWeapon) {
    for (let bonus of obstacles4) {
      let distance = dist(player.x, player.y, bonus.x, bonus.y);
      let collisionRadius = (player.width + bonus.width) / 2 + 30;
      
      if (distance < collisionRadius) {
        hasWeapon = true;
        console.log("Épée obtenue!");
        if (soundBonus) soundBonus.play();
        bonus.remove();
        return; // Sortir après avoir récupéré l'épée
      }
    }
  }
  
  // Si on a une épée, chercher le premier obstacle dans la même lane et le détruire
  if (hasWeapon) {
    let allObstacles = [...obstacles1, ...obstacles2, ...obstacles3];
    
    // Trouver l'obstacle le plus proche dans la même lane
    let closestObstacle = null;
    let closestDistance = Infinity;
    
    for (let obs of allObstacles) {
      // Vérifier si l'obstacle est dans la même lane
      if (obs.lane === currentLane) {
        let distance = dist(player.x, player.y, obs.x, obs.y);
        let collisionRadius = (player.width + obs.width) / 2 + 50;
        
        // Si on touche cet obstacle
        if (distance < collisionRadius && distance < closestDistance) {
          closestObstacle = obs;
          closestDistance = distance;
        }
      }
    }
    
    // Détruire l'obstacle le plus proche touché
    if (closestObstacle) {
      console.log("Obstacle détruit!");
      if (soundKillMob) soundKillMob.play();
      closestObstacle.remove();
      hasWeapon = false;
      
      // Déclencher l'animation d'attaque
      player.changeAni('attack');
      player.ani.frameDelay = 6;
      player.ani.scale = 2; // Agrandir l'animation d'attaque
      
      // Revenir à l'animation de course après un court délai
      setTimeout(() => {
        if (player.ani.name === 'attack') {
          player.changeAni('run');
          player.ani.frameDelay = 8;
          player.ani.scale = 0.6; // Remettre la taille normale
        }
      }, 200); // Durée de l'animation d'attaque
      
      return;
    }
  }
}

function jump() {
  if (playerZ > 0 || (playerZ === 0 && playerVz > 0)) {
    playerVz -= GRAVITY;
    playerZ += playerVz;
    
    if (player.ani.name !== "jump") {
      player.changeAni("jump");
      player.ani.noLoop();
    }
    
    // Contrôle manuel des frames basé sur la vélocité
    if (playerVz > JUMP_FORCE * 0.7) {
      player.ani.frame = 0;
    } else if (playerVz > JUMP_FORCE * 0.3) {
      player.ani.frame = 1;
    } else if (playerVz > -JUMP_FORCE * 0.3) {
      player.ani.frame = 2;
    } else if (playerVz > -JUMP_FORCE * 0.7) {
      player.ani.frame = 3;
    } else {
      player.ani.frame = 4;
    }

    for (let obs of obstacles1) {
      obs.collider = "none";
    }

    if (playerZ <= 0) {
      playerZ = 0;
      playerVz = 0;
      readyToJump = true;
      
      // Ne pas changer l'animation si on est en train d'attaquer
      if (player.ani.name !== "attack") {
        player.changeAni("run");
        player.ani.frameDelay = 8;
        player.ani.loop();
      }

      for (let obs of obstacles1) {
        obs.collider = "kinematic";
      }
    }
  } else {
    readyToJump = true;
    
    // Ne pas changer l'animation si on est en train d'attaquer
    if (player.ani.name !== "run" && player.ani.name !== "attack") {
      player.changeAni("run");
      player.ani.frameDelay = 8;
      player.ani.loop();
    }
  }

  player.y = GAME_HEIGHT - 200 - playerZ;
  player.scale = 1 + playerZ / 800;
}
