class DictReplacer {

	constructor(dict) {
		// [ {source, target}, ... ]
		this.init(dict);
	}

	init(dict) {
		this.dict(dict);
	}

	dict(dict, sort = true, filter = true) {
		if (!Array.isArray(dict)) return this.dict = [], this.length = 0;

		if (filter) dict = dict.filter((e) => {
			return Array.isArray(e) && typeof e[0] === 'string' && e[0].length > 0;
		});
		if (sort) dict.sort((a, b) => {
			let la = a[0].length;
			let lb = b[0].length;
			if (la === lb) {
				if (a === b) {
					return 0;
				} else if (a > b) {
					return -1;
				} else {
					return 1;
				}
			} else if (la > lb) {
				return -1;
			} else {
				return 1;
			}
		});
		this.dict = dict;
		this.length = dict.length;
	}

	encode(str) {
		let result = '', dict = this.dict, dictLength = this.length,
			strIndex, strIndexOld, e, b, row;

		while (true) {
			for (let i = 0; i < dictLength; i++) {
				row = dict[i];
				strIndex = str.indexOf(row[0]);
				b = strIndex !== -1;
				if (b) {
					if (strIndexOld !== strIndex) {
						e = row;
						strIndexOld = strIndex;
					}
				}
				if (strIndexOld === 0) break;
				if(row[0]==='12') console.log(strIndex, strIndexOld, str);
				
			}
			if (b) {
				if (strIndexOld !== 0) {
					result += str.slice(0, strIndexOld);
					str = str.slice(strIndexOld);
				}
				result += e[1];
				str = str.slice(e[0].length);
			} else {
				result += str;
				str = '';
			}
			strIndexOld = undefined;
			if (str.length === 0) break;
		}
		return result;
	}

}



let arr = [
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
	['12', ']]'],
	['\\d-(\\d)', 'A-$1']
];

string.replace( search, replacement )

string.replace( array , useRegExp)

let s = '12a a---- 212 ba aa三苹果明白c aaa三才三';
// let dr = new DictReplacer(arr);
// console.log(JSON.stringify(dr.dict));
// console.log(s);
// console.log(dr.encode(s));

let i=0;

let regExpArr = arr.filter(e => Array.isArray(e) && (typeof e[0] === 'string' && e[0].length > 0));

let regExp = new RegExp(regExpArr.map(e=>`(${e[0]})`).join('|'),'g');

let r=s.replace(regExp, function(m){
	let v;
	arr.some(e=>{
		let b=e[0]===m;
		v = e[1];
		return b;
	});
	return v;
});

console.log(s);

console.log(r);


// console.log(regExp)


// {
//     let str = 'abaaababaaa';
//     let i = str.search('bab');

//     console.log( i );
//     console.log(str);
//     console.log(str.slice(0,i));
//     console.log(' '.repeat(i) + str.slice(i) );

// }

