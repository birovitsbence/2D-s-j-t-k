class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 24;
        this.h = 24;
        this.collected = false;
        this.rotation = 0;
        this.pulseScale = 1;
        this.sparkles = [];
    }

    update() {
        if (!this.collected) {
            this.rotation += 0.1;
            this.pulseScale = 1 + Math.sin(millis() * 0.01) * 0.1;
            
            if (random() < 0.1) {
                this.sparkles.push({
                    x: this.x + random(-10, 34),
                    y: this.y + random(-10, 34),
                    life: 20,
                    maxLife: 20
                });
            }
        }
        
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            this.sparkles[i].life--;
            if (this.sparkles[i].life <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
    }

    draw() {
        if (!this.collected) {
            // Csillogások
            for (const sparkle of this.sparkles) {
                const alpha = map(sparkle.life, 0, sparkle.maxLife, 0, 255);
                fill(255, 255, 255, alpha);
                ellipse(sparkle.x, sparkle.y, 3, 3);
            }
            
            push();
            translate(this.x + this.w/2, this.y + this.h/2);
            rotate(this.rotation);
            scale(this.pulseScale);
            
            fill(255, 215, 0);
            stroke(255, 165, 0);
            strokeWeight(2);
            ellipse(0, 0, this.w, this.h);
            
            fill(255, 165, 0);
            textAlign(CENTER, CENTER);
            textSize(12);
            text('$', 0, 0);
            
            pop();
            noStroke();
        }
    }

    checkCollision(player) {
        if (!this.collected) {
            const playerBounds = player.getBounds();
            if (playerBounds.x < this.x + this.w && 
                playerBounds.x + playerBounds.w > this.x &&
                playerBounds.y < this.y + this.h && 
                playerBounds.y + playerBounds.h > this.y) {
                
                this.collected = true;
                return true;
            }
        }
        return false;
    }

    reset() {
        this.collected = false;
        this.rotation = 0;
        this.sparkles = [];
    }
}