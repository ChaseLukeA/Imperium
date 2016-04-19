/*
 *  Imperium
 *
 *  a Phaser game coded by Luke A Chase, Will Weathers, Charles Marion
 *  © 2016
 *
 */

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

var wood,
    woodMeter;

var metal,
    metalMeter;

var stone,
    stoneMeter;

var gold,
    goldMeter;

var mainGame,
    woodGame,
    metalGame,
    stoneGame;

var activeGame;
var Game = {  // 'enum' used in update() method to only run active game
        MAIN: 0,
        WOOD: 1,
        METAL: 2,
        STONE: 3
    };

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

// return a fractional percentage from an input percentage from 1 to 100
function p(number) {
    return number / 100;
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
    // -- game settings -- //
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    
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
    
    // -- game settings -- //
    game.time.events.loop(
        Phaser.Timer.SECOND * ENERGY_INTERVAL, increaseEnergy, this
    );
    
    game.stage.backgroundColor = '#74a5f4';
    
    // -- set up game -- //
    energy = ENERGY_MAX;
    wood = 0;
    metal = 0;
    stone = 0;
    gold = 100;
    
    createMainGame();
    activeGame = Game.MAIN;
}


function update() {
    switch (activeGame) {
        case Game.MAIN:
            // any mainGame -specific update code goes here
            break;
        case Game.WOOD:
            // any woodGame -specific update code goes here
            break;
        case Game.METAL:
            // any metalGame -specific update code goes here
            break;
        case Game.STONE:
            // any stoneGame -specific update code goes here
            break;
    }
    
    // any universal (all games) update code goes here
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
    energyMeter = game.make.text(game.world.width * 0.04, game.world.height * 0.89, 'Energy: ' + energy, {fontSize: '20px', fill: '#fff', align: 'center'});
    mainGame.add(energyMeter);
    
    // -- create wood bar -- //
    woodMeter = game.make.text(game.world.width * 0.86, game.world.height * 0.83, 'Wood: ' + wood, {fontSize: '20px', fill: '#fff', align: 'center'});
    mainGame.add(woodMeter);
    
    // -- create metal bar -- //
    metalMeter = game.make.text(game.world.width * 0.86, game.world.height * 0.87, 'Metal: ' + metal, {fontSize: '20px', fill: '#fff', align: 'center'});
    mainGame.add(metalMeter);
    
    // -- create stone bar -- //
    stoneMeter = game.make.text(game.world.width * 0.86, game.world.height * 0.91, 'Stone: ' + stone, {fontSize: '20px', fill: '#fff', align: 'center'});
    mainGame.add(stoneMeter);
    
    // -- create gold bar -- //
    goldMeter = game.make.text(game.world.width * 0.86, game.world.height * 0.95, 'Gold: ' + gold, {fontSize: '20px', fill: '#fff', align: 'center'});
    mainGame.add(goldMeter);
    
    
}

// -- energy Functions --//
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
    energyMeter.setText('Energy: ' + energy);
}


// -- wood Functions --//
function isEnoughWood() {
    return wood > 0 ? true : false;
}


function decreaseWood() {
    if (wood > 0) {
        wood--;
        updateWoodMeter();
    }
}


function increaseWood() {
    if (wood < wood_MAX ) {
        wood++;
        updateWoodMeter();
    }
}


function updateWoodMeter() {
    woodMeter.setText('Wood: ' + wood);
}


// -- metal Functions --//
function isEnoughMetal() {
    return metal > 0 ? true : false;
}


function decreaseMetal() {
    if (metal > 0) {
        metal--;
        updateMetalMeter();
    }
}


function increaseMetal() {
    if (metal < metal_MAX ) {
        metal++;
        updateMetalMeter();
    }
}


function updateMetalMeter() {
    metalMeter.setText('Metal: ' + metal);
}


// -- stone Functions --//
function isEnoughStone() {
    return stone > 0 ? true : false;
}


function decreaseStone() {
    if (stone > 0) {
        stone--;
        updateStoneMeter();
    }
}


function increaseStone() {
    if (stone < stone_MAX ) {
        stone++;
        updateStoneMeter();
    }
}


function updateStoneMeter() {
    stoneMeter.setText('Stone: ' + stone);
}


// -- gold Functions --//
function isEnoughGold() {
    return gold > 0 ? true : false;
}


function decreaseGold() {
    if (gold > 0) {
        gold--;
        updateGoldMeter();
    }
}


function increaseGold() {
    if (gold < gold_MAX ) {
        gold++;
        updateGoldMeter();
    }
}


function updateGoldMeter() {
    goldMeter.setText('Gold: ' + gold);
}


// -- Mini-Game Functions --//
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
    activeGame = Game.MAIN;
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
    
    activeGame = Game.WOOD;
    woodGame = game.add.group();
    
    var frameShadow = game.make.sprite()
    var frame = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width - game.width * 0.1, game.height - game.height * 0.1,
        'earth', 'earth_05.png'
    );
    frame.anchor.set(0.5);
    frame.tileScale.set(0.33);
    
    woodGame.add(frame);
    
    var table = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width - game.width * 0.13, game.height - game.height * 0.13,
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
    activeGame = Game.METAL;
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
    activeGame = Game.STONE;
    stoneGame = game.add.group();
    
    //something changed here
    // YOUR MINI-GAME CODE!!!
    
    // call exitStoneGame() when the game is over
}

function exitStoneGame() {
    game.world.remove(stoneGame);
    mainGameSetFocus();
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
