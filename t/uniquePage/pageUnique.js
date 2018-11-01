let sw = new SharedWorker('sharedWorker.js');
let port = sw.port;

port.o = Object.create(null);
// port.start();

port.send = function (message) {
	port.postMessage({ message });
};

port.onmessage = function (e) {
	let data = e.data;

	// sharedWorker会发来一个checkUnique, 如果该值与
	if (data.checkUnique) {

		let result = port.o.id !== data.checkUnique;

		
		if (result) {
			document.getElementById('message').innerText=`认证结果: 2秒后关闭`;
			setTimeout(e=>{
				location.replace('about:blank');
			},2000);
		}else{
			document.getElementById('message').innerText=`认证结果: 保持现状`;
		}
	}

	if (data.set) {
		Object.assign(port.o, data.set);
		document.getElementById('message').innerText=`获得了ID: ${port.o.id} (${port.o.upline})`;
	}
};

port.onerror = port.onmessageerror = function (e) {
	console.error(e);
};

