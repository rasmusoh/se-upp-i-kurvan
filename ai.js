VIEWING_DISTANCE = 100;
VIEWING_STEP = 2;

class Ai {
    constructor(collisionMap, width, height) {
        this.width = width;
        this.height = height;
        this.collisionMap = collisionMap;
    }

    update(snake, dt) {
        const maxLeft = checkDirection(snake.direction-Math.PI/4, snake);
        const maxCenter = checkDirection(snake.direction, snake);
        const maxRight = checkDirection(snake.direction+Math.PI/4, snake);

        if (maxLeft > maxCenter && maxLeft > maxRight) {
            snake.turningRight = false;
            snake.turningLeft = true;
        }
        else if (maxRight > maxCenter && maxRight > maxLeft) {
            snake.turningRight = true;
            snake.turningLeft = false;
        }
        else {
            snake.turningRight = false;
            snake.turningLeft = false;
        }
    }

    checkDirection(direction, snake) {
        var x = snake.x;
        var y = snake.y;
        var distanceCenter = 0;

        for (var i=1; i<=VIEWING_DISTANCE; i+= 2) {
            x+= Math.cos(direction) * VIEWING_STEP;
            y+= Math.sin(direction) * VIEWING_STEP;
            if (this.collisionMap.checkCollision(snake.id, 
                Math.trunc(x), Math.trunc(y))) {
                return i;
            }
        }
        return VIEWING_DISTANCE;
    }
}

