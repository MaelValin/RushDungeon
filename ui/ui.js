function drawUI(score) {
    fill(255);
    noStroke();
    textSize(20);
    textAlign(LEFT);
    // Afficher le score en dessous de la caméra (169px de hauteur + 10px de marge)
    text(`Score: ${floor(score)}`, 10, 185);
    text(`Lane: ${getCurrentLane() + 1}`, 10, 210);
    
    if (currentMode === 'hand') {
        if (handDetected) {
            fill(0, 255, 0);
            text('✓ Main détectée', 10, 235);
        } else {
            fill(255, 100, 100);
            text('⚠ Pas de main (utilisez A/D)', 10, 235);
        }
    } else {
        if (poseDetected) {
            fill(255, 0, 255);
            text('✓ Corps détecté', 10, 235);
        } else {
            fill(255, 100, 100);
            text('⚠ Pas de corps (utilisez A/D)', 10, 235);
        }
    }
}