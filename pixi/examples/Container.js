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

// 容器移动到canvas的中间，因为container的注册点为{x:0,y:0}所以要根据container的宽高来移动
container.x = (app.screen.width - container.width) / 2;
container.y = (app.screen.height - container.height) / 2;
