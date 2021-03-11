import map from './map.js';

let tanksTile = ['./img/kenney_topdowntanksredux/Spritesheet/allSprites_default.png',
   './img/blob.png',
  './sounds/popal.mp3',
  './img/buttonFrames.png',
  './sounds/vistrel.mp3',
  './sounds/tracks_rattle_slow_01.mp3',
  './sounds/tankrotate.mp3',
  './img/terrainTiles_default.png',
  './img/imgControll/flatDark23.png',
  './img/imgControll/flatDark24.png',
  './img/imgControll/flatDark25.png',
  './img/imgControll/myBtn.png'];

let g = hexi(window.width, window.height, setup, tanksTile, load);
g.scaleToWindow();
g.start();
g.backgroundColor = "grey";

function load() {
  g.loadingBar();
}
let mode = undefined;
const level = {
  widthInTiles: 20,
  heightInTiles: 20,
  widthTile: 64,
  heightTile: 64,
  tileset: {
    source: './img/kenney_topdowntanksredux/Spritesheet/allSprites_default.png',
    field: [128,0],
    roadGorizont: [[128, 384], [128, 128], [128, 192]],
    roadVertical: [[128, 64], [128, 256], [128, 320]],
    raodTurn: [[0, 0],[0, 192], [0, 256]]
  }
}

let tank = null,
    turret = null,
    bullets = null,
    fireBullet, // выхлоп
    particleBullet,  // спрайт взрыва
    moveEmitter, // выхлоп
    tankB,
    tankGusein, // гусеницы танка
    d; // гусеницы танка анимация

let soundPuh,
    soundBom,
    soundVjjj,
    soundRotate;

let bricks;
let player;
let world1;

let titleText = undefined,
    playButton = undefined,
    testBtn = undefined,
    backMenuBtn = undefined;
// scene
let titleScene = undefined,
    SettingScene = undefined,
    gameSceneOne = undefined,
    settingGameScene = undefined,
    gameSceneOneGroup = undefined;

let leftArrow = g.keyboard(37),
    upArrow = g.keyboard(38),
    rightArrow = g.keyboard(39),
    downArrow = g.keyboard(40),
    spaceArrow = g.keyboard(32),
    camera;

let btnLeft = undefined,
    btnRight = undefined,
    btnUp = undefined,
    btnPuh;


function setup(){
  soundBom = g.sound('./sounds/popal.mp3');
  soundPuh = g.sound('./sounds/vistrel.mp3');
  soundVjjj = g.sound('./sounds/tracks_rattle_slow_01.mp3');
  soundRotate = g.sound('./sounds/tankrotate.mp3');

  titleText = g.text("empty game", "20px puzzler", "white", 0, 0);
  titleText.setPosition(g.canvas.width / 2 - titleText.width / 2, 0);
  let btnFr = g.frames('./img/buttonFrames.png', [[0, 0], [0, 96], [0, 192]], 192, 96);
  playButton = g.button(btnFr);

  // кнопка настроек на главной странице
  testBtn = g.button(['./img/imgControll/myBtn.png', './img/imgControll/myBtn.png', './img/imgControll/myBtn.png']);
  g.stage.putCenter(testBtn);
  testBtn.y = g.canvas.height / 2 + testBtn.height;

  // btn controll
  btnLeft = g.button(['./img/imgControll/flatDark23.png', './img/imgControll/flatDark23.png', './img/imgControll/flatDark23.png']);
  btnRight = g.button(['./img/imgControll/flatDark24.png', './img/imgControll/flatDark24.png', './img/imgControll/flatDark24.png']);
  btnUp = g.button(['./img/imgControll/flatDark25.png', './img/imgControll/flatDark25.png', './img/imgControll/flatDark25.png']);
  btnPuh = g.button(['./img/imgControll/flatDark35.png', './img/imgControll/flatDark35.png', './img/imgControll/flatDark35.png']);
  btnLeft.setPosition(0, g.canvas.height - btnLeft.height);
  btnRight.setPosition(btnLeft.height + btnLeft.height + 30, g.canvas.height - btnUp.height);
  btnUp.setPosition(btnLeft.height + 15, g.canvas.height - btnUp.height);
  btnPuh.setPosition(btnLeft.height + 200, g.canvas.height - btnUp.height );
  
  let settingInPlay = g.button(['./img/blob.png', './img/blob.png', './img/blob.png']);
  settingInPlay.setPosition(50, 0);

  // g.slide(titleText, 250, 300, 30, "decelerationCubed");
  g.stage.putCenter(playButton);
  
  tankGusein = g.frames(level.tileset.source, [[476, 319], [476, 325], [476, 319] ], 37, 40);
  fireBullet = g.frames(level.tileset.source, [[262, 512]], 50, 50);
  let tankFrame = g.frames(level.tileset.source, [[476 ,0]] , 38, 40);
  let turretFrame = g.frames(level.tileset.source, [[514, 0]], 16, 30);
  let botPlayer = g.frame(level.tileset.source, 432, 48, 42, 48);
  particleBullet = g.frames(level.tileset.source, [[0, 128]], 64, 63);
  
  player = g.sprite(botPlayer);
  player.setPosition(150, 150);
  // walkTank(player);

  tankFrame.rotate += -1.6;
  tank = g.sprite(tankFrame);
  tank.setPivot(0.5, 0.5);
  tank.vx = 0;
  tank.vy = 0;
  tank.accelerationX = 0.7;
  tank.accelerationY = 0.7;
  tank.frictionX = 0.86;
  tank.frictionY = 0.86;
  tank.rotation = 0;
  tank.rotationSpeed = 0;
  tank.moveForward = false;
  tank.direction = 'up';

  d = g.sprite(tankGusein);
  d.setPivot(0.5, 0.5);
  d.fps = 12;

  turret = g.sprite(turretFrame);
  turret.setPivot(0.5, 0);
  tankB = g.rectangle(1,1);

  tank.addChild(tankB, d, turret);
  turret.x = 0;
  turret.y = 0;
  tankB.x = -20;
  tankB.y = -25;
  d.x = 0;
  d.y = 0; d.setScale(1.2,1.2)

  

  bullets = [];

  moveEmitter = g.particleEmitter(100,
    function () {
      return g.createParticles(tankB.gx, tankB.gy,
        function () {
          return g.sprite(fireBullet);
        }, g.stage, 1, 0,                        //Gravity
        true,                                    //Random spacing
        0, 6.28,                                 //Min/max angle
        20, 24, )
    });

  bricks = g.grid(3, 3, 50, 50,true, 0, 0,
    function() {
      var brick = g.rectangle(15,15,'blue');
      return brick;
    });
  

  let settingBack = g.rectangle(g.canvas.width, g.canvas.height, 'orange');
  backMenuBtn = g.button(['./img/blob.png', './img/blob.png', './img/blob.png']);
  backMenuBtn.setPosition(0, 50);
  world1 = makeWorld(level);
  world1.x = 0;
  world1.y = 0;
  
  settingGameScene = g.group();

  // tank.setPosition(0,0);

  gameSceneOneGroup = g.group(world1, bricks, player);
  camera = g.worldCamera(gameSceneOneGroup, world1.worldWidth, world1.worldHeight);
  camera.centerOver(tank);
  // tank.collisionArea = { x: 0, y: 0, width: 10, height: 10 };

  // полоска настройка в самой игре
  let k = g.rectangle(g.canvas.width, 100, 'blue');
  k.y = g.canvas.height - k.height;
  settingGameScene.addChild(k, settingInPlay, btnLeft, btnRight, btnUp, btnPuh);

  gameSceneOne = g.group(gameSceneOneGroup, tank, settingGameScene);
  gameSceneOneGroup.setPosition(-500,0);
  gameSceneOne.x = -1000;

  titleScene = g.group(titleText, playButton, testBtn);
  titleScene.x = 0;
  titleScene.backgroundColor = 'green';

  SettingScene = g.group(settingBack, backMenuBtn);
  SettingScene.x = 0;
  SettingScene.y = -settingBack.height;

  settingInPlay.press = () => {
    mode = 'setting';
    controllBtnStop();
    g.slide(titleScene, 0, 0, 30, "decelerationCubed");
    g.slide(gameSceneOne, g.canvas.width + 500, 0, 30, "decelerationCubed");
    g.pause();
  }
  backMenuBtn.press = () => {
    mode = 'start';
    g.slide(titleScene, 0, 0, 30, "decelerationCubed");
    g.slide(SettingScene, 0, -settingBack.height, 30, "decelerationCubed");
  }
  testBtn.press = () => {
    mode = 'setting';
    g.slide(titleScene, g.canvas.width, 0, 30, "decelerationCubed");
    g.slide(SettingScene, 0, 0, 30, "decelerationCubed");
  };

  playButton.press = function () {
    mode = 'play';
    soundPuh.volume = 0.5;
    soundBom.volume = 0.5;
    soundVjjj.volume = 0.5;
    soundRotate.volume = 0.5;
    g.slide(titleScene, g.canvas.width, 0, 30, "decelerationCubed");
    g.slide(gameSceneOne, 0, 0, 30, "decelerationCubed");
    g.state = play;
    g.resume();
    if (mode === 'play') { 
      controllBtn();
      shooting();
      btnControllImg();
    }
  }
}

function play() {
  camera.follow(tank);

  tank.rotation  += (tank.rotationSpeed);
  if (tank.moveForward) {
    tank.vx = tank.accelerationX * Math.cos(tank.rotation + 1.6);
    tank.vy = tank.accelerationY * Math.sin(tank.rotation + 1.6);
  }
  else {
    tank.vx *= tank.frictionX;
    tank.vy *= tank.frictionY;
  }
  tank.x += tank.vx;
  tank.y += tank.vy;

  g.contain(tank, { x: 0, y: 0, width: g.canvas.width, height: g.canvas.height}, false);
  
  // g.move(tank);

  bullets = bullets.filter(bullet => {
    g.move(bullet);
    var collision = g.outsideBounds(bullet, g.stage);
    var collision2 = g.hit(bullet, player, true, true);
    bricks.children.forEach(brick => {
      let coll = g.hit(bullet, brick,  true, false);
      if(coll) {
        g.remove(brick);
        // bullet.visible = 0;  
        bullet.vx = 0;
        bullet.vy = 0;
        g.remove(bullet);
        return false;
      }
    })
    
    if (collision) {
      g.remove(bullet);
      return false;
    }
    if (collision2) {
      soundBom.play();
      g.shake(tank, 1, false);
      bullet.visible = false;
      let bullPart = g.createParticles(bullet.x, bullet.y,
        function () {
          return g.sprite(particleBullet);
        }, g.stage, 1, 0,                                     //Gravity
        true,                                     //Random spacing
        0, 0,                                 //Min/max angle
        22, 56);
    }
    return true;
  });
  
  g.hit(tank, bricks.children, true, false, true);
  // g.hit(tank, player, true, false, true);
};

function walkTank(a) {
  var walker = g.walkPath(a, //The sprite
    //An array of x/y waypoints to connect in sequence
    [[a.x, a.y], //First x/y point
    [32, 128], //Next x/y point
    [300, 128], //Next x/y point
    [300, 32], //Next x/y point
    [32, 32] //Last x/y point
    ], 300, //Total duration, in frames
    "smoothstep", //Easing type
    true, //Should the path loop?
    true, //Should the path reverse?
    1000 //Delay in milliseconds between segments
  );
};
function makeWorld(a, box) {
  let world = g.group();

  world.map = [];
  world.treasure = [];
  world.player = null;

  makeMap();

  makeTileSprite();

  // world.addChild(world.map);

  function makeMap() {
    let nuberOfCail = map.length;

    for (let i = 0; i < nuberOfCail; i++) {
      var x = i % a.widthInTiles,
        y = Math.floor(i / a.widthInTiles);
      var cell = {
        x: x,
        y: y,
        item: ""
      };
      switch (map[i]) {
        case 1:
          cell.tirein = 'road';
          world.map.push(cell);
        break;
        case 2:
          cell.tirein = 'road2';
          world.map.push(cell);
          break;
        case 3:
          cell.tirein = 'road3';
          world.map.push(cell);
          break;
        case 4:
          cell.tirein = 'road4';
          world.map.push(cell);
          break;
        case 5:
          cell.tirein = 'road5';
          world.map.push(cell);
          break;
        case 6:
          cell.tirein = 'road6';
          world.map.push(cell);
          break;
        default:
          cell.tirein = 'pole';
          world.map.push(cell);
      }
    }
  }
  function makeTileSprite() {
    world.map.forEach((item, i, map) => {
          let sprite = undefined,
            frame = undefined,
            x = item.x * a.widthTile,
            y = item.y * a.heightTile,
            width = a.widthTile,
            height = a.heightTile;
      switch (item.tirein) {
        case 'pole':
          frame = g.frame(a.tileset.source, a.tileset.field[0], a.tileset.field[1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x,y);
          world.addChild(sprite);
        break;
        case 'road':
          frame = g.frame(a.tileset.source, a.tileset.roadGorizont[0][0], a.tileset.roadGorizont[0][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road2':
          frame = g.frame(a.tileset.source, a.tileset.roadGorizont[1][0], a.tileset.roadGorizont[1][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road3':
          frame = g.frame(a.tileset.source, a.tileset.roadGorizont[2][0], a.tileset.roadGorizont[2][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road4':
          frame = g.frame(a.tileset.source, a.tileset.roadVertical[0][0], a.tileset.roadVertical[0][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road5':
          frame = g.frame(a.tileset.source, a.tileset.roadVertical[1][0], a.tileset.roadVertical[1][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road6':
          frame = g.frame(a.tileset.source, a.tileset.roadVertical[2][0], a.tileset.roadVertical[2][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
      }
    });
  }
  return world;
}
function btnControllImg() {
  btnLeft.press = () => {
    tank.rotationSpeed = -0.03;
    moveEmitter.play();
    if (!soundRotate.playing) { soundRotate.play() };
  }
  btnLeft.release = () => {
    tank.rotationSpeed = 0;
    if (!upArrow.isDown) { moveEmitter.stop(); }
    soundRotate.pause();
  }
  btnRight.press = () => {
    tank.rotationSpeed = 0.03;
    moveEmitter.play();
    if (!soundRotate.playing) { soundRotate.play() };
  }
  btnRight.release = () => {
    tank.rotationSpeed = 0;
    if (!upArrow.isDown) { moveEmitter.stop(); }
    soundRotate.pause();
  }
  btnUp.press = () => {
    tank.moveForward = true;
    moveEmitter.play();
    d.playAnimation();
    if (!soundVjjj.playing) {
      soundVjjj.loop = true;
      soundVjjj.play();
    };
  }
  btnUp.release = () => {
    tank.moveForward = false;
    moveEmitter.stop();
    d.stopAnimation();
    soundVjjj.pause();
  }
  btnPuh.press = () => {
    soundPuh.play();
    g.shoot(tank,// Стрелок
      (tank.rotation + 1.6), //Угол, под которым стрелять
      0, //Точка x на стрелке, откуда должна начаться пуля
      35, //Точка Y на стрелке, откуда должна начаться пуля.
      g.stage, //Контейнер, в который вы хотите добавить пулю
      7, //The bullet's speed (pixels per frame)
      bullets, //Массив, используемый для хранения пуль
      function () {
        let bulletFrame = g.frames(level.tileset.source, [[485, 130]], 6, 16);
        let bulletSprite = g.sprite(bulletFrame);
        bulletSprite.rotation = tank.rotation + 3.2;
        return bulletSprite;
      });
  }
}
function controllBtn() {
  leftArrow.press = () => {
    tank.direction = 'left';
    tank.rotationSpeed = -0.03;
    moveEmitter.play();
    if (!soundRotate.playing) { soundRotate.play() };
  };
  leftArrow.release = () => {
    tank.direction = 'down';
    tank.rotationSpeed = 0;
    if (!upArrow.isDown) { moveEmitter.stop(); }
    soundRotate.pause();
  };
  upArrow.press = () => {
    tank.direction = 'up';
    tank.moveForward = true;
    moveEmitter.play();
    d.playAnimation();
    if (!soundVjjj.playing) { 
      soundVjjj.loop = true;
      soundVjjj.play(); };
  };
  upArrow.release = () => {
    tank.direction = 'down';
    tank.moveForward = false;
    moveEmitter.stop();
    d.stopAnimation();
    soundVjjj.pause();
  };
  rightArrow.press = () => {
    tank.direction = 'right';
    tank.rotationSpeed = 0.03;
    moveEmitter.play();
    if (!soundRotate.playing) { soundRotate.play() };
  };
  rightArrow.release = () => {
    tank.direction = 'down';
    tank.rotationSpeed = 0;
    if (!upArrow.isDown) { moveEmitter.stop(); }
    soundRotate.pause();
  };
}
function controllBtnStop(){
  soundPuh.volume = 0;
  soundBom.volume = 0;
  soundVjjj.volume = 0;
  soundRotate.volume = 0;
}
function shooting() {
  spaceArrow.press = function () {
    soundPuh.play();
    g.shoot(tank,// Стрелок
      (tank.rotation + 1.6), //Угол, под которым стрелять
      0, //Точка x на стрелке, откуда должна начаться пуля
      35, //Точка Y на стрелке, откуда должна начаться пуля.
      g.stage, //Контейнер, в который вы хотите добавить пулю
      7, //The bullet's speed (pixels per frame)
      bullets, //Массив, используемый для хранения пуль
      function () {
        let bulletFrame = g.frames(level.tileset.source, [[485, 130]], 6, 16);
        let bulletSprite = g.sprite(bulletFrame);
        bulletSprite.rotation = tank.rotation + 3.2;
        return bulletSprite;
      });
  };
}
