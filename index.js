// Configuration du jeu
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Variables globales
let player;
let walls;

function setup() {
    // Créer le canvas
    new Canvas(GAME_WIDTH, GAME_HEIGHT);
    
    // Configuration du monde
    world.gravity.y = 10;
    
    // Créer le joueur
    player = new Sprite();
    player.width = 40;
    player.height = 40;
    player.x = GAME_WIDTH / 2;
    player.y = GAME_HEIGHT / 2;
    player.color = 'blue';
    player.rotationLock = true;
    
    // Créer un groupe pour les murs
    walls = new Group();
    walls.color = 'gray';
    walls.collider = 'static';
    
    // Créer le sol
    let ground = new walls.Sprite();
    ground.x = GAME_WIDTH / 2;
    ground.y = GAME_HEIGHT - 25;
    ground.width = GAME_WIDTH;
    ground.height = 50;
    
    // Créer des plateformes
    let platform1 = new walls.Sprite();
    platform1.x = 200;
    platform1.y = GAME_HEIGHT - 150;
    platform1.width = 150;
    platform1.height = 20;
    
    let platform2 = new walls.Sprite();
    platform2.x = 600;
    platform2.y = GAME_HEIGHT - 250;
    platform2.width = 150;
    platform2.height = 20;
}

function draw() {
    // Couleur de fond
    background(30);
    
    // Contrôles du joueur
    handlePlayerMovement();
    
    // Empêcher le joueur de sortir de l'écran
    if (player.x < 0) player.x = 0;
    if (player.x > GAME_WIDTH) player.x = GAME_WIDTH;
    if (player.y > GAME_HEIGHT + 100) {
        // Réinitialiser la position si le joueur tombe
        player.x = GAME_WIDTH / 2;
        player.y = 100;
        player.velocity.y = 0;
    }
    
    // Afficher les informations de debug
    displayDebugInfo();
}

function handlePlayerMovement() {
    // Déplacement horizontal
    if (kb.pressing('left') || kb.pressing('q')) {
        player.velocity.x = -5;
    } else if (kb.pressing('right') || kb.pressing('d')) {
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;
    }
    
    // Saut
    if (kb.presses('space') || kb.presses('up') || kb.presses('z')) {
        // Vérifier si le joueur est au sol
        if (player.colliding(walls)) {
            player.velocity.y = -10;
        }
    }
}

function displayDebugInfo() {
    // Afficher les FPS et la position
    fill(255);
    noStroke();
    textSize(14);
    text(`FPS: ${Math.round(frameRate())}`, 10, 20);
    text(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 10, 40);
    text(`Contrôles: Flèches/ZQSD pour bouger, Espace pour sauter`, 10, GAME_HEIGHT - 10);
}