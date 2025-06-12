class Game {
    constructor() {
        this.player = new Player(30, 350);
        this.platforms = [];
        this.coins = [];
        this.door = null;
        this.currentLevel = 0;
        this.score = 0;
        this.maxScore = 0;
        this.totalScore = 0;
        this.highScore = this.loadHighScore();
        this.completedLevels = this.loadCompletedLevels();
        this.isStarted = false;
        this.keys = new Set();
        this.particles = [];
        this.levelStartTime = 0;
        this.bestTimes = this.loadBestTimes();
        
        this.levelData = [
            {
                platforms: [
                    { x: 0, y: 400, w: 600, h: 40, type: 'normal' },
                    { x: 650, y: 350, w: 150, h: 30, type: 'normal' },
                    { x: 850, y: 300, w: 100, h: 30, type: 'bouncy' },
                    { x: 1000, y: 400, w: 300, h: 30, type: 'normal' }
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
                    { x: 0, y: 400, w: 500, h: 40, type: 'normal' },
                    { x: 550, y: 380, w: 150, h: 30, type: 'moving' },
                    { x: 750, y: 320, w: 100, h: 30, type: 'bouncy' },
                    { x: 900, y: 360, w: 180, h: 30, type: 'normal' },
                    { x: 1100, y: 400, w: 200, h: 40, type: 'normal' }
                ],
                coins: [
                    { x: 100, y: 350 },
                    { x: 600, y: 330 },
                    { x: 950, y: 320 },
                    { x: 1200, y: 360 }
                ],
                door: { x: 1250, y: 340, w: 40, h: 60 }
            }
        ];
    }

    loadLevel(levelIndex) {
        this.platforms = [];
        this.coins = [];
        this.score = 0;
        this.levelStartTime = millis();
        
        const level = this.levelData[levelIndex];
        if (!level) return;

        for (const p of level.platforms) {
            this.platforms.push(new Platform(p.x, p.y, p.w, p.h, p.type || 'normal'));
        }

        for (const c of level.coins) {
            this.coins.push(new Coin(c.x, c.y));
        }
        
        this.maxScore = level.coins.length;
        this.door = new Door(level.door.x, level.door.y, level.door.w, level.door.h);
        this.player.reset(30, 350);
        
        this.updateUI();
    }

    update() {
        if (!this.isStarted) return;

        for (const platform of this.platforms) {
            platform.update();
        }

        for (const coin of this.coins) {
            coin.update();
        }

        this.door.update(this.score >= this.maxScore);

        const playerFell = this.player.update(this.keys, this.platforms, width, height);
        
        if (playerFell) {
            this.handlePlayerFall();
        }

        this.checkCollisions();
        this.updateParticles();
    }

    checkCollisions() {
        for (const coin of this.coins) {
            if (coin.checkCollision(this.player)) {
                this.score++;
                this.totalScore++;
                this.createCoinParticles(coin.x + coin.w/2, coin.y + coin.h/2);
                this.updateUI();
            }
        }

        if (this.door.checkCollision(this.player)) {
            this.completeLevel();
        }
    }

    completeLevel() {
        const levelTime = millis() - this.levelStartTime;
        const levelNumber = this.currentLevel;
        
        if (!this.bestTimes[levelNumber] || levelTime < this.bestTimes[levelNumber]) {
            this.bestTimes[levelNumber] = levelTime;
            this.saveBestTimes();
        }

        if (!this.completedLevels.includes(levelNumber)) {
            this.completedLevels.push(levelNumber);
            this.saveCompletedLevels();
        }

        this.currentLevel++;
        if (this.currentLevel >= this.levelData.length) {
            this.gameCompleted();
        } else {
            this.loadLevel(this.currentLevel);
        }
    }

    gameCompleted() {
        if (this.totalScore > this.highScore) {
            this.highScore = this.totalScore;
            this.saveHighScore();
        }

        alert(`Gratulálok! Végigjátszottad a játékot!\nÖsszpontszám: ${this.totalScore}\nLegjobb pontszám: ${this.highScore}`);
        
        this.currentLevel = 0;
        this.totalScore = 0;
        this.loadLevel(this.currentLevel);
    }

    handlePlayerFall() {
        this.currentLevel = 0;
        this.totalScore = 0;
        this.loadLevel(this.currentLevel);
    }

    createCoinParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: random(-3, 3),
                vy: random(-5, -1),
                life: 30,
                maxLife: 30,
                size: random(3, 6)
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        background(135, 206, 235);
        
        if (this.isStarted) {
            for (const platform of this.platforms) {
                platform.draw();
            }

            for (const coin of this.coins) {
                coin.draw();
            }

            this.door.draw();
            this.player.draw();

            for (const particle of this.particles) {
                const alpha = map(particle.life, 0, particle.maxLife, 0, 255);
                fill(255, 215, 0, alpha);
                ellipse(particle.x, particle.y, particle.size, particle.size);
            }

            this.drawStats();
        } else {
            this.drawStartScreen();
        }
    }

    drawStartScreen() {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(28);
        text('Kattints a "Játék indítása" gombra a kezdéshez', width / 2, height / 2 - 50);
        
        textSize(18);
        text(`Legjobb pontszám: ${this.highScore}`, width / 2, height / 2);
        text(`Teljesített szintek: ${this.completedLevels.length}/${this.levelData.length}`, width / 2, height / 2 + 30);
    }

    drawStats() {
        const currentTime = millis() - this.levelStartTime;
        const timeText = `Idő: ${Math.floor(currentTime / 1000)}s`;
        
        fill(255);
        textAlign(LEFT, TOP);
        textSize(14);
        text(timeText, 10, 10);
        
        if (this.bestTimes[this.currentLevel]) {
            const bestTime = Math.floor(this.bestTimes[this.currentLevel] / 1000);
            text(`Legjobb: ${bestTime}s`, 10, 30);
        }
        
        text(`Összes pont: ${this.totalScore}`, 10, 50);
    }

    start() {
        this.isStarted = true;
        this.loadLevel(this.currentLevel);
    }

    updateUI() {
        const levelInfo = document.getElementById('level-info');
        const scoreInfo = document.getElementById('score-info');
        
        if (levelInfo) levelInfo.textContent = `Játék szint: ${this.currentLevel + 1}`;
        if (scoreInfo) scoreInfo.textContent = `Pontszám: ${this.score} / ${this.maxScore}`;
    }

    // Memory-based storage methods (localStorage nem támogatott)
    saveHighScore() {
        // Csak memóriában tároljuk
    }

    loadHighScore() {
        return 0;
    }

    saveCompletedLevels() {
        // Csak memóriában tároljuk
    }

    loadCompletedLevels() {
        return [];
    }

    saveBestTimes() {
        // Csak memóriában tároljuk
    }

    loadBestTimes() {
        return {};
    }
}

// P5.js setup és draw
let game;

function setup() {
    let canvas = createCanvas(1280, 480);
    canvas.parent('game-container');
    
    game = new Game();
    
    initControls();
    noLoop();
}

function draw() {
    game.update();
    game.draw();
}

function initControls() {
    // Start gomb
    document.getElementById('start-btn').addEventListener('click', () => {
        game.start();
        loop();
    });

    // Billentyűzet kezelés
    window.addEventListener('keydown', e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) {
            e.preventDefault();
            game.keys.add(e.code);
        }
    });
    
    window.addEventListener('keyup', e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) {
            e.preventDefault();
            game.keys.delete(e.code);
        }
    });
}