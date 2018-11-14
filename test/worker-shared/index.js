console.warn('index.js - v4');
let sw, port, info = { el: '#swInfo', data: { id: -1 } }, v, url;

url = 'sw.js';
// url = 'sw.js?t='+Date.now();

v = new Vue(info);

sw = new SharedWorker(url);
sw.onerror = function (e) {
	log('no connect');
};

port = sw.port;
// port.start();// 如果使用addEventListener()，那就需要使用start()函数。

let handles = {
	connected: false,
	connect(e) {
		if (!this.connected && e.data && e.data.type && e.data.type === 'connect') {
			this.connected = true;
			v.id = port.id = e.data.id;
			console.warn('connect id:', e.data.id, this.connected);
		}
	}
}

port.onmessage = function (e) {
	handles.connect(e);
	console.warn(e.data);
	document.body.append(JSON.stringify(e.data)+'\n');
};

port.addEventListener('errormessage', function (e) {
	console.log(e);
	document.body.append(JSON.stringify(e.data)+'\n');
});

port.addEventListener('error', function (e) {
	console.log(e)
	document.body.append(JSON.stringify(e.data)+'\n');
});

port.addEventListener('change', function (e) {
	console.log(e)
	document.body.append(JSON.stringify(e.data)+'\n');
});

port.addEventListener('close', function (e) {
	console.log(e)
	document.body.append(JSON.stringify(e.data)+'\n');
});

window.addEventListener('mousedown', function (e) {
	if(e.which===1){// 左键
		let { x, y } = e;
		port.postMessage({ type: 'click', pointer: { x, y }, id:port.id });
	}else {// 中键|右键
		port.postMessage({ type: 'numPorts' });
	}
	
});
window.addEventListener('contextmenu', function (e) {
	e.preventDefault();
});
window.addEventListener('beforeunload', function (e) {
	// 页面关闭前，发送退出信息。
	port.postMessage({ type: 'exit', from: v.id });
});

function log(...args) {
	let id = args[0];
	let data = args[1];
	console.log(args);
	document.querySelector('.ui.log').prepend(`shared worker ${id} : ${data}\n\n`);
}