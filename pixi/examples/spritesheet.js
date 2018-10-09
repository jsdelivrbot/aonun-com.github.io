var app = new PIXI.Application();// 创建800x600的画布背景色为0x000000
document.body.appendChild(app.view);// <body>中添加<canvas>

PIXI.loader
    .add('required/assets/basics/fighter.json')// 
    .load(onAssetsLoaded);// 正式读取

function onAssetsLoaded()
{
    // 动画帧的纹理数组
    var frames = [];

    // 创建30个帧
    for (var i = 0; i < 30; i++) {
        var val = i < 10 ? '0' + i : i;// 变量val为2位数,如 00~29

        // 读取外部图片纹理 rollSequence0000.png~rollSequence0029.png
        frames.push(PIXI.Texture.fromFrame('rollSequence00' + val + '.png'));
    }

    // 创建一个AnimatedSprite(类似GIF或Flash的帧动画MovieClip影片剪辑)
    var anim = new PIXI.extras.AnimatedSprite(frames);
    anim.x = app.screen.width / 2;// x轴居中
    anim.y = app.screen.height / 2;// y轴居中
    anim.anchor.set(0.5);// 注册点x,y轴居中
    anim.animationSpeed = 0.5;// 该动画速度
    anim.play();// 播放动画,另外stop()可以停止.

    app.stage.addChild(anim);

    // 侦听事件,动画更新.通常是60fps,每秒60次刷新.
    app.ticker.add(function() {
        anim.rotation += 0.01;
    });
}
