// addEventListener('connect', function(e){
// 	let port = e.ports[0];
// 	port.start();

// 	port.postMessage('sw2.js');
// });

function show(){
	return Object.keys(this);
}

var name = 'sw2';

function f(){
	this.postMessage(arguments);
}

function sum(...args) {
	return args.reduce(function(r,e){
		return r+e;
	});
}