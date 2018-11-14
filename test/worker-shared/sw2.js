try{
	// port.postMessage('多次调用sw2.js >> count:');
	broadcast('sw2.js 실행하였습니다.'+port.id);
	// broadcast(Object.getOwnPropertyNames(this).join());
	// broadcast(Object.getOwnPropertyNames(this.__proto__).join());
}catch(err){
	port.postMessage(err.stack);
}


// 用户sw测试调用，结果可用。
function f(){
	broadcast('f()');
	// console.log('ok');// 不知道被送到哪里了。
}