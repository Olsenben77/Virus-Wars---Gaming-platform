/* eslint-disable no-use-before-define */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable no-extra-parens */
/* eslint-disable prefer-template */
/* eslint-disable no-magic-numbers */
"use strict";

let game;
let score = 0;

// global game options
let gameOptions = {
  // platform speed range, in pixels per second
  platformSpeedRange: [250, 250],

  // building speed, in pixels per second
  buildingSpeed: 80,

  // spawn range, how far should be the rightmost platform from the right edge
  // before next platform spawns, in pixels
  spawnRange: [80, 300],

  // platform width range, in pixels
  platformSizeRange: [90, 300],

  // a height range between rightmost platform and next platform to be spawned
  platformHeightRange: [-5, 5],

  // a scale to be multiplied by platformHeightRange
  platformHeighScale: 20,

  // platform max and min height, as screen height ratio
  platformVerticalLimit: [0.4, 0.8],

  // player gravity
  playerGravity: 900,

  // player jump force
  jumpForce: 400,

  // player starting X position
  playerStartPosition: 200,

  // consecutive jumps allowed
  jumps: 2,

  // % of probability a pill appears on the platform
  pillPercent: 65,

  // % of probability a bacteria appears on the platform
  bacteriaPercent: 35
};

window.onload = function() {
  // object containing configuration options
  let gameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 750,
    scene: [preloadGame, playGame],
    backgroundColor: 0x0c88c7,

    // physics settings
    physics: {
      default: `arcade`
    }
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener(`resize`, resize, false);
};

// preloadGame scene
class preloadGame extends Phaser.Scene {
  constructor() {
    super(`PreloadGame`);
  }
  preload() {
    this.load.image(`platform`, `/assets/img/platform.png`);

    // player is a sprite sheet made by 24x48 pixels
    this.load.spritesheet(`player`, `/assets/img/player.png`, {
      frameWidth: 24,
      frameHeight: 48
    });

    // the pill is a sprite sheet made by 20x20 pixels
    this.load.spritesheet(`pill`, `/assets/img/coin.png`, {
      frameWidth: 20,
      frameHeight: 20
    });

    // the bacteriacamp is a sprite sheet made by 32x58 pixels
    this.load.spritesheet(`bacteria`, `/assets/img/bacteria.png`, {
      frameWidth: 40,
      frameHeight: 70
    });

    // buildings are a sprite sheet made by 512x512 pixels
    this.load.spritesheet(`building`, `/assets/img/buildings.png`, {
      frameWidth: 510,
      frameHeight: 510
    });
  }
  create() {
    // setting player animation
    this.anims.create({
      key: `run`,
      frames: this.anims.generateFrameNumbers(`player`, {
        start: 0,
        end: 1
      }),
      frameRate: 8,
      repeat: -1
    });

    // setting pill animation
    this.anims.create({
      key: `rotate`,
      frames: this.anims.generateFrameNumbers(`pill`, {
        start: 0,
        end: 5
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1
    });

    // setting bacteria animation
    this.anims.create({
      key: `burn`,
      frames: this.anims.generateFrameNumbers(`bacteria`, {
        start: 0,
        end: 4
      }),
      frameRate: 15,
      repeat: -1
    });

    this.scene.start(`PlayGame`);
  }
}
class playGame extends Phaser.Scene {
  constructor() {
    super(`PlayGame`);
    // this.gameover = false;
  }
  create() {

    // group with all active buildings.
    this.buildingGroup = this.add.group();

    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function(platform) {
        platform.scene.platformPool.add(platform);
      }
    });

    // platform pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function(platform) {
        platform.scene.platformGroup.add(platform);
      }
    });

    // group with all active pills.
    this.pillGroup = this.add.group({
      // once a pill is removed, it's added to the pool
      removeCallback: function(pill) {
        pill.scene.pillPool.add(pill);
      }
    });

    // pill pool
    this.pillPool = this.add.group({
      // once a pill is removed from the pool, it's added to the active pills group
      removeCallback: function(pill) {
        pill.scene.pillGroup.add(pill);
      }
    });

    // group with all active bacteriacamps.
    this.bacteriaGroup = this.add.group({
      // once a bacteriacamp is removed, it's added to the pool
      removeCallback: function(bacteria) {
        bacteria.scene.bacteriaPool.add(bacteria);
      }
    });

    // bacteria pool
    this.bacteriaPool = this.add.group({
      // once a bacteria is removed from the pool, it's added to the active bacteria group
      removeCallback: function(bacteria) {
        bacteria.scene.bacteriaGroup.add(bacteria);
      }
    });

    // adding a building
    this.addBuildings();

    // keeping track of added platforms
    this.addedPlatforms = 0;

    // number of consecutive jumps made by the player so far
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width, x position and y position
    this.addPlatform(
      game.config.width,
      game.config.width / 2,
      game.config.height * gameOptions.platformVerticalLimit[1]
    );

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      game.config.height * 0.7,
      `player`
    );
    this.player.setGravityY(gameOptions.playerGravity);
    this.player.setDepth(2);

    // the player is not dying
    this.dying = false;

    // setting collisions between the player and the platform group
    this.platformCollider = this.physics.add.collider(
      this.player,
      this.platformGroup,
      function() {
        // play "run" animation if the player is on a platform
        if (!this.player.anims.isPlaying) {
          this.player.anims.play(`run`);
        }
      },
      null,
      this
    );

    // setting collisions between the player and the pill group
    this.physics.add.overlap(
      this.player,
      this.pillGroup,
      function(player, pill) {
        this.tweens.add({
          targets: pill,
          y: pill.y - 100,
          alpha: 0,
          duration: 800,
          ease: `Cubic.easeOut`,
          callbackScope: this,
          onComplete: function() {
            this.pillGroup.killAndHide(pill);
            this.pillGroup.remove(pill);
            collectPill();
          }
        });
      },
      null,
      this
    );

    // setting collisions between the player and the bacteria group
    this.physics.add.overlap(
      this.player,
      this.bacteriaGroup,
      function(player, bacteria) {
        this.dying = true;
        this.player.anims.stop();
        this.player.setFrame(2);
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);
      },
      null,
      this
    );

    this.physics.add.collider(this.player, this.bacteria, Gameover, null, this);
    this.physics.add.collider(this.player, this.pill, collectPill, null, this);

    // checking for input
    this.input.on(`pointerdown`, this.jump, this);
  }

  // adding buildings
  addBuildings() {
    let rightmostBuilding = this.getRightmostBuilding();
    if (rightmostBuilding < game.config.width * 2) {
      let building = this.physics.add.sprite(
        rightmostBuilding + Phaser.Math.Between(100, 350),
        game.config.height + Phaser.Math.Between(0, 100),
        `building`
      );
      building.setOrigin(0.5, 1);
      building.body.setVelocityX(gameOptions.buildingSpeed * -1);
      this.buildingGroup.add(building);
      if (Phaser.Math.Between(0, 1)) {
        building.setDepth(1);
      }
      building.setFrame(Phaser.Math.Between(0, 3));
      this.addBuildings();
    }
  }

  // getting rightmost building x position
  getRightmostBuilding() {
    let rightmostBuilding = -200;
    this.buildingGroup.getChildren().forEach(function(building) {
      rightmostBuilding = Math.max(rightmostBuilding, building.x);
    });
    return rightmostBuilding;
  }

  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms++;
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      let newRatio = platformWidth / platform.displayWidth;
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, `platform`);
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(
        Phaser.Math.Between(
          gameOptions.platformSpeedRange[0],
          gameOptions.platformSpeedRange[1]
        ) * -1
      );
      platform.setDepth(2);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );

    // if this is not the starting platform...
    if (this.addedPlatforms > 1) {
      // is there a pill over the platform?
      if (Phaser.Math.Between(1, 100) <= gameOptions.pillPercent) {
        if (this.pillPool.getLength()) {
          let pill = this.pillPool.getFirst();
          pill.x = posX;
          pill.y = posY - 96;
          pill.alpha = 1;
          pill.active = true;
          pill.visible = true;
          this.pillPool.remove(pill);
        } else {
          let pill = this.physics.add.sprite(posX, posY - 96, `pill`);
          pill.setImmovable(true);
          pill.setVelocityX(platform.body.velocity.x);
          pill.anims.play(`rotate`);
          pill.setDepth(2);
          this.pillGroup.add(pill);
        }
      }

      // is there a bacteria over the platform?
      if (Phaser.Math.Between(1, 100) <= gameOptions.bacteriaPercent) {
        if (this.bacteriaPool.getLength()) {
          let bacteria = this.bacteriaPool.getFirst();
          bacteria.x =
            posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          bacteria.y = posY - 46;
          bacteria.alpha = 1;
          bacteria.active = true;
          bacteria.visible = true;
          this.bacteriaPool.remove(bacteria);
        } else {
          let bacteria = this.physics.add.sprite(
            posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth),
            posY - 46,
            `bacteria`
          );
          bacteria.setImmovable(true);
          bacteria.setVelocityX(platform.body.velocity.x);
          bacteria.setSize(8, 2, true);
          bacteria.anims.play(`burn`);
          bacteria.setDepth(2);
          this.bacteriaGroup.add(bacteria);
        }
      }
    }
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  // and obviously if the player is not dying
  jump() {
    if (
      !this.dying &&
      (this.player.body.touching.down ||
        (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;

      // stops animation
      this.player.anims.stop();
    }
  }

  update() {
    // game over
    if (this.player.y > game.config.height) {
      Gameover();
    }
    // else if(this.gameover){
    //   return;
    // }

    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = game.config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function(platform) {
      let platformDistance =
        game.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // recycling pills
    this.pillGroup.getChildren().forEach(function(pill) {
      if (pill.x < -pill.displayWidth / 2) {
        this.pillGroup.killAndHide(pill);
        this.pillGroup.remove(pill);
      }
    }, this);

    // recycling bacteria
    this.bacteriaGroup.getChildren().forEach(function(bacteria) {
      if (bacteria.x < -bacteria.displayWidth / 2) {
        this.bacteriaGroup.killAndHide(bacteria);
        this.bacteriaGroup.remove(bacteria);
      }
    }, this);

    // recycling buildings
    this.buildingGroup.getChildren().forEach(function(building) {
      if (building.x < -building.displayWidth) {
        let rightmostBuilding = this.getRightmostBuilding();
        building.x = rightmostBuilding + Phaser.Math.Between(100, 350);
        building.y = game.config.height + Phaser.Math.Between(0, 100);
        building.setFrame(Phaser.Math.Between(0, 3));
        if (Phaser.Math.Between(0, 1)) {
          building.setDepth(1);
        }
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      let platformRandomHeight =
        gameOptions.platformHeighScale *
        Phaser.Math.Between(
          gameOptions.platformHeightRange[0],
          gameOptions.platformHeightRange[1]
        );
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight =
        game.config.height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight =
        game.config.height * gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      this.addPlatform(
        nextPlatformWidth,
        game.config.width + nextPlatformWidth / 2,
        nextPlatformHeight
      );
    }
  }
}
function resize() {
  let canvas = document.querySelector(`canvas`);
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + `px`;
    canvas.style.height = windowWidth / gameRatio + `px`;
  } else {
    canvas.style.width = windowHeight * gameRatio + `px`;
    canvas.style.height = windowHeight + `px`;
  }
}

function collectPill() {
  //  Add and update the score
  score++;
  $(`#coinCollected`).text(score);
  console.log(score);
}

// This functions is our score screen. This game is ended if pills collected or player runs out of lives.
function Gameover() {
  console.log(`gameover`);
  // $.post(`/highscore`, score, function(data) {
  //   console.log(data);
    // Redirect player to the leader board Screen
    window.location = `/highscore/`;
  // });

  // const user = document.getElementById("user").value;
  // var endTime = new Date();
  // var endScore = {
  //   name: user,
  //   treasurePoint: coinScore,
  //   monstersKilled: numOfKilledMonster,
  //   bestTime: endTime - startTime
  // };
  // $.post("/endgame", endScore, function(data) {
  //   console.log(data);
  //   // Redirect player to the leader board Screen
  //   window.location = "/leader/" + user;
  // });
}
