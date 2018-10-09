let _a='w variable a';

// console.log(self.location===location, self===this);

console.log('run', location.href)

onclose=function(e){
	postMessage(location.href, 'close');
}

onmessage=function(e){
	console.log(location.href, 'w.message', e.data);
}


onerror=function(e){
	console.log(location.href, 'w.error', e.message);
}

postMessage('from w message');

importScripts('w2.js');

_a='changed'