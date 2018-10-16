const fs=require('fs');

let s=fs.readFileSync('cedict_ts.u8.txt','utf8').trim();

function convertDictionary(str){
	let res;
	if(str.length>3&&str.indexOf(' ')){
		res=str.split('\n').map(e=>{
			let pair=e.split(' ').filter(e=>e);
			let s,t;
			s=pair[0];
			t=pair[1];
			return s&&t ? [s,t] :null;
		}).filter(e=>e);
	}else{
		res=[];
	}
	return res;
}

function dictionarySort(arr) {
	arr.sort((a,b)=>{
		let al=a[0].length, bl=b[0].length;
		return al>bl ? -1 : (al<bl? 1 : (a[0]>b[0]?-1:(a[0]<b[0]?1:0)));
	});
	return arr;
}


let a=convertDictionary(s);
console.log(a)
a=a.map(e=>e.reverse());

dictionarySort(a);


// require('fs').writeFileSync('d:/jianfan.txt', JSON.stringify(a,'\n',0))

require('fs').writeFileSync('public.txt', a.map(e=>e.join('\t')).join('\n'));

// console.log(a.slice(0,10));

