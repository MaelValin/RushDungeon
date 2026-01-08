let player;
let currentLane = 1;
let readyToJump = true;

function initPlayer() {
  player = new Sprite();
  player.width = 60;
  player.height = 90;
  player.rotation = 0;
  player.rotationLock = true;
  player.visible = false;
  player.layer = 10;
  
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
  
  player.ani = "run";
  player.ani.frameDelay = 8;
  player.ani.scale = 0.6;
  player.ani.rotation = 0;
}

function updatePlayer() {
  player.y = GAME_HEIGHT - 200;
  player.layer = 10;

  let handPos = getHandPosition();
  let bodyPos = getBodyPosition();

  if (handPos !== null) {
    currentLane = floor(handPos * NUM_LANES);
    currentLane = constrain(currentLane, 0, NUM_LANES - 1);    
    // Détecter si la main est fermée (poing) pour sauter
    if (isHandClosed() && readyToJump) {
      readyToJump = false;
      playerVz = JUMP_FORCE;
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
    }
  }

  jump();
}

function getCurrentLane() {
  return currentLane;
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
      
      player.changeAni("run");
      player.ani.frameDelay = 8;
      player.ani.loop();

      for (let obs of obstacles1) {
        obs.collider = "kinematic";
      }
    }
  } else {
    readyToJump = true;
    
    if (player.ani.name !== "run") {
      player.changeAni("run");
      player.ani.frameDelay = 8;
      player.ani.loop();
    }
  }

  player.y = GAME_HEIGHT - 200 - playerZ;
  player.scale = 1 + playerZ / 800;
}
