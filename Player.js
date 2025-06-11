        class Player {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.w = 40;
                this.h = 60;
                this.vx = 0;
                this.vy = 0;
                this.onGround = false;
                this.speed = 5;
                this.jumpPower = 12;
                this.gravity = 0.5;
            }

            update(keys, platforms, canvasWidth, canvasHeight) {
                // Vízszintes mozgás
                if (keys.has('ArrowLeft')) {
                    this.vx = -this.speed;
                } else if (keys.has('ArrowRight')) {
                    this.vx = this.speed;
                } else {
                    this.vx = 0;
                }

                // Ugrás
                if (keys.has('ArrowUp') && this.onGround) {
                    this.vy = -this.jumpPower;
                    this.onGround = false;
                }

                // Gravitáció
                this.vy += this.gravity;

                // Pozíció frissítése
                this.x += this.vx;
                this.y += this.vy;

                // Platform ütközések
                this.checkPlatformCollisions(platforms);

                // Világhatárok
                if (this.x < 0) this.x = 0;
                if (this.x + this.w > canvasWidth) this.x = canvasWidth - this.w;
                
                // Leesés ellenőrzése
                return this.y > canvasHeight;
            }

            checkPlatformCollisions(platforms) {
                this.onGround = false;
                for (const platform of platforms) {
                    if (this.x < platform.x + platform.w && 
                        this.x + this.w > platform.x &&
                        this.y < platform.y + platform.h && 
                        this.y + this.h > platform.y) {
                        
                        // Felülről érkezik
                        if (this.vy > 0 && this.y < platform.y) {
                            this.y = platform.y - this.h;
                            this.vy = 0;
                            this.onGround = true;
                            
                            // Bouncy platform
                            if (platform.type === 'bouncy') {
                                this.vy = -this.jumpPower * 1.5;
                                this.onGround = false;
                            }
                        }
                    }
                }
            }

            reset(x, y) {
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.onGround = false;
            }

            draw() {
                fill(106, 90, 205);
                rect(this.x, this.y, this.w, this.h);
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