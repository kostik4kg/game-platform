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
  './img/imgControll/myBtn.png',
'./img/tilemap_packed.png',
'./img/imgControll/back.png',
'./img/imgControll/start.png']

let g = hexi(812, window.height, setup, tanksTile, load);
g.scaleToWindow();
g.start();
g.backgroundColor = "grey";

function load() {
  g.loadingBar();
}
let mode = undefined;
const level = {
  widthInTiles: 18,
  heightInTiles: 16,
  widthTile: 64,
  heightTile: 64,
  tileset: {
    source: './img/kenney_topdowntanksredux/Spritesheet/allSprites_default.png',
    field: [128,0],
    roadGorizont: [[128, 384], [128, 128], [128, 192]],
    roadVertical: [[128, 64], [128, 256], [128, 320]],
    raodTurn: [[0, 0],[0, 192], [0, 256]],
  }
}
let tileBuild = undefined;
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
let messeg = null;
let messegBrick = null;
let finishMessage = undefined;

let finish = undefined;

function setup(){
  soundBom = g.sound('./sounds/popal.mp3');
  soundPuh = g.sound('./sounds/vistrel.mp3');
  soundVjjj = g.sound('./sounds/tracks_rattle_slow_01.mp3');
  soundRotate = g.sound('./sounds/tankrotate.mp3');

  titleText = g.text("super tank scout", "20px puzzler", "white", 0, 0);
  titleText.setPosition(g.canvas.width / 2 - titleText.width / 2, 0);
  
  playButton = g.button(['./img/imgControll/start.png', './img/imgControll/start.png','./img/imgControll/start.png']);

  // btn controll
  btnLeft = g.button(['./img/imgControll/flatDark23.png', './img/imgControll/flatDark23.png', './img/imgControll/flatDark23.png']);
  btnRight = g.button(['./img/imgControll/flatDark24.png', './img/imgControll/flatDark24.png', './img/imgControll/flatDark24.png']);
  btnUp = g.button(['./img/imgControll/flatDark25.png', './img/imgControll/flatDark25.png', './img/imgControll/flatDark25.png']);
  btnPuh = g.button(['./img/imgControll/flatDark35.png', './img/imgControll/flatDark35.png', './img/imgControll/flatDark35.png']);
  btnLeft.setPosition(0, g.canvas.height - btnLeft.height);
  btnRight.setPosition(btnLeft.height + btnLeft.height + 30, g.canvas.height - btnUp.height);
  btnUp.setPosition(btnLeft.height + 15, g.canvas.height - btnUp.height);
  btnPuh.setPosition(btnLeft.height + 200, g.canvas.height - btnUp.height );
  
  let settingInPlay = g.button(['./img/imgControll/back.png', './img/imgControll/back.png', './img/imgControll/back.png']);
  settingInPlay.setPosition(50, 0);

  g.stage.putCenter(playButton);
  
  tankGusein = g.frames(level.tileset.source, [[476, 319], [476, 325], [476, 319] ], 37, 40);
  fireBullet = g.frames(level.tileset.source, [[262, 512]], 50, 50);
  let tankFrame = g.frames(level.tileset.source, [[476 ,0]] , 38, 40);
  let turretFrame = g.frames(level.tileset.source, [[514, 0]], 16, 30);
  particleBullet = g.frames(level.tileset.source, [[0, 128]], 64, 63);
  
 
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
  
  bricks = g.group();
  // createBricks();

  world1 = makeWorld(level);
  world1.x = 0;
  world1.y = 0;
  
  let finifFrame = g.frame(level.tileset.source, 52,512,54,52);
  finish = g.sprite(finifFrame);
  finish.setPivot(0.5, 0.5);
  g.strobe(finish, 1.1, 1, 1, 25);
  finish.x = world1.width / 2;
  finish.y = world1.height - 60;

  // полоска настройка в самой игре
  gameSceneOneGroup = g.group(world1, bricks, finish);
  
  gameSceneOne = g.group(gameSceneOneGroup, tank);

  camera = g.worldCamera(gameSceneOne, gameSceneOne.width, gameSceneOne.height);
  camera.centerOver(tank);

  titleScene = g.group(titleText, playButton);
  titleScene.x = 0;
  titleScene.backgroundColor = 'green';

  
  gameSceneOne.x = 1000;
  gameSceneOne.y = 0;

  settingGameScene = g.group();
  settingGameScene.addChild(settingInPlay, btnLeft, btnRight, btnUp, btnPuh);
  settingGameScene.alpha = 0.5;

  settingGameScene.visible = false;

  settingInPlay.press = () => {
    mode = 'setting';
    settingGameScene.visible = false;
    console.log('exit');
    controllBtnStop();
    reset();
    g.slide(titleScene, 0, 0, 30, "decelerationCubed");
    g.slide(gameSceneOne, gameSceneOne.width, 0, 30, "decelerationCubed");
    g.pause();
  }
  
  playButton.press = function () {
    mode = 'play';
    settingGameScene.visible = true;
    soundPuh.volume = 0.5;
    soundBom.volume = 0.5;
    soundVjjj.volume = 0.5;
    soundRotate.volume = 0.5;


    g.slide(titleScene, g.canvas.width, 0, 30, "decelerationCubed");
    g.slide(gameSceneOne, 0, 0, 30, "decelerationCubed");
    g.state = play;
    g.resume();
    if (mode === 'play') { 
      console.log(bricks);
      controllBtn();
      shooting();
      btnControllImg();

      createBricks();
      gameSceneOneGroup.addChild(bricks);
    }
    // if (bricks === undefined) { createBricks();}
  }
  g.stage.putCenter(tank);

  finishMessage = g.text('', '42px sant-serif', 'brown');
}

function play() {
  finish.rotation += 0.1;

  var conectRect = g.contain(tank, world1);

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
  
  g.move(tank);

  camera.follow(tank);

  bullets = bullets.filter(bullet => {
    let bulletRem = true;
    bricks.children.filter(brick => {
      
      if (g.hitTestRectangle(bullet, brick, true, true)) {
        g.remove(brick);
        g.remove(bullet);
        bullet.vx = 0;
        bullet.vy = 0;
        //g.remove(bullet);
        bulletRem = false;
        return false;
      }
      return true;
    });
    return bulletRem;
  });
  bullets = bullets.filter(bullet => {
    var collision = g.outsideBounds(bullet, g.stage);
    if (collision) {
      g.remove(bullet);
      return false;
    }
    return true;
  });

  g.move(bullets);

  g.hit(tank, bricks.children, true, false, true);

  let goFinish = g.hit(tank, finish, false, true, true);
  if(goFinish) {
    g.pause();
    finishMessage.visible = true;
    finishMessage.content = 'finish';
    g.stage.putCenter(finishMessage);
    controllBtnStop();
    g.wait(3000, function () {
      return reset();
    });
  }
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
        case 7:
          cell.tirein = 'road7';
          world.map.push(cell);
          break;
        case 8:
          cell.tirein = 'road8';
          world.map.push(cell);
          break;
        case 9:
          cell.tirein = 'road9';
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
        case 'road7':
          frame = g.frame(a.tileset.source, a.tileset.raodTurn[2][0], a.tileset.raodTurn[2][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road8':
          frame = g.frame(a.tileset.source, a.tileset.raodTurn[0][0], a.tileset.raodTurn[0][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road9':
          frame = g.frame(a.tileset.source, a.tileset.raodTurn[1][0], a.tileset.raodTurn[1][1], width, height);
          sprite = g.sprite(frame);
          sprite.setPosition(x, y);
          world.addChild(sprite);
          break;
        case 'road10':
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
  tank.moveForward = false;
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
    }
}
function createBuilding(){
  tileBuild = './img/tilemap_packed.png';
  let arrBuild = g.group();
  let spriteFrame = g.frame(tileBuild, 128, 48, 48, 48);
  let spriteBlock = g.sprite(spriteFrame);
  let buildF = g.frame(tileBuild, 272, 0, 48, 64);
  let buildS = g.sprite(buildF);
  buildS.y += spriteBlock.height;
  arrBuild.addChild(spriteBlock, buildS);
  return arrBuild;
}
function startParam() {
  createBricks();
}
function offParam() {

}
function createBricks() {
  bricks = g.grid(5, 4, 200, 250, false, 0, 0,
    function () {
      var brick = createBuilding();
      brick.health = 100;
      return brick;
    });
  bricks.children.forEach((item, i) => {
    let sizeB = g.randomInt(0, item.width);
    item.x += sizeB;
    item.y += sizeB;
  });
}
function reset() {
  finishMessage.visible = false;
  g.stage.putCenter(tank);
  spaceArrow.press = null;
  g.remove(bullets);
  g.remove(bricks);
  bricks.children = [];

  g.slide(titleScene, 0, 0, 30, "decelerationCubed");
  g.slide(gameSceneOne, g.canvas.width, 0, 30, "decelerationCubed");
  settingGameScene.visible = false;
}