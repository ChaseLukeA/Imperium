/*
 *  Imperium
 *
 *  a Phaser game coded by Luke A Chase, Will Weathers, Charles Marion
 *  © 2016
 *
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload, create: create, update: update
    }
);


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Global Declarations ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
const ENERGY_MAX = 10;  // most energy you can have
const ENERGY_INTERVAL = 10;  // how often energy autoIncreases
const ENERGY_INCREMENT = 1;  // the amount energy autoIncreases

/* --------------------------------------------------------------
 * Resource is used to build new resources which have thier own
 * properties and methods, e.g. energy, wood, metal, stone, gold;
 * --------------------------------------------------------------
 * Example:
 *   var silver = new Resource('Silver', 40);
 *   silver.name;  >> outputs 'Silver'
 *   silver.amount;  >> outputs '40'
 *   silver.increase(10);
 *   silver.amount;  >> outputs '50'
 *   silver.hasEnoughFor(60);  >> outputs 'false' because 60 > 50
 *   silver.decrease(20);
 *   silver.amount;  >> outputs '30'
 */
var Resource = function (_name, _amount, _max) {
    this.name = _name;
    this.amount = _amount;
    this.max = (_max == null ? 0 : _max);
    
    this.increase = function(value) {
        this.amount += value;
    },
    this.decrease = function(value) {
        if (this.amount - value >= 0) {
            this.amount -= value;
        } else {
            alert(this.name + " cannot go below zero!");
        }
    },
    this.hasEnoughFor = function(value) {
        return this.amount - value >= 0;
    }
}

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

var GAME_COST = 1;

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
    game.load.atlas('stone_textures', 'assets/sprites/stone_textures.png', 'assets/sprites/stone_textures.json');
    
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
    
    game.stage.backgroundColor = '#74a5f4';
    
    // -- set up game -- //
    energy = new Resource('Energy', ENERGY_MAX, ENERGY_MAX);
    wood = new Resource('Wood', 0);
    metal = new Resource('Metal', 0);
    stone = new Resource('Stone', 0);
    gold = new Resource('Gold', 100);
    
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
    energyMeter = game.make.text(
        game.world.width * 0.04,
        game.world.height * 0.89,
        "",
        {fontSize: '20px', fill: '#fff', align: 'center'}
    );
    mainGame.add(energyMeter);
    updateResourceMeter(energy);
    
    // -- create wood bar -- //
    woodMeter = game.make.text(
        game.world.width * 0.86,
        game.world.height * 0.83,
        "",
        {fontSize: '20px', fill: '#fff', align: 'center'}
    );
    mainGame.add(woodMeter);
    updateResourceMeter(wood);
    
    // -- create metal bar -- //
    metalMeter = game.make.text(
        game.world.width * 0.86,
        game.world.height * 0.87,
        "",
        {fontSize: '20px', fill: '#fff', align: 'center'}
    );
    mainGame.add(metalMeter);
    updateResourceMeter(metal);
    
    // -- create stone bar -- //
    stoneMeter = game.make.text(
        game.world.width * 0.86,
        game.world.height * 0.91,
        "",
        {fontSize: '20px', fill: '#fff', align: 'center'}
    );
    mainGame.add(stoneMeter);
    updateResourceMeter(stone);
    
    // -- create gold bar -- //
    goldMeter = game.make.text(
        game.world.width * 0.86,
        game.world.height * 0.95,
        "",
        {fontSize: '20px', fill: '#fff', align: 'center'}
    );
    mainGame.add(goldMeter);
    updateResourceMeter(gold);
    
    // -- start energy auto-regeneration -- //
    game.time.events.loop(
        Phaser.Timer.SECOND * ENERGY_INTERVAL, autoIncreaseEnergy, this
    );
}


// -- Mini-Game Functions --//
function playWoodGame() {
    if (energy.hasEnoughFor(GAME_COST)) {
        energy.decrease(GAME_COST);
        updateResourceMeter(energy);
        mainGameRemoveFocus();
        startWoodGame();
    } else {
        alert("Not enough energy!");
    }
}


function playMetalGame() {
    if (energy.hasEnoughFor(GAME_COST)) {
        energy.decrease(GAME_COST);
        updateResourceMeter(energy);
        //mainGameRemoveFocus();
        //startMetalGame();
        alert("Play metal game!");
    } else {
        alert("Not enough energy!");
    }
}


function playStoneGame() {
    if (energy.hasEnoughFor(GAME_COST)) {
        energy.decrease(GAME_COST);
        updateResourceMeter(energy);
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


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Resource Functions ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function autoIncreaseEnergy()
{
    if (energy.amount + ENERGY_INCREMENT <= energy.max)
    {
        energy.increase(ENERGY_INCREMENT);
    }
    else
    {
        energy.amount = energy.max
    }
    updateResourceMeter(energy);
}


function updateResourceMeter(resource)
{
    switch (resource.name)
    {
        case 'Energy':
            energyMeter.setText(resource.name + ": " + resource.amount);
            break;
        case 'Wood':
            woodMeter.setText(resource.name + ": " + resource.amount);
            break;
        case 'Metal':
            metalMeter.setText(resource.name + ": " + resource.amount);
            break;
        case 'Stone':
            stoneMeter.setText(resource.name + ": " + resource.amount);
            break;
        case 'Gold':
            goldMeter.setText(resource.name + ": " + resource.amount);
            break;
    }
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
    
    // -- Mini-Game Declarations -- //
    const ROW_COUNT = 4,
          COLUMN_COUNT = 5,
          MATCH = 2;
    
    var selected;
    
    const DISPLAY_DURATION = 1000;
    
    
    // -- Build Game Board -- //
    var frame = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width * 0.9, game.height * 0.9,
        'wood_tiles', 'wood_tile_03.png'
    );
    frame.anchor.set(0.5);
    frame.tileScale.set(0.25);
    
    woodGame.add(frame);
    
    var table = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width * 0.87, game.height * 0.87,
        'wood_tiles', 'wood_tile_02.png'
    );
    table.anchor.set(0.5);
    table.tileScale.set(0.5);
    
    woodGame.add(table);
    
    
    // -- Randomize Cards -- //
    var cardList = new Array(),
        cardMatches = new Array(),
        cardTotal = COLUMN_COUNT * ROW_COUNT;
    
    for (var cardSet = 0; cardSet < MATCH; cardSet++) {
        for (var cardMatch = 0; cardMatch < cardTotal / MATCH; cardMatch++) {
            cardList.push(cardMatch);
        }
    }
    
    for (var i = 1; i <= cardTotal; i++) {
        var randomIndex = game.rnd.integerInRange(0, cardList.length - 1);
        var currentCard = cardList[randomIndex];
        cardMatches.push(currentCard);
        var cardIndex = cardList.indexOf(currentCard);
        cardList.splice(cardIndex, 1);
    }
    
    var cards = game.add.group();
    var cardIndex = 0;
    
    for (var column = 1; column <= COLUMN_COUNT; column++)
    {
        for (var row = 1; row <= ROW_COUNT; row++)
        {
            var gridWidth = table.width - ROW_COUNT * 2,
                gridHeight = table.height - COLUMN_COUNT * 2;
            var gridPercentageX = 1 / ROW_COUNT * row,
                gridPercentageY = 1 / COLUMN_COUNT * column;
            
            var card = game.make.group();
            
            // used for the actual index this will be added to
            // the cards group, for later access by flipCard()
            var index = game.make.text(0, 0, cardIndex);
            index.visible = false;
            
            var face = game.make.sprite(
                Math.floor(gridWidth * gridPercentageY) - Math.pow(ROW_COUNT, 2) + ROW_COUNT,
                Math.floor(gridHeight * gridPercentageX) - Math.pow(COLUMN_COUNT, 2) + ROW_COUNT,
                'wood_tiles', 'wood_tile_01.png'
            );
            face.width = 0;
            face.height = (gridHeight / ROW_COUNT) - ROW_COUNT;
            face.anchor.set(0.5);
    
            var back = game.make.sprite(
                Math.floor(gridWidth * gridPercentageY) - Math.pow(ROW_COUNT, 2) + ROW_COUNT,
                Math.floor(gridHeight * gridPercentageX) - Math.pow(COLUMN_COUNT, 2) + ROW_COUNT,
                'wood_tiles', 'wood_tile_03.png'
            );
            back.width = (gridWidth / COLUMN_COUNT) - COLUMN_COUNT;
            back.height = (gridHeight / ROW_COUNT) - ROW_COUNT;
            back.anchor.set(0.5);
            back.inputEnabled = true;
            back.events.onInputDown.add(flipCard, card);
    
            // using to verify the card matches
            var name = game.make.text(
                Math.floor(gridWidth * gridPercentageY) - Math.pow(ROW_COUNT, 2) + ROW_COUNT,
                Math.floor(gridHeight * gridPercentageX) - Math.pow(COLUMN_COUNT, 2) + ROW_COUNT,
                "card" + cardMatches[cardIndex++]
            );
            name.anchor.set(0.5);
            
            card.add(index);
            card.add(face);
            card.add(back);
            card.add(name);
            cards.add(card);
        }
    }
    woodGame.add(cards);
    
    
    function flipCard() {
        var index = this.children[0].text,
            face = this.children[1],
            back = this.children[2],
            name = this.children[3].text;
        
        const CARD_WIDTH = back.width;
        
        animateFlip(back, face, 100, 0);
        
        if (selected == null) {
            selected = this;
        } else {
            s_index = selected.children[0].text;
            s_face = selected.children[1];
            s_back = selected.children[2];
            s_name = selected.children[3].text;
            
            if (name == s_name) {
                // remove both cards
                game.time.events.add(DISPLAY_DURATION * 0.6, function() {
                    animateMatch(face, DISPLAY_DURATION * 0.4);
                    animateMatch(s_face, DISPLAY_DURATION * 0.4);
                    
                    game.time.events.add(DISPLAY_DURATION, function() {
                        face.kill();
                        s_face.kill();
                    })
                }, this);
            } else {
                // flip cards back
                animateFlip(face, back, 100, DISPLAY_DURATION);
                animateFlip(s_face, s_back, 100, DISPLAY_DURATION);
            }
            selected = null;
        }
        
        function animateFlip(fromSide, toSide, duration, delay) {
            game.make.tween(fromSide).to({width: 0}, duration, Phaser.Easing.Linear.None, true, delay, 0, false);
            // had to do a time.events delay here because was causing funky flip time otherwise
            game.time.events.add(delay, function() {
                game.make.tween(toSide).to({width: CARD_WIDTH}, duration, Phaser.Easing.Linear.None, true, duration, 0, false);
            });
        }
        
        function animateMatch(card, duration) {
            game.make.tween(card).to({width: 0, height: 0}, duration, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
    }
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
    
    const MATCH_PAIRS = 2;
    const NUMBER_COLUMNS = 4;
    const NUMBER_ROWS = 7;
        
        
    var selectedGroup;
    
    var tableRow = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width * .84, game.height * .64,
        'stone_textures', 'obj_stoneblock001.png'
    );
    
    tableRow.anchor.set(0.5);
    
    stoneGame.add(tableRow);
    
    var cards = new Array();
    var cardsMatch = new Array();
    var cardsTotal = NUMBER_COLUMNS * NUMBER_ROWS;
    
    for (var cardsSet = 0; cards < MATCH_PAIRS; cardsSet++) {
        
        for (var match = 0; match < cardsTotal / MATCH_PAIRS; match++) {
            
            cards.push(match);
        }
        
    }
    
    // call exitStoneGame() when the game is over
}

function exitStoneGame() {
    game.world.remove(stoneGame);
    mainGameSetFocus();
}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
