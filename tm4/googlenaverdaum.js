function google(v,t,f){
	return $.ajax({
			url:'http://tm3.aonun.com/net/google/',
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
			url:'http://tm3.aonun.com/net/naver/',
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
			url:'http://tm3.aonun.com/net/daum/',
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
