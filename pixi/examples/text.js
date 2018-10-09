var app = new PIXI.Application(800, 600, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

var basicText = new PIXI.Text('Basic text in pixi');// 创建Text,直接输入内容
basicText.x = 30;
basicText.y = 90;

app.stage.addChild(basicText);

var style = new PIXI.TextStyle({
    fontFamily: 'Arial',// 字体
    fontSize: 36,// 字体大小
    fontStyle: 'italic',// 斜体
    fontWeight: 'bold',// 粗体
    fill: ['#ffffff', '#00ff99'], // 颜色填充渐变
    stroke: '#4a1850',// 边线颜色
    strokeThickness: 5,
    dropShadow: true,// 阴影启用
    dropShadowColor: '#000000',// 阴影颜色
    dropShadowBlur: 4,// 阴影模糊
    dropShadowAngle: Math.PI / 6,// 阴影方向(弧度)
    dropShadowDistance: 6,// 
    wordWrap: false,// 自动换行
    wordWrapWidth: 440// 自动换行宽度
});

var richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style);// 创建文字, 应用样式
richText.x = 30;// 文字x轴移动
richText.y = 180;// 文字y轴移动

app.stage.addChild(richText);// 加入到场景内



function draw(x,y,w,h){
    graphics.lineStyle='1px solid #00f';
    graphics.beginFill(0xff0000,.25);
    graphics.drawEllipse(x,y,w,h);
    graphics.drawCircle(x,y,1);
    graphics.endFill();
}
