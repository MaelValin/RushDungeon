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
    // Créer l'élément vidéo HTML natif
    video = document.createElement('video');
    video.width = 1280;
    video.height = 720;
    video.style.display = 'none';
    document.body.appendChild(video);
    
    // Obtenir l'accès à la caméra
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280,
            height: 720
        }
    }).then(stream => {
        video.srcObject = stream;
        video.play();
    }).catch(err => {
        console.error('Erreur d\'accès à la caméra:', err);
    });
    
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
    
    // Taille de la vidéo miniature en haut à gauche
    let miniVideoW = 300;
    let miniVideoH = 169; // 16:9 ratio
    let miniVideoX = -150; // Collé au bord gauche
    let miniVideoY = 75; // Collé au bord haut
    
    // Échelle pour les keypoints (plein canvas)
    let scaleX = GAME_WIDTH / 1280;
    let scaleY = GAME_HEIGHT / 720;
    
    // Dessiner la vidéo miniature en haut à gauche
    push();
    // Retourner horizontalement pour effet miroir
    translate(miniVideoX + miniVideoW, miniVideoY);
    scale(-1, 1);
    image(video, 0, 0, miniVideoW, miniVideoH);
    pop();
    
    // Dessiner les keypoints sur tout le canvas
    if (currentMode === 'hand' && handDetected && hands.length > 0) {
        for (let hand of hands) {
            for (let keypoint of hand.keypoints) {
                fill(0, 255, 0);
                noStroke();
                // Inverser X pour correspondre à la vidéo miroir
                let scaledX = GAME_WIDTH - (keypoint.x * scaleX);
                let scaledY = keypoint.y * scaleY;
                circle(scaledX, scaledY, 10);
            }
        }
    }
    
    if (currentMode === 'body' && poseDetected && poses.length > 0) {
        for (let pose of poses) {
            for (let keypoint of pose.keypoints) {
                fill(255, 0, 255);
                noStroke();
                // Inverser X pour correspondre à la vidéo miroir
                let scaledX = GAME_WIDTH - (keypoint.x * scaleX);
                let scaledY = keypoint.y * scaleY;
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
        // Inverser X pour effet miroir
        let normalizedX = 1 - (handX / 1280);
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
        // Inverser X pour effet miroir
        let normalizedX = 1 - (centerX / 1280);
        return normalizedX;
    }
    return null;
}

function isHandClosed() {
    if (currentMode !== 'hand' || !handDetected || hands.length === 0) return false;
    
    let hand = hands[0];
    
    // Récupérer les points clés
    let wrist = hand.keypoints.find(kp => kp.name === 'wrist');
    let indexTip = hand.keypoints.find(kp => kp.name === 'index_finger_tip');
    let middleTip = hand.keypoints.find(kp => kp.name === 'middle_finger_tip');
    let ringTip = hand.keypoints.find(kp => kp.name === 'ring_finger_tip');
    let pinkyTip = hand.keypoints.find(kp => kp.name === 'pinky_finger_tip');
    
    if (!wrist || !indexTip || !middleTip || !ringTip || !pinkyTip) return false;
    
    // Calculer les distances entre le bout des doigts et le poignet
    let indexDist = dist(indexTip.x, indexTip.y, wrist.x, wrist.y);
    let middleDist = dist(middleTip.x, middleTip.y, wrist.x, wrist.y);
    let ringDist = dist(ringTip.x, ringTip.y, wrist.x, wrist.y);
    let pinkyDist = dist(pinkyTip.x, pinkyTip.y, wrist.x, wrist.y);
    
    // Distance moyenne
    let avgDist = (indexDist + middleDist + ringDist + pinkyDist) / 4;
    
    // Si la distance moyenne est petite, la main est fermée (poing)
    // Ajuster le seuil selon les tests (100-150 généralement)
    return avgDist < 120;
}

