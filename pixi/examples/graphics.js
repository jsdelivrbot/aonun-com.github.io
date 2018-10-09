var app = new PIXI.Application(800, 600, { antialias: true });
document.body.appendChild(app.view);

var graphics = new PIXI.Graphics();// 创建矢量图


graphics.beginFill(0xFF3300);// 填充色,不透明度1
graphics.lineStyle(4, 0xffd900, 1);// 边框色

// 绘图
graphics.moveTo(50,50);// 移动指针(尚未绘图)
graphics.lineTo(250, 50);// 画线到指定{x,y}坐标
graphics.lineTo(100, 100);// 画线到指定{x,y}坐标
graphics.lineTo(50, 50);// 画线到指定{x,y}坐标
graphics.endFill();// 结束填充

graphics.lineStyle(2, 0x0000FF, 1);
graphics.beginFill(0xFF700B, 1);
graphics.drawRect(50, 250, 120, 120);// 画尖角四边形

graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0xFF00BB, 0.25);// 不透明度0.25
graphics.drawRoundedRect(150, 450, 300, 100, 15);// 画圆角四边形
graphics.endFill();

graphics.lineStyle(0);
graphics.beginFill(0xFFFF0B, 0.5);// 填充颜色,不透明度0.5
graphics.drawCircle(470, 90,60);// 画圆
graphics.endFill();



app.stage.addChild(graphics);