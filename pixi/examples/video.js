var app = new PIXI.Application(800, 600, { transparent: true });
document.body.appendChild(app.view);


var button = new PIXI.Graphics()// 创建矢量图
    .beginFill(0x0, 0.5)// 填充黑色,不透明度0.5
    .drawRoundedRect(0, 0, 100, 100, 10)// 圆角四边形{x,y,w,h,r}
    .endFill()// 结束填充
    .beginFill(0xffffff)// 填充白色
    .moveTo(36, 30)// 移动绘图指针
    .lineTo(36, 70)// 画线{x,y}
    .lineTo(70, 50);// 画线{x,y}


button.x = (app.screen.width - button.width) / 2;// x轴移动
button.y = (app.screen.height - button.height) / 2;// y轴移动


button.interactive = true;// 激活交互(鼠标/触摸)
button.buttonMode = true;// 按钮模式,就是css的{cursor:pointer;}


app.stage.addChild(button);// 添加到场景中

button.on('pointertap', onPlayVideo);// 侦听触摸事件,类似click

function onPlayVideo() {

    button.destroy();// 删除按钮

    // 创建饰品纹理
    var texture = PIXI.Texture.fromVideo('required/assets/testVideo.mp4');

    // sprite接受纹理渲染
    var videoSprite = new PIXI.Sprite(texture);

    // 设置宽高
    videoSprite.width = app.screen.width;// 设为canvas宽度
    videoSprite.height = app.screen.height;// 设为canvas高度

    app.stage.addChild(videoSprite);
}
