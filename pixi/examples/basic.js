var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});	//创建PIXI应用
document.body.appendChild(app.view);	//app.view为<canvas>标签
var bunny = PIXI.Sprite.fromImage('required/assets/basics/bunny.png')	//Sprite是容器，容器读取外部图片bunny.png
bunny.anchor.set(0.5);	//sprite的注册点设为居中
bunny.x = app.screen.width / 2;	//sprite移动到屏幕横向中间
bunny.y = app.screen.height / 2;	//sprite移动到屏幕纵向中间
app.stage.addChild(bunny);	//将sprite添加到stage中
app.ticker.add(function(delta) {	//ticker(时间轴)添加触发函数
	bunny.rotation += 0.1 * delta;	//每次ticker事件发生时，旋转sprite
});
