let log=function(s,size=5){
	console.log("%c"+s," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:"+size+"em");
};
log('TM 4');
log('ddb@aonun.com',2);


$(window).on('beforeunload',function(e){
	e.preventDefault();
	$('.qa').remove();
	saveDatas();
});
// $(window).on('unload',function(e){
// 	e.preventDefault();
// 	var msg='[Warning] Close the page?';
// 	return msg;
// });

// 词典查找大法。长度截断渐进法。
function lenSearch(str,dictArray){
	let startTime=Date.now();
	let timeout=false;
	let rs=[];
	if(!dictArray) return rs;
	let i=0, len=str.length, start=i, end=len, chunk,index=0,re,b=false;

	while(true){
		if((Date.now()-startTime)>2000) { timeout=true;break;}
		if(end===start) break;
		chunk=str.slice(start,end);

		// 寻找这个内容
		b=dictArray.some((e,i,a)=>{
			if((Date.now()-startTime)>2000) { timeout=true;break;}
			re=new RegExp('^'+Search._getRegExp(chunk)+'$','gi');
			if(re.test(e[0])){
				index=i;
				start=end;
				end=len;
				return true;
			}
			return false;
		})

		if(timeout){
			return [];
		}else if(b){
			// 找到
			rs.push(dictArray[index]);
			// console.log('[has]',dict[index]);
			continue;
		}
		end--;
	}
	if(timeout){
		return [];
	}
	return rs;
}

let dict=new Reference([]);
function addDict(a){
	a=a||[];
	if(typeof dict==='undefined') {dict=new Reference(a); pushlog('create dict') } else {dict.concat(a); pushlog('add dict'); }
}

var lastEditTarget;

var targetLang;
// var asciiNospace=/[\x00-\x08\x0e-\x1f\x21-\x2b\x2d\x2f\x3a-\x9f\xa1-\xff]+|(\d[\x2c\x2e]?)+/g; //  ASCII范围内的 [^ \f\n\r\t\v,\.\d]  ,\x2c .\x2e
var asciiNospace=/(\d[\x2c\x2e]?)+|[\x00-\x08\x0e-\x1f\x21-\x2b\x2d\x2f-\x9f\xa1-\xff]+/g; //  ASCII范围内的 [^ \f\n\r\t\v,\.\d]  ,\x2c .\x2e


$(function(){
	$(window).on('dragover',function(e){
		e.preventDefault();
	});
	$(window).on('drop',function(e){// drop file
		console.log('drop');
		e.preventDefault();
		let files, length, E, onloadCount=0;
		files  = e.originalEvent.dataTransfer.files;// 被拖进的文件
		length = files.length;// 文件数量
		E=new Event('loaddropfiles');// 创建事件实例
		E.files=files;// 加入文件
		E.datas=[];// 加入数据
		for(var i=0; i<length; i++) {// 遍历文件
			let file = files.item(i);// 文件
			let filename=file.name;
			console.log('Loading...', filename);
			if(! (/\.txt$/.test(filename))) {// 是否扩展名为.txt
				pushlog('No support the file type. '+file.name+'('+file.size+')');// 不支持非.txt文件
				continue;
			}

			var fr=new FileReader();// 读文件数据
			fr.file = file;
			fr.name = filename;
			fr.onload = function(e){
				onloadCount++;
				let t=e.target;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['type'] = 'tmtool';
				// E.datas['filename'] = t.file.name;
				// console.log(t)
				E.datas.push({
					type:'tmtool',
					name:t.name,
					data:t.result,
					file:t.file
				});
				if(onloadCount===length) window.dispatchEvent(E);// 读完后触发事件
			};
			fr.readAsText(file);
		}
	});

	$(window).on('dragover',function(e){
		e.preventDefault();
	});
	// $('#dictDrop').on('drop');

	$('#dictPaste').on('paste',function(e){
		e.preventDefault();

		var t=e.originalEvent.clipboardData.getData('text/plain').trim();
		var a=ao.stringToArray(t);
		a=a.filter(function(e){
			return (e instanceof Array)&&e[0]&&e[1]&&e[0].length&&e[1].length;
		});
		addDict(a);
		console.log(dict)
		var oldDictArrayLength=dict.array ? dict.array.length : 0;
		pushlog('[Update Dictionary]', oldDictArrayLength+'->'+dict.array.length);

	});

	let workPasting=false;
	$('#workPaste').on('paste',function(e){
		e.preventDefault();
		pushlog('[Warning]','Wait finish!');
		if(workPasting) return ;
		workPasting=true;
		let t=e.originalEvent.clipboardData.getData('text/plain').trim();
		let p=new Promise((y,n)=>{
			setTimeout(()=>{
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
					$(table).attr({dataname:'wordpaste',datatype:'clipboard'});
					$('td:nth-child(1)',table).addClass('source');
					$('td:nth-child(2)',table).addClass('target').attr({'contenteditable':'plaintext-only'});
					$('tr',table).each(function(i,tr){
						$(tr).prepend($('<td class="no"></td>').text(i+1));
					});
					$('#works').append(table);
				}
				y();
			});
		});
		p.then(()=>{
			workPasting=false;
			pushlog('[Finish] Pasted Missions!');
		});
	});
	// $('#workPaste').on('keydown',function(e){
	// 	// ctrl+v
	// 	if(e.ctrlKey&&e.keyCode===86&& !e.altKey && !e.shiftKey && !e.metaKey) return true;
	// 	e.preventDefault();
	// });
	// $('#dictPaste').on('keydown',function(e){
	// 	// ctrl+v
	// 	if(e.ctrlKey&&e.keyCode===86&& !e.altKey && !e.shiftKey && !e.metaKey) return true;
	// 	e.preventDefault();
	// });

	// 查找内容
	var prevFocusTarget;
	$(document).on('focus','#works .target',function(e){
		// 焦点太卡了。记录上一次的焦点吧。
		if(prevFocusTarget===e.target && $('#works td.target').length>1) return false;
		prevFocusTarget=e.target;

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
			$('td:nth-child(4)',table).attr({'contenteditable':'plaintext-only'}).addClass('index');
			$('td:nth-child(3)',table).attr({'contenteditable':'plaintext-only'}).addClass('similar');
			$('td:nth-child(2)',table).attr({'contenteditable':'plaintext-only'}).addClass('target');
			$('td:nth-child(1)',table).attr({'contenteditable':'plaintext-only'}).addClass('source');
			$('tr',table).each(function(i,tr){
				$(tr).prepend($('<td class="no"></td>').text(i+1));
			});
			$('#tips').html(table.innerHTML).prop('scrollTop',0);
			// .css({position:'absolute',
			// 	top:offset.top+offset.height+60+document.body.scrollTop,left:8});	
				// left:offset.left+offset.width+document.body.scrollLeft});	
			
			// 规则A：对于如果最后一个编辑的内容，不要采取自动插入。
			if($('#auto100').prop('checked') && a && a[0] &&a[0][2]==100) {
				$(this).text(a[0][1]).css({background:$('#ctrlEnterColor').val()});
			}

			// 新型算法。长度渐进法 lenSearch()
			let p=new Promise((y,n)=>{
				setTimeout(n,2000);
				let lenSearchRes=lenSearch(t, dict.array);
				y(lenSearchRes);
			});
			p.then((v)=>{
				if(v.length>0){
					let res=v.map((e,i)=>{
						let tr=$('<tr>');
						$('<td class="no"></td>').text(i+1).appendTo(tr);
						$('<td class="source"></td>').text(e[0]).appendTo(tr);
						$('<td class="target"></td>').text(e[1]).appendTo(tr);
						return tr;
					})
					console.log(res)
					$('#statusDict').empty().append(res);
				}
			}).catch(()=>{console.warn('[timeout] lenSearch');})
		}

		// 显示谷歌等
		var g=$('#useGoogle').prop('checked'),n=$('#useNaver').prop('checked'),d=$('#useDaum').prop('checked');
		if(g||n||d){
			var s=$(e.target).parent('tr').find('.source').text().trim();
			if(s){
				var t=$('#netTarget').val();
				function net(n,s,t){
					if(net.count===undefined) net.count=0;
					net.count++;
					$('#'+n+'Result').text('Loading...('+net.count+')');
					this[n](s,t,function(o){
						$('#'+n+'Result').text(o.error||o.result.join('\n'));
					});
				}
				if(g) net('google', s,t);
				if(n) net('naver',  s,t);
				if(d) net('daum',   s,t);
			}
		}

		// 当前行高亮显示
		$('#works tr').removeClass('currentEditRow');
		$(e.target).parent().addClass('currentEditRow');
	});

	// 全局按键侦听
	$(document).on('keydown',function(e){
		if(e.keyCode===113 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey){// 113:F2
			// 移动到未翻译内容td上
			e.preventDefault();
			$('#gotoUntranslationTarget').trigger('click');
		}else if(e.keyCode===112 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey){// 112:F1
			// 自动匹配100%内容
			e.preventDefault();
			var event={type:'click',ctrlKey:e.ctrlKey, altKey:e.altKey, shiftKey:e.shiftKey, metaKey:e.metaKey};
			$('#MatchWork100').trigger(event);
			pushlog('Automatically enter to translate content.');
		}else if(e.keyCode===192&&e.altKey&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey){// Alt＋`  逐个词典匹配
			e.preventDefault();
			var v='';
			var t=$(e.target);
			t=$(t);
			if(t.is('#works td.source')){
				var source=t;
				var target=t.next('td.target');
				var sourceText=source.text();
				var arr=sourceText.split(/\s+/g)
				arr.forEach(function(text){
					v=dict.search(text,100)[0];
					v=(v===undefined?text:v[1]);
					target.text(target.text()+v);
					pushlog(v);
				});
			}else if(t.is('#works td.target')){
				var target=t;
				var source=target.prev('td.source');
				var sourceText=source.text();
				var arr=sourceText.split(/\s+/g);
				arr.forEach(function(text){
					v=dict.search(text,100)[0];
					v=(v===undefined?text:v[1]);
					target.text(target.text()+v);
					pushlog(v);
				});
			}
		}else if(e.keyCode===19&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey){// Pause - get google,naver,daum
			e.preventDefault();
			var s=window.getSelection().toString();
			if(!s.trim()) return $('#googleResult').text('No selected content.');
			var g=$('#useGoogle').prop('checked'),n=$('#useNaver').prop('checked'),d=$('#useDaum').prop('checked');
			// if(g||n||d){
				var s=lastSourceSelectionText;
				if(s && s.trim()){
					var t=$('#netTarget').val();
					function net(n,s,t){
						if(net.count===undefined) net.count=0;
						net.count++;
						$('#'+n+'Result').text('Loading...('+net.count+')');
						this[n](s,t,function(o){
							$('#'+n+'Result').text(o.error||o.result.join('\n'));
						});
					}
					net('google', s,t);
					// net('naver',  s,t);
					// net('daum',   s,t);
				}
			// }
		}else if(e.ctrlKey&&e.keyCode===81&&!e.shiftKey&&!e.altKey&&!e.metaKey){
		// Enter，ctrl+Q，ctrl+S 来保存到词库
			e.preventDefault();
			lastSourceSelectionText=$('#lsst').text().trim();
			lastTargetSelectionText=$('#ltst').text().trim();
			if(lastSourceSelectionText && lastTargetSelectionText) {
				// 保存
				var l=dict.array.length;
				dict.add(lastSourceSelectionText,lastTargetSelectionText);
				pushlog('[Update Dictionary] '+l+'→'+dict.array.length,lastSourceSelectionText+'→'+lastTargetSelectionText);
			}else{
				pushlog('[Warning] Need content.');
			}
		}else if(e.keyCode===68&&e.ctrlKey&&e.shiftKey&&!e.altKey&&!e.metaKey){
			//ctrl+shift+d  复制上面.target的内容
			e.preventDefault();
			var c=$(document.activeElement);
			s=c.parent().prevAll().not('.hide,.hide2').first().find(Array.prototype.map.call(document.activeElement.classList,function(e){ return '.'+e;}).join(' '));
			if(s.length){
				c.text(c.text()+s.text());
				pushlog('Copy: '+s.text());
			}else{
				pushlog('No copy.');
			}
		}else if(e.keyCode===83&&e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey){
			//ctrl+s 保存内容
			e.preventDefault();
			saveDatas();

			try{
				pushlog('[Save]', dict.array.length);
			}catch(err){
				pushlog('[Error]', err.message);
			}
		}
	});

	$(document).on('keydown','.target',function(e){
		if(e.ctrlKey && (e.keyCode===17) && e.repeat) return ;// ctrlKey 反复
		var tar=$(e.target);
		if(e.keyCode===13){// Enter
			e.preventDefault();

			if(tar.text().trim().length===0) {
				// target没有内容，不需要做任何操作。
				pushlog('No content');
				return ;
			}

			if($(tar).is('#tips td')){
				var p=tar.parent();
				var no=$('.no',p);
				no.animate({backgroundColor:$('#ctrlEnterColor').val()});
				var s=$('.source',p);
				var t=$('.target',p);
				s=s.text().trim();
				t=t.text().trim();
				// s或t的值为空，则跳到下一个。
				if(s.length===0||t.length===0) return p.next().find('.target').focus();
				var i=$('td:last()',p).text().trim();
				if(dict.array[i]){
					var l=dict.array.length;
					dict.array[i][0]=s;
					dict.array[i][1]=t;
					dict.from(dict.array);
					pushlog('[Update Dictionary] ', '('+l+'→'+dict.array.length+')',s+'→'+t);
					console.log(dict.array.length);
				}
				// ctrl+enter 换色
				var t=$(e.target);
				if($('#ctrlEnter').prop('checked')){
					t.animate({background:$('#ctrlEnterColor').val()});
				}
			}else{
				var p=tar.parent();
				var no=$('.no',p);
				no.animate({backgroundColor:$('#ctrlEnterColor').val()},function(){no.removeAttr('style');});
				var s=$('.source',p);
				var t=$('.target',p);
				t=t.text().trim().replace(/\{\\r\\n\}/g,'\\n');
				s=s.text().trim().replace(/\{\\r\\n\}/g,'\\n');
				var l=dict.array.length;
				dict.array.push([s,t]);
				dict.from(dict.array);
				pushlog('[Update Dictionary]',l+'->'+dict.array.length, s,t);
				// ctrl+enter 换色
				var t=$(e.target);
				if($('#ctrlEnter').prop('checked')){
					t.css({background:$('#ctrlEnterColor').val()})
				}
			}
			t.parent().nextAll().not('.hide,.hide2').eq(0).find('.target').focus();
			saveDatas();
		}else if(e.ctrlKey){
			// shift键 
			if(e.shiftKey){
				switch(e.keyCode) {
				case 48:// 0
				case 49:// 1
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:{
					e.preventDefault();
					var target=$(e.target);
					var sourceText=target.prev('.source').text().trim();
					var key = e.keyCode-48;
					if(key===0){
						key=10;	
					}else if(key===144) {
						console.log(e)
						key=1;
					} 
					key--;
					var tr=$('#tips').find('tr').eq(key);
					var s=tr.find('.source').text().trim();
					var t=tr.find('.target').text().trim();
					var v=smartMatch(sourceText, [s,t], dict.unique());
					target.text(target.text()+v)
					replaceTD(t);
					return ;
					}
				}
			}

			if(e.keyCode===192){// `
				e.preventDefault();
				var target=$(e.target);
				var sourceText=target.prev('.source').text().trim();
				var key = 0;
				var tr=$('#tips').find('tr').eq(key);
				var s=tr.find('.source').text().trim();
				var t=tr.find('.target').text().trim();
				var v=smartMatch(sourceText, [s,t], dict.unique());
				target.text(target.text()+v)
				replaceTD(t);
				return ;
			}

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
					if(typeof key==='number'){
						if(key===0) key==10;
						key--;
						var t=$('#tips').find('tr').eq(key).find('.target').text().trim();
						$(e.target).text($(e.target).text()+t)
						replaceTD(t);
					}
					break;
				}
				case 45:{
					var t = $(e.target);
					if(t.is('#works .target')){
						t.text(t.text()+t.prev('.source').text());
					}
					break;
				}
			}
		}else if(e.keyCode===27){
			//esc
			$('#tips').empty();
			$('#statusDict').empty();
		}
	});


	// 记录最后的source和target的内容
	$(document).on('mouseup','#works td.source, #works td.target', function(e){
		var s=window.getSelection();// 选择文字
		if(s.baseNode !== s.extentNode) return ;// 不是一个Node时，不做任何事情。
		var t=$(e.target);
		if(t.is('.source')){
			lastSourceSelectionText=s.toString().trim();
			$('#lsst').text(lastSourceSelectionText);

			// 查找词典内容
			// if($('#useDictTip').prop('checked') && lastSourceSelectionText){
			if(lastSourceSelectionText){
				var tar=$(e.target);
				var t=lastSourceSelectionText;
				var a=dict.search(t,Number($('#similarPercent').val()));
				// 提示内容
				var table=ao.arrayToTable(a);
				$('td:nth-child(4)',table).attr({'contenteditable':'plaintext-only'}).addClass('index');
				$('td:nth-child(3)',table).attr({'contenteditable':'plaintext-only'}).addClass('similar');
				$('td:nth-child(2)',table).attr({'contenteditable':'plaintext-only'}).addClass('target');
				$('td:nth-child(1)',table).attr({'contenteditable':'plaintext-only'}).addClass('source');
				$('tr',table).each(function(i,tr){
					$(tr).prepend($('<td class="no"></td>').text(i+1));
				});
				$('#statusDict').html(table.innerHTML).prop('scrollTop',0);
			}
			// google,naver,daum
			var g=$('#useGoogle').prop('checked'),n=$('#useNaver').prop('checked'),d=$('#useDaum').prop('checked');
			if(g||n||d){
				var s=lastSourceSelectionText;
				if(s && s.trim()){
					var t=$('#netTarget').val();
					function net(n,s,t){
						if(net.count===undefined) net.count=0;
						net.count++;
						$('#'+n+'Result').text('Loading...('+net.count+')');
						this[n](s,t,function(o){
							$('#'+n+'Result').text(o.error||o.result.join('\n'));
						});
					}
					if(g) net('google', s,t);
					if(n) net('naver',  s,t);
					if(d) net('daum',   s,t);
				}
			}



		}else if(t.is('.target')) {
			lastTargetSelectionText=window.getSelection().toString().trim();
			$('#ltst').text(lastTargetSelectionText);
		}
	});

	// 锁定未翻译目标
	$('#gotoUntranslationTarget').click(function(){
		let ts=$('#works .target:empty()');
		let t=ts.eq(0).trigger('focus');
		if(ts.length){
			var w=$('#works');
			w.prop('scrollTop', t.prop('offsetTop')-w.prop('offsetTop')-10);

			let countChar=0;
			let countRow=ts.each((_,e)=>{
				countChar+=$(e).prev('td.source').text().length;
			}).length;
			pushlog('No translated item is '+countRow+'ea('+countChar+'byte).');

		}else{
			pushlog('No target... ^ ^');
		}
		delete ts,t;
	});

	// 下载词库
	$('#downloadDict').click(function(){
		try{
			dict.array.forEach(function(e){
				e.forEach(function(v,i,a){
					a[i]=String(v).trim().replace(/\r|\n|\{\\r\\n\}/g,'\\n');
				});
			});
		}catch(_){
			dict=new Reference(ao.ls.get('dict')||[]);
			dict.array.forEach(function(e){
				e.forEach(function(v,i,a){
					a[i]=String(v).trim().replace(/\r|\n|\{\\r\\n\}/g,'\\n');
				});
			});
		}
		dict.from(dict.array);
		downloadFile('dict', ao.arrayToString(dict.array));
	});
	$('#downloadDictXLS').click(function(){
		let fn=formatName(location.search)+'_dict_'+Date.now()+'.xls';
		let sheet = XLSX.utils.aoa_to_sheet(dict.array);
		let html=XLSX.utils.sheet_to_html(sheet);
		let table=$(html).filter('table').get(0)
		let wb = XLSX.utils.table_to_book(table, {sheet:"Sheet1"});
		XLSX.writeFile(wb, fn);
	});

	// 提交所有翻译内容
	$('#mergeDict').on('click',function(e){
		if(confirm('[Warning] Are you sure you want to overwrite your work with dict?')) {
			$('#useDictTip').add('#useGoogle').add('#useNaver').add('#useDaum').prop('checked',false);
			$('#works td.target:not(:empty())').trigger({type:'keydown',keyCode:13,ctrlKey:true});
		}
	});

	// 下载任务
	$('#downloadWorksExcel').on('click',function(e){
		var fn=formatName(location.search)+'_works_'+Date.now()+'.xls';
		doit($('works').get(0), fn, 'xls');
	});
	$('#downloadWork').click(function(e){
		let
		ctrl=e.ctrlKey,
		shift=e.shiftKey,
		alt=e.altKey,
		meta=e.metaKey;

		$('#works table').each(function(_,table){
			let r=[], hasTextKey=false;
			if($('td.textKey').length) r.push('[FieldNames]\nTextKey\tText\tComment\n[Table]');

			$('tr',table).clone().find('td.no').remove().end().each(function(i,tr){
				var k=$('td.textKey',tr);
				var c=$('td.targetComment',tr).text().trim();
				var row=[];
				if(k.length){
					hasTextKey=true;
					var t=$('td.target',tr);
					row.push(k.get(0).textContent.trim());
					row.push(t.get(0).textContent.trim());
					if(ctrl){
						// empty comment add datetime
						if(!Boolean(c)) c=new Date().toISOString();
					}else if(shift){
						// all comment replace datetime
						c=new Date().toISOString();
					}
					row.push(c);
					r.push(row.join('\t'));
				}else{
					var row=[];
					$('td',tr).each(function(i,td){
						row.push(td.textContent.trim());
					});
					r.push(row.join('\t'));
				}
			});

			let name=table.getAttribute('dataname');
			console.log(name);

			var data=r.join('\n');
			// 下载works时，textKey。
			if(hasTextKey||ctrl||shift||alt||meta) {
				if(hasTextKey){
					downloadFileUcs2(name+'work', data);
				}else{
					downloadFile(name+'work', data);
				}
			}else{
				copyToTempResult(data);
			}
		});

		if($('#works table').length===0 && $('#works tr')!==0){
			$('#works').each(function(_,tbody){
				let r=[], hasTextKey=false;
				if($('td.textKey').length) r.push('[FieldNames]\nTextKey\tText\tComment\n[Table]');
				$('tr',tbody).clone().find('td.no').remove().end().each(function(i,tr){
					var k=$('td.textKey',tr);
					var c=$('td.targetComment',tr).text().trim();
					var row=[];
					if(k.length){
						hasTextKey=true;
						var t=$('td.target',tr);
						row.push(k.get(0).textContent.trim());
						row.push(t.get(0).textContent.trim());
						if(ctrl){
							// empty comment add datetime
							if(!Boolean(c)) c=new Date().toISOString();
						}else if(shift){
							// all comment replace datetime
							c=new Date().toISOString();
						}
						row.push(c);
						r.push(row.join('\t'));
					}else{
						var row=[];
						$('td',tr).each(function(i,td){
							row.push(td.textContent.trim());
						});
						r.push(row.join('\t'));
					}
				});

				let name='';

				var data=r.join('\n');
				// 下载works时，textKey。
				if(hasTextKey||ctrl||shift||alt||meta) {
					if(hasTextKey){
						downloadFileUcs2(name+'work', data);
					}else{
						downloadFile(name+'work', data);
					}
				}else{
					copyToTempResult(data);
				}
			});
		}









	});
	$('#downloadWorkT').click(function(e){
		var r=[],ctrl=e.ctrlKey,shift=e.shiftKey,alt=e.altKey,meta=e.metaKey;
		dict.array.forEach(function(e){
			e.forEach(function(v,i,a){
				a[i]=String(v).trim();
			});
		});
		$('#works td.target').each(function(i,td){
			r.push(td.textContent.trim());
		});
		r=r.filter(function(e){return e.length>0;});
		// var table=$('<table>').append($('#works').find('tr').clone()).get(0);
		// console.log(table);
		var data=r.join('\n');

		if(ctrl||shift||alt||meta) {
			downloadFile('work-t', data);
		}else{
			copyToTempResult(data);
		}
	});	

	// 清空任务
	$('#clearWork').click(function(){
		if(confirm('Warning! Delete the missions?')) {
			$('#works').empty();
			$('#tips').empty();
		}
	});
	// 清空任务
	$('#clearDict').click(function(){
		if(confirm('Warning! Delete the dictionary?')) {
			$('#works').empty();
			$('#tips').empty();
			$('#downloadDict').trigger('click');
			setTimeout(function(){
				dict.array=[];
				pushlog('Clear dictionary')
			});
		}
	});


	// 选择任务
	$('#selectWorks').click(function(){
		var s=window.getSelection();
		s.removeAllRanges();
		s.selectAllChildren($('#works').get(0));
		document.execCommand('copy',true);
	})

	// 过滤词典
	function myFilter(id,cls) {
		var _cls=cls.slice(0,1).toUpperCase()+cls.slice(1).toLowerCase();
		$('#'+id+_cls+'Filter').on('input',function(e){
			var tar=e.target,v=tar.value;
			if(v.length>0){
				$('#'+id).find('.'+cls).each(function(i,e){
					var regexp=Search.getRegExp(v,'gm',$('#'+id+_cls+'RegExp').prop('checked'));
					if( regexp.test(e.textContent) ) {
						$(e).parent().removeClass('hide');
					}else{
						$(e).parent().addClass('hide')
					}
				});
			}else{
				$('#'+id).find('.'+cls).parent().removeClass('hide hide2');
			}	
		});
	}

	myFilter('statusDict','source');
	myFilter('statusDict','target');
	myFilter('works','source');
	myFilter('works','target');
	myFilter('tips','source');
	myFilter('tips','target');

	function mySearch(id,cls){
		var _cls=cls.slice(0,1).toUpperCase()+cls.slice(1).toLowerCase();
		$('#'+id+_cls+'Search').on('input',function(e){
			var t=e.target, v=t.value;
			if(v.length>0){
				$('#'+id).find('.'+cls).each(function(i,e){
					var regexp=Search.getRegExp(v,'gm',$('#'+id+_cls+'RegExp').prop('checked'));
					if( regexp.test(e.textContent) ) {
						$(e).parent().removeClass('hide2');
					}else{
						$(e).parent().addClass('hide2')
					}
				});
			}else{
				$('#'+id).find('tr').removeClass('hide2');
			}
		});
	}

	mySearch('statusDict','source');
	mySearch('statusDict','target');
	mySearch('works','source');
	mySearch('works','target');
	mySearch('tips','source');
	mySearch('tips','target');

	function myReplace(id,cls){
		var _cls=cls.slice(0,1).toUpperCase()+cls.slice(1).toLowerCase();
		$('#'+id+_cls+'Replace').on('keydown',function(e){
			if(e.keyCode===13 && confirm('Are you sure you want to replace?')){
				e.preventDefault();
				var s=$('#'+id+_cls+'Search').val();
				var r=$('#'+id+_cls+'Replace').val();
				var regexp=Search.getRegExp(s,'gm',$('#'+id+_cls+'RegExp').prop('checked'));
				// 过滤替换
				$('#'+id+' tr:not(.hide,.hide2) td.'+cls).each(function(i,e){
					e.textContent=e.textContent.replace(regexp,r).trim();
				});
				setTimeout(function(){
					$('#'+id+_cls+'Search,#'+id+_cls+'Replace').val('');
					$('#'+id+_cls+'Search').trigger('input');
				});
			}
		});
	}

	myReplace('statusDict','source');
	myReplace('statusDict','target');
	myReplace('works','source');
	myReplace('works','target');
	myReplace('tips','source');
	myReplace('tips','target');


	$('#tipsSourceFilterAll').on('change',function(e){
		var id='#tips';
		$(id).empty();
		var v=e.target.value;
		if(v.length>0){
			var regexp=Search.getRegExp(v,'gm',$(id+'SourceRegExp').prop('checked'));
			console.log(regexp);
			var a=dict.array, i=a.length, e, tr,s,t,m,count=1;
			while(true){
				if(--i===-1) break;
				regexp.lastIndex=undefined;
				e=a[i];
				if(e){
					s=e[0];
					t=e[1];
					if(s&&t){
						m=regexp.test(s);
						if(m){
							regexp.lastIndex=undefined;
							no =$('<td class="no"></td>').text(count++);
							m =$('<td class="match"></td>').text(Array.from(s.match(regexp)).join('\n'));
							s =$('<td class="source" contenteditable="plaintext-only"></td>').text(s);
							t =$('<td class="target" contenteditable="plaintext-only"></td>').text(t);
							$('<tr>')
							.append(no)
							.append(s)
							.append(t)
							.append(m)
							.append($('<td class="index"></td>').text(i))
							.appendTo(id);
							regexp.lastIndex=undefined;
							console.log()
						}
					}else{
						a.splice(i,1);
					}
				}else{
					a.splice(i,1);
				}
			}
		}else{
			$(id).empty();
		}
	});

	$('#tipsTargetFilterAll').on('change',function(e){
		var id='#tips';
		$(id).empty();
		var v=e.target.value;
		if(v.length>0){
			var regexp=Search.getRegExp(v,'gm',$(id+'TargetRegExp').prop('checked'));
			console.log(regexp);
			var a=dict.array, i=a.length, e, tr,s,t,m,count=0;
			while(true){
				if(--i===-1) break;
				regexp.lastIndex=undefined;
				e=a[i];
				if(e){
					s=e[0];
					t=e[1];
					if(s&&t){
						m=regexp.test(t);
						if(m){
							regexp.lastIndex=undefined;
							no =$('<td class="no"></td>').text(count++);
							m =$('<td class="match"></td>').text(Array.from(t.match(regexp)).join('\n'));
							s =$('<td class="source" contenteditable="plaintext-only"></td>').text(s);
							t =$('<td class="target" contenteditable="plaintext-only"></td>').text(t);
							$('<tr>')
							.append(no)
							.append(s)
							.append(t)
							.append(m)
							.append($('<td class="index"></td>').text(i))
							.appendTo(id);
							regexp.lastIndex=undefined;
							console.log()
						}
					}else{
						a.splice(i,1);
					}
				}else{
					a.splice(i,1);
				}
			}
		}else{
			$(id).empty();
		}
	});

	// if(dict && dict.array) pushlog('Update Dictionary: '+dict.array+length+'ea');

	$('#useDictTip').on('click',function(e){
		if(e.target.checked===false){
			$('#tips').empty();
			$('#statusDict').empty();
		}
	});


	// 需要从记录中全文匹配，如果没有则智能匹配。auto100
	$('#MatchWork100').click(function(clickEvent){
		clickEvent.preventDefault();
		var o={};
		dict.array.forEach(function(e){
			// 去掉左右空白后，再整理出键值对。
			e[0]=String(e[0]).trim();
			e[1]=String(e[1]).trim();
			if(e[0]&&e[1]){
				o[e[0]]=e[1];
			}
		});
		$('#works').find('tr').each(function(i,tr){
			var s=$(tr).find('.source');
			var st=s.text().replace(/\{\\r\\n\}/g,'\\n').trim();
			var t=$(tr).find('.target');

			// 直接找到一致内容。
			if(st in o) {
				if(clickEvent.altKey) return t.parent().remove();
				return t.text(o[st]).css({'background':$('#ctrlEnterColor').val()});
			}

			// 如果没有直接找到一致内容，则需要只能匹配了。
			// 智能忽略空格匹配
			var regexp=new RegExp('^'+Search.getRegExp(st).source+'$');
			for(var k in o){
				if(regexp.test(k)) {
					// 找到一致内容
					if(clickEvent.altKey) return t.parent().remove();
					return t.text(o[k]).css({'background':'#ccc'});
				}
			}
			// 只能忽略数字英文符号等的匹配。
			var filterRegExp=/[\x00-\xff]/g, _k,_v;
			for(var k in o){
				_k=k.replace(filterRegExp,'');
				if(_k==st.replace(filterRegExp,'')) {
					let v=smartMatch(st, [k,o[k]], dict.unique());
					t.text(v).css({'background':'#f005'});
					return ;
				}
			}

			// 实在是没有找到，需要做最后的处理。
			// 按下ctrl时，保留原来内容。按下alt时，删除找到的内容。找到内容时，自动替换背景颜色为灰色。
			if(clickEvent.ctrlKey) {
				t.text('').removeAttr('style');
			}
		});
	});


	$('#numQA').click(function(e){
		$('#works td.qa').remove();
		$('#numQA').prop('running', !$('#numQA').prop('running'))
		if(!$('#numQA').prop('running')) {
			$('#worksTargetFilter').val('').trigger('input');
			$('#useDictTip').prop('checked',true);
			$('#numQA').css('boxShadow','');
			return ;
		}

		$('#numQA').css('boxShadow','0 0 4px #F0F');
		$('#useDictTip').prop('checked',false);

		$('#worksTargetFilter').val('numQA');
		var count=0;
		$('#works tr').removeClass('hide,hide1,hide2,hide3');
		$('#works tr').each(function(i,tr){
			var qa=$(tr).find('.qa');
			if(qa.length===0){
				qa=$('<td class="qa">').appendTo(tr);
			}

			var source=$(tr).find('td.source').eq(0).text()||'';
			var target=$(tr).find('td.target').eq(0).text()||'';

			var s,t,sm,tm;
			sm=source.match(asciiNospace);
			s=sm ? Array.from(sm) : [];


			tm=target.match(asciiNospace);
			t=tm ? Array.from(tm) : [];
			if(s.join('').split('').sort().join('')===t.join('').split('').sort().join('')) return ;

			if(s.length!==t.length){

				// $(tr).find('td.target').css('background','#f96');
				count++;
				if(s) {
					let _s=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
					for(let i=0, len=s.length, v; i<len; i++){
						$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(s[i]).appendTo(_s);
					}
				}
				if(t) {
					let _t=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
					for(let i=0, len=t.length, v; i<len; i++){
						$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(t[i]).appendTo(_t);
					}
				}
				qa.css('background','#fdd');
			}else{
				var resplan='B';
				s.sort();
				t.sort();
				// $(tr).find('td.target').css('background','#f69');
				if(s) {
					let _s=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
					for(let i=0, len=s.length, v; i<len; i++){
						$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(s[i]).appendTo(_s);
					}
				}
				if(t) {
					let _t=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
					for(let i=0, len=t.length, v; i<len; i++){
						$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(t[i]).appendTo(_t);
					}
				}
				if(s.join('').split('').sort().join('')===t.join('').split('').sort().join('')) {
					resplan='C';
					// $(tr).find('td.target').css('background','#ff9');
					return qa.css('background','#ffd');
				}
				qa.css('background','#fee');
				count++;

			}
		});
		$('#works td.qa:empty()').parent().addClass('hide');
		if(count) pushlog('🍀','Found numeric mismatchs, '+count+'ea, Good luck!');
		else pushlog('☘','Did not find numeric mismatchs.');
	});

	$('#dictQA').on('click',function(){
		$('#worksTargetFilter').val('dictQA');
		var tmpDict=filterDict();

		$('#works tr').each(function(_,tr){
			var qa=$(tr).find('.qa');
			if(qa.length===0){
				qa=$('<td class="qa">').appendTo(tr);
			}
			var qars=[];
			var s=$(tr).find('.source');
			var t=$(tr).find('.target');

			tmpDict.forEach(function(e,i){
				// **** qa ddb
				var ds=e[0],dt=e[1];
				if(Search.getRegExp(ds).test(s.text())) {
					if(!Search.getRegExp(dt).test(t.text())){
						qars.push($('<li>').text(ds+'👁'+dt).get(0).outerHTML);
					}
				}
			});
			qa.html('<ol>'+qars.join('')+'</ol>');
		});
	});


	// import text lines
	$('#ImportTextLines').click(function(e){
			var str;
			var arr;
			var target;
			var div = $("<div>").css({
				position: "fixed",
				top: 0,
				width: "40%",
				right: 10,
				bottom: 10,
				border: "2px solid blue",
				padding: 24,
				background: "rgba(0,0,0,0.5)",
				zIndex: 99999999999
			}).appendTo("body");
			var msg = $("<h5>").text("use lines...").css({
				"background": "rgba(255,255,255,0.9)",
				"font-weight": "bold"
			}).appendTo(div);
			var ok = $("<button>").text("done").on("click",
			function() {
				str = ta.val().trim();
				arr = str.split("\n");
				ta.remove();
				ok.remove();
				msg.text("Please thouch <down> key").appendTo(div);
				$(document).on("keydown", ".target", doWork);
				div.css({
					width: 200,
					height: 200,
					top: 0,
					right: 10
				})
			}).appendTo(div);
			var ng = $("<button>").text("cancel").on("click",
			function() {
				div.remove();
				$(document).off("keydown", doWork)
			}).appendTo(div);
			div.append("<br>");
			var ta = $("<textarea>").appendTo(div).css({
				width: "100%",
				height: window.innerHeight / 2
			});
			function doWork(e) {
				if (e.keyCode !== 40) {
					return
				}
				var v = arr.shift();
				if (v) {
					e.preventDefault();
					e.target.textContent=v;
					$(e.target).parent().nextAll().not('.hide,hide1,.hide2,.hide3,.hide4').eq(0).find('.target').focus();
					msg.text(arr.length + "ea");
					if (arr.length === 0) {
						msg.text("complete.").appendTo(div).css({
							background: "rgba(0,255,0,0.2)"
						});
						$(document).off("keydown", doWork);
						div.remove();
					}
				}
			}
	});


	// 查找替换按钮
	function activeSRButton(id){
		$('#'+id).on('click',function(e){
			if(!confirm('Are you sure you want to replace?')) return false;

			var id=e.target.getAttribute('id').replace('Button','');
			if(id){
				$('#'+id).trigger({type:'keydown',keyCode:13});
				console.log(id)
			}
		});
	}

	activeSRButton('statusDictSourceReplaceButton');
	activeSRButton('statusDictTargetReplaceButton');
	activeSRButton('worksSourceReplaceButton');
	activeSRButton('worksTargetReplaceButton');
	activeSRButton('tipsSourceReplaceButton');
	activeSRButton('tipsTargetReplaceButton');




	setTimeout(function(){
		if(dict && dict.array && dict.array.length){
			pushlog('Dictionary have '+dict.array.length +'ea.', {'background':'#00F',color:'#FFF'});
		}
	},1000);

})

var lastSourceSelectionText, lastTargetSelectionText;
window.addEventListener('loaddropfiles',function(e){
	// e.datas  [ {type, name, data} ,...]
	// return console.log(e.datas);
	let ls=ao.ls, table, datas=e.datas, name,type,data;
	for(let i=0, len=datas.length; i<len; i++){
		name=datas[i].name;
		type=datas[i].type;
		data=datas[i].data;
		table=ao.tmstringToTable(data);
		// console.log('-'.repeat(32));
		// console.log(name);
		// console.log(type);
		// console.log(data);

		$(table)
		.find('.target').each(function(i,e){
			$(e).attr('tabindex',i+1000000);// 1000000~开始给tabindex序号
		})
		.end().attr({dataType:type,dataName:name});
		
		if(type==='tmtool') table.classList.add('tmtoolfile');
		$('#works').append(table);
	}
},true);



// loadDatas
$(function(){
	// var ls=ao.ls;
	// try{
	// 	$('#works').html(ls.get('works'));
	// 	setTimeout(function(){
	// 		$('#works tr').removeClass('hide hide2');
	// 	},1000);
	// }catch(err){
	// 	$('#works').html('');
	// }

	// try{
	// 	dict=new Reference(ls.get('dict'));
	// }catch(err){
	// 	dict=new Reference([]);
	// }

	// var t;
	// t=ls.get('ctrlEnterColor');
	// if(t){
	// 	$('#ctrlEnterColor').val(t)
	// }

	// t=ls.get('useGoogle');	if(t){$('#useGoogle').prop('checked',t); };
	// t=ls.get('useNaver');	if(t){$('#useNaver').prop('checked',t); };
	// t=ls.get('useDaum');	if(t){$('#useDaum').prop('checked',t); };
	// t=ls.get('netTarget');	if(t){$('#netTarget').val(t); };

	let tm=localforage.createInstance({name:'tm'});
	tm.getItem(formatName(location.search)+'works', (j,v)=>{ if(j){console.warn('[Error] No read works. '+j.message)}else if(v){ $('#works').html(v).find('*').removeClass('hide hide2 hide3 hide4'); } });
	tm.getItem(formatName(location.search)+'dict', (j,v)=>{ if(j){ console.warn('[Error] No read dict . '+j.message); addDict() }else if(v){ addDict(v); } });
	tm.getItem(formatName(location.search)+'ctrlEnterColor', (j,v)=>{ if(j){ console.warn('[Error] No read ctrlEnterColor . '+j.message); }else if(v){ $('#ctrlEnterColor').val(v); } });
	tm.getItem(formatName(location.search)+'useGoogle', (j,v)=>{ if(j){ console.warn('[Error] No read useGoogle . '+j.message); }else if(v){ $('#useGoogle').prop('checked',v);console.log('google',v); } });
	tm.getItem(formatName(location.search)+'useNaver', (j,v)=>{ if(j){ console.warn('[Error] No read useNaver . '+j.message); }else if(v){ $('#useNaver').prop('checked',v);console.log('naver',v); } });
	tm.getItem(formatName(location.search)+'useDaum', (j,v)=>{ if(j){ console.warn('[Error] No read useDaum . '+j.message); }else if(v){ $('#useDaum').prop('checked',v);console.log('daum',v); } });
	tm.getItem(formatName(location.search)+'useDictTip', (j,v)=>{ if(j){ console.warn('[Error] No read useDictTip . '+j.message); }else if(v){ $('#useDictTip').prop('checked',v);console.log('useDictTip',v); } });

});

function saveDatas(){
	// var ls=ao.ls;
	// try{ls.set('works', $('#works').html()); }catch(err){ pushlog('😱 no save works.'); }
	// try{ ls.set('dict',dict.array); } catch(err) { pushlog('😱 no save dict.'); }
	// try{ ls.set('ctrlEnterColor', $('#ctrlEnterColor').val()); } catch(err) { pushlog('😱 no save ctrlEnterColor.'); }
	// try{ ls.set('useGoogle', $('#useGoogle').prop('checked')); } catch(err) { pushlog('😱 no save useGoogle'); }
	// try{ ls.set('useNaver', $('#useNaver').prop('checked')); } catch(err) { pushlog('😱 no save useNaver'); }
	// try{ ls.set('useDaum', $('#useDaum').prop('checked')); } catch(err) { pushlog('😱 no save useDaum'); }
	// try{ ls.set('netTarget', $('#netTarget').val()); } catch(err) { pushlog('😱 no save netTarget'); }
	// pushlog('😊 save datas',{position:'fixed',bottom:100});

	let tm=localforage.createInstance({name:'tm'});
	tm.setItem(formatName(location.search)+'works', $('#works').html()).catch((e)=>{ if(e){alert('[Error] no save works. '+e.message);}}).then(v=>{console.log('[save] works, ok.')});
	if(dict && dict.array) tm.setItem(formatName(location.search)+'dict', dict.array).catch((e)=>{ if(e){alert('[Error] no save dict. '+e.message);}}).then(v=>{console.log('[save] dict, ok.')});
	tm.setItem(formatName(location.search)+'ctrlEnterColor', $('#ctrlEnterColor').val()).catch((e)=>{ if(e){alert('[Error] no save ctrlEnterColor. '+e.message);}}).then(v=>{console.log('[save] ctrlEnterColor, ok.')});
	tm.setItem(formatName(location.search)+'useGoogle', $('#useGoogle').prop('checked')).catch((e)=>{ if(e){alert('[Error] no save useGoogle. '+e.message);}}).then(v=>{console.log('[save] useGoogle, ok.')});
	tm.setItem(formatName(location.search)+'useNaver', $('#useNaver').prop('checked')).catch((e)=>{ if(e){alert('[Error] no save useNaver. '+e.message);}}).then(v=>{console.log('[save] useNaver, ok.')});
	tm.setItem(formatName(location.search)+'useDaum', $('#useDaum').prop('checked')).catch((e)=>{ if(e){alert('[Error] no save useDaum. '+e.message);}}).then(v=>{console.log('[save] useDaum, ok.')});
	tm.setItem(formatName(location.search)+'useDictTip', $('#useDictTip').prop('checked')).catch((e)=>{ if(e){alert('[Error] no save useDictTip. '+e.message);}}).then(v=>{console.log('[save] useDictTip, ok.')});
}


let lastAutoSaveTimeStamp;
// autoSaveData
$(window).on('blur',(e)=>{
	e.preventDefault();

	// 保存间隔不至少 30s
	lastAutoSaveTimeStamp=lastAutoSaveTimeStamp||0;
	if( (Date.now()-lastAutoSaveTimeStamp)>30000 ) {
		saveDatas();
		lastAutoSaveTimeStamp=Date.now();
	}
});

/*
1	11
2	22
3	33
*/
function pushlog(){
	var clog=createCustomLog.apply(null,arguments);
	if(clog){
		if(pushlog.prev){
			pushlog.prev.appendTo('#clogs');
		}
		let left=(window.innerWidth-clog.width())/2;
		clog.css({position:'fixed',bottom:99,left:left}).animate({bottom:77});
		setTimeout(()=>{
			$('#clogs').find('tr:gt(30)').remove();
			$('#clogs').prepend(clog);
			$(clog).css({position:'inherit',bottom:'auto',right:'auto'});
		},5000);
	}
}
pushlog.prev;
function createCustomLog(){
	if(arguments.length===0) return ;
	let tr=$('<tr class="clog"></tr>');
	Array.prototype.forEach.call(arguments,function(e){
		if(typeof e ==='string') {
			$('<td></td>').text(e).appendTo(tr);
		}else if(!(e instanceof Array) && typeof e==='object'){
			tr.css(e);
		}else{
			$('<td>').text(String(e)).appendTo(tr);
		}
	});
	tr.appendTo('body');
	return tr;
}



function downloadFile(filename, content){
	var a = document.createElement('a');
	var blob = new Blob([content]);
	var url = window.URL.createObjectURL(blob);
	filename = filename+formatName(location.search)+'_'+Date.now()+'.txt';

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
		// console.log(bn);
	}
}

// 格式化名称
function formatName(n){
	return n.replace(/[\\\/\:\*\?\"\<\>\|\&\-\+\=\`\~\%\!\@\#\$\%\^\,\.\;\:\'\(\)\{\}\[\]\s]/g,'_');
}

// 过滤dictArray的source空格分隔数小于等于n
function filterStep(arr,n=0){
	return arr.filter(function(e){
		var v=e[0];
		if(v){
			v=v.trim().match(/\s+/g);
			if(v){
				return v.length<=n;
			}else{
				return true;
			}
		}
		return false;
	});
}

// 过滤一些标签
function filterTag(arr){
	var rs=[],regExp=/\[[a-z0-9\-]+?\]|\{[\d+?]\}|[\(\)\[\]\{\}\<\>\"\'\`\!\！\,\，\.\。\…\?\？]|^\d+$/ig;
	arr.forEach(function(e){
		var s=e[0],t=e[1];
		if(s){
			s=s.trim();
			if(s){
				s=s.replace(regExp,'');
				if(t){
					t=t.replace(regExp,'');
				}
				rs.push([s,t]);
			}
		}
	});
	return rs;
}

function filterLength(arr,max=16,min=2){
	return arr.filter(function(e){
		var s=e[0];
		if(s){
			s=s.trim();
			if(s){
				var length=s.length;
				return length<=max && length>=min;
			}
		}
		return false;
	})
}

function filterDict(){
	var rs=filterStep(dict.array,0);
	rs=filterTag(rs);
	rs=filterLength(rs,10);
	return rs;
}





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


$(document).on('keydown',function(e){
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
						// console.log(key,t,v);

						console.log('k',e)
						if($(e.target).is('#works td.source')){
							console.log('ok')
							var target=$(e.target).next();
							if(target.is('#workd td.target')){
								console.log('ook')
								target.focus();
							}
						}
					}
					break;
				}
		}
	}
});


$(document).on('mousedown','#tips td,#statusDict td',function(e){
	if(e.which===3 && !$(e).is('.source') && !$(e).is('.target')){
		e.preventDefault();
		var t=$(e.target).parent('tr').find('td').last().text();
		if(parseInt(t)!=t) return false;
		if(confirm('[!] Delete '+t+'?')){
			var l=dict.array.length;
			var item=dict.array.splice(t,1);
			$(e.target).parent('tr').remove();
			pushlog('Remove',l+'→'+dict.array.length,item);
		}
	}
});

// downloadExcel
function doit(table,fn,type,dl){
	var elt = document.getElementById('works');
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet1"});
	return dl ?
		XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
		XLSX.writeFile(wb, fn || ('test.' + (type || 'xlsx')));
}

function smartMatch(source,sourceTargetArray,dictArray){
	var ret='';
	var o=strDiff(source,sourceTargetArray[0]);
	var d1=o.diff1, d2=o.diff2, len1=d1.length, len2=d2.length,d1Value,d2Value;
	var regexp=/^[\x01-\xff]+$/;
	if(len1===len2) {
		var startResult=[];
		startResult.push('⁉ Replace');
		ret=sourceTargetArray[1];
		for(var i=0; i<len1; i++) {
			d1Value=d2Value='';
			if(regexp.test(d1[i])) {
				ret=ret.replace(d2[i], d1[i]);
				startResult.push(d2[i]+' -> '+d1[i]);
			}else{
				dictArray.some(function(e){
					if(e && (typeof e[0]==='string') && e[0] && (typeof e[1]==='string') && e[1]){
						if(e[0].trim()===d1[i].trim()) d1Value=e[1].trim();
						if(e[0].trim()===d2[i].trim()) d2Value=e[1].trim();
						if(d1Value&&d2Value) return true;
					}
				});
				if(d2Value){
					ret=ret.replace(d2Value,d1Value||d1[i]);
					if(d1Value){
						startResult.push(d2Value+' -> '+d1Value);
					}else{
						startResult.push(d2Value+' *> '+d1[i]);
					}
				}else{
					if(d1Value){
						startResult.push(d2[i]+' *> '+d1Value);
					}else{
						startResult.push(d2[i]+' *> '+d1[i]);
					}
				}
			}
		}
		startResult.push('[Use] '+sourceTargetArray[1]);
		pushlog.apply(null,startResult);
	}else if(len1==0){
		// len2多，所以要删除多余的部分
		var startResult=[];
		startResult.push('⁉ Remove');
		ret=sourceTargetArray[1];
		for(var i=0; i<len2; i++) {
			d2Value='';
			if(regexp.test(d2[i])) {
				ret=ret.replace(d2[i], '');
			}else{
				dictArray.some(function(e){
					if(e && (typeof e[0]==='string') && e[0] && (typeof e[1]==='string') && e[1]){
						if(e[0].trim()===d2[i].trim()) {
							d2Value=e[1];
							return true;
						}
					}
				});
				if(d2Value){
					ret=ret.replace(d2Value,'');
					startResult.push('[x] '+d2Value);
				}else{
					startResult.push('[*] '+d2[i]);
				}
			}
		}
		startResult.push('[Use] '+sourceTargetArray[1]);
		pushlog.apply(null,startResult);
	}else if(len2==0){
		// len1多，所以要找到内容，添加进去
		var startResult=[];
		ret=sourceTargetArray[1];
		startResult.push('‼ Add');
		for(var i=0; i<len1; i++) {
			d1Value='';
			if(regexp.test(d1[i])) {
				startResult.push('[*]'+d1[i]);
			}else{
				dictArray.some(function(e){
					if(e && (typeof e[0]==='string') && e[0] && (typeof e[1]==='string') && e[1]){
						if(e[0].trim()===d1[i].trim()) {
							d1Value=e[1];
							return true;
						}
					}
				});
				if(d1Value){
					startResult.push('[*] '+d1Value);
				}else{
					startResult.push('[*] '+d1[i]);
				}
			}
		}
		startResult.push('[Use] '+sourceTargetArray[1]);
		pushlog.apply(null,startResult);
	}else{
		ret=sourceTargetArray[1];
		var startResult=[];
		startResult.push('❌ No smart');
		startResult.push('[*]'+d1.join('|')+' <- '+d2.join('|'));
		pushlog.apply(null,startResult);
		// ❌💯‼️⁉️
	}
	return ret;
}

function strDiff(str1, str2, separator){
	str1 = str1 || "";
	str2 = str2 || "";
	separator = separator || /\b|[\s,\.\!_\-\+]+|\{\\r\\n\}|\\n/;
	// arr中有ele元素
	function hasElement(arr, ele){
		// 内存循环
		var hasItem1 = false;
		for(var i2=0; i2 < arr.length; i2++){
			//
			var item2 = arr[i2] || "";
			if(!item2){
				continue;
			}
			//
			if(ele == item2){
				hasItem1 = true;
				break;
			}
		}
		return hasItem1;
	};
	function inAnotB(a, b){ // 在A中，不在B中
		var res = [];
		for(var i1=0; i1 < a.length; i1++){
			var item1 = a[i1] || "";
			if(!item1){
				continue;
			}
			var hasItem1 = hasElement(b, item1);
			if(!hasItem1){
				res.push(item1);
			}
		}
		return res;
	};
	//
	var list1 = str1.split(separator);
	var list2 = str2.split(separator);
	//
	var diff1 = inAnotB(list1, list2);
	var diff2 = inAnotB(list2, list1);
	// 返回结果
	var result = {
		diff1:diff1,
		diff2:diff2,
		separator : separator
	};
	return result;
};


// 查找表情符号用
function imo(begin,count){ while(count-->0) console.log(String.fromCharCode(55357,begin++)); }


// var password='a';
// if(ao.ls.get('licensePassword')!==password){
// 	var licensePassword=prompt('Input your license Password!');
// 	if(licensePassword===password) {
// 		ao.ls.set('licensePassword',licensePassword);
// 		// document.write('You do not have permission');
// 	}else{
// 		alert('You do not have permission. '+licensePassword);
// 		location.href=location.href;
// 	}
// }



// $(document).on('keydown','#tempResult',function(e){
// 	if(e.keyCode===27){
// 		hideTempResult();
// 	}
// })
// function showTempResult(text){
// 	$('#tempResult').text(text).height(window.innerHeight).removeClass('hide').trigger('select');
// 	document.execCommand('copy',true);
// 	hideTempResult();
// }
// function hideTempResult(){
// 	$('#tempResult').addClass('hide').text('');
// }
function copyToTempResult(data) {
	$('#tempResult').text(data).trigger('select');
	document.execCommand('copy',true);

	var length=data.length;
	pushlog('Copyed', length>50? (data.slice(0,50)+'...('+length+')') : data);
}

function downloadFileUcs2(filename,content){
	content=content.replace(/\n/g,'\r\n');
	content=punycode.ucs2.decode(content);
	content.unshift(0xfeff);
	content= Uint16Array.from(content);
	var a = document.createElement('a');
	var blob = new Blob([content]);
	var url = window.URL.createObjectURL(blob);
	filename = filename+formatName(location.search)+'_'+Date.now()+'.txt';

	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

$(document).on('contextmenu','#works td.no', function(e){
	if(confirm('[Warning] Delete row '+e.target.textContent+'?!')){
		e.preventDefault();
		e.target.parentElement.remove();
	}
});

/*
智能匹配任务
源：검성 라시드의 비밀

已知：
	검성 라시드	剑圣拉希德
	라시드의 비밀	拉希德的秘密

推荐翻译：
검성 라시드의 비밀	剑圣拉希德的秘密

推荐词库收录：
검성	剑圣
라시드	拉希德
비밀	秘密




Inconsistency in Source
原文一样，译文不同。(空格敏感)
原文不同，译文一样。(空格敏感)

Tag Mismatch
原文中的某些<[()]>标签，在译文中有所不同。

Numeric Mismatch
原文中的数字，与译文中的内容有所不同。


Alphanumeric Mismatch Source(AD2DB57FF) Target(ADD625FF)
原文多进制数字，与译文中的内容有所不同。

Unpaired Symbol
不成对的符号
()[]{}<>没有开或关，就是没有配套出现。

Unpaired Quotes
各种开始或结束的没有匹配到的" ' 中文的全角‘’


*/
