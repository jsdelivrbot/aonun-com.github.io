let id = 0;
let ports = new Set();

this.onconnect = function (event) {
	id++;

	let port = event.ports[0];
	port.o=Object.create(null);
	port.o.id=id;
	port.o.upline=Date.now();
	// port.start();
	port.postMessage({set:port.o});
	broadcast({checkUnique:id});
	
	ports.add(port);
}

function broadcast(o,p){
	// if(p) p.postMessage({message:'me'});
	ports.forEach((port)=>{
		if(p && p===port) return ;
		port.postMessage(o);
	});
}
