let dict = [
	['ba', 'BO'],
	['aa', 'AA'],
	['a', '_'],
	['', '*'],
	// undefined,
	// ' ',
	[' ', '~'],
	['_', '~'],
	['三才', '森次'],
	['三', '参'],
	['\\d+', '[$&]'],
];

let str = '12a a---- 212 ba aa三苹果明白c aaa三才三';


function dictReplacer(str, dict) {
	let regExpArr = dict.filter(e => Array.isArray(e) && (typeof e[0] === 'string' && e[0].length > 0));
	let regExp = new RegExp(regExpArr.map(e => `(${e[0]})`).join('|'), 'g');
	let r = str.replace(regExp, function (m) {
		let v;
		dict.some(e => {
			let b = e[0] === m;
			v = e[1];
			return b;
		})
		console.log(v);
		return v;
	});
	return r;
}
	
	
// console.log(str);
console.log(dictReplacer(str, dict));

let r='abcdea'.replace(/a/g, '[$$&]');console.log(r);
