```instructions
# RushDungeon - AI Coding Agent Instructions

## Project Overview

RushDungeon is a **3D perspective runner game** (Subway Surfers-style) with **webcam hand-tracking controls** built with **q5** (lightweight p5.js alternative), **p5play** physics library, and **ml5.js** for computer vision. The game uses 2D rendering with perspective transforms to create 3D depth along a 3-lane track, and displays the mirrored webcam feed as the background with real-time hand keypoint visualization.

## Tech Stack & Dependencies

- **q5 v2.9.3**: Lightweight p5.js alternative for canvas rendering  
- **p5play v3.24.1**: Physics and sprite management library built on Planck.js  
- **ml5.js v1.0.1**: Machine learning library for hand pose detection (loaded from CDN)  
- **No build system**: Direct script includes in HTML, runs in browser without compilation

## Architecture Pattern: Webcam-Driven Perspective Runner

### Hand Tracking Integration (ml5.js)

**Critical API Change**: ml5.js handPose v1.x uses `detectStart()` callback pattern, NOT `.on()` event listeners:

```javascript
// ✅ Correct pattern (index.js:35, 265-268)
handPose = ml5.handPose(video, modelLoaded);
function modelLoaded() {
    handPose.detectStart(video, gotHands); // Start continuous detection
}
```

**Hand-to-lane mapping** (index.js:195-206):
- Wrist keypoint X position (0-320px) maps to lanes (0-2)
- Position is mirrored: `handX = 320 - wrist.x` (webcam mirror effect)
- `normalizedX = handX / 320` then `floor(normalizedX * NUM_LANES)`
- Fallback to keyboard (A/D or arrows) when `handDetected === false`

### Webcam Background Rendering

The video feed is the **full-screen background** with aspect-ratio-preserving scaling (index.js:58-116):

**Critical gotcha**: Never name a variable `scale` - it conflicts with q5's `scale()` function. Use `videoScale` instead.

```javascript
// Calculate contain-fit scaling
let videoScale = GAME_HEIGHT / 240; // or GAME_WIDTH / 320 depending on aspect
// Mirror the video: translate(offsetX + videoW, offsetY); scale(-1, 1);
// Hand keypoints: mirroredX = offsetX + videoW - (keypoint.x * videoScale)
```

Hand visualization draws green circles (10px) at keypoints and lines connecting sequential keypoints.

### Core Perspective System

The game simulates 3D depth through mathematical perspective transforms:

- `getLaneX(laneIndex, y)`: Maps lane positions from narrow top (80px) to wide bottom (800px) using `lerp()` based on Y position  
- `PERSPECTIVE_START_Y = 100`: Where perspective effect begins  
- Objects scale from 0.5x to 1x as they move down screen (see `moveObstacles()`)

### Lane System

- **3 lanes** (indices 0, 1, 2) using `currentLane` variable  
- Lane widths: `LANE_WIDTH_TOP = 80`, `LANE_WIDTH_BOTTOM = 800`  
- Dynamic X positioning: obstacles update their X position every frame via `getLaneX()` in `moveObstacles()`

### Sprite Management Convention

Uses **p5play Groups** for entity management:

- `player`: Blue sprite (50px wide), kinematic collider, positioned at `y = GAME_HEIGHT - 400`  
- `obstacles`: Group with `collider = 'kinematic'` (moves but doesn't respond to physics)  
- `grounds`: Visual elements with `collider = 'none'` (unused)  
- Store metadata on sprites: `obstacle.lane` tracks which lane an obstacle belongs to

## Key Development Patterns

### Game Loop Structure (draw function)

1. Render webcam background with mirror transform and hand tracking visualization  
2. Draw semi-transparent 3D road with `drawRoad()` (alpha 100 on road fill)  
3. Move obstacles with perspective transform via `moveObstacles()`  
4. Update player position with `movePlayer()` (lerp to target lane, 0.2 smoothing)  
5. Spawn obstacles every 80 frames (`frameCount % 80 === 0`)  
6. Increment score (+0.1 per frame)  
7. Display UI with score, lane, and hand detection status

### Perspective Math Pattern

```javascript
let progress = (y - PERSPECTIVE_START_Y) / (GAME_HEIGHT - PERSPECTIVE_START_Y);
let value = lerp(topValue, bottomValue, progress);
```

This pattern is used for: lane widths, X positions, object scaling, road rendering.

### Kinematic Movement

Game uses `world.gravity.y = 0` with manual Y velocity (`gameSpeed = 5`). Objects move via additive Y (`obs.y += gameSpeed`), not physics forces.

## Development Workflow

### Running the Game

1. Install dependencies: `npm install`  
2. Open [index.html](index.html) directly in browser (or use Live Server extension)  
3. **Allow webcam access** when prompted - game requires video input  
4. Files are loaded from `node_modules/` via relative paths + ml5.js from CDN

### Git Workflow

- Uses npm version scripts: `npm run v` (patch), `npm run V` (minor)  
- Auto-pushes on version bump via `postversion` hook

## File Structure

- [index.html](index.html): Canvas container + script loader (**order critical**: q5 → planck → p5play → ml5 → index.js)  
- [index.js](index.js): All game logic in single file (setup + draw pattern)  
- [json.config](json.config): jsconfig for ESNext + type definitions from node_modules  
- [package.json](package.json): p5play template with ml5 dependency

## Critical Gotchas

- **Script load order in HTML**: q5 before p5play, planck.min.js before p5play.js, ml5 from CDN before index.js  
- **ml5 API version**: Use `detectStart(video, callback)` not `.on('hand', callback)` - the latter doesn't exist in v1.x  
- **Variable naming**: Avoid `scale` (conflicts with q5 function), use `videoScale` or similar  
- **Webcam coordinates**: Video is 320x240, needs scaling to canvas size (1500x900) and mirroring for intuitive controls  
- **Kinematic colliders**: Player and obstacles are kinematic (controllable position), not dynamic (physics-driven)  
- **Frame-based spawning**: Obstacles spawn via `frameCount` checks, not timers

```
