const LINE_THICKNESS = 1;
const COLLISION_TIME = 1.6;

class CollisionMap {
    constructor(width, height) {
        this.width = width;
        this.hieght = height;
        this.recentPoints = [];
        this.points = new Uint8Array(width*height);
        this.points.fill(255);
    }

    clear() {
        this.points.fill(255);
    }

    checkCollision(id, x, y) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            console.log(id+" collided out of bounds- x:"+x+" y:"+y);
            return true;
        }
        if (this.points[this.width * y + x] != 255) { 
            console.log(id+" collided with "+this.points[this.width * y + x]);
            return true;
        }
        for (var point of this.recentPoints) {
            if (point.id !== id && point.x === x && point.y === y) {
                console.log(id+" collided with "+point.id);
                return true;
            }
        }
        return false;
    }

    setPoint(id, x, y, time) {
        for (var i=-LINE_THICKNESS; i<=LINE_THICKNESS;i++) {
            for (var j=-LINE_THICKNESS; j<=LINE_THICKNESS;j++) {
                this.recentPoints.push({
                    timer: COLLISION_TIME,
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
                this.recentPoints.splice(i,1);
                this.points[this.width * point.y + point.x] = point.id;
            }
        }
    }
}
