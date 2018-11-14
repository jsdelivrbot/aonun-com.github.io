// process.chdir('/home/');
console.log(process.cwd());

const express = require('express');
const http = require('http');
const path=require('path');
const url = require('url');

const fs=require('fs');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const PORT = 80;
const app = express();
const server = http.createServer(app);

// app.set('env','production')
// console.log(app.enable('cache view')
// console.log(app.settings)
app.set('x-powered-by', false);
app.set('trust proxy', false);
// console.log(path.resolve('./statics'));
app.use(express.static('./cihot.com',{
	dotfiles:'ignore',
	etag:false,
	// maxAge:'1d',
	// redirect:false,
	// index: false,
	// extensions: ['html','htm'],
	// setHeaders: function(res,path,stat) {res.set('x-timestamp',Date.now())},
}));
app.set('view engine', 'jade');
app.set('views', './views');
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());
// app.use(function (req, res) {
// 	console.log(req.url);
// 	res.setHeader('Content-Type', 'text/plain')
// 	res.write('you posted:\n')
// 	res.end(JSON.stringify(req.body, null, 2))
// });
// parse various different custom JSON types as JSON
// app.use(bodyParser.json({ type: 'application/*+json' }))
// parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))

/*
模板引擎jade，静态目录static，模板目录views。
主页面/，
*/

// app.use(function(req,res,next) {
// 	console.log('----------------%d---------------\n%s\n%j', Date.now(), decodeURI(req.url), req.headers);
// 	if(req.url==='/favicon.ico') fs.createReadStream('./statics/favicoin.ico').pipe(res.socket);
// 	else next();
// });
// app.use(require('./routers/main.js'));
// app.use(require('./routers/user.js'));


// var videoPath='C:/Users/d/Downloads/a'
// app.use(express.static(videoPath))
// app.get('/a', function(req,res){
// 	var videos=fs.readdirSync(videoPath);
// 	// console.log(videos)
// 	res.render('video',{videos});
// })

// app.get('/demo', function(req,res){
// 	res.render('demo',{a:1,b:2,c:3})
// })

// app.all('/json', (req,res,next)=>{
	
// 	console.log(req.param);
// });

// app.get('/socketio',function(req,res,next){
// 	res.render('socketio');
// });


// req.cookie   可以访问到cookie
// req.query  可以访问到?search
// req.params  可以访问到:key
// app.get(['/db', '/db/:name', '/db/:name/:storeName'], require('./routers/fsdb'));
// app.all(['/fsdb','/fsdb/:name','/fsdb/:name/:storeName'], require('./routers/fsdb'));

const multer=require('multer');
const upload=multer({dest:'uploads'});
app.post('/ajax', upload.single('files'),function(req,res,next){
	// req.file
	let file=req.file;
	if(file){
		console.log(file)
	}else{
		let o={
			method:req.method,
			url:req.url,
			query:req.query,
			cookies:req.cookies,
			body:req.body
		}
		console.log(o);
		res.write(JSON.stringify(o));
	}
	res.end();
});
// app.post('/ajax',upload.array('files',2),function(req,res,next){
// 	// req.files
// 	let files=req.files;
// 	if(files){
// 		let length=files.length, file;
// 		console.log(files)
// 		while(length-- > 0){
// 			file=files[length];
// 			// console.log(file);
// 			fs.rename(file.path, file.destination+'/'+file.originalname, function(err){
// 				console.log(arguments);
// 			});
// 		}
// 	}else{
// 		console.log(req.method, req.query, req.cookies, req.body);
// 	}
// 	res.end();
// });

// app.get('/ajax', function(req,res){
// 	let path=require.resolve('./test/ajax.js');// 返回绝对路径
// 	if(path in require.cache) delete require.cache[path];// 删除缓存
// 	require(path)(req,res);// 路由
// });
app.get('/ajax', function(req,res){
	res.render('ajax');
});


// logger.path=process.stdout;
// app.use(logger);



// var db=require('db');
// require('upload_file')(app, db);

// express 将被放入到http 服务中
// 日后 server.listen()
// 而不是app.listen();

// websocket
// require('./test/wsHttp.js')(server);// Service of webSocket
// app.all('/ws', function(req,res){
// 	let path=require.resolve('./test/ws.js');// 返回绝对路径
// 	delete require.cache[path];
// 	require('./test/ws.js')(req,res);
// });


// socket.io
// require('./test/socketio.js')(server);


server.listen(PORT, function listening() {
	var address = server.address();
	console.log(Date.now(), 'Listening... %s:%d', address.address, address.port );
});


