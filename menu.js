var activePlayers = 2;

function createMenu() {
    for (var i= 0; i < Players.length; i++) {
        const tr = document.createElement('tr');
        const p = Players[i];
        tr.innerHTML= 
            '<td class="player-color" style="background-color:'+p.color+';"></td>'
            +'<td class="player-keys-'+i+'">'+p.turnLeft.displayName+'</td>'
            +'<td class="player-keys-'+i+'">'+p.turnRight.displayName+'</td>'
            +'<td>Människa</td>'
            +'<td>'
            +'<div class="ai-switch">'
            +    '<input type="checkbox" id="ai-switch-'+i+'" onclick="toggleAi('+i+')"/>'
            +    '<label for="ai-switch-'+i+'"></label>'
            +'</div>'
            +'</td>'
            +'<td>Dator</td>';

        const scoreTr = document.createElement('tr');
        scoreTr.innerHTML = 
            '<td class="player-color" style="background-color:'+p.color+';"></td>'
            +'<td>0</td>';

        if (i >= activePlayers) {
            tr.classList.add('novisible');
            scoreTr.classList.add('novisible');
        }
        document.getElementById('players').appendChild(tr);
        document.getElementById('score').appendChild(scoreTr);

        document.getElementById('removePlayer').classList.add('novisible');
    }
}

function addPlayer() {
    if (activePlayers >= Players.length) { return; }

    document.getElementById('players')
        .children[activePlayers]
        .classList.remove('novisible');

    document.getElementById('score')
        .children[activePlayers]
        .classList.remove('novisible');

    activePlayers++;
    document.getElementById('removePlayer').classList.remove('novisible');
    if (activePlayers == players.length) {
        document.getElementById('addPlayer').classList.add('novisible');
    }
}

function removePlayer() {
    if (activePlayers <= 2) { return; }

    activePlayers--;
    document.getElementById('players')
        .children[activePlayers]
        .classList.add('novisible');

    document.getElementById('score')
        .children[activePlayers]
        .classList.add('novisible');

    document.getElementById('addPlayer').classList.remove('novisible');
    if (activePlayers == 2) {
        document.getElementById('removePlayer').classList.add('novisible');
    }
}

function toggleAi(playerId) {
    var elements = document.querySelectorAll('.player-keys-'+playerId);
    Array.prototype.forEach.call(elements, el => el.classList.toggle('novisible'));

    Players[playerId].humanControlled = !Players[playerId].humanControlled;
}

function startGame() {
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('gameDiv').classList.remove('hidden');

    const match = new Match(Players.slice(0,activePlayers));
    match.start();
}
