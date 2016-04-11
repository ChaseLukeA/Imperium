var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var energyBar;
var timer;
var energyTotal = 10;
var playGameOneButton;
var playGameTwoButton;
var playGameThreeButton;

    
function preload() {
        game.load.image('shovel', '../assets/sprites/shovel.png');
}
    
function create() {
        
    game.stage.backgroundColor = '#34a26f';
    
    energyBar = game.add.text(game.world.centerX - 100, 20, 'Engery Left: 10', {fontSize: '20px', fill: '#000', align: 'center'});
    
    game.time.events.loop(Phaser.Timer.SECOND * 5, updateEnergyBar, this);
    
    playGameOneButton = game.add.button(150, 500, 'shovel', playGameOne, this);
    playGameTwoButton = game.add.button(350, 500, 'shovel', playGameTwo, this);
    playGameThreeButton = game.add.button(550, 500, 'shovel', playGameThree, this);
        
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


