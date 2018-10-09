$(function(){
	var translateNaverComBox=document.getElementById('translateNaverComBox');
	// tn.value='js输入的内容‘;
	var source=document.getElementById('source');
	source.addEventListener('keyup',function(e){
		if(e.ctrlKey && e.keyCode===13) {
			translateNaverComBox.innserHTML='';
			translateNaverComBox.classList.add('switch');
			var translateNaverCom=document.createElement('iframe');
			translateNaverCom.src='http://translate.naver.com/#/zh-CN/ko/'+encodeURIComponent(e.target.value);
			translateNaverCom.addEventListener('load',function(e){
				translateNaverComBox.classList.remove('switch');
				this.removeEventListener(e.type, arguments.applly);
			});
			translateNaverComBox.appendChild(translateNaverCom);
		}
	});

});

function user(){
    console.log(this,arguments); }