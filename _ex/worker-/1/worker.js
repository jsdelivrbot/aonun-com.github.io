importScripts('module.js');

let w=this;
let i=0;

w.addEventListener('message', function(e){
	let data=e.data;
	console.log('worker.onmessage:', data);// MessageEvent

	if(Number.isInteger(data.interval)){
		setInterval(function(){
			w.postMessage(++i);
		},100);
	}
	
	// console.log('worker.origin', w.origin);// 好像无法跨域
});

postMessage('WORKER: hi, main~!');
// setTimeout(function(){
// 	console.log('worker.close()');
// 	w.close();// 结束自己进程
// },100);





