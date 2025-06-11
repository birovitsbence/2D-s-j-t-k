let game;

function setup() {
    let canvas = createCanvas(1280, 480);
    canvas.parent('game-container');
    
    // Játék objektum létrehozása
    game = new Game();
    
    initControls();
    noLoop();
}

function draw() {
    game.update();
    game.draw();
}

function initControls() {
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