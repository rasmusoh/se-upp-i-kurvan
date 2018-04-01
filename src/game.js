SPEED = 2.01;
RADIUS = 0.08;
JUMP_SPACING = 100;
JUMP_DISTANCE = 4.2;
LINEWIDTH = 3;

class Game {
    constructor(players) {
        this.winner = null;
        this.canvasContext = document.getElementById('gameCanvas').getContext('2d');
        this.width = document.getElementById('gameCanvas').width;
        this.height = document.getElementById('gameCanvas').height;
        this.jump = {
            isJumping: false,
            timer: JUMP_SPACING
        };

        this.controls = {
            left: {},
            right: {}
        };
        this.collisionMap = new CollisionMap(this.width, this.height);
        players.forEach((p,i) => this.controls.left[p.turnLeft.scanCode] = i);
        players.forEach((p,i) => this.controls.right[p.turnRight.scanCode] = i);

        this.snakes = players.map((p,i) => {
            const x = this.width*Math.random();
            const y = this.height*Math.random();
            const direction = 2*Math.PI*Math.random();
            return {
                id: i,
                x: x,
                y: y,
                lastXPixel: Math.trunc(x),
                lastYPixel: Math.trunc(y),
                direction:direction,
                alive: true,
                color: p.color,
                turningLeft: false,
                turningRight: false
            };
        });
    }

    handleKeyUp(e) {
        if (this.controls.left[e.keyCode] !== undefined) {
            this.snakes[this.controls.left[e.keyCode]].turningLeft = false;
        }
        else if (this.controls.right[e.keyCode] !== undefined) {
            this.snakes[this.controls.right[e.keyCode]].turningRight = false;
        }
    }

    handleKeyDown(e) {
        if (this.controls.left[e.keyCode] !== undefined) {
            this.snakes[this.controls.left[e.keyCode]].turningLeft = true;
        }
        else if (this.controls.right[e.keyCode] !== undefined) {
            this.snakes[this.controls.right[e.keyCode]].turningRight = true;
        }
    }

    update(dt) {
        this.jump.timer-=dt; 
        if (this.jump.timer <= 0) {
            this.jump.timer = this.jump.isJumping ? 
                JUMP_SPACING
                : JUMP_DISTANCE;
            this.jump.isJumping = !this.jump.isJumping;
        }

        this.collisionMap.update(dt);

        for (var snake of this.snakes) {
            if (!snake.alive) { continue; }

            if (snake.turningLeft) {
                snake.direction-=RADIUS*dt;
            }
            if (snake.turningRight) {
                snake.direction+=RADIUS*dt;
            }

            snake.x = snake.x + Math.cos(snake.direction)*SPEED*dt;
            snake.y = snake.y + Math.sin(snake.direction)*SPEED*dt;

            const xPixel = Math.trunc(snake.x);
            const yPixel = Math.trunc(snake.y);
            if (xPixel != snake.lastXPixel || yPixel != snake.lastYPixel) {

                snake.lastXPixel = Math.trunc(snake.x);
                snake.lastYPixel = Math.trunc(snake.y);

                if (!this.jump.isJumping) {
                    if (this.collisionMap.checkCollision(snake.id, xPixel, yPixel)) {
                        snake.alive = false;
                        if (this.snakes.filter(s => s.alive).length === 1) {
                            this.winner = this.snakes.filter(s => s.alive)[0].id;
                        }
                    }
                    else {
                        this.collisionMap.setPoint(snake.id, xPixel, yPixel);
                    }
                }
            }
        }
    }

    render() {
        if (this.jump.isJumping || this.paused) { return; }
        for (var snake of this.snakes) {
            this.canvasContext.strokeStyle = snake.color;
            this.canvasContext.lineWidth = LINEWIDTH;
            this.canvasContext.lineJoin = 'round';
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(snake.lastXPixel, snake.lastYPixel);
            this.canvasContext.lineTo(snake.x, snake.y);
            this.canvasContext.closePath();
            this.canvasContext.stroke();
        }
    }
}
