let dmp = new diff_match_patch();
let obj = {
	el: '#app',
	data: {
		timeout: 1,
		text1: 'abc',
		text2: 'cba',
		rows: '',
		dmp_1: new diff_match_patch(),
		dmp_2: new diff_match_patch(),
	},
	computed: {
		patche_1(){ return this.dmp_1.patch_make(this.text1, this.text2); },
		patche_2(){ return this.dmp_1.patch_make(this.text2, this.text1); },

		length_1(){ return this.text1.length; },
		length_2(){ return this.text2.length; },

		prettyHtml_1(){ return this.dmp_1.diff_prettyHtml(this.main_1); },
		prettyHtml_2(){ return this.dmp_1.diff_prettyHtml(this.main_2); },

		main_1() { return this.dmp_1.diff_main(this.text1, this.text2); },
		main_2() { return this.dmp_1.diff_main(this.text2, this.text1); },

		cleanupSemantic_1(){ return this.dmp_1.diff_cleanupSemantic(this.main_1); },
		cleanupSemantic_2(){ return this.dmp_2.diff_cleanupSemantic(this.main_2); },

		cleanupEfficiency1() { return this.dmp_1.diff_cleanupEfficiency(this.main_1); },
		cleanupEfficiency2() { return this.dmp_2.diff_cleanupEfficiency(this.main_2); },

		levenshtein1() { return this.dmp_1.diff_levenshtein(this.main_1); },
		levenshtein2() { return this.dmp_2.diff_levenshtein(this.main_2); },

		toText1() { return this.dmp_1.patch_toText(this.text1, this.text2); },
		toText2() { return this.dmp_2.patch_toText(this.text2, this.text1); },
	},
	watch: {
		timeout: {
			handler(n, o) {
				dmp.Diff_Timeout = parseFloat(n);
				console.log('timeout', n, o);
			},
			immediate: true,
			deep: false
		},

		// text102: {
		// 	handler(n) {
		// 		console.log(n)
		// 		dr.bind(this)();
		// 	}
		// },
		// text202: {
		// 	handler(n) {
		// 		dr.bind(this)();
		// 	}
		// }
	},
	methods: {
		onInput(e){
			console.log(e.target);
		}
	}
};

dmp.Diff_Timeout = 0;
let v = new Vue(obj);

function dr(a,b) {
	let res = [];
	if (a.length == 0 || b.length == 0) {
		return res;
	}
	a = String(a).split('\n');
	b = String(b).split('\n');
	if (a.length !== b.length) {
		return res;
	}
	a.forEach((e, i) => res.push(dmp.diff_main(e, b[i]).filter(e => e[0] !== 0).map(e => e[1])));
	v.rows = res.join('\n');
	return res;
}


let test = localforage.createInstance('test');
test.getItem('text1').then(e=>{
	if(typeof e==='string') v.text1=e;
});
test.getItem('text2').then(e=>{
	if(typeof e==='string') v.text2=e;
});

