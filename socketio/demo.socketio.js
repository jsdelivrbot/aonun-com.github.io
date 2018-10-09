'use strict';

const SocketIO=require('socket.io');// Server

let socketCount=0;

module.exports=function(httpServer) {
	// @server 是 http.createServer()

	/*
	创建sever实例
	server=new SocketIO();

	server=SocketIO(httpServer, {
		path:'/test',
		serveClient:false,
		pingInterval:10000,
		pingTimeout:5000,
		cookie:false
	});
	server.listen(3000);

	server=SocketIO(3000,{
		path:'/test',
		serveClient:false,
		pingInterval:10000,
		pingTimeout:5000,
		cookie:false
	});

	server=new SocketIO({
		path:'/test',
		serveClient:false
	});
	server.attach(3000,{
		pingInterval:10000,
		pingTimeout:5000,
		cookie:false
	});
	*/
	// 被传递到engine.io。配置参数也可以在上面阶段直接输入。
	let opt={
		path : '/tm4-chat',// 要捕获的路径名称(/socket.io)
		origins : ['x:80'],// 允许的域名端口 '*:*'
		serveClient : false,// 是否提供客户端文件
		pingInterval : 60000,// 超过该毫秒的ping pong间隔则考虑关闭连接(60000)
		pingTimeout : 25000,// 发送新的ping数据包间隔(25000)
		// transports:['polling','websocket'],// 允许连接的类型
		cookie:false
	};


	// 创建 SocketIO 服务器实例
	// new SocketIO 与 SocketIO() 效果一样
	// let server=SocketIO(opt);// 创建时可加入参数
	let server=SocketIO();// 日后 attach | listen 时可以补充参数
	
	
	// 以下设置, 必须在 server.attach() 执行前设置
	// server.path(path);// 创建时漏掉了设置，补充
	// server.serveClient(false);
	// server.adapter(require('socket.io-redis')({host:'localhost',port:80}));// socket.io 适配器

	// 访问限制
	// server.origins(['aonun.com','aonun.com:433']);// 默认允许任何来源
	// server.origins(function(origin,callback){ if(origin!=='http://x/io'){ return callback('No access',false); } callback(null,true); });


	// 开启服务, 端口侦听
	// server.attach(server, opt);// 别名 server.listen(server, opt);// 用httpServer开启服务
	// server.attach(port, opt);// 别名 server.listen(port, opt);// 如果没有server，可以直接创建并侦听新server。
	server.attach(httpServer, opt);
	// server.attach(80, opt);

	// server.sockets
	// server.of(namespace);// server.of('/') === server.sockets; 默认命名空间/
	// server.close(function(){});// 关闭socketIO实例，所有连接关闭时调用回调函数(可选)。
	server.engine.generateId=function(req){
		return 'u'+(++socketCount);
	};// 生成自定义套接字标识的函数，第一个参数必须是请求对象http.IncomingMessage实例。
	// server.to('room 123', '通知该房间所有人，有新用户加入了该房间！');


	// 高级使用
	// server.bind(new EngineIO);// 高级应用，绑定到其他引擎上。
	// server.onconnection(new engine.Socket);// 高级应用，从SocketIO传入EngineIO，返回Server。
	

	// 切换命名空间(namespace) nps
	let nsp;
	// nsp=server.of('/ex/require');// 获取初始化或已被初始化的命名空间
	// Namespace{name:'/io', server, sockets:{}, connected:{}, fns:[], ids:0, roms:[],flags:{}}
	// nsp.name==='/io';// 名称空间标识符属性
	// nsp.connected==={};// socket连接
	// nsp.adapter===Adapter{nps,roms,sids,encoder};// 当前命名空间适配器
	// nsp.to('room_1').emit('event', {some:'data'});// 别名 nsp.in('room_1')
	// nsp.emit(eventName,...args);
	// nsp.use((socket,next)=>{ next(err) });// next()传递err时将会中断连接
	// server.of('/').adapter;// 主命名空间的适配器
	// nsp.clients(function(err,cs){console.log(cs); });

	// 向所有连接中的客户端发出事件
	// server.emit('main namespace');// 别名 n.emit('main namespace')
	// console.log(nsp.name, nsp.connected, nsp.adapter);

	/*
	server.sockets === server.of('/')  反馈Namespace
	*/

	// 官方事件 connect, connection 一样？套接字与客户端连接
	nsp=server.of('/');
	nsp.on('connect',function(s){
		// @s  client socket
		// s.id
		// s.rooms     房间列表用 Object.keys(s.rooms) 获取
		// s.client
		// s.conn    对底层Client传输连接（engine.io Socket对象）的引用。这允许访问IO传输层，它仍然（大部分）抽象出实际的TCP / IP套接字。
		// s.request   一个getter代理，用于将引用返回给request源自底层engine.io的引用Client。用于访问诸如Cookieor的请求标头User-Agent。
		// s.handshake      握手细节，用于 server.use( (socket,next)=>{ socket.handshake } )
		// s.use((packet,next){})   中间件，可以为每个入站接收packet进行检查，并延迟处理。
		// s.send(...args, ack)
		// s.emit(eventName, ...args, function acknowledgement(data){})
		// s.on(eventName,callback)
		// s.once(eventName,callback)
		// s.removeListener(eventName,callback)
		// s.removeListeners(eventName)
		// s.eventNames()
		// s.join('room 123', callback(err)=>{})    进入房间  server.to('room 123', s.id+'进入了房间')
		// s.leave('room 123', callback(err)=>{})   离开房间
		// s.to('room 123').to('room 456').emit('hi')   可向room或id发送事件(自身除外)
		// s.in('room 123')   同上
		// s.compress(true).emit()   压缩发送
		// s.disconnect(true)   是否关闭底层连接
		// s.broadcast.emit()   广播(自身除外)
		// s.volatile.emit()   客户可能收不到该信息

		nsp.emit('[connect]',s.id);
		console.log('[connect]',s.id);
		// s.broadcast.emit('message','connection: '+s.id);// 广播

		// 官方事件  error, connect, disconnecting, newListener, removeListener
		s.on('error',function(err){
			console.log('[error]'+s.id+' '+err.message);
		});
		s.on('disconnect',function(reason){
			console.log('[disconnect]'+s.id+' '+reason);// transport error
		});
		s.on('broadcast',function(){
			var msg={
				type:'broadcast',
				namespace:s.nsp.name,
				sid: s.id,
				message:arguments
			};
			console.log(msg);
			nsp.emit(msg);
			// server.of('/').broadcast.send(msg);
			// s.broadcast.send(msg);
			// s.broadcast.emit('message',msg);
		});
		// 自定义事件
		s.on('message',function(...args){
			var a=Array(args), i=a.length;
			a[i]='normal';
			server.emit('message',a);// 广播
			a[i]='volatile';
			server.volatile.emit('message',a);// 未能被发送
			a[i]='local';
			server.local.emit('message',a);
		});
		s.on('eval',function(code){
			try{
				eval(code);
			}catch(err){
				console.log('[Error]',err.message);
			}
		});
		s.on('sockets',function(){
			(function(){
				var o=server.of('/').connected;
				var i;
				var s;
				for(i in o){
					s=o[i];
					console.log(s.id, s.connected);
				}
			})();
		});


	});

	// 新建命名空间并侦听
	nsp = server.of('/ex/require/');
	nsp.on('connect',function(s){
		let msg={type:'connect',sid:s.id};

		console.log(msg);
		nsp.emit('message',msg);// 广播

		// 官方默认事件 message
		// 可以理解为客户端与服务端的数据通道
		// 客户端---服务端(双向通讯)
		// clientSocket.send(msg) --- serverSocket.send(msg)
		// clientSocket.emit('message',msg) --- serverSocket.send('message',msg)
		s.on('message',function(m){
			let msg={
				type:'message',
				sid:s.id,
				data:arguments
			};
			console.log(msg);
			s.send(msg);
			// s.send(data)  or  s.emit('message',data)  给自己发送
		});

		// 自定义事件 broadcast
		// clientSocket.emit('message',msg) --- namespace.emit('message',msg)
		// 通过 server.of(name) 可以获取到 namespace 实例
		// server可以虽然Server实例,但可以视为 server.of('/') 命名空间
		// 要注意的是, server和socket都有 send() 函数,但命名空间没有
		// emit('message', msg) 等于 send(msg)
		s.on('broadcast',function(){
			var msg={
				type:'broadcast',
				namespace:s.nsp.name,
				sid: s.id,
				message:arguments
			};
			console.log(msg);
			// server.broadcast.send(msg);
			// s.broadcast.send(msg);// 不含自己
			// s.broadcast.emit('message',msg);// 不含自己
			nsp.emit('message',msg);// 向命名空间发送消息,所以包括自己
		});
		s.on('room',function(name,joinLeave,msg){
			console.log(name,joinLeave,msg);
			s[joinLeave?'join':'leave'](name);
			if(joinLeave) server.of('/ex/require').to(name).send(arguments);// 向命名空间发送消息,所以包括自己
		});
		s.on('eval',function(code){
			try{
				eval(code);
			}catch(err){
				console.log('[Error]',err.message);
			}
		});
	});
	console.log('server.nsps');
	for(var k in server.nsps){
		console.log('\t'+k);
	}

	server.on('connect',function(s){
		console.log('[server connect]', s.id);
	})

}

// server.to(room).send(msg)   向房间所有人发送信息
// s.to(room).send(msg)   向房间除自己的所有人发送信息
// server.of(namespace).send(msg)   向命名空间的所有人发送信息
// server.of(namespace).to(room).send(msg)   向命名空间的所有人发送信息

