onclose=function(e){
	console.log('w2.clsoe');
	// postMessage('w2.clsoe', e.filename);
}

onmessage=function(e){
	console.log('w2.message', e.data);
}


onerror=function(e){
	console.log('w2.error', e.message);
}

onconnect=function(sw){
	console.log('w2 sw', sw);
	console.log('w2 ports', sw.ports)
	let port = sw.ports[0];

	port.onmessage=function(e){
		console.log('w2 port message', e)
	}

	port.start();
}



console.log(typeof _a, _a);

setTimeout(function(){
	console.log(_a);
	close();
}, 1000);

postMessage('from w2 message');


