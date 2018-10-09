// ok
var lastEditTarget;
var dict=[];
var targetLang;

$(function(){
	$(window).on('dragover',function(e){
		e.preventDefault();
	});
	$(window).on('drop',function(e){
		e.preventDefault();
		var files  = e.originalEvent.dataTransfer.files;
		var length = files.length;
		var E=new Event('loaddropfiles');
		E.files=files;
		E.datas={};
		for(var i=0; i<length; i++) {
			var file = files.item(i);
			// console.log(file);
			if(! (/\.txt$/.test(file.name))) {
				pushlog('No support the file type. '+file.name+'('+file.size+')');
				continue;
			}
			var fr=new FileReader();
			fr.file = file;

			fr.readAsText(file);
			fr.onload = function(e){
				var t=e.target;
				E.datas['tmtoolfile_'+t.file.name] = t.result;
				if(i===length) window.dispatchEvent(E);
			};
		}
	});

	$(window).on('dragover',function(e){
		e.preventDefault();
	});
	// $('#dictDrop').on('drop');

	$('#dictPaste').on('paste',function(e){
		var t=e.originalEvent.clipboardData.getData('text/plain').trim();
		var a=ao.stringToArray(t);
		if(!dict) dict=new Reference(a);
		else dict.concat(a);
		e.preventDefault();
		pushlog('Update Dictionary, '+dict.array.length+'ea.');

		// e.target.value='';
	});

	$('#workPaste').on('paste',function(e){
		var t=e.originalEvent.clipboardData.getData('text/plain').trim();
		if(t.length>0){
			var a=ao.stringToArray(t);
			if(a.length>0) {
				if(a[0].length===1){
					a.forEach(function(e){
						return e.push('');
					});
				}
			}
			var table=ao.arrayToTable(a);
			console.log(table);
			$('td:nth-child(1)',table).addClass('source');
			$('td:nth-child(2)',table).addClass('target').attr({'contenteditable':'plaintext-only'});
			$('#works').append(table);
		}
		pushlog('Append Mission!');
		e.preventDefault();
		// e.target.value='';
	})

	// 查找内容
	$(document).on('focus','#works .target',function(e){
		// 词典提示
		if($('#useDictTip').prop('checked')) {
			var t=$(e.target).prev('.source').text().trim();
			var a=dict.search(t,Number($('#similarPercent').val()));
			var last=$(e.target).parent().find('td:last()');
			var offset = last.offset();
			offset.width=last.width();
			offset.height=last.height();
			// console.log(offset)
			// 提示内容
			var table=ao.arrayToTable(a);
			$('td:nth-child(2)',table).attr({'contenteditable':'plaintext-only'}).addClass('target');
			$('td:nth-child(1)',table).attr({'contenteditable':'plaintext-only'}).addClass('source');
			$('td:nth-child(4)',table).on('mousedown',function(e){
				if(e.which===3){
					var t=$(e.target).text();
					e.preventDefault();
					if(confirm('[!] Delete '+t+'?')){
						dict.array.splice(t,1);
						pushlog('Dictionary: '+dict.array.length+'ea');
						$(e.target).parent('tr').remove();
					}
				}
			});
			$('#tips').html(table)
			.css({position:'absolute',
				top:offset.top+offset.height+60+document.body.scrollTop,left:8});	
				// left:offset.left+offset.width+document.body.scrollLeft});	
			
			// 规则A：对于如果最后一个编辑的内容，不要采取自动插入。
			if($('#auto100').prop('checked') && a && a[0] &&a[0][2]==100) {
				$(this).text(a[0][1]);
			}
		}
	});

	$(document).on('keydown','.target',function(e){
		if(e.keyCode===13){
			e.preventDefault();
			if($(e.target).is('#tips td')){
				var p=$(e.target).parent();
				var s=$('.source',p).text().trim();
				var t=$('.target',p).text().trim();
				var i=$('td:nth-child(4)',p).text().trim();
				dict.array[i][0]=s;
				dict.array[i][1]=t;
				dict.from(dict.array);
				pushlog('Update Dictionary: '+s+'→'+t);
				pushlog('Dictionary: '+l+'→'+dict.array.length+'ea');
				// ctrl+enter 换色
				var t=$(e.target);
				if($('#ctrlEnter').prop('checked')){
					t.css({background:$('#ctrlEnterColor').val()})
				}
				t.parent().next('tr').find('.target').focus()
			}else{
				var t=$(e.target);
				var s=t.prev('.source');
				t=t.text().trim();
				s=s.text().trim();
				var l=dict.array.length;
				dict.array.push([s,t]);
				dict.from(dict.array);
				pushlog('Update Dictionary: '+s+'→'+t);
				pushlog('Dictionary: '+l+'→'+dict.array.length+'ea');
				// ctrl+enter 换色
				var t=$(e.target);
				if($('#ctrlEnter').prop('checked')){
					t.css({background:$('#ctrlEnterColor').val()})
				}
				t.parent().next('tr').find('.target').focus()
			}
		}else if(e.ctrlKey){
			// ctrl+ 1~0 在work快速插入找到的内容
			switch(e.keyCode) {
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:{
					e.preventDefault();
					var key = parseInt(e.key);
					console.log(key)
					if(typeof key==='number'){
						if(key===0) key==10;
						key--;
						var t=$('#tips').find('tr').eq(key).find('.target').text().trim();
						$(e.target).text($(e.target).text()+t)
						replaceTD(t);
					}
				}
					break;
				case 45:{
					var t = $(e.target);
					if(t.is('#works .target')){
						t.text(t.prev('.source').text());
					}
					break;
				}
			}
		}else if(e.keyCode===27){
			//esc
			$('#tips').empty();
		}
		// else if(e.keyCode===13){
		// 	e.preventDefault();
		// 	t=$(e.target).parent().next('tr').find('.target').focus();
		// }
		else if(e.keyCode===19){
			var p=$(e.target).parent();
			var s=$('.source',p).text().trim();
			google(s,targetLang||'zh-CN',function(e,r){console.log(e,r); });
			naver(s,targetLang||'zh-CN',function(e,r){console.log(e,r); });
		}
	})


	// 记录最后的source和target的内容
	$(document).on('mouseup','.source, .target', function(e){
		var t=$(e.target), s=window.getSelection();
		if(s.baseNode !== s.extentNode) return ;
		if(t.is('.source')){
			lastSourceSelectionText=s.toString().trim();
			$('#lsst').text(lastSourceSelectionText);

			if($('#useDictTip').prop('checked') && $(e.target).is('#works .source') && lastSourceSelectionText){
				var tar=$(e.target);
				var t= lastSourceSelectionText;
				var a=dict.search(t,Number($('#similarPercent').val()));
				// 提示内容
				var table=ao.arrayToTable(a);
				$('td:nth-child(2)',table).attr({'contenteditable':'plaintext-only'}).addClass('target');
				$('td:nth-child(1)',table).attr({'contenteditable':'plaintext-only'}).addClass('source');
				$('td:nth-child(4)',table).on('mousedown',function(e){
					if(e.which===3){
						var t=$(e.target).text();
						e.preventDefault();
						if(confirm('[!] Delete '+t+'?')){
							dict.array.splice(t,1);
							pushlog('Dictionary: '+dict.array.length+'ea');
							$(e.target).parent('tr').remove();
						}
					}
				});
				$('#statusDict').empty().append($(table).find('tr'));
			}

			if($('#useGoogle').prop('checked')){
				google(lastSourceSelectionText,$('#targetLang').val(),function(err,rs){
					$('#googleResult').text(rs);
				});
			}
			if($('#useNaver').prop('checked')){
				naver(lastSourceSelectionText,$('#targetLang').val(),function(err,rs){
					$('#naverResult').text(rs);
				});
			}



		}else if(t.is('.target')) {
			lastTargetSelectionText=window.getSelection().toString().trim();
			$('#ltst').text(lastTargetSelectionText);
		}
	});



	// 下载词库
	$('#downloadDict').click(function(){
		dict.array.forEach(function(e){
			e.forEach(function(v,i,a){
				a[i]=v.trim().replace(/\n/g,'\\n');
			});
		});
		dict.from(dict.array);
		downloadFile('dict', ao.arrayToString(dict.array));
	});
	// 下载任务
	$('#downloadWork').click(function(){
		dict.array.forEach(function(e){
			e.forEach(function(v,i,a){
				a[i]=v.trim();
			});
		});

		var r='';
		$('#works').find('table').each(function(i,table){
			table=$(table);
			if(table.is('.tmtoolfile')) {
				table.find('tr').each(function(i,tr){
					var tds=$(tr).find('td');
					var k=tds.eq(2).text();
					var t=tds.eq(1).text();
					if(k && t) {
						r+=k+'\t'+t+'\t'+Date.now().toString(36)+'\n';
					}
				});
			}else{
				table.find('tr').each(function(i,tr){
					var tds=$(tr).find('td');
					var k=tds.eq(1).text().trim();
					var t=tds.eq(0).text().trim();
					r+=k+'\t'+t+'\n';
				});
			}
			r+='\n\n\n';
		});
		// var table=$('<table>').append($('#works').find('tr').clone()).get(0);
		// console.log(table);
		downloadFile('work', r );
	});
	// 清空任务
	$('#clearWork').click(function(){
		if(confirm('Warning! Delete the missions?')) {
			$('#works').empty();
			$('#tips').empty();
		}
	});


	$('#worksSourceSearch').on('input',function(e){
		var t=e.target, v=t.value;

		if(v.length>0){
			$('#works').find('.source').each(function(i,e){
				var s=new Search($(e).text());
				if( s.test(v) ) {
					$(e).parent().removeClass('hide');
				}else{
					$(e).parent().addClass('hide')
				}
			});
		}else{
			$('#works').find('.source').parent().removeClass('hide');
		}
			
	});
	$('#worksTargetSearch').on('input',function(e){
		var t=e.target, v=t.value;

		if(v.length>0){
			$('#works').find('.target').each(function(i,e){
				var s=new Search($(e).text());
				if( s.test(v) ) {
					$(e).parent().removeClass('hide');
				}else{
					$(e).parent().addClass('hide')
				}
			});
		}else{
			$('#works').find('.target').parent().removeClass('hide');
		}
	});
	$('#dictsSourceSearch').on('input',function(e){
		var t=e.target, v=t.value;
		if(v.length>0){
			var rs=[];
			dict.array.forEach(function(e,i){
				var s=new Search(e[0]);
				if(s.test(v)){
					rs.push([].concat(e,'',i));
				}
			});
			var table=ao.arrayToTable(rs);
			$(table).find('tr').each(function(i,e){
				$(e).find('td')
				.eq(0).addClass('source').prop({'contenteditable':'plaintext-only'})
				.end()
				.eq(1).addClass('target').prop({'contenteditable':'plaintext-only'})
				.end()
				.eq(3).on('mousedown',function(e){
					if(e.which===3){
						var t=$(e.target).text();
						e.preventDefault();
						// if(confirm('删除'+t+'?')){
							// dict.array.splice(t,1);
							// pushlog('词库数量：'+dict.array.length);
							// $(e.target).parent('tr').remove();
						// }
						console.log(dict.array[t]);
					}
				});
			});
			$('#tips').html(table);
		}
			
	});
	$('#dictsTargetSearch').on('input',function(e){
		var t=e.target, v=t.value;
		if(v.length>0){
			var rs=[];
			dict.array.forEach(function(e,i){
				var s=new Search(e[1]);
				if(s.test(v)){
					rs.push(e.concat('',i));
				}
			});
			var table=ao.arrayToTable(rs);
			$(table).find('tr').each(function(i,e){
				$(e).find('td')
				.eq(0).addClass('source').prop({'contenteditable':'plaintext-only'}).on('keyup',function(e){
					if(e.keyCode===13){// ctrl+enter ***
						var p=$(e.target).parent();
					}
				})
				.end()
				.eq(1).addClass('target').prop({'contenteditable':'plaintext-only'})
				.end()
				.eq(3).on('mousedown',function(e){
					if(e.which===3){
						var t=$(e.target).text();
						e.preventDefault();
						if(confirm('Delete '+t+'?')){
							dict.array.splice(t,1);
							pushlog('Dictionary: '+dict.array.length+'ea');
							$(e.target).parent('tr').remove();
						}
					}
				});
			});
			$('#tips').html(table);
		}
	});

	if(dict && dict.array) pushlog('Update Dictionary: '+dict.array+length+'ea');


	$('#MatchWork100').click(function(){
		$('#works').find('tr').each(function(i,tr){
			var s=$(tr).find('.source').text();
			var t=$(tr).find('.target');
			var o={};
			dict.array.forEach(function(e){
				o[e[0]]=e[1];
			});
			if(s in o){
				t.text(o[s]).css('background','#eee');
			}else{
				t.text('').removeAttr('style');
			}
		});
	});


	setTimeout(function(){
		if(dict && dict.array && dict.array.length){
			pushlog('Dictionary have '+dict.array.length +'ea.').css({'background':'#00F',color:'#FFF'});
		}
	},3000);

})

var lastSourceSelectionText, lastTargetSelectionText;
window.addEventListener('loaddropfiles',function(e){
	var ls=ao.ls, table;
	for(var i in e.datas){
		table=ao.tmstringToTable(e.datas[i]);
		if(/^tmtoolfile_/.test(i)) table.classList.add('tmtoolfile');
		// console.log('drops',table,i);
		$('#works').append(table);
	}
},true);

window.addEventListener('beforeunload',function(){
	var ls=ao.ls;
	saveDatas();
	return confirm('[Warning] Close the page?');

},true);

$(function(){
	var ls=ao.ls;
	try{
		$('#works').html(ls.get('works'));
	}catch(err){
		$('#works').html('');
	}

	try{
		dict=new Reference(ls.get('dict'));
	}catch(err){
		dict=new Reference([]);
	}
});


function saveDatas(){
	var ls=ao.ls;
	ls.set('works', $('#works').html());
	ls.set('dict',dict.array);
	pushlog('*** Auto saved ***');
}

setInterval(saveDatas,60000);

/*
1	11
2	22
3	33
*/
function pushlog(t){
	return createCustomLog(t).appendTo('#clogs');
}
function createCustomLog(t){
	var clog=$('<pre class="clog" />').text(t);
	clog.fadeIn(300);
	setTimeout(function(){
		clog.fadeOut(3000);
	},2000);
	return clog;
}

function formatName(n){
	return n.replace(/[\\/:*?"<>|&\-+=`~%!@#$%^,.;:'(){}[\]]/g,'_')
}

function downloadFile(filename, content){
	var a = document.createElement('a');
	var blob = new Blob([content]);
	var url = window.URL.createObjectURL(blob);
	filename = formatName(location.search)+'_'+filename+'_'+Date.now()+'.txt';

	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

function downloadFile2(fileName, content){
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

var t;
function replaceTD(t){
	var w=window.getSelection();
	var bn=w.baseNode;
	var b=w.baseOffset;
	var en=w.extentNode;
	var e=w.extentOffset;
	if(bn===en){
		window.bn=bn;
		console.log(bn);
	}
}





// ctrl+q
$(window).on('keyup',function(e){
	if(e.ctrlKey && e.keyCode===81 && lastSourceSelectionText && lastTargetSelectionText){
		e.preventDefault();
		dict.add(lastSourceSelectionText,lastTargetSelectionText);
		pushlog('Update Dictionary: '+lastSourceSelectionText+'→'+lastTargetSelectionText);
	}
});


// function uniqueDict(){
// 	var o = {}, a=[];
// 	dict.array.forEach(function(e){
// 		o[e[0]]=e[1];
// 	});
// 	for(var k in o) {
// 		a.push([k,o[k]]);
// 	}
// 	return a;
// }

// 问题：在翻译时，mission中的相似文章，没有像Dictionary一样同时被显示出来，所以很难统一语句。
// 问题：需要在某个范围内，大量替换某个关键字、关键词的功能。
// 问题：自动提示本文中的词语，越长的开始匹配，有可能有2个原文词合并的情况，但有可能又是别的译文。


$(window).on('keyup',function(e){
	if(e.altKey && $('#statusDict').find('tr').length){
		switch(e.keyCode) {
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:{
					e.preventDefault();
					var key = parseInt(e.key);
					if(typeof key==='number'){
						if(key===0) key==10;
						key--;
						var v=$('#statusDict').find('tr').eq(key).find('.target').text().trim();
						var t=window.getSelection().baseNode;
						if(t.nodeType===3) t=t.parentElement;
						t=$(t);
						if(t.is('#works td.source')){
							t=t.next('td.target');
							t.text(t.text()+v);
						}else if(t.is('#works td.target')){
							t.text(t.text()+v);
						}
						console.log(key,t,v);
					}
				}
					break;
		}

	}
});
