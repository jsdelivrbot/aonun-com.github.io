// Replacer.js
// MIT
!(function (g) {
	class Replacer {
		offRegExp(src, opt = 'gim') {
			src = src.replace(/[\\\[\]\{\}\(\)\.\-\?\*\+\^\$]/g, '\\$&');
			this.regExp = new RegExp(src, opt);
			return this.regExp;
		}
		off(text, tar = '') {
			return text.replace(this.regExp, tar);
		}

		onRegExp(src, opt = 'gim') {
			this.regExp = new RegExp(src, opt);
			return this.regExp;
		}
		on(text, tar = '') {
			return text.replace(this.regExp, tar);
		}
	}
	g.Replacer = Replacer;
})(this);