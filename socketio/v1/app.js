// 前言
// process.on('uncaughtException',(e)=>console.log(e));
// 导入准备
const SocketIO=require('socket.io');


// 创建服务器参数
let port='3900';
let option={
  path:'/cn-1',// 捕获路径名
  serveClient:false,// 客户端文件
  // adapter:undefined,// 适配器(socket.io-adapter)
  // origins:'*',// 来源域名
  // origins:['http://d','http://localhost','http://aonun.com','http://cihot.com'],// 来源域名
  // parser:undefined,// 解析器(socket.io-parser)
  // pingTimeout:1e3,// 超时5000ms向客户端发送ping
  // pingTimeout:1e7,// 超时5000ms向客户端发送ping
  pingInterval:3e5,// ping重新发送等待时间25000ms
  pingInterval:6e6,// ping重新发送等待时间25000ms
  // upgradeTimeout:10000,// 升级超时时间10000ms
  // maxHttpBufferSize:10e7,// 关闭会话前字节数
  // allowRequest:undefined,// 握手升级
  // transports:['polling','websocket'],// 依次升级传输方式(可退回)
  // transports:['websocket'],
  // allowUpgrades:true,// 允许升级
  // perMessageDeflate:true,// 
  // httpCompression:true,// 采用压缩方式
  cookie:false,// 客户端生成cookie,默认名称'io'
  // cookiePath:'/',//cookie路径
  // cookieHttpOnly:true,
  // wsEngine:ws,// 也可以用uws
}



let io, server;
// io 通常是socket.io的实例
// server 通常时httpServer的实例

// 创建服务 I
// server=require('http').createServer();
// io=SocketIO();
// io.attach(server,option);
// server.listen(3900);

// 创建服务 II
// io=SocketIO();
// io.attach(port,option);

// 创建服务 II
// server=require('http').createServer();
// io=SocketIO(server,option);
// server.liten(port);

// 创建服务 III
// io=SocketIO(port,?option);
io=new SocketIO(port, option);

// 关闭服务
// io.close(()=>{});



let sockets;
// 所有连接,默认namespace为'/'

sockets=io.sockets;
// console.log(io.sockets===io.of('/'));// true


// sockets.emit('hi','sockets-hi');// 向所有连接发送事件hi和数据everyone
// io.emit('hi','io-hi')

// id客户端
let num=0;
io.engine.generateId=(req)=>{
  return 'i'+(++num);
};



// 客户端连接仲裁 I
// io.use((socket,next)=>{
//   // socket 客户端
//   // socket.handshake// {headers,time,address,xdomain,secure,issued,url,query}
//   let query=socket.handshake.query;
//   let token=query.token;
//   // console.log(socket.handshake.address, socket.handshake.time);// ip地址
//   if(token!=='abc') return next(new Error('token error'));
//   next();// 允许访问
// });

// 客户端连接仲裁 II
// io.origins((origin, callback) => {
//   console.log(origin);
//   if (origin !== 'http://d') {
//     return callback('origin not allowed', false);
//   }
//   callback(null, true);// (errorMessage, accessAllowed)
// });

// 客户端连接仲裁 III
// io.origins(['http://d']);

// 侦听连接
sockets.on('connect', (socket)=>{
  console.log('io@connect','检测到客户端连接...',socket.nsp.name,socket.id,socket.handshake.query.token);
});

io.on('connection', (socket)=>{
  // console.log('io@connection',socket.nsp.name, socket.id);
  let token=socket.handshake.query.token;
  
  // 内置事件,响应send()函数和emit('message')函数
  socket.on('message',(...a)=>{
    a=Array.from(a);
    socket.broadcast.send(socket.id,...a);// 其他所有人聊天(不包括自己)
    // console.log('s@message', Object.keys(socket.rooms), a);
  });
  socket.on('broadcast',(...a)=>{
    sockets.send(socket.id,...a);// 所有人聊天(包括自己)
  });

  // 自定事件:进入房间
  socket.on('join',(name)=>{
    socket.join(name,()=>{
      // let _rooms=Object.values(socket.rooms);
      // let r=`*SOCKET(${socket.id})(${socket.nsp.name}) join ${name}!  *ROOMS(${_rooms.join()})`;
      // socket.emit('message', r);
      console.log(socket.id,'join',name,'-->rooms:', Object.values(socket.rooms));
    });
  });

  socket.on('leave',(name)=>{
    socket.leave(name,()=>{
      console.log(socket.id, 'leave', name, '-->rooms:', Object.values(socket.rooms));
    });
  });

  socket.on('rooms',(...a)=>{
    let rooms=Object.values(socket.rooms);
    console.log(socket.nsp.name, rooms, ...a);
    // socket.emit('message', 's@rooms', socket.nsp.name, rooms);
  });

  socket.on('room',(m)=>{
    console.log('s@room',m);
    io.of(m).to(m).send('hi,'+m);
  });

  socket.on('to',(room,...a)=>{
    console.log('s@to',...a);
    // io.to(room).emit('message',`io.to(${room})`,...a);// 在room广播
    socket.to(room).emit('message',`socket.to(${room})`,...a);// 在room聊天(不包含自己)
  });




  socket.on('n',(name)=>{
    socket.nsp.name=name;
    io.of(name).on('message',(m)=>console.log('n', name, m));
    console.log('nsp.name', socket.nsp.name);
  });

  socket.on('m',(name,m)=>{
    io.of(name).send(m);
    io.of(name).emit('message',m);
    console.log(io.of(name).name, name,m);
  });

  socket.on('disconnect',(reason)=>{
    console.log('人数:',Object.keys(io.sockets.connected));
  });

  // socket 内置事件 3ea
  socket.on('disconnecting',(reason)=>console.log('s@disconnecting',reason));
  socket.on('disconnect',(reason)=>console.log('s@disconnect',reason));
  socket.on('error',(reason)=>console.log('s@error',err));

  // 每次有新人广播
  // io.emit('message',socket.id+'上线了');
  // sockets.emit('message',socket.id+'上线了');

  io.clients((error,clients)=>console.log(error||clients));
});



// 用不到!
io.of('/ko').on('connect', (socket)=>{
  console.log('nsp.connect',socket.nsp.name);
  // socket.nsp.emit('message',socket.nsp.name);
});

console.log(io)


// io.onconnection(socket)





// 命名空间 <Namespace>
// {
  // name,
  // connected,
  // adapter,
  // to(room)|in(room),
  // emit(eventName,...args),
  // clients(fn(err,cs)),
  // use(fn(socket,enxt)),
// }
// events: connect, connection, 

// io.of(/.+/)
io.of('/').on('message', (m)=>console.log(m))
io.of('/').on('hi', (m)=>console.log(m))
io.of('/socket.io').on('message', (m)=>console.log('/socket.io',m))
// io.of(/^room-\d+$/).on('connect',(socket)=>{
//   console.log('connect',socket.nsp.name);
// });

// io.of((nspName,query,next)=>{
//   next(null,true);
//   console.log(nspName,query)
//   next();
// }).on('connect',(socket)=>{
//   console.log('connect','*',socket.nsp.name);
// });



// 配置
// io.serveClient(false);
// io.origins(['https://foo.example.com:443']);
// io.origins((origin, callback) => {
//   if (origin !== 'https://foo.example.com') {
//     return callback('origin not allowed', false);
//   }
//   callback(null, true);
// });

// io.volatile.emit('an event', { some: 'data' });// 客户端可能未准备好,没收到
// io.binary(false).emit('an event', { some: 'data' });// 明示无二进制,提高性能
// io.local.emit('an event', { some: 'data' });// 针对Redis适配器




// Socket
{
  // id,
  // rooms,
  // client,
  // conn,
  // request,
  // handshake,
  // use(fn(socket)),
  // send(...?args,?ack),
  // emit(eventName,...?args,?ack),
  // on(eventName,fn(..args)),
  // once(eventName,fn(..args)),
  // removeListener(eventName,fn),
  // removeAllListener(eventName),
  // eventNames()
  // join(rooms,?fn),
  // leave(room,?fn),
  // to(room)|in(room)
  // compress(false) // 压缩,
  // disconnect(true) // 关闭socket
  // broadcast.emit() // 广播
  // volatile.emit() // 客户端有可能收不到
  // binary(false).emit() //  明示不用二进制,提高效率
}
// events: connection(socket), disconnect(reason), onerror(err), disconnecting(reason)


// <Client>
{
  // conn,// Socket
  // request
}



// https 443
// server-side
// const fs = require('fs');
// const server = require('https').createServer({
//   key: fs.readFileSync('server-key.pem'),
//   cert: fs.readFileSync('server-cert.pem')
// });
// const io = require('socket.io')(server);
// server.listen(3000);

// // client-side
// const socket = io({
//   // option 1
//   ca: fs.readFileSync('server-cert.pem'),

//   // option 2. WARNING: it leaves you vulnerable to MITM attacks!
//   rejectUnauthorized: false
// });