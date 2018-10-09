var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});// 创建800x600的画布背景色为0x1099bb
document.body.appendChild(app.view);// <body>中添加<canvas>

var container = new PIXI.Container();// Container是容器,据说stage也是Container的实例

app.stage.addChild(container);// stage中添加container容器


var texture = PIXI.Texture.fromImage('required/assets/basics/bunny.png');// 用纹理读取外部图片bunny.png

// 创建5x5的阵列图
for (var i = 0; i < 25; i++) {
    var bunny = new PIXI.Sprite(texture);// 创建Sprite实例
    bunny.anchor.set(0.5);// 设置注册点为图片正中间
    bunny.x = (i % 5) * 40;// 移动sprite的x轴
    bunny.y = Math.floor(i / 5) * 40;// 移动sprite的y轴
    container.addChild(bunny);// 容器添加sprite
}

// 容器移动到canvas的中间,因为container的注册点为{x:0,y:0},所以此时还不是正中间.
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// 将容器的注册点设为该容器的中间
container.pivot.x = container.width / 2;// x注册点设为中间
container.pivot.y = container.height / 2;// y注册点设为中间

// 侦听事件,动画更新.通常是60fps,每秒60次刷新.
app.ticker.add(function(delta) {
    container.rotation -= 0.01 * delta;// 旋转容器. 使用弧度.
});