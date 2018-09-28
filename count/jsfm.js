let JSFM = {

	cache: new Map(),

	parseHeaders(headers){
		let limit=':', res=Object.create(null);
		headers.split('\n').forEach(s=>{
			if(s.length) {
				let i=s.indexOf(limit), len=s.length;
				if(i!==-1) {
					res[s.slice(0,i).trim()]=s.slice(i+1).trim();
				}
			}
		});
		return res;
	},

	writeCache(url, code){
		let file=new Blob([code], {type:'text/javascript'});
		let objectURL=URL.createObjectURL(file);
		let res={code, file, objectURL};
		JSFM.cache.set(url, res);
		return res;
	},


	loadFile(url, callback){
		let hasCallback = typeof callback==='function';

		if(JSFM.cache.has(url)) {
			let code=JSFM.cache.get(url);
			return hasCallback ? callback(code) : Promise.resolve(code);
		}

		let p = new Promise((resolve, reject)=>{
			let req=new XMLHttpRequest();
			req.open('GET',url,true);
			// req.setRequestHeader('Content-Type','application/javascript');
			req.addEventListener('readystatechange',e=>{
				let t=e.target,
					rs=t.readyState,
					s =t.status,
					r =t.response,
					rt=t.responseType;

				// if(rs===4) {
				// 	if(s>=200 && s<400) {

				// 		JSFM.cache.set(url, r);
				// 		if(typeof callback==='function') callback(null, r);
				// 		else resolve(r);
				// 	}else{
				// 		if(typeof callback==='function') callback({id:s, message:t.statusText}, null);
				// 		else reject(r);
				// 	}
				// }

				if(rs===4){
					let headers=JSFM.parseHeaders(req.getAllResponseHeaders());
					// console.log(headers);
					if(/\bjavascript\b/.test(headers['content-type'])){
						JSFM.writeCache(url, r);

						if(typeof callback==='function') callback(null, r);
						else resolve(r);
					}else{
						if(typeof callback==='function') callback({id:s, message:t.statusText}, null);
						else reject(r);
					}
				}
				// console.log(e.type, s/*e.target.status*/, rs /*e.target.readyState*/);
			});

			req.addEventListener('error',e=>{
				console.log(e.type, e)
				if(typeof callback==='function') callback(e, null);
				else reject(e)
			});

			req.send();
		});

		return hasCallback ? undefined: p;
	},

	get: k=>{
		return JSFM.cache.get(k);
	},

	has(url) {
		return JSFM.cache.has(url);
	}

}