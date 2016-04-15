var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var energyBar,
    energyTotal = 10;
var timerText,
    time;
var buttons,
    button_playWoodGame,
    button_playMetalGame,
    button_playStoneGame;
    

function preload() {
        //game.load.image('shovel', '../assets/sprites/shovel.png');
    game.load.atlas('buttons', 'assets/sprites/buttons.png', 'assets/sprites/buttons.json');
}

    
function create() {
        
    game.stage.backgroundColor = '#34a26f';
    
    button_playWoodGame = game.add.button(
        game.width * 0.39,
        game.height * 0.92,
        'buttons',
        playWoodGame,
        this,
        'btn_wood_over.png',
        'btn_wood.png',
        'btn_wood_down.png'
    );
    button_playWoodGame.anchor.set(0.5);
    button_playWoodGame.scale.set(0.35);
    
    button_playMetalGame = game.add.button(
        game.width * 0.50,
        game.height * 0.90,
        'buttons',
        playMetalGame,
        this,
        'btn_metal_over.png',
        'btn_metal.png',
        'btn_metal_down.png'
    );
    button_playMetalGame.anchor.set(0.5);
    button_playMetalGame.scale.set(0.35);
    
    button_playStoneGame = game.add.button(
        game.width * 0.61,
        game.height * 0.92,
        'buttons',
        playStoneGame,
        this,
        'btn_stone_over.png',
        'btn_stone.png',
        'btn_stone_down.png'
    );
    button_playStoneGame.anchor.set(0.5);
    button_playStoneGame.scale.set(0.35);
    
    
    energyBar = game.add.text(game.world.centerX - 100, 20, 'Energy Left: 10', {fontSize: '20px', fill: '#000', align: 'center'});
    
    game.time.events.loop(Phaser.Timer.SECOND * 5, updateEnergyBar, this);
}


function playWoodGame() {
    alert("Play wood game!");
}

function playMetalGame() {
    alert("Play metal game!");
}

function playStoneGame() {
    alert("Play stone game!");
}


function update() {
    
}


function updateEnergyBar() {
    if (energyTotal <= 9 ) {
        energyTotal++;
        energyBar.setText('Engery Left: ' + energyTotal);
    }
}

function playGameOne() {
    if (energyTotal > 0) {
        energyTotal--;
        energyBar.setText('Engery Left: ' + energyTotal);
    }
}

function playGameTwo() {
    if (energyTotal > 0) {
        energyTotal--;
        energyBar.setText('Engery Left: ' + energyTotal);
    }
}

function playGameThree() {
    if (energyTotal > 0) {
        energyTotal--;
        energyBar.setText('Engery Left: ' + energyTotal);
    }
}


