/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }
  preload() { 
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Players
    this.players = this.game.add.group();
    this.players.enableBody = true;
    
    //Player 1
    this.player1 = this.createPlayer(600, 550, 'player', false, 650, 210);  //x, y, jump (jumpHeight), velocity (runningSpeed)
    this.player1.enableBody = true;
    //Player 2
    this.player2 =this.createPlayer(10, 550, 'player', true, 400, 145);

    //Platform
    this.platforms = this.game.add.physicsGroup();
    this.platforms.enableBody = true;
    
    //Tiles
    this.tiles = this.game.add.physicsGroup();
    this.tiles.enableBody = true;
    this.createPlatforms();

    this.cursors = game.input.keyboard.createCursorKeys();
    
    //ADD Keys from Keyboard:
    var k = this.input.keyboard;
    //w 
    this.wKey = k.addKey(87);
    //a
    this.aKey = k.addKey(65);
    //s
    this.sKey = k.addKey(83);
    //d
    this.dKey = k.addKey(68);
    //f //fight
    this.fKey = k.addKey(70);
    //m //also for fight
    this.mKey = k.addKey(77);
    //k //for placing brick
    this.kKey = k.addKey(75);
  }

  update() {
    this.playersUpdate();
    this.player1Update();
    this.player2Update();
  }

  playersUpdate() {
    this.game.physics.arcade.collide(this.players, this.platforms );
    this.game.physics.arcade.collide(this.players, this.players );
  }

  player1Update() {
    var p = this.player1;
    p.body.velocity.x = 0;

    //m key down + touching destroyable tile -> destroys tile
    if(this.mKey.isDown && this.game.physics.arcade.collide(p, this.tiles, this.collidingWithTiles, this.processHandler, this )) {
    }
    else { //normal collide
      this.game.physics.arcade.collide(p, this.tiles)
    }
    //GO LEFT
    if(this.cursors.left.isDown) {
      p.animations.play('left');
      p.facingRight = false;
      p.body.velocity.x = -p.v;
      if(this.cursors.up.isDown && p.body.touching.down) {
        p.animations.play('jump');
        p.body.velocity.y = -p.j;
      }
    } //GO RIGHT
    else if(this.cursors.right.isDown) {
      p.animations.play('right');
      p.facingRight = true;
      p.body.velocity.x = p.v;
      if(this.cursors.up.isDown && p.body.touching.down) {
        p.animations.play('jump');
        p.body.velocity.y = -p.j;
      }
    }//JUMP
    else if(this.cursors.up.isDown && p.body.touching.down) { //player.body.touching.down only when touching platforms
      p.attack = false;
      p.animations.play('jump');
      p.body.velocity.y = -p.j;
    } //FLYING or FALLING
    else if(!p.body.touching.down) { //player.body.touching.down only when touching platforms
      p.animations.play('jump');
    } //DUCK DOWN
    else if(this.cursors.down.isDown) {
      p.animations.play('duck');
      p.body.velocity.y = p.v;
    } //ATTACK
    else if (this.mKey.isDown) {
      //ATTACK RIGHT
      if(p.facingRight) {
        p.animations.play('attackRight');
      } //ATTACK LEFT
      else {
        p.animations.play('attackLeft');
      }
      var snd = this.game.add.audio("spell1"); //add sound to game
      snd.volume = 0.01; //lower volume
      snd.play(); //Play Sound
    }
    else if(this.kKey.isDown) { //BUILD TILE
      var x = 1;
      var y = 1;

      //placing tiles in a more ordered place (noch verbessern) --->
      for(var xtmp = Math.ceil(p.x); xtmp <= this.game.width; xtmp++){
        if(xtmp % 50 === 0){
          x = xtmp;
          break;
        }
      }
      for(var ytmp = Math.ceil(p.y) - 15; ytmp <= this.game.height; ytmp++){
        if(ytmp % 30 === 0){
          y = ytmp;
          break;
        }
      }
      if(x != 1){
        var tile = this.tiles.create(x + 30, y, 'tileSet', 1);
        tile.body.setSize(30, 30);
        tile.body.immovable = true;
      }
      //<------

    } //JUST CHILLING FACING RIGHT
    else if(p.facingRight) {
      p.animations.play('idleRight');
    } //JUST CHILLING FACING LEFT
    else if(!p.facingRight) {
      p.animations.play('idleLeft');
    }
  }

  player2Update() {
    var p = this.player2;
    p.body.velocity.x = 0;
    if(this.aKey.isDown) {
      p.body.velocity.x = -p.v;
    } 
    else if(this.dKey.isDown) {
      p.body.velocity.x = p.v;
    }

    //jumping
    if(this.wKey.isDown && p.body.touching.down) { //player.body.touching.down only when touching platforms
      p.body.velocity.y = -p.j;
    }
    else if(this.sKey.isDown) {
      p.body.velocity.y = p.v;
    }

    if (this.fKey.isDown) {
      //Attack
      var snd = this.game.add.audio("spell1");
      snd.volume = 0.05;
      snd.play();
    }
  }

  processHandler (player, tile) {
    return true;
  }

  collidingWithTiles(player, tile) {
    if(tile.frame == 1) {
      tile.kill();
    }
  }

  createPlatforms() {
    //cover floor with tiles
    for(var i = 0; i < this.game.width; i += 30) {
      var ground = this.platforms.create(i, this.game.world.height - 20, 'tileSet', 0);
      ground.body.immovable = true;
    }

    var tileSet = 0;
    var randomNumber;

    for(var i = 0; i < this.game.width; i += 50) {
      for(var j = 0; j < this.game.height - 50; j += 50) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
        if(tileSet > 1) {
          if(randomNumber < 50) { 
            var tile = this.tiles.create(i, j - 20, 'tileSet', 0);
            tile.body.setSize(30, 30);
            tile.body.immovable = true;
          }
          if(tileSet > 4) {
            tileSet = 0;
          }
        }
        if(randomNumber < 10) {
          tileSet += 1;
          var tile = this.tiles.create(i, j - 20, 'tileSet', 1);
          tile.body.setSize(30, 30);
          tile.body.immovable = true;
        }
      }
    }
  }

  createPlayer(x,y,skin,facingRight,jump,velocity) {
    //cover floor with tiles
    var player = this.players.create(x,y, skin);
    player.body.gravity.y = 500;
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(28, 45);

    player.j = jump;
    player.v = velocity;
    player.facingRight = facingRight
    player.attack = false;

    player.animations.add('idleRight', [32,33,34,35], 12, true);
    player.animations.add('idleLeft', [0,1,2,3], 12, true);
    player.animations.add('left', [8,9,10,11,12,13,14,15], 12, true);
    player.animations.add('right', [41,42,43,44,45,46,47,48], 12, true);
    player.animations.add('attackRight', [16,17,18,19], 12, false);
    player.animations.add('attackLeft', [20,21,22,23], 12, false);
    player.animations.add('duck', [26,27,28,29,30], 12, true);
    player.animations.add('jump', [37], 20, true);
    player.animations.add('die', [38], 9, true);

    player.animations.play('idleRight');

    return player;
  }
}