




class Replacer {

	constructor(dict) {
		// [ {source, target}, ... ]
		dict.sort((a, b) => {
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

	get(str) {
		let result = '', dict = this.dict, dictLength = this.length,
			strIndex=0, strLength = str.length, e, b,
			eLength, eIndex;

		while(true) {
			for(let i=0; i<dictLength; i++) {
				e = dict[i];
				strIndex = str.search(e[0]);
				b = strIndex !== -1;
				strLength = e[0].length;
				if(b) {
					eLength = e[0].length;
					eIndex = i;
				}
				console.log(e[0], strLength, strIndex, result)
				if(strIndex===0) break;
			}

			result += b ? e[1] : str.slice(0, strIndex);
			
			str = str.slice(eIndex);
			strLength = str.length;
			if(strLength===0) break;
		}
		return result;
	}

}



let arr = [
	['a', 'A'],
	['ba', 'BO'],
	['aa', '--'],
	// {source:'a', target:'A'},
	// {source:'ba', target:'BO'},
];

let r = new Replacer(arr);
console.log(JSON.stringify(r.dict));
console.log( r.get('abaaababaaa') );


// {
//     let str = 'abaaababaaa';
//     let i = str.search('bab');

//     console.log( i );
//     console.log(str);
//     console.log(str.slice(0,i));
//     console.log(' '.repeat(i) + str.slice(i) );

// }

