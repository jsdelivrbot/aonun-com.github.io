let socketio=require('socket.io');

let port = 3001;
let opt={
	// path:'/',
	serveClient:false,
	pingInterval:120000,
	pingTimeout:5000,
	cookie:false,
};

let server=new socketio(port, opt);

// let redis = require('socket.io-redis');
// server.adapter(redis({ host:'localhost', port:port }));


// let domainRegExp=/^http(s?):\/\/(\w+\.)*x$/;

// server.origins(['http://x', 'http://localhost']);
server.origins((origin,callback)=>{
	console.log(origin);
	let re = /^http(s?):\/\/(x|localhost|\d+\.\d+\.\d+\.\d+)$/;
	let message = null;
	let isSuccess = re.test(origin);
	callback(null, isSuccess);
});

let clientCount = 0;
server.engine.generateId = function generateId(req){
  return 'u-'+(++clientCount);
};

/*
server.attach(httpServer[, options])
server.attach(port[, options])
server.listen(httpServer[, options])
server.listen(port[, options])
*/

// 侦听Namespace
// server.of( nsp:(String|RegExp|Function) ):Namespace
let root = server.of('/');

// connect --> connection -->

root.on('connect', (socket) => {
	console.log('root connect', socket.id);
	server.of('/').send(socket.id,' has come in');
});

root.on('connection', (socket) => {
	let id = socket.id;
  
	let handshake = socket.handshake;
	console.log('root connection', id);
	// console.log('handshake', handshake);// {issued, url, query,time,headers}

	socket.on('connect',()=>console.log('close'));
	socket.on('message',(data)=>console.log('message',data));
	socket.on('message',(data)=>{
		root.send(socket.id, data);
	});
	socket.on('disconnect',(reason)=>console.log('disconnect',reason));
	socket.on('disconnecting',(reason)=>console.log('disconnecting',reason));
	socket.on('error',(err)=>console.log('error'));

	socket.send('('+socket.id+'  has come in)');

	socket.on('joinroom',()=>{
		socket.join('/room', ()=>{
			console.log('join', Object.keys(socket.rooms));
			socket.broadcast.send('skt leave-'+socket.id);
		});
	});
	socket.on('leaveroom',()=>{
		socket.leave('/room',()=>{
			console.log('leave', Object.keys(socket.rooms))
			socket.broadcast.send('skt leave-'+socket.id);
		});
	})

	// socket.client
	// socket.conn
	// socket.request
	// socket.handshake
	// use(), send(), emit(),
	// on(), once(), eventNames(), removeListener(), removeAllListeners()
	// join(room|rooms,ack), leave(room,ack), to(room) == in(room), 
	// socket.compress(true).send()
	// socket.disconnect(close)
	// socket.broadcast.send()   // 广播给所有人，但除了自己
});


// root命名空间侦听message
root.on('message', (data)=>{
	console.log(data);
	if(typeof data==='object') {
		root.to(data.x).send('ok');
	}
	server.of('/broadcast').send(data);
});


function startInterval(s){
	setInterval(function(){
		server.to('/room').send('room push');

		server.of('/room').clients(function(r,c){
			console.log(c);
			if(c.length) {
				console.log(typeof c[0]);
			}
		});

		console.log(server.to('/room').rooms);
	},s*1000);
}


// 	server.binary(false).send('disabld binary');
// 	server.volatile.send('volatile');
// 	server.local.send('local')



// root.clients(function(error,clients){})
// root.in('general').clients(function(error,clients){})
// server.clients(function(error,clients){})   nsp==='/'
// server.use((socket,next)=>{})

// 


// xxxxxxxxxxxxx
// server.on('message', function(data){
// 	console.log('sm', data);

// });



// setInterval(function(){
// 	let o=server.nsps, k, v;
// 	for(k in o){
// 		v=o[k];
// 		console.log(k, v.rooms, v.flags);
// 	}
// },1000);



// setTimeout(()=>{
// 	server.binary(false).send('disabld binary');
// 	server.volatile.send('volatile');
// 	server.local.send('local')
// },5000);

// let volatileCount=0
// setInterval(()=>{
// 	server.volatile.send('volatile'+(++volatileCount));
// },1000);
