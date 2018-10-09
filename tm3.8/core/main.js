require.config({
	baseUrl:'/lib',
	paths:{
	}
});
require(['jquery','prototype','pixi','localforage'],
function ($,prototype,pixi,localforage){

// 
$(function(){
	let stype=$('<style>').text(`pre{
		border:1px solid #ccf;
		padding:1em;
	}`).appendTo('body');
	let source=$('<pre class="source">').appendTo('body');
	let target=$('<pre class="target">').appendTo('body');

	source.text('[A3DB57FF]부활[-]: 죽으면 1회에 한하여 부활합니다.')
	target.attr('contenteditable',true).on('input',function(e){
		let text=target.text();
		if(text){
			let index=source.text().indexOf(text)
			console.log(index);
		}
	})
});


});