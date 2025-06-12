class Platform {
    constructor(x, y, w, h, type = 'normal') {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type;
        this.originalX = x;
        this.originalY = y;
        this.moveSpeed = 1;
        this.moveDirection = 1;
        this.moveRange = 100;
    }

    update() {
        if (this.type === 'moving') {
            this.x += this.moveSpeed * this.moveDirection;
            
            if (this.x > this.originalX + this.moveRange || this.x < this.originalX - this.moveRange) {
                this.moveDirection *= -1;
            }
        }
    }

    draw() {
        push();
        
        // Platform árnyéka
        fill(0, 0, 0, 50);
        rect(this.x + 2, this.y + 2, this.w, this.h, 5);
        
        // Platform színe típus szerint
        switch(this.type) {
            case 'bouncy':
                fill(34, 197, 94);
                break;
            case 'moving':
                fill(239, 68, 68);
                break;
            default:
                fill(139, 92, 246);
        }
        
        rect(this.x, this.y, this.w, this.h, 5);
        pop();

        // Platform mintája
                fill(255, 255, 255, 100);
                for (let i = 10; i < this.w - 10; i += 20) {
                    rect(this.x + i, this.y + 5, 10, this.h - 10, 2);
                }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }
}