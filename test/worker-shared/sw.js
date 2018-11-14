let count=0, s=new Set(), ports, port;

addEventListener('connect',function(e) {
	try{

	let id;

	port=e.ports[0];

	port.start();

	s.add(port);

	id = ++count;

	// // port 是自己connect过来的sharedWorker端口
	port.postMessage( {type:'connect', id , data:{id}});

	// 广播
	port.addEventListener('message', function(e) {
		try{
			let type, data, msg;
			
			type=e.data.type;
			data=e.data.data;

			if(type==='click') {
				return broadcast({type:'message', id, data:'im click' });

			}
			else if(type==='wheel') {
				// return broadcast({type:'message', id, data:'im click' });
				importScripts('sw2.js');
				f();
			}
		}catch(err){
			broadcast(err.stack);
		}

		if(type==='throwError'){
			broadcast(1);
			// broadcast({type:'message', data:'throw'+type});
			// throw new Error('throwError');
		}
		broadcast(1);
    });

   

	}catch(err){
		e.ports[0].postMessage(err.stack);
	}	
});


function broadcast(msg) {
	try{
		s.forEach(port=>port.postMessage(msg));
	}catch(err){
		s.forEach(port=>port.postMessage(err.stack));
	}
}