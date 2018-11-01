{
	let s='화재가 발생하였습니다. 3급전사 획득. 지진\\n 1.2강도. Lv.10 미션.{\\r\\n}';

	console.log(splitLongSource(s));
}


function splitLongSource(s){
	let r=/(?!\d)\s*(\.|\?)\s*(?!\d)|{\\r\\n}|\\n/g;
	let a1=s.split(r);
	let l1=a1.length;
	if(l1<2) return false;
	let a2=s.match(r);
	let l2=a2.length;
	let a=[];
	let len=Math.max(l1,l2);
	let i=0;
	while(i<len){
		let v1=a1[i], v2=a2[i]||'', chunk;
		if(v2.indexOf('.')===-1){
			chunk=[v1,v2];
		}else{
			chunk=[v1+v2];
		}
		a=a.concat(chunk);
		i++;
	}
	a=a.filter(e=>e.length>0);
	return a;
}