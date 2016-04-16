
var game = new Phaser.Game(
    800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update
    }
);


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Global Declarations ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const ENERGY_MAX = 10;
const ENERGY_INTERVAL = 10;  // in seconds

var energy,
    energyMeter;

var mainGame,
    woodGame,
    metalGame,
    stoneGame;

// javascript addon filters
var blurX,
    blurY;
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Global Game Functions ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Phaser.State Functions ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function preload() {
    // -- load sprites and atlases -- //
    game.load.atlas('buttons', 'assets/sprites/buttons.png', 'assets/sprites/buttons.json');
    game.load.atlas('clouds', 'assets/sprites/clouds.png', 'assets/sprites/clouds.json');
    game.load.atlas('earth', 'assets/sprites/earth.png', 'assets/sprites/earth.json');
    game.load.atlas('grass', 'assets/sprites/grass.png', 'assets/sprites/grass.json');
    game.load.atlas('sun', 'assets/sprites/sun.png', 'assets/sprites/sun.json');
    game.load.atlas('trees_flower', 'assets/sprites/trees_flower.png', 'assets/sprites/trees_flower.json');
    game.load.atlas('trees_thin', 'assets/sprites/trees_thin.png', 'assets/sprites/trees_thin.json');
    game.load.atlas('trees_full', 'assets/sprites/trees_full.png', 'assets/sprites/trees_full.json');
    game.load.atlas('wood_tiles', 'assets/sprites/wood_tiles.png', 'assets/sprites/wood_tiles.json');
    
    // -- load audio -- //
    // TODO: add audio clips
    
    // -- load scripts -- //
    game.load.script('filterX', 'js/addons/BlurX.js');
    game.load.script('filterY', 'js/addons/BlurY.js');
}

    
function create() {
    
    // -- create blurring filter -- //
    blurX = game.add.filter('BlurX');
    blurY = game.add.filter('BlurY');
    
    energy = ENERGY_MAX;
    
    game.time.events.loop(
        Phaser.Timer.SECOND * ENERGY_INTERVAL, increaseEnergy, this
    );
    
    game.stage.backgroundColor = '#74a5f4';
    
    createMainGame();
}


function update() {
    
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Main Game Functions ~                                      [mainGame]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function createMainGame() {
    var ground,
        grass,
        clouds;
    var button_playWoodGame,
        button_playMetalGame,
        button_playStoneGame;
    
    mainGame = game.add.group();
    
    // -- create ground -- //
    ground = game.make.tileSprite(
        0, game.height, game.width, game.height * 0.20, 'earth', 'earth_03.png'
    );
    ground.anchor.set(0, 1);
    ground.tileScale.set(0.33);
    mainGame.add(ground);
    
    // -- create grass -- //
    grass = game.make.sprite(
        0, game.height - game.height * 0.18, 'grass', 'grass_02.png'
    );
    grass.anchor.set(0, 1);
    grass.scale.set(game.width / grass.width);
    mainGame.add(grass);
    
    // -- create random clouds -- //
    var numberOfClouds = randomNumber(3, 6);
    clouds = game.make.group();
    
    for (var totalClouds = 0; totalClouds < numberOfClouds; totalClouds++) {
        
        var randomCloudSprite = paddedNumber(randomNumber(1, 10));
        
        cloud = clouds.create(
            randomNumber(0, game.width),
            randomNumber(0, game.height * 0.667),
            'clouds', 'cloud_' + randomCloudSprite + ".png"
        );
        
        cloud.anchor.set(0.5);
        cloud.scale.set(randomPercentage(15, 25));
        cloud.alpha = (randomPercentage(80, 100));
    }
    mainGame.add(clouds);
    
    // -- create mini-game buttons -- //
    button_playWoodGame = game.make.button(
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
    mainGame.add(button_playWoodGame);
    
    button_playMetalGame = game.make.button(
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
    mainGame.add(button_playMetalGame);
    
    button_playStoneGame = game.make.button(
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
    mainGame.add(button_playStoneGame);
    
    // -- create energy bar -- //
    energyMeter = game.make.text(game.world.centerX - 100, 20, 'Energy Left: ' + energy, {fontSize: '20px', fill: '#000', align: 'center'});
    mainGame.add(energyMeter);
}


function isEnoughEnergy() {
    return energy > 0 ? true : false;
}


function decreaseEnergy() {
    if (energy > 0) {
        energy--;
        updateEnergyMeter();
    }
}


function increaseEnergy() {
    if (energy < ENERGY_MAX ) {
        energy++;
        updateEnergyMeter();
    }
}


function updateEnergyMeter() {
    energyMeter.setText('Energy Left: ' + energy);
}


function playWoodGame() {
    if (isEnoughEnergy()) {
        decreaseEnergy();
        mainGameRemoveFocus();
        startWoodGame();
    } else {
        alert("Not enough energy!");
    }
}


function playMetalGame() {
    if (isEnoughEnergy()) {
        decreaseEnergy();
        //mainGameRemoveFocus();
        //startMetalGame();
        alert("Play metal game!");
    } else {
        alert("Not enough energy!");
    }
}


function playStoneGame() {
    if (isEnoughEnergy()) {
        decreaseEnergy();
        //mainGameRemoveFocus();
        //startStoneGame();
        alert("Play stone game!");
    } else {
        alert("Not enough energy!");
    }
}


function mainGameRemoveFocus() {
    mainGame.forEach(function(obj) {
        obj.filters = [blurX, blurY];
        if (obj.type == Phaser.BUTTON) {
            obj.kill();
        }
    }, this);
}


function mainGameSetFocus() {
    mainGame.forEach(function(obj) {
        obj.filters = null;
        if (obj.type == Phaser.BUTTON) {
            obj.revive();
        }
    }, this);
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


// created groups for mini-games so on exit entire group can be removed
// with the 'game.world.remove(gameName)' call

/*

All your mini-game code needs to go in the appropriate 'start<mini>Game()' method and will run separate from the mainGame

Make sure you create all objects with '<varName> = game.make.<objectType>()' and then add it to your mini-game with '<mini>Game.add(<varName>)'

*/


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Wood Game Functions ~                                      [woodGame]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function startWoodGame() {
    
    woodGame = game.add.group();
    
    var table = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width - game.width * 0.10, game.height - game.height * 0.10,
        'wood_tiles', 'wood_tile_01.png'
    );
    table.anchor.set(0.5);
    table.tileScale.set(0.33);
    
    woodGame.add(table);
    
    var button_exitWoodGame = game.make.button(
        table.width,
        game.height - table.height,
        'sun',
        exitWoodGame,
        this,
        'sun_01.png',
        'sun_02.png',
        'sun_03.png'
    );
    
    button_exitWoodGame.anchor.set(0.5);
    button_exitWoodGame.scale.set(0.20);
    
    woodGame.add(button_exitWoodGame);
}

function exitWoodGame() {
    game.world.remove(woodGame);
    mainGameSetFocus();
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Metal Game Functions ~                                    [metalGame]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function startMetalGame() {
    metalGame = game.add.group();
    
    // YOUR MINI-GAME CODE!!!
    
    // call exitMetalGame() when the game is over
}

function exitMetalGame() {
    game.world.remove(metalGame);
    mainGameSetFocus();
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Stone Game Functions ~                                    [stoneGame]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function startStoneGame() {
    stoneGame = game.add.group();
    
    // YOUR MINI-GAME CODE!!!
    
    // call exitStoneGame() when the game is over
}

function exitStoneGame() {
    game.world.remove(stoneGame);
    mainGameSetFocus();
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */