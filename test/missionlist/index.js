let rows = [];
let methods = {
	onCenter: function (e) {
		if (v.opts.editContentAutoCenter) e.target.scrollIntoView({
			behavior: `smooth`,
			// behavior:`auto`,
			// block:`center`,
			inline: `center`
			// inline:`nearest`
		});
	},
	onText: function (e) {
		// console.log(e.type,e.target, e.target.textContent)
		console.log(e.target.textContent)
		e.target.textContent = e.target.innerText.trim()
	},
	onInput: function (e) {
		// console.log(e.target.innerText);
		// console.log(e.target.outerHTML);
	}
};

let v = new Vue({
	el: '#works',
	data: {
		v1: 'VALUE1',
		v2: 'VALUE2',
		v3: 'VALUE3',
		items: [
			[0, 'a'],
			[1, 'b'],
			// {index:0, item:'a'},
			// {index:1, item:'b'},
		],
		rows,
		opts: {
			editContentAutoCenter: true
		},
	},
	methods,
});

let i = 1;
while (i < 100) {
	v.rows.push(i + '-' + randomString(10));
	i++;
}


let p = new Proxy(rows, {
	set: function (target, k, v) {
		console.log(k, v);
		return target[k] = v;
	},
	get: function (target, k) {
		return target[k];
	},
	apply: function (target, thisArg, args) {
		console.log(args);
		return 1
	}
});



function randomString(len = 1, caps = true) {
	len = Math.max(1, len), s = '';
	while (len-- > 0) {
		if (caps) {
			s += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
		} else {
			s += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
		}
	}
	return s;
}

