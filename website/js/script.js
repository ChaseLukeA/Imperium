  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
 *       I       M       P       E       R       I       U       M       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\
\\                                                                      //
//           .-'-. .-'-. .-'-. .-'-. .-'-. .-'-. .-'-. .-'-.            \\
\\           | I | | M | | P | | E | | R | | I | | U | | M |            //
//           '-.-' '-.-' '-.-' '-.-' '-.-' '-.-' '-.-' '-.-'            \\
\\                                                                      //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *       I       M       P       E       R       I       U       M       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                       *
 *     A Phaser game coded by Luke A Chase,                              *
 *                                        Will Weathers,                 *
 *                                                     Charles Marion    *
 *                   © 2016                                              *
 *                                                                       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *       I       M       P       E       R       I       U       M       *
  \* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

                    var game = new Phaser.Game(
                        800,
                        600,
                        Phaser.AUTO,
                        '',
                        {
                            preload: preload,
                            create: create,
                            update: update
                        }
                    );           //          ;(

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Global Declarations                                                  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const ENERGY_MAX = 10;       // most energy you can have
const ENERGY_INTERVAL = 30;  // how often energy autoIncreases
const ENERGY_INCREMENT = 1;  // the amount energy autoIncreases

/* --------------------------------------------------------------
 * Resource is used to build new resources which have their own
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
    this.name = (_name == null ? '' : _name);
    this.amount = (_amount == null ? 0 : _amount);
    this.max = (_max == null ? 0 : _max);
    this.delta = Delta.NoChange;
    
    this.increase = function(value) {
        this.amount += value;
        this.delta = Delta.Increased;
    };

    this.decrease = function(value) {
        if (this.amount - value >= 0) {
            this.amount -= value;
            this.delta = Delta.Decreased;
        } else {
            alert("Error! " + this.name + " cannot go below zero!");
            this.delta = Delta.NoChange;
        }
    };

    this.hasEnoughFor = function(value) {
        return this.amount - value >= 0;
    };
}

/* --------------------------------------------------------------
 * Calamity is used to build new troubles which have their own
 * properties and methods, e.g. enemies, disasters, plagues
 * --------------------------------------------------------------
 * Examples:
 *   var gang = new Calamity('Gang', 3, true);
 *   if (gang.active) {
 *   	energy.decrease(gang.trouble);
 *   }
 *   
 *   
 *   var air = new Calamity('Air', 1, true);
 *   var water = new Calamity('Water', 1, true);
 *   
 *   if (air.active && water.active) {
 *   	// air & water makes metal rust, both both
 *   	// alone are harmless!
 *   	metal.decrease(air.trouble + water.trouble);
 *   }
 */
var Calamity = function (_name, _trouble, _interval, _active, _settings) {
	this.name = (_name == null ? '' : _name);

	// the amount of illness/damage/decrease Calamity causes
	this.trouble = (_trouble == null ? 0 : _trouble);
    
    // the amount of time that passes between troubles
    this.interval = (_interval == null ? 1 : _interval);

	// whether or not this Calamity is alive and active, or dormant
	this.active = (_active == null ? false : _active);

	// optional 'other settings' object literal you can pass in
	// as other properties this Calamity can have, e.g.
	// { weakness: sunlight, lifeExpecancy: 20, ... }
	this.settings = (_settings == null ? {} : _settings);
}

const Delta = {
		Decreased: -1,
		NoChange: 0,
		Increased: 1
	};

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

var blurX,  // javascript addon filter
	blurY;  // javascript addon filter



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Global Game Functions                                                *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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

// generate a random direction for use in the x, y coordinate system;
// returns either 1 or -1, to be used in calculation of heading in a
// positive axis direction or a negative axis direction;
// usage examples: object.position.x = 3 * randomDirection()  >>
// sets object.position.x to 3 or -3 with a 50% chance of either
function randomDirection() {
    return randomNumber(0, 1) == 0 ? -1 : 1;
}

// generate a random frequency to be used in the update() function;
// frequency takes in a whole number percentage (example: 35) and then
// returns true that percentage of the time;
// examples: frequency(50)  >>  returns true 50% of the time
//           frequency(4)  >>  returns true 4% of the time
function frequency(percentage) {
    if (randomNumber(1, (100 / percentage)) == 1) {
        return true;
    } else {
        return false;
    }
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




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Phaser.State Functions                                               *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
    game.load.atlas('wood_game_cards', 'assets/sprites/wood_game_cards.png', 'assets/sprites/wood_game_cards.json');
    game.load.atlas('beetle', 'assets/sprites/beetle.png', 'assets/sprites/beetle.json');
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
    wood = new Resource('Wood', 50);
    metal = new Resource('Metal', 50);
    stone = new Resource('Stone', 50);
    gold = new Resource('Gold', 100);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
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
            if (termites.active == true) {
            	if (nematodes.active == true) {
                    displayNotification("Ye have nematodes living in ye wood so thy termites cannot thrive.", 7000);
                    termites.active = false;
            	} else {
                    displayNotification("Ye wood stores be infested with termites! Seek thy nematodes to ruin them.");
                    if (game.time.now >= termitesTimer) {
                        termitesTimer = game.time.now + termites.interval;
                        wood.decrease(termites.trouble);
                        updateResourceMeter(wood);
                    }
            	}
            }
            if (fire.active == true) {
            	if (water.active == true) {
            		displayNotification("Ye wood be wet so fire cannot be living here.", 7000);
                    fire.active = false;
            	} else {
            		displayNotification("Thy wood be ablaze! Seek thee water to purge this calamity!");
                    if (game.time.now >= fireTimer) {
                        fireTimer = game.time.now + fire.interval;
                        wood.decrease(fire.trouble);
                        updateResourceMeter(wood);
                    }
            	}
            }
            
            beetles.forEach(function(beetle) {
                if (beetle.visible == true) {
                    if (frequency(2)) {
                        beetle.angle += randomNumber(1, 2) * randomDirection();
                    }
                }
            });
            
            
            
            
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




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Main Game Functions                                      [mainGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
    	game.world.width * 0.01,
        game.world.height,
        "",
        {fontSize: '24px', fill: '#fff', align: 'center'}
    );
    energyMeter.type = Phaser.TEXT;
    energyMeter.anchor.set(0, 0.9);
    energyMeter.setShadow(2, 2, '#000', 2);
    mainGame.add(energyMeter);
    updateResourceMeter(energy);
    
    // -- create wood bar -- //
    woodMeter = game.make.text(
    	game.world.width * 0.35,
        game.world.height,
        "",
        {fontSize: '16px', fill: '#fff', align: 'center'}
    );
    woodMeter.type = Phaser.TEXT;
    woodMeter.anchor.set(1, 0.7);
    woodMeter.setShadow(2, 2, '#000', 2);
    mainGame.add(woodMeter);
    updateResourceMeter(wood);
    
    // -- create metal bar -- //
    metalMeter = game.make.text(
    	game.world.width * 0.5,
        game.world.height,
        "",
        {fontSize: '16px', fill: '#fff', align: 'center'}
    );
    metalMeter.type = Phaser.TEXT;
    metalMeter.anchor.set(0.5, 0.7);
    metalMeter.setShadow(2, 2, '#000', 2);
    mainGame.add(metalMeter);
    updateResourceMeter(metal);
    
    // -- create stone bar -- //
    stoneMeter = game.make.text(
    	game.world.width * 0.70,
        game.world.height,
        "",
        {fontSize: '16px', fill: '#fff', align: 'center'}
    );
    stoneMeter.type = Phaser.TEXT;
    stoneMeter.anchor.set(0.5, 0.7);
    stoneMeter.setShadow(2, 2, '#000', 2);
    mainGame.add(stoneMeter);
    updateResourceMeter(stone);
    
    // -- create gold bar -- //
    goldMeter = game.make.text(
    	game.world.width * 0.99,
        game.world.height,
        "",
        {fontSize: '24px', fill: '#fff', align: 'center'}
    );
    goldMeter.type = Phaser.TEXT;
    goldMeter.anchor.set(1, 0.9);
    goldMeter.setShadow(2, 2, '#000', 2);
    mainGame.add(goldMeter);
    updateResourceMeter(gold);
    
    // -- start energy auto-regeneration -- //
    game.time.events.loop(
        Phaser.Timer.SECOND * ENERGY_INTERVAL, autoIncreaseEnergy, this
    );
}




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Resource Mini-Game Start/End Functions                   [mainGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
    	if (obj.type != Phaser.TEXT) {
    		obj.filters = [blurX, blurY];
    	}
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




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Resource/Meter Functions                                 [mainGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function autoIncreaseEnergy() {
    if (energy.amount + ENERGY_INCREMENT <= energy.max) {
        energy.increase(ENERGY_INCREMENT);
    } else {
        energy.amount = energy.max
    }
    updateResourceMeter(energy);
}


function updateResourceMeter(resource) {
    switch (resource.name) {
        case 'Energy':
            energyMeter.setText(resource.name + ": " + resource.amount);
            animateMeterUpdate(energyMeter, resource.delta);
            break;
        case 'Wood':
            woodMeter.setText(resource.name + ": " + resource.amount);
            animateMeterUpdate(woodMeter, resource.delta);
            break;
        case 'Metal':
            metalMeter.setText(resource.name + ": " + resource.amount);
            animateMeterUpdate(metalMeter, resource.delta);
            break;
        case 'Stone':
            stoneMeter.setText(resource.name + ": " + resource.amount);
            animateMeterUpdate(stoneMeter, resource.delta);
            break;
        case 'Gold':
            goldMeter.setText(resource.name + ": " + resource.amount);
            animateMeterUpdate(goldMeter, resource.delta);
            break;
    }
}


function animateMeterUpdate(resourceMeter, delta) {
    var currentScale = resourceMeter.scale;
    
	if (delta == Delta.Decreased) {
		// make resource color temporarily red and shrink size
        resourceMeter.scale.x = currentScale.x - 0.025;
        resourceMeter.scale.y = currentScale.y - 0.025;
        resourceMeter.fill = "#fcc";
        waitFor(250, function() {
            resourceMeter.scale.x = currentScale.x + 0.025;
            resourceMeter.scale.y = currentScale.y + 0.025;
            resourceMeter.fill = "#fff";
        });
	}
	if (delta == Delta.Increased) {
		// make resource color temporarily green and grow size
        resourceMeter.scale.x = currentScale.x + 0.025;
        resourceMeter.scale.y = currentScale.y + 0.025;
        resourceMeter.fill = "#cfc";
        waitFor(250, function() {
            resourceMeter.scale.x = currentScale.x - 0.025;
            resourceMeter.scale.y = currentScale.y - 0.025;
            resourceMeter.fill = "#fff";
        });
	}
}




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Here are created groups for mini-games so on exit the entire group can
be removed with a 'game.world.remove(gameName)' call

All mini-game code needs to go in the appropriate 'start<mini>Game()'
method and will run separate from the mainGame

Make sure you create objects with '<varName> = game.make.<objectType>()'
and then add it to your mini-game with '<mini>Game.add(<varName>)'

 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




//                       Created by Luke A Chase                       \\
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Wood Game Declarations and Functions                     [woodGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var fire,
    water,
    termites,
    nematodes;

var fireTimer = 0,
    termitesTimer = 0;

var beetles;

var notification;


function startWoodGame() {
    
    activeGame = Game.WOOD;
    woodGame = game.make.group();
    
    // -- Mini-Game Declarations -- //
    const ROW_COUNT = 4,
          COLUMN_COUNT = 5,
          MATCH_COUNT = 2,  // # of like cards needed to consider match
          TOTAL_NUM_CARDS = ROW_COUNT * COLUMN_COUNT,
          TOTAL_NUM_MATCHES = TOTAL_NUM_CARDS / MATCH_COUNT;
    
    var numberOfCardsShowing = 0,
        numberOfMatchesLeft = TOTAL_NUM_MATCHES;
    
    var selected;
    
    const DISPLAY_DURATION = 1000;  // time to show cards before flip
    
    function getType(index) {
      switch (index) {
          case 0:
              return 'cord_01';
          case 1:
              return 'cord_02';
          case 2:
              return 'cord_03';
          case 3:
              return 'cord_04';
          case 4:
              return 'cord_05';
          case 5:
              return 'cord_06';
          case 6:
              return 'termites';
          case 7:
              return 'nematodes';
          case 8:
              return 'fire';
          case 9:
              return 'water';
      }
    };
    
    fire = new Calamity('Fire', 1, 1000, false);
    water = new Calamity('Water', 0, 0, false);
    termites = new Calamity('Termites', 1, 2000, false);
    nematodes = new Calamity('Nematodes', 0, 0, false);
    
    
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
    
    
    // -- Create Random Cards List -- //
    var cardStartList = new Array(),
        cardMatchList = new Array();
    
    for (var cardSet = 1; cardSet <= MATCH_COUNT; cardSet++) {
        for (var cardMatch = 0; cardMatch < TOTAL_NUM_MATCHES; cardMatch++) {
            cardStartList.push(cardMatch);
        }
    }
    
    for (var i = 1; i <= TOTAL_NUM_CARDS; i++) {
        var randomIndex = game.rnd.integerInRange(0, cardStartList.length - 1);
        var newCard = cardStartList[randomIndex];
        cardMatchList.push(newCard);
        var usedCardIndex = cardStartList.indexOf(newCard);
        cardStartList.splice(usedCardIndex, 1);
    }
    

    // -- Build Beetles and Cards From Random Cards List -- //
    beetles = game.make.group();
    var cards = game.make.group();
    var cardIndex = 0;
    
    for (var column = 1; column <= COLUMN_COUNT; column++)
    {
        for (var row = 1; row <= ROW_COUNT; row++)
        {
            var gridWidth = table.width - ROW_COUNT * 2,
                gridHeight = table.height - COLUMN_COUNT * 2;
            var gridPercentageX = 1 / ROW_COUNT * row,
                gridPercentageY = 1 / COLUMN_COUNT * column;
            var cardWidth = Math.floor(gridWidth * gridPercentageY) - Math.pow(ROW_COUNT, 2) + ROW_COUNT,
                cardHeight = Math.floor(gridHeight * gridPercentageX) - Math.pow(COLUMN_COUNT, 2) + ROW_COUNT;
            
            // make golden beetle
            var beetle = game.make.sprite(
                Math.floor(gridWidth * gridPercentageY) - Math.pow(ROW_COUNT, 2) + ROW_COUNT,
                Math.floor(gridHeight * gridPercentageX) - Math.pow(COLUMN_COUNT, 2) + ROW_COUNT,
                'beetle', 'beetle_01.png' 
            );
            beetle.width = gridWidth / COLUMN_COUNT / 3;
            beetle.height = gridHeight / ROW_COUNT / 3;
            beetle.anchor.set(0.5);
            beetle.name = cardIndex;  // what index in beetles this will be
            beetle.animations.add('crawl', [0, 1], 3, true);
            beetle.visible = false;
            
            beetles.add(beetle);
            
            
            // make card
            var card = game.make.group();
            
            // used for the actual index this will be added to
            // the cards group, for later access by flipCard()
            var index = game.make.text(0, 0, cardIndex);
            index.visible = false;
            
            var face = game.make.sprite(
                beetle.position.x, beetle.position.y,
                'wood_game_cards', getType(cardMatchList[cardIndex]) + ".png"
            );
            face.width = 0;
            face.height = (gridHeight / ROW_COUNT) - ROW_COUNT;
            face.anchor.set(0.5);
    
            var back = game.make.sprite(
                beetle.position.x, beetle.position.y,
                'wood_tiles', 'wood_tile_03.png'
            );
            back.width = (gridWidth / COLUMN_COUNT) - COLUMN_COUNT;
            back.height = (gridHeight / ROW_COUNT) - ROW_COUNT;
            back.anchor.set(0.5);
            back.inputEnabled = true;
            back.events.onInputDown.add(checkCard, card);
    
            // using to verify the card matches
            var name = game.make.text(
                beetle.position.x, beetle.position.y,
                getType(cardMatchList[cardIndex++])
            );
            name.anchor.set(0.5);
            name.visible = false;
            
            card.add(index);
            card.add(face);
            card.add(back);
            card.add(name);
            cards.add(card);
        }
    }
    woodGame.add(beetles);
    woodGame.add(cards);
    
    // set normal card width to that of the first card's back
    const CARD_WIDTH = cards.children[0].children[2].width;
    
    
    function checkCard() {
        if (numberOfCardsShowing < 2)
        {
            var index = this.children[0].text,
                face = this.children[1],
                back = this.children[2],
                name = this.children[3].text;

            animateFlip(back, face, 100, 0);

            if (selected == null) {
                numberOfCardsShowing++;

                selected = this;
            } else {
                numberOfCardsShowing++;

                var selected_index = selected.children[0].text,
                    selected_face = selected.children[1],
                    selected_back = selected.children[2],
                    selected_name = selected.children[3].text;

                if (name == selected_name) {
                	if (name == 'termites') {
                		termites.active = true;
                	} else if (name == 'nematodes') {
                		nematodes.active = true;
                	} else if (name == 'fire') {
                		fire.active = true;
                	} else if (name == 'water') {
                		water.active = true;
                	} else {
                        wood.increase(randomNumber(5, 20));
                        updateResourceMeter(wood);
                    }
                	
                    // remove matching cards
                    game.time.events.add(DISPLAY_DURATION * 0.6, function() {
                        animateMatch(face, DISPLAY_DURATION * 0.4);
                        animateMatch(selected_face, DISPLAY_DURATION * 0.4);
                        wakeBeetle(index);
                        wakeBeetle(selected_index);

                        game.time.events.add(DISPLAY_DURATION, function() {
                            face.kill();
                            selected_face.kill();
                            
                            numberOfCardsShowing = 0;
                            numberOfMatchesLeft--;
                            
                            if (numberOfMatchesLeft == 0) {
                                notification.position.y = game.world.centerY;
                                notification.fontSize = '96px';
                                displayNotification("Good game!", 4000);
                                game.make.tween(woodGame).to({alpha: 0.334}, 2000, Phaser.Easing.Default, true, 2000, 0, false);
                                waitFor(4000, function() {
                                    exitWoodGame();
                                });
                            }
                        })
                    }, this);
                } else {
                    // flip all cards back
                    animateFlip(face, back, 100, DISPLAY_DURATION);
                    animateFlip(selected_face, selected_back, 100, DISPLAY_DURATION);
                    waitFor(DISPLAY_DURATION, function() {
                        numberOfCardsShowing = 0;
                    });
                }
                selected = null;
            }
        }
        
        function animateFlip(fromSide, toSide, duration, delay) {
            game.make.tween(fromSide).to({width: 0}, duration, Phaser.Easing.Default, true, delay, 0, false);
            game.make.tween(toSide).to({width: CARD_WIDTH}, duration, Phaser.Easing.Default, true, delay + duration, 0, false);
        }
        
        function animateMatch(card, duration) {
            game.make.tween(card).to({width: 0, height: 0}, duration, Phaser.Easing.Default, true, 0, 0, false);
        }
    }
    
    notification = game.make.text(
    	game.world.centerX,
        game.world.height * 0.01,
        "",
        {fontSize: '18px', fill: '#ff7510', align: 'center'}
    );
    notification.anchor.set(0.5, 0);
    notification.setShadow(2, 2, '#000', 2);
    notification.visible = false;
    woodGame.add(notification);
}


function waitFor(duration, callback) {
    game.time.events.add(duration, callback);
}


function displayNotification(message, duration) {
    notification.text = message;
    notification.visible = true;
    
    if (duration != null) {
        waitFor(duration, function() {
            notification.text = "";
            notification.visible = false;
        });
    }
}


function wakeBeetle(index) {
    var beetle = beetles.children[index];
    beetle.position.x += randomNumber(1, beetle.width) * randomDirection();
    beetle.visible = true;
    
    game.physics.arcade.enable(beetle);
    
    beetle.animations.play('crawl');
    
    if (beetle.position.x < game.world.centerX) {
        beetle.body.gravity.x = randomNumber(1, 3);
    } else {
        beetle.body.gravity.x = randomNumber(1, 3) * -1;
    }
    
    if (beetle.position.y < game.world.centerY) {
        beetle.body.gravity.y = randomNumber(1, 3);
    } else {
        beetle.body.gravity.y = randomNumber(1, 3) * -1;
    }
    
    beetle.angle = (Math.atan2(0 - beetle.body.gravity.y, 0 - beetle.body.gravity.x) * 180 / Math.PI) - 90;
    
    beetle.inputEnabled = true;
    beetle.events.onInputDown.add(squishEmBeetle, beetle);
    
    beetle.checkWorldBounds = true;
    beetle.events.onOutOfBounds.add(beetleGotAway, beetle);
}


function squishEmBeetle(beetle) {
    gold.increase(1);
    updateResourceMeter(gold);
    beetle.kill();
}


function beetleGotAway(beetle) {
    beetle.kill();
}

        
function exitWoodGame() {
    game.world.remove(woodGame);
    mainGameSetFocus();
}




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Metal Game Declarations and Functions                   [metalGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


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




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*       I       M       P       E       R       I       U       M       *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
*  Stone Game Declarations and Functions                   [stoneGame]  *
*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


function startStoneGame() {
    activeGame = Game.STONE;
    stoneGame = game.add.group();
    
    // YOUR MINI-GAME CODE!!!
    // ITS OK TO KEEP THE GAME BACKGROUND FROM
    // THE WOODGAME EXAMPLE, ALL OTHER CODE AFTER
    // THIS MUST BE YOUR ORIGINAL CODE
    
    var tableRow = game.make.tileSprite(
        game.world.centerX, game.world.centerY,
        game.width * .84, game.height * .64,
        'stone_textures', 'obj_stoneblock001.png'
    );
    
    tableRow.anchor.set(0.5);
    
    stoneGame.add(tableRow);
    
    // call exitStoneGame() when the game is over
}

function exitStoneGame() {
    game.world.remove(stoneGame);
    mainGameSetFocus();
}
