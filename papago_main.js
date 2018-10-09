var text=document.getElementById("text");
text.addEventListener("input",function(e){
		search(text.value, show);
	// if(e.ctrlKey&&e.keyCode===13)
});


function search(value,callback) {
	
	var x=new XMLHttpRequest();
	x.open('POST','http://localhost/papago',true);
	x.onload=callback;
	x.setRequestHeader("Content-Type", "application/json");
	x.send(JSON.stringify({text:value,source:'zh-CN',target:'ko'}));
}


var result=document.getElementById('result');

function show(e){
	result.innerHTML=e.target.result;
}