function drawUI(score) {
    fill(255);
    noStroke();
    textSize(20);
    textAlign(LEFT);
    text(`Score: ${floor(score)}`, 20, 30);
    text(`Lane: ${getCurrentLane() + 1}`, 20, 55);
    
    if (currentMode === 'hand') {
        if (handDetected) {
            fill(0, 255, 0);
            text('✓ Main détectée', 20, 80);
        } else {
            fill(255, 100, 100);
            text('⚠ Pas de main (utilisez A/D)', 20, 80);
        }
    } else {
        if (poseDetected) {
            fill(255, 0, 255);
            text('✓ Corps détecté', 20, 80);
        } else {
            fill(255, 100, 100);
            text('⚠ Pas de corps (utilisez A/D)', 20, 80);
        }
    }
}