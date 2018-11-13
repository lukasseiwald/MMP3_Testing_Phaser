import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.spritesheet(
			"player",
      "assets/images/player.png",
      48, //frameWidth
      48, //frameHeight
      48  //cells
    );
    
    //blocks
    this.load.spritesheet('tileSet', 'assets/images/tileSet.png', 48, 48, 2);

    //sounds
    this.load.audio('spell1', ['assets/sounds/attack/fire_sound.mp3']);
  }

  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start('Game')
  }
}
