var app = new PIXI.Application();// 创建App, 默认{width:800, height:600}
document.body.appendChild(app.view);// 添加<canvas>


var texture = PIXI.Texture.fromImage('required/assets/p2.jpeg');// 读取外部图片为纹理

var tilingSprite = new PIXI.extras.TilingSprite(
    texture,// 设置纹理
    app.screen.width,// 设置宽
    app.screen.height// 设置高
);// 平铺纹理
app.stage.addChild(tilingSprite);

var count = 0;

app.ticker.add(function() {

    count += 0.005;

    tilingSprite.tileScale.x = 2 + Math.sin(count);// 取值范围 1~3的浮点
    tilingSprite.tileScale.y = 2 + Math.cos(count);// 取值范围 1~3的浮点

    tilingSprite.tilePosition.x += 1;// 纹理x轴移动
    tilingSprite.tilePosition.y += 1;// 纹理y轴移动
});