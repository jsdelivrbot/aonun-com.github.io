$(function(){

var shots = [{keys:'ctrl+shift+s',command:'copyTable'}]

var commands = {
	'copyTable':function(){
		console.log('run copyTable')
		// var range1 = document.createRange();
		// range1.selectNode($('#excelTableEditer').get(0));
		// var range2 = document.createRange();
		// range2.selectNode($('#excelStylesheet').get(0));

		// /* 窗口的selection对象，表示用户选择的文本 */
		// const selection = window.getSelection();
		// if(selection.rangeCount > 0) selection.removeAllRanges();
		// // selection.addRange(range2);
		// selection.addRange(range1);

		// document.execCommand('copy');
		// selection.removeAllRanges()
	}
}

function parseKeys(t){
	t=t.trim().replace(/\s/g,'').split('+')
	var i, r={}
	r.ctrlKey=check('ctrl',t)
	r.shiftKey=check('shift',t)
	r.altKey=check('alt',t)
	r.key=t.pop()
	// if(r.key) r.keyCode=r.key.charCodeAt(0)
	return r;
}

function check(v,a){
	var i=a.indexOf(v)
	if(i!==-1) {
		a.splice(i,i+1)
		return true
	}
	return false
}





window.onkeydown=function(e){
	var shots = [
		
	];
	var commands = {
		'copyTable':function(){
			console.log('run copyTable')
			// var range1 = document.createRange();
			// range1.selectNode($('#excelTableEditer').get(0));
			// var range2 = document.createRange();
			// range2.selectNode($('#excelStylesheet').get(0));

			// /* 窗口的selection对象，表示用户选择的文本 */
			// const selection = window.getSelection();
			// if(selection.rangeCount > 0) selection.removeAllRanges();
			// // selection.addRange(range2);
			// selection.addRange(range1);

			// document.execCommand('copy');
			// selection.removeAllRanges()
		}
	}

	shots.forEach(function(element){
		console.log(testKeys(element.keys, shots))

	})

turn r
	}

}


});