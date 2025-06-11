let player;
let platforms = [];
let coins = [];
let door;
let score = 0;
let maxScore = 0;
let currentLevel = 0;
let isStarted = false;
let keys = new Set();

const levelData = [
    {
        platforms: [
            { x: 0, y: 400, w: 600, h: 40 },
            { x: 650, y: 350, w: 150, h: 30 },
            { x: 850, y: 300, w: 100, h: 30 },
            { x: 1000, y: 400, w: 300, h: 30 }
        ],
        coins: [
            { x: 150, y: 350 },
            { x: 700, y: 300 },
            { x: 970, y: 350 }
        ],
        door: { x: 1200, y: 360, w: 40, h: 60 }
    },
    {
        platforms: [
            { x: 0, y: 400, w: 500, h: 40 },
            { x: 550, y: 380, w: 150, h: 30 },
            { x: 750, y: 320, w: 100, h: 30 },
            { x: 900, y: 360, w: 180, h: 30 },
            { x: 1100, y: 400, w: 200, h: 40 }
        ],
        coins: [
            { x: 100, y: 350 },
            { x: 600, y: 330 },
            { x: 950, y: 320 },
            { x: 1200, y: 360 }
        ],
        door: { x: 1250, y: 340, w: 40, h: 60 }
    },
    {
        platforms: [
            { x: 0, y: 400, w: 400, h: 40 },
            { x: 450, y: 380, w: 100, h: 30 },
            { x: 600, y: 350, w: 120, h: 30 },
            { x: 770, y: 300, w: 150, h: 30 },
            { x: 1000, y: 250, w: 80, h: 30 },
            { x: 1120, y: 300, w: 180, h: 40 }
        ],
        coins: [
            { x: 50, y: 350 },
            { x: 470, y: 330 },
            { x: 650, y: 300 },
            { x: 800, y: 260 },
            { x: 1100, y: 270 }
        ],
        door: { x: 1220, y: 260, w: 40, h: 60 }
    }
];

function setup() {
    let canvas = createCanvas(1280, 480);
    canvas.parent('game-container');
    
    // Játékos létrehozása
    player = {
        x: 30,
        y: 350,
        w: 40,
        h: 60,
        vx: 0,
        vy: 0,
        onGround: false
    };
    
    loadLevel(currentLevel);
    initControls();
    noLoop();
}

function draw() {
    background(135, 206, 235); // Világos kék háttér
    
    if (isStarted) {
        updatePlayer();
        drawGame();
        checkCollisions();
    } else {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(28);
        text('Kattints a "Játék indítása" gombra a kezdéshez', width / 2, height / 2);
    }
}

function loadLevel(levelIndex) {
    platforms = [];
    coins = [];
    score = 0;
    
    const level = levelData[levelIndex];
    if (!level) return;

    // Platformok
    for (const p of level.platforms) {
        platforms.push({
            x: p.x,
            y: p.y,
            w: p.w,
            h: p.h
        });
    }

    // Érmék
    for (const c of level.coins) {
        coins.push({
            x: c.x,
            y: c.y,
            collected: false
        });
    }
    
    maxScore = level.coins.length;

    // Ajtó
    door = {
        x: level.door.x,
        y: level.door.y,
        w: level.door.w,
        h: level.door.h
    };
    
    // Játékos pozíciójának beállítása a szint elején
    player.x = 30;
    player.y = 350;
    player.vx = 0;
    player.vy = 0;
    
    updateUI();
}

function updatePlayer() {
    // Vízszintes mozgás
    if (keys.has('ArrowLeft')) {
        player.vx = -5;
    } else if (keys.has('ArrowRight')) {
        player.vx = 5;
    } else {
        player.vx = 0;
    }

    // Ugrás
    if (keys.has('ArrowUp') && player.onGround) {
        player.vy = -12;
        player.onGround = false;
    }

    // Gravitáció
    player.vy += 0.5;

    // Pozíció frissítése
    player.x += player.vx;
    player.y += player.vy;

    // Platform ütközések
    player.onGround = false;
    for (const platform of platforms) {
        if (player.x < platform.x + platform.w && 
            player.x + player.w > platform.x &&
            player.y < platform.y + platform.h && 
            player.y + player.h > platform.y) {
            
            // Felülről érkezik
            if (player.vy > 0 && player.y < platform.y) {
                player.y = platform.y - player.h;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }

    // Világhatárok
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > width) player.x = width - player.w;
    
    // Ha leesik - visszatérés az első szintre
    if (player.y > height) {
        // Visszatérés az első szintre
        currentLevel = 0;
        loadLevel(currentLevel);
    }
}

function drawGame() {
    // Platformok rajzolása
    fill(139, 92, 246);
    for (const platform of platforms) {
        rect(platform.x, platform.y, platform.w, platform.h);
    }

    // Érmék rajzolása
    fill(255, 215, 0);
    for (const coin of coins) {
        if (!coin.collected) {
            ellipse(coin.x + 12, coin.y + 12, 24, 24);
        }
    }

    // Ajtó rajzolása
    fill(6, 182, 212);
    rect(door.x, door.y, door.w, door.h);

    // Játékos rajzolása
    fill(106, 90, 205);
    rect(player.x, player.y, player.w, player.h);
}

function checkCollisions() {
    // Érme gyűjtés
    for (const coin of coins) {
        if (!coin.collected && 
            player.x < coin.x + 24 && 
            player.x + player.w > coin.x &&
            player.y < coin.y + 24 && 
            player.y + player.h > coin.y) {
            
            coin.collected = true;
            score++;
            updateUI();
        }
    }

    // Ajtó ellenőrzése
    if (score >= maxScore && 
        player.x < door.x + door.w && 
        player.x + player.w > door.x &&
        player.y < door.y + door.h && 
        player.y + player.h > door.y) {
        
        currentLevel++;
        if (currentLevel >= levelData.length) {
            alert("Gratulálok! Végigjátszottad a játékot!");
            currentLevel = 0;
        }
        loadLevel(currentLevel);
    }
}

function updateUI() {
    const levelInfo = document.getElementById('level-info');
    const scoreInfo = document.getElementById('score-info');
    
    if (levelInfo) levelInfo.textContent = `Játék szint: ${currentLevel + 1}`;
    if (scoreInfo) scoreInfo.textContent = `Pontszám: ${score} / ${maxScore}`;
}

function initControls() {
    window.addEventListener('keydown', e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) {
            e.preventDefault();
            keys.add(e.code);
        }
    });
    
    window.addEventListener('keyup', e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) {
            e.preventDefault();
            keys.delete(e.code);
        }
    });

    // Mobil vezérlők
    const jumpBtn = document.getElementById('jump-btn');
    if (jumpBtn) {
        jumpBtn.style.display = ('ontouchstart' in window) ? 'inline-block' : 'none';
        
        jumpBtn.addEventListener('touchstart', e => {
            e.preventDefault();
            keys.add('ArrowUp');
        });
        
        jumpBtn.addEventListener('touchend', e => {
            e.preventDefault();
            keys.delete('ArrowUp');
        });
        
        jumpBtn.addEventListener('mousedown', e => {
            e.preventDefault();
            keys.add('ArrowUp');
        });
        
        jumpBtn.addEventListener('mouseup', e => {
            e.preventDefault();
            keys.delete('ArrowUp');
        });
    }
}

// Játék indítása
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            isStarted = true;
            startBtn.style.display = 'none';
            loop();
        });
    }
});