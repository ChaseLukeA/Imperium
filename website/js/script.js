var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var energyBar,
    energyTotal = 10;
var timerText,
    time;
var buttons,
    button_playWoodGame,
    button_playMetalGame,
    button_playStoneGame;
var cloud,
    clouds,
    numberOfClouds;
    

function preload() {
    game.load.image('dirt_01', 'assets/sprites/dirt_01.png');
    game.load.image('grass_01', 'assets/sprites/grass_01.png');
    game.load.atlas('clouds', 'assets/sprites/clouds.png', 'assets/sprites/clouds.json');
    game.load.atlas('buttons', 'assets/sprites/buttons.png', 'assets/sprites/buttons.json');
}


// -- global game functions ----------------------------------------- //

// generate a random number between min and max
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// generate a random percentage between min and max;
// takes in whole numbers for range and returns fractional percentages (0.##);
// great for calculating sizes for responsive design, like sprite
// scaling (example: mySprite.scale.set(randomPercentage(15, 25)); will
// return a fractional percentage between 0.15 and 0.25)
function randomPercentage(min, max) {
    return randomNumber(min, max) / 100;
}

// pad a single digit number, so '4' would become '04', and '10'
// would just stay '10'; great for use with sprites and atlases where
// the assets are named with precise digits (e.g. sky_01.png, sky_02.png)
function paddedNumber(number) {
    return number < 10 ? "0" + number : number;
}
// ------------------------------------------------------------------ //

    
function create() {
        
    game.stage.backgroundColor = '#74a5f4';
    
    // --- create ground and grass ---------------------------------- //
    var ground = game.add.tileSprite(
        0, game.height,  // position
        game.width, game.height * 0.20,  // size
        'dirt_01'  // sprite key
    );
    ground.anchor.set(0, 1);  // bottom left anchor
    ground.tileScale.set(0.33);
    
    var grass = game.add.sprite(0, game.height - game.height * 0.18, 'grass_01' )
    grass.anchor.set(0, 1);  // bottom left anchor
    grass.scale.set(game.width / grass.width);
    // -------------------------------------------------------------- //
    
    
    // --- create random clouds ------------------------------------- //
    numberOfClouds = randomNumber(3, 6);
    clouds = game.add.group();
    
    for (var totalClouds = 0; totalClouds < numberOfClouds; totalClouds++) {
        
        var randomCloud = paddedNumber(randomNumber(1, 10));
        
        cloud = clouds.create(
            randomNumber(0, game.width),
            randomNumber(0, game.height * 0.667),
            'clouds', 'cloud_' + randomCloud + ".png"
        );
        
        cloud.anchor.set(0.5);
        cloud.scale.set(randomPercentage(15, 25));
        cloud.alpha = (randomPercentage(80, 100));
    }
    // -------------------------------------------------------------- //
    
    
    // -- create mini-game buttons ---------------------------------- //
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
    // -------------------------------------------------------------- //
    
    
    // -- create energy bar ----------------------------------------- //
    energyBar = game.add.text(game.world.centerX - 100, 20, 'Energy Left: 10', {fontSize: '20px', fill: '#000', align: 'center'});
    
    game.time.events.loop(Phaser.Timer.SECOND * 5, updateEnergyBar, this);
    // -------------------------------------------------------------- //
}


// -- mini-game loaders --------------------------------------------- //
function playWoodGame() {
    if (enoughEnergy()) {
        decreaseEnergy();
        alert("Play wood game!");
    } else {
        alert("Not enough energy!");
    }
}

function playMetalGame() {
    if (enoughEnergy()) {
        decreaseEnergy();
        alert("Play metal game!");
    } else {
        alert("Not enough energy!");
    }
}

function playStoneGame() {
    if (enoughEnergy()) {
        decreaseEnergy();
        alert("Play stone game!");
    } else {
        alert("Not enough energy!");
    }
}
// ------------------------------------------------------------------ //


// -- energy functions ---------------------------------------------- //
function enoughEnergy() {
    return energyTotal > 0 ? true : false;
}

function decreaseEnergy() {
    if (energyTotal > 0) {
        energyTotal--;
        energyBar.setText('Energy Left: ' + energyTotal);
    }
}

function increaseEnergy() {
    if (energyTotal <= 9 ) {
        energyTotal++;
        energyBar.setText('Engery Left: ' + energyTotal);
    }
}
// ------------------------------------------------------------------ //


function update() {
    
}