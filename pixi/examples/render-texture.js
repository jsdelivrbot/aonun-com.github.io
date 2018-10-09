var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

var container = new PIXI.Container();
app.stage.addChild(container);

var texture = PIXI.Texture.fromImage('required/assets/basics/bunny.png');

// 根据上面的texture, 创建25个Sprite, 并进行舞台排列
for (var i = 0; i < 25; i++) {
    var bunny = new PIXI.Sprite(texture);
    bunny.x = (i % 5) * 30;
    bunny.y = Math.floor(i / 5) * 30;
    bunny.rotation = Math.random() * (Math.PI * 2)
    container.addChild(bunny);
}

// 创建300x300的渲染区域
var brt = new PIXI.BaseRenderTexture(300, 300, PIXI.SCALE_MODES.LINEAR, 1);
var rt = new PIXI.RenderTexture(brt);// 创建渲染纹理

var sprite = new PIXI.Sprite(rt);// 新建sprite, 应用纹理
// 移动并添加
sprite.x = 450;
sprite.y = 60;
app.stage.addChild(sprite);


container.x = 100;
container.y = 60;

app.ticker.add(function() {
    app.renderer.render(container, rt);
});
