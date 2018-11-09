if (typeof DedicatedWorkerGlobalScope) {
	postMessage('log.js -> parent');
	onmessage = e=>{
		console.log(e.data);
	}
}
console.warn('log',Date.now());