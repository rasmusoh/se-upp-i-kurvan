const THRESHOLD = 10;

class Match {
    constructor(players) {
        this.paused = false;
        this.matchEnded = false;
        this.gameEnded = false;
        this.score = new Array(players.length).fill(0);
        this.currentGame = new Game(players);
        this.players = players;
        this.threshold = THRESHOLD;
        this.time = {
            now : 0,
            dt : 0,
            last : 0,
            step : 1/60
        };
        updateScore(this.score);
        clearCanvas();
    }

    handleKeyUp(e) {
        this.currentGame.handleKeyUp(e);
    }

    handleKeyDown(e) {
        if (e.keyCode === 32) {
            if (this.matchEnded) {
                backToMainMenu();
            }
            else if (this.gameEnded) {
                clearCanvas();
                this.gameEnded = false;
                this.paused = false;
            }
            else {
                this.paused = !this.paused;
            }
        }
        else {
            this.currentGame.handleKeyDown(e);
        }
    }

    update(dt) {
        if (this.paused) { return; }
        this.currentGame.update(dt);

        if (this.currentGame.winner !== null) { 
            this.score[this.currentGame.winner]++;
            updateScore(this.score);

            if (this.score[this.currentGame.winner] >= this.threshold) {
                this.paused = true;
                this.matchEnded = true;
                displayGameOverScreen();
            }
            else {
                this.gameEnded = true;
                this.paused = true;
                this.currentGame = new Game(this.players);
            }
        }
    }

    frame() {
        this.time.now = timestamp();
        this.time.dt = this.time.dt + Math.min(1, (this.time.now - this.time.last) / 1000);
        while(this.time.dt > this.time.step) {
            this.time.dt = this.time.dt - this.time.step;
            this.update(this.time.step);
        }

        this.currentGame.render(this.time.dt);

        if (!this.matchEnded) {
            requestAnimationFrame(() => this.frame.call(this));
        }
    }

    start() {
        document.onkeydown = (e) => this.handleKeyDown.call(this,e);
        document.onkeyup = (e) => this.handleKeyUp.call(this,e);
        requestAnimationFrame(() => this.frame.call(this));
    }
}

function backToMainMenu() {
    document.onkeydown = null;
    document.onkeyup = null;
    document.getElementById('startMenu').classList.remove('hidden');
    document.getElementById('gameDiv').classList.add('hidden');
}

function displayGameOverScreen() {
    const canvas = document.getElementById('gameCanvas');
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.font = '100px Arial';
    ctx.fillText('Spelet slut.',width/3,height/2);
}

function clearCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0,0,width,height);
}

function updateScore(scores) {
    for (var i = 0; i < scores.length; i++) {
        document.getElementById('score')
            .children[i]
            .children[1].innerHTML = scores[i];
    }
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
