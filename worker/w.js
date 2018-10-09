let _a = `variable _a in "w.js"`;

// console.log('run', location.href);// 不同于 sharedWorker， 在这里可以使用console.log函数。
// console.log(self.location===location, self===this);

self.onclose=function(e){
	postMessage(location.href, 'close');
}

self.onmessage=function(e){
	console.log(location.href, 'w.message', e.data);
}


self.onerror=function(e){
	console.log(location.href, 'w.error', e.message);
}

postMessage('from w message');

importScripts('w2.js');

_a=`variable _a to changed`;


