import Preloader from './Preloader.js';
import MainMenu from './MainMenu.js';
import MainGame from './Game.js';
import Boot from './Boot.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#B46984',
  parent: 'phaser-example',
  scene: [Boot, Preloader, MainMenu, MainGame]
};

let game = new Phaser.Game(config);