// const socket = io('http://x', {
// 	port:3001,
// 	path:'/socket'
// });

let datas={
	msgI:'',
	msgO:'',
	id:-1
};

let opts={
	// path:'',
	port:3001,
	reconnection:false,
	reconnectionAttempts:1,
	reconnectionDelay:1000,
	reconnectionDelayMax:5000,
	randomizationFactor:0.5,
	timeout:5000,
	autoConnect:false,
	// ,query,parser
};

let socket=io(location.origin+':'+opts.port, opts);
// let socket=io(location.origin, opts);
// let socket=io('/'+opts.port, opts);

socket.on('connect', onConnect);
socket.on('reconnect', onReconnect);
socket.on('message',onMessage);
socket.on('reconnect_attempt',onReconnectionAttempt);
socket.on('disconnect',onDisconnect);
socket.on('error',onError);


// const socket = io('http://x');
// socket.on('connection', onConnection)
// socket.on('reconnect_attempt', onReconnection);
// socket.on('message',onMessage);

// const broadcast=io('/broadcast', {forceNew:false});
// broadcast.on('connection', onConnection)
// broadcast.on('reconnect_attempt', onReconnection);
// broadcast.on('message',onMessage);

function onConnect(){
	// let token=socket.handshake.query.token;
	// console.log(token);
	// let socket=this;
	datas.id=this.id;
	console.log('connection', this)
}
function onReconnect(socket){
	console.log('reconnect');
	// socket.io.opts.query = {
	//   token: 'reconnectToken'
	// }
}
function onMessage(id,data){
	console.log(id, data);
	addLog(id, data);

}
function onReconnectionAttempt(e){
	console.log('reconnectionAttempt');
	socket.io.autoConnect=false;

}
function onDisconnect(reason){
	console.log('disconnect', reason);
	// 已断开连接
	$('#msgInput').prop('disabled',true);
}
function onError(err){
	console.log('error', err);
	$('#msgInput').prop('disabled',true);
}


// [test]   @click=send
// window.addEventListener('click',function(e){
// 	if(!$(e.target).is('#msgInput')) socket.send({x:e.x,y:e.y});
// 	// console.log('ok');
// });


function addLog(id, msg){
	let u = $('<span>').addClass('id').text(id);
	let m = $('<span>').text(msg).addClass('log');
	let p = $("#msgLogs");
	p.append(u).append(m).scrollTop(p.outerHeight());

	let ms=p.find('.msg'), l=ms.length, max=20;
	if(l>max) ms.slice(0, l-max).remove();
}


$('#msgInput').on('keydown',(e)=>{
	if(e.keyCode===13){
		let v=$('#msgInput').val().trim();
		if(v.length) {
			// socket.emit('message', v);
			socket.send(v);
			e.target.value='';
		}
	}
});


// function noti(msg){
// 	let N=Notification;
// 	if(N){
// 		if(N.permission!=='granted'){
// 			let n=new N('hi');	
// 		}else{
// 			N.requestPermission().then(function(stat){
// 				if(stat==='granted'){
// 					let n=new N('Message', {
// 						body:msg
// 					});
// 					n.onclick=function (){
// 						n.close();
// 					};
// 				}else{
// 					notit(msg);
// 				}
// 			});
// 		}
// 	}else{
// 		notit(msg);
// 	}
// }
function notit(){
	if(notit.i===undefined){
		let t=document.title;
		let i=notit.i=setInterval(()=>{
			document.title = document.title===t ? '🦄️*******' : t;
		},500);
		$(window).one('focus mouseover keydown', ()=>{
			clearInterval(i);
			notit.i=undefined;
			document.title=t;
			$(window).off('focus mouseover keydown', arguments.callee);
		});
	}
}

function joinRoom(){
	console.log('join')
	socket.emit('joinroom');
}


function leaveRoom(){
	socket.emit('leaveroom');
}
