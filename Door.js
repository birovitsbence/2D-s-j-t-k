class Door {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.glowIntensity = 0;
        this.isOpen = false;
        this.particles = [];
    }

    update(canOpen) {
        this.isOpen = canOpen;
        
        if (this.isOpen) {
            this.glowIntensity = 0.5 + Math.sin(millis() * 0.01) * 0.3;
            
            if (random() < 0.3) {
                this.particles.push({
                    x: this.x + random(this.w),
                    y: this.y + this.h,
                    vx: random(-1, 1),
                    vy: random(-3, -1),
                    life: 60,
                    maxLife: 60,
                    size: random(3, 8)
                });
            }
        } else {
            this.glowIntensity = 0;
        }
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        push();
        
        if (this.isOpen && this.glowIntensity > 0) {
            fill(6, 182, 212, this.glowIntensity * 100);
            rect(this.x - 10, this.y - 10, this.w + 20, this.h + 20, 10);
        }
        
        if (this.isOpen) {
            fill(6, 182, 212);
        } else {
            fill(100, 100, 100);
        }
        
        rect(this.x, this.y, this.w, this.h, 5);
        
        fill(this.isOpen ? 255 : 150);
        rect(this.x + 5, this.y + 5, this.w - 10, this.h - 10, 3);
        
        fill(255, 215, 0);
        ellipse(this.x + this.w - 10, this.y + this.h/2, 6, 6);
        
        for (const p of this.particles) {
            const alpha = map(p.life, 0, p.maxLife, 0, 255);
            fill(6, 182, 212, alpha);
            ellipse(p.x, p.y, p.size, p.size);
        }
        
        if (!this.isOpen) {
            fill(255, 0, 0);
            textAlign(CENTER, CENTER);
            textSize(12);
            text('Gyűjtsd össze\naz érméket!', this.x + this.w/2, this.y - 20);
        }
        
        pop();
    }

    checkCollision(player) {
        if (this.isOpen) {
            const playerBounds = player.getBounds();
            return playerBounds.x < this.x + this.w && 
                    playerBounds.x + playerBounds.w > this.x &&
                    playerBounds.y < this.y + this.h && 
                    playerBounds.y + playerBounds.h > this.y;
        }
        return false;
    }
}