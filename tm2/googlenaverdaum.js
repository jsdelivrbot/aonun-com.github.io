function google(q,t,f){
	return $.ajax({
			url:'http://zun.aonun.com/tm/google/',
			dataType:'json',
			data: {
				q:q,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'GET'
		}).done(function (o){
			f(o.error, o.result);
			console.log(o);
		});
}
function naver(q,t,f){
	return $.ajax({
			url:'http://zun.aonun.com/tm/naver/',
			dataType:'json',
			data: {
				q:q,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'GET'
		}).done(function (o){
			f(o.error, o.result);
		});
}
function daum(q,t,f){
	return $.ajax({
			url:'http://zun.aonun.com/tm/daum/',
			dataType:'json',
			data: {
				q:q,
				s:'auto',
				t:t||'zh-CN'
			},
			method:'GET'
		}).done(function (o){
			f(o.error, o.result);
		});
}
