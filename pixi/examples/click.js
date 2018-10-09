var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });// 创建800x600的画布背景色为0x1099bb
document.body.appendChild(app.view);// <body>中添加<canvas>

//所有纹理的缩放模式，都会保留像素化
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var sprite = PIXI.Sprite.fromImage('required/assets/basics/bunny.png');// 读取图片

sprite.anchor.set(0.5);// 设置注册点为图片的中心
sprite.x = app.screen.width / 2;// 移动x轴
sprite.y = app.screen.height / 2;// 移动y轴

sprite.interactive = true;// 启用交互. 开启后可支持键盘鼠标事件.

sprite.buttonMode = true;// 鼠标样式为手势,如css的{cursor:pointer;}


sprite.on('pointerdown', onClick);// 侦听鼠标事件 mousedown

// 鼠标和触摸事件
// sprite.on('click', onClick); // 只有鼠标事件
// sprite.on('tap', onClick); // 只有触摸事件

app.stage.addChild(sprite);// 添加到场景中

function onClick () {
    sprite.scale.x *= 1.25;// x轴放大
    sprite.scale.y *= 1.25;// y轴放大
}