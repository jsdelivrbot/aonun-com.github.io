onerror = function (m) {
	broadcast('Error', m);
};

let count = 0, s = new Set(), ports;
let handles = {
	exit(port,data){
		for(let p of s) {
			if(p.id===port.id) {
				s.delete(p);
				broadcast(`ID ${port.id} 下线`);
				break;
			}
		}
	},
	numPorts(port, data) {
		port.postMessage({numPorts: s.size});
	},
	click(port,data){
		data.id = port.id;
		broadcast(data);
	}
};

addEventListener('connect', function(e){
// onconnect = function (e) {
	let id = ++count;
	let port = e.ports[0];// ["onmessage", "onmessageerror", "postMessage", "start", "close"]
	port.id = id;
	port.start();
	let send = port.send = function (...args) {
		port.postMessage(args);
	}
	s.add(port);
	broadcast(`ID ${port.id} 上线！`);
	port.postMessage({ type: 'connect', id });

	{
		// Connect Test
		send('has?',typeof Worker);
		send('has?',typeof importScripts);
		
		importScripts('./sw2.js');// function sum(){}
		
		// const name = 'sw';
		send(name);

		send(sum(1,2,3,4));// 只能是可复制对象参数。如port是不可复制对象，放入会出错。

		send(show())

	}

	port.onmessage = function (e) {
		let data = e.data, type=data.type;
		if(type in handles) {
			let f = handles[type];
			f(e.target, data);
		}else{
			broadcast(data);
		}
	};

	port.onmessageerror = function (e) {
		broadcast('messageerror',JSON.stringify(e));
	}
	// // port 是自己connect过来的sharedWorker端口
	port.postMessage({ type: 'connect', id, data: { id } });
	port.postMessage(['size', s.size]);
	port.postMessage({Worker: typeof Worker});

// };
});

addEventListener('close', function (e) {
	broadcast('close', e.target.id);
});


function broadcast(...msg) {
	msg.unshift('Broadcast');

	s.forEach(function (p) {
		try {
			p.postMessage(msg);
		} catch (err) {
			s.delete(p);
		}
	});
}

