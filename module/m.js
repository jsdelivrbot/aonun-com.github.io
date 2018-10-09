const _A = {
	name:'m.A',
	createTime:Date.now(),
	say:function(){
		alert('is module '+this.name);
	}
};

function _f(){}
// export function f(){
// 	console.log('m.f()');
// }

export {_A as A, _f as f}

