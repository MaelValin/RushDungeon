// VERSION AVEC DETECTION DE LA MAIN (active)
let video;
let handPose;
let hands = [];
let handDetected = false;

let bodyPose;
let poses = [];
let poseDetected = false;

// Charger le mode depuis localStorage, sinon utiliser 'hand' par défaut
let currentMode = localStorage.getItem('gameMode') || 'hand';

function initVideo() {
    video = createCapture(VIDEO);
    video.size(1280, 720);
    video.hide();
    
    // Initialiser le bouton avec le mode actuel
    const btn = document.getElementById('modeToggle');
    if (btn) {
        btn.textContent = `Mode: ${currentMode === 'hand' ? 'Main' : 'Corps'}`;
    }
    
    handPose = ml5.handPose(video, () => {
        console.log('HandPose model loaded!');
        modelsLoaded.handPose = true;
        handPose.detectStart(video, (results) => {
            hands = results;
            handDetected = results.length > 0;
        });
    });
    
    bodyPose = ml5.bodyPose(video, () => {
        console.log('BodyPose model loaded!');
        modelsLoaded.bodyPose = true;
        bodyPose.detectStart(video, (results) => {
            poses = results;
            poseDetected = results.length > 0;
        });
    });
}

function switchMode() {
    currentMode = currentMode === 'hand' ? 'body' : 'hand';
    // Sauvegarder le mode dans localStorage
    localStorage.setItem('gameMode', currentMode);
    const btn = document.getElementById('modeToggle');
    btn.textContent = `Mode: ${currentMode === 'hand' ? 'Main' : 'Corps'}`;
    return currentMode;
}

function drawVideo() {
    if (!video) return;
    
    background(20, 20, 40);
    
    let videoAspect = 1280 / 720;
    let canvasAspect = GAME_WIDTH / GAME_HEIGHT;
    let videoScale, videoW, videoH, offsetX, offsetY;
    
    if (canvasAspect > videoAspect) {
        videoH = GAME_HEIGHT;
        videoW = videoH * videoAspect;
        offsetX = (GAME_WIDTH - videoW) / 2;
        offsetY = 0;
    } else {
        videoW = GAME_WIDTH;
        videoH = videoW / videoAspect;
        offsetX = 0;
        offsetY = (GAME_HEIGHT - videoH) / 2;
    }
    
    videoScale = videoW / 1280;
    
    push();
    image(video, offsetX, offsetY, videoW, videoH);
    pop();
    
    if (currentMode === 'hand' && handDetected && hands.length > 0) {
        for (let hand of hands) {
            for (let keypoint of hand.keypoints) {
                fill(0, 255, 0);
                noStroke();
                let scaledX = offsetX + (keypoint.x * videoScale);
                let scaledY = offsetY + (keypoint.y * videoScale);
                circle(scaledX, scaledY, 10);
            }
        }
    }
    
    if (currentMode === 'body' && poseDetected && poses.length > 0) {
        for (let pose of poses) {
            for (let keypoint of pose.keypoints) {
                fill(255, 0, 255);
                noStroke();
                let scaledX = offsetX + (keypoint.x * videoScale);
                let scaledY = offsetY + (keypoint.y * videoScale);
                circle(scaledX, scaledY, 10);
            }
        }
    }
}

function getHandPosition() {
    if (currentMode !== 'hand' || !handDetected || hands.length === 0) return null;
    
    let hand = hands[0];
    let wrist = hand.keypoints.find(kp => kp.name === 'wrist');
    
    if (wrist) {
        let handX = wrist.x;
        let normalizedX = handX / 1280;
        return normalizedX;
    }
    return null;
}

function getBodyPosition() {
    if (currentMode !== 'body' || !poseDetected || poses.length === 0) return null;
    
    let pose = poses[0];
    
    let leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
    let rightHip = pose.keypoints.find(kp => kp.name === 'right_hip');
    
    if (leftHip && rightHip && leftHip.confidence > 0.1 && rightHip.confidence > 0.1) {
        let centerX = (leftHip.x + rightHip.x) / 2;
        let normalizedX = centerX / 1280;
        return normalizedX;
    }
    return null;
}

