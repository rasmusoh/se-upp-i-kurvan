const KEYCODES = {
    TAB : 9,
    ENTER : 13,
    CTRL : 17,
    ESCAPE : 27,
    SPACE : 32,
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    A : 65,
    S : 83,
    C : 67,
    V : 86,
    X : 88
};

const CONSTANTS = {
    SPEED: 2.01,
    RADIUS: 0.08,
    JUMP_SPACING: 100,
    JUMP_DISTANCE: 6.2,
    LINEWIDTH: 3
};

class CollisionMap {
    constructor(width, height) {
        this.width = width;
        this.width = height;
        this.array = new Uint8Array(width*height);
    }

    getPoint(x, y) {
        return this.array[this.width * y + x];
    }

    setPoint(value, x, y) {
        this.array[this.width * y + x] = value;
    }
}

class Application {
    constructor() {
        this.canvasContext = document.getElementById("gameCanvas").getContext("2d");
        this.width = document.getElementById("gameCanvas").width;
        this.height = document.getElementById("gameCanvas").height;
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
        this.snakes = [
            {
                x: 100,
                y: 200,
                lastX: 100,
                lastY: 200,
                direction:0,
                alive: true,
                color: 'blue',
                turningLeft: false,
                turningRight: false
            },
            {
                x: 400,
                y: 300,
                lastX: 400,
                lastY: 300,
                direction:0,
                alive: true,
                color: 'red',
                turningLeft: false,
                turningRight: false
            }
        ];
    }

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    handleKeyUp(e) {
        switch(e.keyCode) {
            case KEYCODES.LEFT:
                this.snakes[0].turningLeft = false;
                break;
            case KEYCODES.RIGHT:
                this.snakes[0].turningRight = false;
                break;
            case KEYCODES.A:
                this.snakes[1].turningLeft = false;
                break;
            case KEYCODES.S:
                this.snakes[1].turningRight = false;
                break;
        }
    }

    handleKeyDown(e) {
        switch(e.keyCode) {
            case KEYCODES.LEFT:
                this.snakes[0].turningLeft = true;
                break;
            case KEYCODES.RIGHT:
                this.snakes[0].turningRight = true;
                break;
            case KEYCODES.A:
                this.snakes[1].turningLeft = true;
                break;
            case KEYCODES.S:
                this.snakes[1].turningRight = true;
                break;
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
        //handle jumping
        this.jump.timer-=dt; 
        if (this.jump.timer <= 0) {
            this.jump.timer = this.jump.isJumping ? 
                  CONSTANTS.JUMP_SPACING
                : CONSTANTS.JUMP_DISTANCE;
            this.jump.isJumping = !this.jump.isJumping;
        }

        //update snake positions and check for collisions
        for (var snake of this.snakes) {
            if (!snake.alive) { continue; }

            if (snake.turningRight) {
                snake.direction+=CONSTANTS.RADIUS*dt;
            }
            if (snake.turningRight) {
                snake.direction-=CONSTANTS.RADIUS*dt;
            }

            snake.x = snake.x + Math.cos(snake.direction)*CONSTANTS.SPEED*dt;
            snake.y = snake.y + Math.sin(snake.direction)*CONSTANTS.SPEED*dt;

            xInt = Math.trunc(snake.x);
            yInt = Math.trunc(snake.y);
            if (xInt != snake.lastX || yInt != snake.lastY) {

                snake.lastX = Math.trunc(snake.x);
                snake.lastY = Math.trunc(snake.y);
            }

            if (!this.jump.isJumping) {

                if (snake.x < 0 || snake.x > this.width ||
                    snake.y < 0 || snake.y > this.height) {
                    snake.alive = false;
                }

                this.array.getPoint(snake.x, snake.y);
            }

        }
    }

    render() {
        for (var snake of this.snakes) {
            if (this.jump.isJumping) { return; }
            this.canvasContext.strokeStyle = snake.color;
            this.canvasContext.lineWidth = CONSTANTS.LINEWIDTH;
            this.canvasContext.lineJoin = "round";
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(snake.lastX, snake.lastY);
            this.canvasContext.lineTo(snake.x, snake.y);
            this.canvasContext.closePath();
            this.canvasContext.stroke();
        }
    }
}
