let n =/[0-9]/;
let en=/[a-zA-Z]/;
let cn=/[\u4e00-\u9fa5]/
let ko=/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/;// /[ㄱ-ㅎㅏ-ㅣ가-힣]/
let jp=/[\u3040-\u30ff\u31f0-\u31ff]/;
let checkList={n,en,cn,ko,jp};





self.addEventListener('message',e=>{
	let str=e.data, current=0, total=str.length, index, counter={}, char, percent,
		res={n:0, en:0, cn:0, ko:0, jp:0, _:0},
		k,v,o;

	while(current<total) {
		index=current++;
		char=str[index];
		percent=current/total;
		Object.assign(res, { current, total, percent });

		if(n.test(char)) {
			res.n++;
		}else if(en.test(char)){
			res.en++;
		}else if(cn.test(char)){
			res.cn++;
		}else if(ko.test(char)){
			res.ko++;
		}else if(jp.test(char)){
			res.jp++;
		}else{
			res._++;
		}

		if(percent===1) res.done=true;
		self.postMessage(res);
	}
});