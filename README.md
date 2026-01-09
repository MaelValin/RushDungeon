# RushDungeon 🎮

A 3D perspective runner game (Subway Surfers-style) with **webcam body/hand tracking controls** using computer vision. Built with q5.js, p5play, and ml5.js.

## 🎯 Features

- **Dual Control Modes**: Switch between hand tracking and full body tracking
- **Real-time Detection**: See your detected keypoints overlaid on the video feed
- **3D Perspective**: 3-lane runner with depth effect and dynamic obstacle scaling
- **Modular Architecture**: Clean code structure with separated modules

## 🚀 Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open `index.html` in your browser (or use Live Server extension)

### How to Play

1. **Allow webcam access** when prompted
2. Choose your control mode:
   - **Hand Mode** (default): Move your hand left/right to control the player
   - **Body Mode**: Move your body (hips) left/right to control the player
3. Click the **"Mode: Main/Corps"** button (top-right) to switch between modes
4. **Fallback**: Use **A/D** or **Arrow keys** if no detection

### Controls

| Control | Action |
|---------|--------|
| 🖐️ Hand/Body Movement | Move between lanes |
| A / ← | Move left (keyboard fallback) |
| D / → | Move right (keyboard fallback) |
| 🔘 Mode Button | Switch between Hand/Body tracking |

## 🏗️ Architecture

### Project Structure

```
RushDungeon/
├── index.html          # Main HTML entry point
├── main.js             # Game configuration and main loop
├── style.css           # Global styles + mode button
├── video/              # Webcam & ML detection module
│   ├── video.js        # Camera, ml5.js integration
│   └── video.css       # Video-specific styles
├── player/             # Player sprite module
│   ├── player.js       # Player movement & lane switching
│   └── player.css      # Player-specific styles
├── obstacles/          # Obstacles module
│   ├── obstacles.js    # Spawn & movement logic
│   └── obstacles.css   # Obstacle-specific styles
├── road/               # Road rendering module
│   ├── road.js         # 3D perspective road + lanes
│   └── road.css        # Road-specific styles
└── ui/                 # User interface module
    ├── ui.js           # Score, lane, detection status
    └── ui.css          # UI-specific styles
```

### Core Systems

#### 1. Detection System (`video/video.js`)

**Two ML Models Running Simultaneously:**
- `ml5.handPose()` - Detects hand keypoints (21 points per hand)
- `ml5.bodyPose()` - Detects full body pose (17 keypoints)

**Key Functions:**
- `initVideo()` - Initializes webcam and both ML models
- `drawVideo()` - Renders video feed + colored keypoints
- `getHandPosition()` - Returns normalized X position of wrist (0-1)
- `getBodyPosition()` - Returns normalized X position of hip center (0-1)
- `switchMode()` - Toggles between hand/body tracking

**Detection Colors:**
- 🟢 Green = Hand mode keypoints
- 🟣 Magenta = Body mode keypoints

#### 2. Perspective System (`road/road.js`)

**3D Depth Simulation:**
```javascript
// Lane width interpolates from narrow (top) to wide (bottom)
LANE_WIDTH_TOP = 80px
LANE_WIDTH_BOTTOM = 800px
PERSPECTIVE_START_Y = 100px
```

**Key Function:**
- `getLaneX(laneIndex, y)` - Calculates X position of lane at any Y coordinate using linear interpolation

**How it works:**
1. Progress from top to bottom: `(y - START) / (HEIGHT - START)`
2. Interpolate lane width: `lerp(TOP_WIDTH, BOTTOM_WIDTH, progress)`
3. Position is centered and adjusted per lane

#### 3. Player System (`player/player.js`)

**Movement Logic:**
1. Check for hand/body position from ML models
2. Convert normalized position (0-1) to lane index (0-2)
3. Smooth transition using `lerp(currentX, targetX, 0.2)`
4. Constrain within road boundaries

**Current lane** is tracked globally and used for collision detection.

#### 4. Obstacles System (`obstacles/obstacles.js`)

**Spawn & Animation:**
- New obstacle every 80 frames
- Random lane selection
- Scale from 0.5x to 1x as they approach (depth effect)
- Dynamic X position updated every frame via `getLaneX()`

#### 5. Game Loop (`main.js`)

```javascript
function draw() {
    drawVideo();        // Render webcam + keypoints
    drawRoad();         // Draw 3D perspective road
    updateObstacles();  // Move & scale obstacles
    updatePlayer();     // Handle player movement
    spawnObstacle();    // Generate new obstacles
    drawUI();          // Display score & status
}
```

## 🎨 Visual Detection

### Hand Mode Visualization
- Displays 21 keypoint circles per hand
- Green color (#00ff00)
- Tracks wrist position for lane control

### Body Mode Visualization
- Displays 17 keypoint circles for full body
- Magenta color (#ff00ff)
- Uses average of left_hip and right_hip for lane control

## 🔧 Technical Details

### Technologies Used
- **q5.js v2.9.3** - Lightweight p5.js alternative for rendering
- **p5play v3.24.1** - Physics engine & sprite management
- **ml5.js v1.0.1** - Machine learning library (handPose & bodyPose)

### ML5 API Pattern
```javascript
// Modern ml5.js v1.x pattern (not .on() event listeners)
const model = ml5.handPose(video, modelLoaded);
function modelLoaded() {
    model.detectStart(video, gotResults);
}
```

### Performance Notes
- Video resolution: 1280x720 (HD) for better detection
- Canvas size: 1500x900
- Both models run simultaneously without significant performance impact
- Confidence threshold: 0.1 for hip detection

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No detection | Step back from camera to show full body/hand |
| Laggy controls | Reduce video resolution in `video.js` |
| Wrong lane mapping | Check camera isn't mirrored (code already handles this) |
| Mode button not working | Check browser console for errors |

## 🎯 Game Mechanics

- **Score**: Increases by 0.1 every frame
- **Lanes**: 3 lanes (left, center, right)
- **Speed**: Constant 5 pixels per frame
- **Spawn Rate**: New obstacle every 80 frames (~1.3s at 60fps)
- **Collision**: Not yet implemented (TODO)


## Site Web
https://maelvalin.github.io/RushDungeon/

## 📝 License

CC0 - Public Domain

## 👥 Credits

Based on p5play template by p5play team  
Computer vision powered by ml5.js
