'use strict';

// // PIXI.utils.sayHello=function(){};

// // 检测是否支持WebGL
document.querySelector('#hasWebGL').checked=PIXI.utils.isWebGLSupported();


// // Aliases
let
Application=PIXI.Application,
Container  =PIXI.Container,
BaseTexture=PIXI.BaseTexture,
Texture=PIXI.Texture,
Sprite=PIXI.Sprite,
Text=PIXI.Text,
Graphics=PIXI.Graphics,
Rectangle=PIXI.Rectangle,
loader =PIXI.loader,
resources=PIXI.loader.resources,
TextureCache=PIXI.utils.TextureCache,


// // 新建
opt ={
	width:400,
	height:300,
	antialias:true,
	transparent:false,
	backgroundColor:0xffffff,
	resolution:1
},
// var app = new PIXI.Application(400,300);
app=new Application(opt),
stage = app.stage,
renderer=app.renderer,
view  = app.view,
sprite=new Sprite(),
graphics = new Graphics(),
container=new Container(),
img,
texture,
data,
textures;

document.body.appendChild(view);// view 是canvas标签。
stage.addChild(sprite);
stage.addChild(container);


// // 绘制圆
graphics.lineStyle='4px solid #000';
graphics.beginFill(0x5cafe2);
graphics.drawCircle(0, 0, 10);
graphics.x = 10;
graphics.y = 10;
container.addChild(graphics);


// var sprite = new PIXI.Sprite();
// sprite.addChild(circle);
// sprite.interactive = true;  
// sprite.buttonMode = true;  
// // sprite.anchor.set(0.5); 
// sprite.x=sprite.y=200;
// container.addChild(sprite);

// sprite
// 	.on('pointerdown', onDragStart)
// 	.on('pointerup', onDragEnd)  
// 	.on('pointerupoutside', onDragEnd)  
// 	.on('pointermove', onDragMove);
  
// function onDragStart(event) {  
// 	console.log(event.data, event)
// 	this.data = event.data;  
//     this.alpha = 0.5;
//     this.dragging = true;
// }  
  
// function onDragEnd(event) {  
//     this.alpha = 1;  
//     this.dragging = false;  
//     this.data = null;  
// }  
  
// function onDragMove(event) {  

//     if(this.dragging) {  
//         var newPosition = this.data.getLocalPosition(this.parent); //获取鼠标移动的位置  
//         this.position.x = newPosition.x;  
//         this.position.y = newPosition.y;  
//     }  
// }

// loader.add('action.json');

// var texture = PIXI.Texture.fromImage('action.png');
// // sprite.texture=texture;// sprite

// var png=new PIXI.Sprite(texture);
// stage.addChild(png);




// var renderer = PIXI.autoDetectRenderer(256, 256, {antialiasing: false, transparent: false, resolution: 1});
//     document.body.appendChild(renderer.view);
//     renderer.backgroundColor = 0xeeeeee;

//     renderer.view.style.border='2px solid #000'

//     var scene = new PIXI.Container();

//     var render = function() {
//         renderer.render(scene);
//         requestAnimationFrame(render);
//     }
//     render();

// var texture = PIXI.Texture.fromImage('action.png');
// var sprite=new PIXI.Sprite();
// sprite.texture=texture;// sprite
// scene.addChild(sprite)


// function Loader(url,f){
// 	loader.add(url,function(l,r){
// 		console.log(l,r)
// 		// stage.addChild(new PIXI.Sripte(PIXI.BaseTexture()))
// 	})
// 	// .on('progress',function(l,r){console.log(l.progress+'%',r.url);})
// 	.load(f);
// }

// Loader('action.png',function(loader,resources){
// 	console.log(arguments.length, loader);

// })






loader
.add('images/textures.json')
.add('images/rori.jpg')
.load(setup);
// .add('action.png')
// .add([
	// 'images/buttonset.png',
	// 'images/tileset.png',
	// 'images/textures.json'
	// ])
// .add({
// 	name:'action',
// 	url:'action.png',
// 	onComplete:function(resource){
// 		console.log('complete');
// 		console.log(resource.name);
// 		console.log(resource.url);
// 		console.log(resource.data);// <img>
// 		console.log(resource.error);// instanceof Error
// 	}
// })
// .on('progress',function(loader,resource){
// 	console.log(resource.name, resource.url, loader.progress, loader, resource)
// })
// .add({name:'action2', url:'action2.png', onComplete:function(r){ console.log(arguments.length,r); }, crossOrigin:true})


function setup(){
	console.log(resources);

	start();
}

function start(){
	textures=resources['images/textures.json'].textures;

	sprite.texture=textures.b0;
	sprite.interactive=true;
	sprite.buttonMode=true;
	sprite.x=100;

	var outlineFilter=new PIXI.filters.OutlineFilter(1, 0xefef00);
	var filter = new PIXI.filters.ColorMatrixFilter();
	var blurFilter = new PIXI.filters.BlurFilter();
	blurFilter.blur=1;

	var rand=0;
	sprite.on('pointerover',function(e){
		this.filters=[outlineFilter];
	}).on('pointerout',function(e){
		this.filters=null;
		// app.ticker.remove(colorFilter);
	}).on('pointerup',function(e){
		this.filters=null;
		// app.ticker.remove(colorFilter);
	}).on('pointerdown',function(e){
		this.filters=[blurFilter]

		// rand=0;
		// this.filters=[filter]
		// var matrix = filter.matrix;
		// app.ticker.add(colorFilter);
	})
	function colorFilter(){
		rand+=0.1;
		var matrix = filter.matrix;
		matrix[1] = Math.sin(rand) * 3;
		matrix[2] = Math.cos(rand);
		matrix[3] = Math.cos(rand) * 1.5;
		matrix[4] = Math.sin(rand / 3) * 2;
		matrix[5] = Math.sin(rand / 2);
		matrix[6] = Math.sin(rand / 4);
		console.log(matrix)
	}



}

// (function(){
// var Stage = curvejs.Stage,
//     Curve = curvejs.Curve,
//     canvas = document.querySelector('canvas'),
//     stage = new Stage(canvas),
//     rd = function() {
//         return -2 + Math.random() * 2
//     }

// var curve = new Curve({
//     color: '#00FF00',
//     points: [277, 327, 230, 314, 236, 326, 257, 326],
//     data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
//     motion: function motion(points, data) {
//       points.forEach(function (item, index) {
//           points[index] += data[index]
//       })
//     }
// })

// stage.add(curve)

// function tick(){
//     stage.update()
//     requestAnimationFrame(tick)
// }
// tick();
// })();

window.addEventListener('dragover',function(e){
	e.preventDefault();

},true);
window.addEventListener('drop',function(e){
	e.preventDefault();
	var dt=e.dataTransfer;
	var files=dt.files;
	var items=dt.items;
	console.log(files.length, items.length);
	if(items.length){
		// var item=items.getItem(0);
		items[0].getAsString(function(s){
			console.log(s)
		});
	}
	if(files.length) {
		var fr=new FileReader();
		fr.onload=function(e){
			var s=fr.result;
			console.log(s);
			console.log(rs)
		}
		fr.readAsText(files[0]);
	}
},true);


