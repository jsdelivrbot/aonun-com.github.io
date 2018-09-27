function google(v,t,f){
	return $.ajax({
			url:'http://ftp.aonun.com/net/google/',
			dataType:'json',
			data: {
				q:v,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'POST'
		}).done(function (o){
			if(typeof f==='function') f(o);
		});
}
function naver(v,t,f){
	return $.ajax({
			url:'http://ftp.aonun.com/net/naver/',
			dataType:'json',
			data: {
				q:v,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'POST'
		}).done(function (o){
			if(typeof f==='function') f(o);
		});
}
function daum(v,t,f){
	return $.ajax({
			url:'http://ftp.aonun.com/net/daum/',
			dataType:'json',
			data: {
				q:v,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'POST'
		}).done(function (o){
			if(typeof f==='function') f(o);
		});
}
