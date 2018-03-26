var activePlayers = 2;

function createMenu() {
    for (var i= 0; i < Players.length; i++) {
        const tr = document.createElement('tr');
        const p = Players[i];
        tr.innerHTML= 
            '<td style="background-color:'+p.color+';"></td>'
            +'<td>'+p.turnLeft.displayName+'</td>'
            +'<td>'+p.turnRight.displayName+'</td>'
            +'<td>'
            +    '<input id="aiCheckbox'+p.id+'" type="checkbox">'
            +    '<label for="aiCheckbox'+p.id+'">Robot</label>'
            +'</td>';
        if (i >= activePlayers) {
            tr.classList.add('hidden');
        }
        document.getElementById('players').appendChild(tr);
        document.getElementById('removePlayer').classList.add('novisible');
    }
}

function addPlayer() {
    if (activePlayers >= Players.length) { return; }

    activePlayers++;
    document.getElementById('players')
        .children[activePlayers]
        .classList.remove('hidden');

    document.getElementById('removePlayer').classList.remove('novisible');
    if (activePlayers == players.length) {
        document.getElementById('addPlayer').classList.add('novisible');
    }
}

function removePlayer() {
    if (activePlayers <= 2) { return; }

    activePlayers--;
    document.getElementById('players')
        .children[activePlayers+1]
        .classList.add('hidden');

    document.getElementById('addPlayer').classList.remove('novisible');
    if (activePlayers == 2) {
        document.getElementById('removePlayer').classList.add('novisible');
    }
}

function startGame() {
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('gameCanvas').classList.remove('hidden');

    const game = new Game(Players.slice(0,activePlayers));
    game.run();
}
