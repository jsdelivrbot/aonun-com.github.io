$(function(){

$('#cn').on('input paste',function(e){
	setTimeout(function(){
		var r=fan(fan2($('#cn').html()))
		$('#tw').html(r)
	})
})

$('#tw').on('input paste',function(e){
	setTimeout(function(){
		var r=jian(jian2($('#tw').html()))
		$('#cn').html(r)
	})
})

// $('#tw2').on('input paste',function(e){
// 	setTimeout(function(){
// 		var rows2=$('tr','#tw2'), len1 = rows2.length;
// 		var rows1=$('tr','#tw1'), len2 = rows1.length;
// 		var len=Math.min(len1,len2)

// 		for(var i=0; i<len; i++) {
// 			var b=rows2.get(i).text()!==rows1.get(i).text()
// 			if(b) rows2.get(i).css({background:'rgba(255,0,0,.4)'})
// 		}
// 	})

// })

$('#cn').on('paste',function(e){
	setTimeout(function(){
		$(e.target).find('td').map(function(i,e){
			e.innerText=toStr(e);
		})
	})
})

$('#cn2').on('input paste',function(e){
	setTimeout(function(){
		var r=fan(fan2($('#cn2').val()))
		$('#tw2').val(r)


	})
})

$('#tw2').on('input paste',function(e){
	setTimeout(function(){
		var r=jian(jian2($('#tw2').val()))
		$('#cn2').val(r)
	})
})

$('#cn2').scroll(function(){
		$('#cn2').css('height',$('#cn2').get(0).scrollHeight+'px')
		$('#tw2').css('height',$('#tw2').get(0).scrollHeight+'px')
})
$('#tw2').scroll(function(){
		$('#cn2').css('height',$('#cn2').get(0).scrollHeight+'px')
		$('#tw2').css('height',$('#tw2').get(0).scrollHeight+'px')
})


// function stringify(node){
// 	console.log(node)
// 	var cns=node.childNodes, len=cns.length
// 	if(len>0) {
// 		var i=0, c, r=''
// 		while(i<len) {
// 			c=cns.item(i)
// 			if(c.nodeType===3) {
// 				r+=c.nodeValue.trim()
// 			}else if(c.nodeType===1) {
// 				if(c.nodeName==='BR') r+='\n'
// 				else r+=stringify(c)
// 			}
// 			return '';
// 		}
// 		return r
// 	} else {
// 		if(node.nodeType===3) {
// 			return node.nodeValue.trim()
// 		}else if(node.nodeType===1 && node.nodeName==='BR') {
// 			return '\n'
// 		}
// 		return '';
// 	}
// }

// 如果有子

function toStr(node){
	if(node.hasChildNodes()){
		var i=0,s=node.childNodes, len=s.length, r='', c
		while(i<len) {
			c=s.item(i)
			r+=toStr(c)
			i++
		}
		return r
	}else{
		switch(node.nodeType){
			case 3: 
				return node.nodeValue.trim()
				break;
			case 1:
				return node.nodeName==='BR'?'\r':''
				break;
			default:
				return ''
		}
	}
}


$('#ta1').on('input paste',function(){
	$('#t1').val($('#ta1').val().length)
	showtresult();
})
$('#ta2').on('input paste',function(){
	$('#t2').val($('#ta2').val().length)
	showtresult();
})
function showtresult(){
	if($('#t1').val()!==$('#t2').val()){
		$('#tresult').text('다릅니다!! 글자 수가요.').css('background','rgba(255,0,0,.2)')
	}else if($('#t1').val()===$('#t2').val()){
		$('#tresult').css('background','rgba(0,255,0,.2)').text('같습니다 ^ ^ 글자 수가요.')
	}else{
		$('#tresult').removeAttr('style').text('입력하세요')
	}
}
$('#ta1').scroll(function(){
		$('#ta1').css('height',$('#ta1').get(0).scrollHeight+'px')
})
$('#ta2').scroll(function(){
		$('#ta2').css('height',$('#ta2').get(0).scrollHeight+'px')
})



})




var t=document.createTextNode('textNode')
var br=document.createElement('br')
var div=document.createElement('div')

