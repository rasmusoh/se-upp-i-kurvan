const CONSTANTS = {
    COLLISION_TIME: 300,
    SPEED: 2.01,
    RADIUS: 0.08,
    JUMP_SPACING: 100,
    JUMP_DISTANCE: 4.2,
    LINEWIDTH: 3,
    TOLERANCE: 1,
};

class CollisionMap {
    constructor(width, height) {
        this.width = width;
        this.width = height;
        this.recentPoints = [];
        this.points = new Uint8Array(width*height);
        this.points.fill(255);
    }

    checkCollision(id, x, y) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            return true;
        }
        if (this.points[this.width * y + x] != 255) { 
            return true;
        }
        for (var point of this.recentPoints) {
            if (point.id !== id && point.x === x && point.y === y) {
                return true;
            }
        }
        return false;
    }

    setPoint(id, x, y, time) {
        for (var i=-CONSTANTS.TOLERANCE; i<=CONSTANTS.TOLERANCE;i++) {
            for (var j=-CONSTANTS.TOLERANCE; j<=CONSTANTS.TOLERANCE;j++) {
                this.recentPoints.push({
                    timer: CONSTANTS.COLLISION_TIME,
                    id: id,
                    x: x+i, 
                    y: y+j, 
                });
            }
        }
    }

    update(dt) {
        for (var i = this.recentPoints.length -1; i >= 0; i--) {
            const point = this.recentPoints[i];
            point.timer-=dt;
            if (point.timer <= 0) {
                console.log("point placed on "+point.x+" "+point.y);
                this.recentPoints.splice(i,1);
                this.points[this.width * point.y + point.x] = point.id;
            }
        }
    }
}

class Game {
    constructor(players) {
        this.canvasContext = document.getElementById('gameCanvas').getContext('2d');
        this.width = document.getElementById('gameCanvas').width;
        this.height = document.getElementById('gameCanvas').height;
        this.collisionMap = new CollisionMap(this.width, this.height);
        this.time = {
            now : 0,
            dt : 0,
            last : 0,
            step : 1/60
        };
        this.jump = {
            isJumping: false,
            timer: CONSTANTS.JUMP_SPACING
        };

        this.controls = {
            left: {},
            right: {}
        };
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

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
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

    frame() {
        this.time.now = this.timestamp();
        this.time.dt = this.time.dt + Math.min(1, (this.time.now - this.time.last) / 1000);
        while(this.time.dt > this.time.step) {
            this.time.dt = this.time.dt - this.time.step;
            this.update(this.time.step);
        }
        this.render(this.time.dt);
        requestAnimationFrame(() => this.frame.call(this));
    }

    run() {
        document.onkeydown = (e) => this.handleKeyDown.call(this,e);
        document.onkeyup = (e) => this.handleKeyUp.call(this,e);
        requestAnimationFrame(() => this.frame.call(this));
    }

    update(dt) {
        this.jump.timer-=dt; 
        if (this.jump.timer <= 0) {
            this.jump.timer = this.jump.isJumping ? 
                CONSTANTS.JUMP_SPACING
                : CONSTANTS.JUMP_DISTANCE;
            this.jump.isJumping = !this.jump.isJumping;
        }

        this.collisionMap.update(dt);

        for (var snake of this.snakes) {
            if (!snake.alive) { continue; }

            if (snake.turningLeft) {
                snake.direction-=CONSTANTS.RADIUS*dt;
            }
            if (snake.turningRight) {
                snake.direction+=CONSTANTS.RADIUS*dt;
            }

            snake.x = snake.x + Math.cos(snake.direction)*CONSTANTS.SPEED*dt;
            snake.y = snake.y + Math.sin(snake.direction)*CONSTANTS.SPEED*dt;

            const xPixel = Math.trunc(snake.x);
            const yPixel = Math.trunc(snake.y);
            if (xPixel != snake.lastXPixel || yPixel != snake.lastYPixel) {

                snake.lastXPixel = Math.trunc(snake.x);
                snake.lastYPixel = Math.trunc(snake.y);

                if (!this.jump.isJumping) {
                    if (this.collisionMap.checkCollision(snake.id, xPixel, yPixel)) {
                        snake.alive = false;
                    }
                    else {
                        this.collisionMap.setPoint(snake.id, xPixel, yPixel);
                    }
                }
            }
        }
    }

    render() {
        if (this.jump.isJumping) { return; }
        for (var snake of this.snakes) {
            this.canvasContext.strokeStyle = snake.color;
            this.canvasContext.lineWidth = CONSTANTS.LINEWIDTH;
            this.canvasContext.lineJoin = 'round';
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(snake.lastXPixel, snake.lastYPixel);
            this.canvasContext.lineTo(snake.x, snake.y);
            this.canvasContext.closePath();
            this.canvasContext.stroke();
        }
    }
}
