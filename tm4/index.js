console.log('version', 4 );

let log = function (s, size = 5) {
	console.log("%c" + s, " text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:" + size + "em");
};
// log('TM 4');
// log('ddb@aonun.com', 2);


let SM = {
	s: window.getSelection(),
	get range() {
		return this.s.getRangeAt(0);
	},
	set range(v) {
		if (v instanceof Range) {
			this.s.removeAllRanges();
			this.s.addRange(v);
		}
	},
	get text() {
		return this.r.toString();
	},
	set text(v) {
		this.range.deleteContents();
		this.range.insertNode(document.createTextNode(v));
		this.range.collapse();
	}
};


let code_similar = `(function(g){if(typeof g.ao==='undefined'){g.ao={};}var r=g.ao.similar=function similar(t,s,u){if(null===t||null===s||void 0===t||void 0===s)return 0;var n,o,e,l,f=0,i=0,b=0,c=(t+="").length,h=(s+="").length;for(n=0;n<c;n++)for(o=0;o<h;o++){for(e=0;n+e<c&&o+e<h&&t.charAt(n+e)===s.charAt(o+e);e++);e>b&&(b=e,f=n,i=o)}return(l=b)&&(f&&i&&(l+=r(t.substr(0,f),s.substr(0,i))),f+b<c&&i+b<h&&(l+=r(t.substr(f+b,c-f-b),s.substr(i+b,h-i-b)))),u?200*l/(c+h):l};})(this);`;
let code_Reference = `class Reference{
	constructor(arr){if(!(arr instanceof Array)) arr=[]; this.from(arr); }
	from(arr) {this.array=Reference.unique(arr); }
 	add(source,target){this.array.push([source,target]); this.from(this.array); }
	static enlistKey(arr){return arr.filter(function(e){return e[0] && e.toString().trim().length>0; }); }
	unique(arr){
		return arr;
	}
	static unique(arr){
		return arr;
	}
	// [ ['source','target','other', ...], ... ]
	concat(arr) {
		this.from(this.array.concat(arr));
	}

	search(s,p=0,i=0){
		var r=this.result=[];
		if(typeof s==='undefined' || typeof s!=='string') return r;
		this.array.forEach(function(e,index){
			var _s=e[i], sv=similar(s, e[i], true);
			if(sv >= p) {
				r.push(([]).concat(e,sv,index));
			}
		});

		r.sort(function(a,b){
			// 0:source, 1:target, 2:similar, 3:index
			var a_similar=parseFloat(a[2]);
			var b_similar=parseFloat(b[2]);
			if(a_similar===b_similar) {
				var a_index=parseFloat(a[3]);
				var b_index=parseFloat(b[3]);
				return a_index>b_index? -1: (a_index===b_index? 0 : 1)
			}else{
				return a_similar>b_similar?-1:(a_similar===b_similar?0:1);
			}
		});
		// console.log(s,r,this.array);
		// r.reverse();
		return r;
	}
	searchAll(s,p=0){
		var r=this.result=[];
		if(typeof s==='undefined' || typeof s!=='string') {
			return r;
		}
		this.array.forEach(function(e){
			var sv;
			var b = e.some(function(ee){
				sv = similar(s, ee, true);
				return sv >= p;
			});
			if(b) {
				r.push([sv].concat(e));
			}
		});
		return r;
	}
};

function similar(a,b,c=true) {
	return Number(ao.similar(a,b,c).toFixed(2));
};`;
let code_Search_min = `class Search {
	static _getRegExp(v) {
		v=v.replace(Search.REGEXP_SPACES,'')
		if(v==='') return '';
		var s=Search.SPACES;
		return s+v.split('').map(function(e){return e.replace(Search.REGEXP_TOKENS,'\\\\$&');}).join(s)+s;
	}
	static getRegExp(v,options,noFormat) {
		if(!v) return ;
		if(noFormat) {
			try{
				v=new RegExp(v,'g');
				return v;
			}catch(err){
				console.warn('Invalid argument - new RegExp('+v+',"g")');
			}
		}
		v=v.split('\\\\');
		v=new RegExp(v.map(Search._getRegExp).join('\\\\\\\\'),options);
		v= v.source==='(?:)' ? Search.VIRTUAL_REGEXP : v;
		return v;
	}
}
Object.defineProperties(Search, {
	REGEXP_TOKENS : {value:/[\\/\\?\\*\\+\\-\\^\\$\\(\\)\\<\\>\\[\\]\\{\\}\\.\\,\\:\\&\\|]/g},
	REGEXP_SPACES : {value:/\\s+/g},
	SPACES        : {value:'\\\\s*'},
	VIRTUAL_REGEXP: {value:{test:function(){return false;},match:function(){return null;}}}
});
`;


// statusDict tip
let lwsd2 = new LocaleWorker('searchDictionary2',
	(e) => {
		let data = e.data, status = data[0], res;
		if (status === 200) {
			lwsd2.done = true;
			// 显示到#statusDict中
			res = data[1];
			$('#statusDict').empty();
			res.sort(function (a, b) {
				return a[0].length === 1 ? 1 : 0;
			});
			res.forEach((kv, i) => {
				$('<tr>').appendTo('#statusDict')
					.append($('<td class="no">').text(i + 1))
					.append($('<td class="source">').text(kv[0]))
					.append($('<td class="target" contenteditable="plaintext-only">').text(kv[1]))
					.append($('<td class="similar">').text('Auto'))
					.append($('<td class="index">').text(kv[2]))
			});
		}
	}, code_Search_min + `
function stringNormalize(s){
	console.log('stringNormalize');
    // return typeof s!=='undefined' ? String(s).replace(/[\\x00-\\xff]/g,'') : s;
    return s;
}

addEventListener('message',(e)=>{
	let a=e.data, status=a[0], source, res, array;
	if(status===100){
		// send(100,source,dict.array);
		// a[1] text
		// a[2] dict
		source=a[1];
		array=a[2];

		source=stringNormalize(source);
		res=[];

		array.forEach(function(kv,index){
		    let k=kv[0], v=kv[1], _k=stringNormalize(k);
		    let re= Search.getRegExp(_k.length>0 ? _k : k);
		    if(re.test(source)) {
		        res.push([k,v,index]);
		    }
		});

		res.sort((a,b)=>String(a[0]).length<String(b[0]).length)
		res.reverse();
		send(200,res);
	}
});
`);
lwsd2.done = true;


// tips
let lwsd = new LocaleWorker('searchDictionary',
	(e) => {
		let data = e.data;
		if (data[0] === 200) {
			lwsd.done = true;
			let a = data[1];
			let table = ao.arrayToTable(a);
			// 显示到#tips中
			$('td:nth-child(4)', table).addClass('index');
			$('td:nth-child(3)', table).addClass('similar').each((i, e) => e.textContent = parseInt(e.textContent) + '%');
			$('td:nth-child(2)', table).attr({ 'contenteditable': 'plaintext-only' }).addClass('target');
			$('td:nth-child(1)', table).attr({ 'contenteditable': 'plaintext-only' }).addClass('source');
			$('tr', table).each(function (i, tr) {
				$(tr).prepend($('<td class="no"></td>').text(i + 1));
			});
			$('#tips').html(table.innerHTML).prop('scrollTop', 0);
			// console.log($('#auto100').prop('checked') && a && a[0] &&a[0][2]==100)
			// 规则A：对于如果最后一个编辑的内容，不要采取自动插入。
			if ($('#auto100').prop('checked') && a && a[0] && a[0][2] == 100 && lwsd.target.textContent !== a[0][1]) {
				$(lwsd.target).text(a[0][1])
					.addClass('doneAuto')
				// .css({background:$('#ctrlEnterColor').val()})
			}
		}
	}, code_similar + code_Reference + `addEventListener('message',(e)=>{
	let a=e.data;
	if(a[0]===100){
		// send(100,t,similarPercent,dict.array);
		// a[1] text
		// a[2] similarPercent
		// a[3] dict

		let arr=new Reference(a[3]).search(a[1],a[2]);
		// let table=a[4](arr);
		send(200,arr);
	}
});
`);
lwsd.done = true;



$(window).on('beforeunload', function (e) {
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
function lenSearch(str, dictArray) {
	let startTime = Date.now();
	let timeout = false;
	let rs = [];
	if (!dictArray) return rs;
	let i = 0, len = str.length, start = i, end = len, chunk, index = 0, re, b = false;

	while (true) {
		if ((Date.now() - startTime) > 2000) {
			timeout = true;
			break;
		}
		if (end === start) break;
		chunk = str.slice(start, end);

		// 寻找这个内容
		b = dictArray.some((e, i, a) => {
			if ((Date.now() - startTime) > 2000) {
				timeout = true;
				return true;
			}
			re = new RegExp('^' + Search._getRegExp(chunk) + '$', 'gi');
			if (re.test(e[0])) {
				index = i;
				start = end;
				end = len;
				return true;
			}
			return false;
		})

		if (timeout) {
			return [];
		} else if (b) {
			// 找到
			rs.push(dictArray[index]);
			// console.log('[has]',dict[index]);
			continue;
		}
		end--;
	}
	if (timeout) {
		return [];
	}
	return rs;
}

let dict = new Reference([]);
function addDict(a) {
	a = a || [];
	if (typeof dict === 'undefined') { dict = new Reference(a); pushlog('create dict') } else { dict.concat(a); pushlog('add dict'); }
	$('#dictArrayLengthUI').text(dict.array.length);
}

var lastEditTarget;

var targetLang;
// var asciiNospace=/[\x00-\x08\x0e-\x1f\x21-\x2b\x2d\x2f\x3a-\x9f\xa1-\xff]+|(\d[\x2c\x2e]?)+/g; //  ASCII范围内的 [^ \f\n\r\t\v,\.\d]  ,\x2c .\x2e
var asciiNospace = /(\d[\x2c\x2e]?)+|[\x00-\x08\x0e-\x1f\x21-\x2b\x2d\x2f-\x9f\xa1-\xff]+/g; //  ASCII范围内的 [^ \f\n\r\t\v,\.\d]  ,\x2c .\x2e


$(() => {
	//begin
	let f = $('#TMToolFile');
	let input = f.get(0);// <input>
	console.log(f)
	f.on('change', (e) => {
		wpClac();
		let files, length, E, onloadCount = 0;
		files = input.files;
		length = files.length;// 文件数量
		E = new Event('loaddropfiles');// 创建事件实例
		E.files = files;// 加入文件
		E.datas = [];// 加入数据
		for (var i = 0; i < length; i++) {// 遍历文件
			let file = files.item(i);// 文件
			let filename = file.name;
			console.log('Loading...', filename);
			pushlog('Loading...', filename);
			if (!(/\.txt$/.test(filename))) {// 是否扩展名为.txt
				pushlog('No support the file type. ' + file.name + '(' + file.size + ')');// 不支持非.txt文件
				continue;
			}

			var fr = new FileReader();// 读文件数据
			fr.file = file;
			fr.name = filename;
			console.log('read', fr.name);
			fr.onload = function (e) {
				onloadCount++;
				let t = e.target;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['type'] = 'tmtool';
				// E.datas['filename'] = t.file.name;
				// console.log(t)
				E.datas.push({
					type: 'tmtool',
					name: t.name,
					data: t.result,
					file: t.file
				});
				if (onloadCount === length) f.value = '', window.dispatchEvent(E);// 读完后触发事件
			};
			fr.readAsText(file);
		}
	});
	$('#importTMToolFile').on('click', () => {
		f.click();
	});
	// end
});


$(function () {
	$(window).on('dragover', function (e) {
		e.preventDefault();
	});
	$(window).on('drop', function (e) {// drop file
		wpClac();
		e.preventDefault();
		let files, length, E, onloadCount = 0;
		files = e.originalEvent.dataTransfer.files;// 被拖进的文件
		length = files.length;// 文件数量
		E = new Event('loaddropfiles');// 创建事件实例
		E.files = files;// 加入文件
		E.datas = [];// 加入数据
		for (var i = 0; i < length; i++) {// 遍历文件
			let file = files.item(i);// 文件
			let filename = file.name;
			console.log('Loading...', filename);
			pushlog('Loading...', filename);
			if (!(/\.txt$/.test(filename))) {// 是否扩展名为.txt
				pushlog('No support the file type. ' + file.name + '(' + file.size + ')');// 不支持非.txt文件
				continue;
			}

			var fr = new FileReader();// 读文件数据
			fr.file = file;
			fr.name = filename;
			console.log('read', fr.name);
			fr.onload = function (e) {
				console.log('load', fr.name)
				onloadCount++;
				let t = e.target;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['tmtoolfile_'+t.file.name] = t.result;
				// E.datas['type'] = 'tmtool';
				// E.datas['filename'] = t.file.name;
				// console.log(t)
				E.datas.push({
					type: 'tmtool',
					name: t.name,
					data: t.result,
					file: t.file
				});
				if (onloadCount === length) window.dispatchEvent(E);// 读完后触发事件
			};
			fr.readAsText(file);
		}
	});

	$(window).on('dragover', function (e) {
		e.preventDefault();
	});
	// $('#dictDrop').on('drop');

	$('#dictPaste').on('paste', function (e) {
		e.preventDefault();

		var t = e.originalEvent.clipboardData.getData('text/plain').trim();
		var a = ao.stringToArray(t);
		a = a.filter(function (e) {
			return (e instanceof Array) && e[0] && e[1] && e[0].length && e[1].length;
		});
		addDict(a);
		console.log(dict)
		var oldDictArrayLength = dict.array ? dict.array.length : 0;
	});

	// let workPasting=false;
	$('#workPaste').on('paste', function (e) {
		e.preventDefault();
		pushlog('문서를 분석하고 있습니다');
		// if(workPasting) return ;
		// workPasting=true;
		let h = e.originalEvent.clipboardData.getData('text/html');
		if (h) {
			let _h = new DOMParser().parseFromString(h, 'application/xml');
			h = Array.from(_h.firstChild.querySelectorAll('tr')).map(tr => {
				return Array.from(tr.querySelectorAll('td')).map(td => {
					console.log(td.textContent)
					return td.textContent;
					return td.textContent.replace(/[\r\n]/gm, '\\n').repleace(/\t/gm, ' ');
				}).join('\t')
			}).join('\n');

			if (!h) {
				h = Array.from(_h.firstChild.querySelectorAll('p')).map(p => {
					return p.textContent.replace(/[\r\n]/gm, '\\n').repleace(/\t/gm, ' ');
				}).join('\n');

				if (!h) {
					h = Array.from(_h.firstChild.querySelectorAll('span')).map(span => {
						return span.textContent.replace(/[\r\n]/gm, '\\n').replace(/\t/gm, ' ');
					}).join('\n');
				} else {
					pushlog('WORD구조 감지');
				}
			} else {
				pushlog('HTML구조 감지');
			}
			pushlog('HTML구조 감지');
		}
		if (!h) h = e.originalEvent.clipboardData.getData('text/plain');
		if (h) {
			let a = ao.stringToArray(h);
			// console.log(a);
			a.forEach((e, i, a) => a[i] = e.filter(e => e));
			let maxLength = a.reduce((r, e) => Math.max(r, e.length), 0);
			a.forEach(e => {
				let l = maxLength - e.length;
				while (l > 0) {
					e.push('');
					l--;
				}
			});
			if (maxLength > 0) {
				// 粘贴1列的情况, 明显只有原文
				{
					let f = document.createDocumentFragment();
					let table = document.createElement('table');
					f.appendChild(table);

					a.forEach((e, i) => {
						let tr = table.appendChild(document.createElement('tr'));
						let no = tr.appendChild(document.createElement('td'));
						no.classList.add('no');
						no.textContent = i + 1;
						let source = tr.appendChild(document.createElement('td'));
						source.classList.add('source');
						source.textContent = e[0];
						let target = tr.appendChild(document.createElement('td'));
						target.classList.add('target');
						target.contentEditable = 'plaintext-only';
						if (maxLength > 1) target.textContent = e[1];
						if (maxLength > 2) {
							let comment = tr.appendChild(document.createElement('td'));
							comment.classList.add('comment');
							comment.textContent = e.slice(2).join('\n');
						}
						if (e[0].trim().length === 0) tr.classList.add('emptyRow');
					});
					// console.log(table)
					document.getElementById('works').appendChild(f);
					delete f;
				}
				pushlog('번역내용 추가');


				let offset = $('#workPaste').offset();
				showTip({ text: '번역내용 추가', css: Object.assign({ background: '#ff0c' }, offset), animate: { top: Math.max(0, offset.top - 10) + 'px' }, delay: 1000 });
			}
		}
		wpClac();
		// let p=new Promise((y,n)=>{
		// 	setTimeout(()=>{
		// 		if(t.length>0){
		// 			var a=ao.stringToArray(t);
		// 			if(a.length>0) {
		// 				// 粘贴1列的情况, 明显只有原文
		// 				if(a[0].length===1){
		// 					let time=Date.now();
		// 					a.forEach((e,i)=>{
		// 						let tr=$('<tr>')
		// 							.appendTo('#works')
		// 							.append($('<td>').addClass('no').text(i+1))
		// 							.append($('<td>').addClass('source').text(e[0]))
		// 							.append($('<td>').addClass('target').attr({'contenteditable':'plaintext-only'}))
		// 							.append($('<td>').addClass('comment').text(time))
		// 						if(e[0].trim().length===0) tr.addClass('emptyRow');
		// 					});

		// 					// a.forEach(function(e){
		// 					// 	return e.push('');
		// 					// });
		// 					// var table=ao.arrayToTable(a);

		// 					// $(table).attr({dataname:'wordpaste',datatype:'clipboard'});
		// 					// $('td:nth-child(1)',table).addClass('source');
		// 					// $('td:nth-child(2)',table).addClass('target').attr({'contenteditable':'plaintext-only'});
		// 					// $('tr',table).each(function(i,tr){
		// 					// 	$(tr).prepend($('<td class="no"></td>').text(i+1));
		// 					// });
		// 					// $('#works').append(table);
		// 				}else{
		// 					// 粘贴2列开始, 需要选择原文和译文列
		// 					let ms=maskScreen()
		// 					let ok=$('<button>').text('추가').click((e)=>{
		// 						let opt=[];
		// 						let control=$('#mask tr.control:first()').find('td').each((i,td)=>{
		// 							let o={}
		// 							$(td).find('input').each((_,input)=>{
		// 								o[input.name]=input.checked
		// 							})
		// 							opt[i]=o
		// 						});

		// 						let hasSource=opt.some(e=>e.source);
		// 						if(hasSource===false) return alert('소스 지정!');

		// 						let hasTarget=opt.some(e=>e.target);

		// 						$('#mask tr.control').remove();
		// 						opt.forEach((option,index)=>{
		// 							$('#mask tr').each((_,tr)=>{
		// 								let td=$(tr).find('td').eq(index);
		// 								if(option.source) {
		// 									td.addClass('source');
		// 									if(td.text().trim().length===0) tr.classList.add('emptyRow');
		// 								}
		// 								if(option.target) td.addClass('target').attr('contenteditable','plaintext-only');
		// 								if(option.edit) td.attr('contenteditable','plaintext-only')
		// 							});

		// 						})
		// 						if(!hasTarget) {
		// 							$('#mask td.source').after('<td class="target" contenteditable="plaintext-only">');
		// 						}

		// 						$('#mask tr').each((i,tr)=>{

		// 							$(tr).find('.target').detach().prependTo(tr)
		// 							$(tr).find('.source').detach().prependTo(tr)
		// 							$('<td class="no">').prependTo(tr).text(i+1)
		// 						})

		// 						$('#mask table').appendTo('#works');
		// 						$('#mask').empty().remove();
		// 					}).appendTo(ms).css({background:'#6fa',color:'030',width:'40%'})
		// 					let cancel=$('<button>').text('취소').click(()=>{
		// 						ms.empty().detach()
		// 					}).appendTo(ms).css({background:'#666',color:'#fff',width:'40%'})
		// 					let table=ao.arrayToTable(a);
		// 					let maxLength=get2DArrayMaxLength(a);
		// 					let tr=createControlTr(maxLength);
		// 					tr.prependTo(table);
		// 					ms.append(table)

		// 					// $(table).attr({dataname:'wordpaste',datatype:'clipboard'});
		// 					// $('td:nth-child(1)',table).addClass('source');
		// 					// $('td:nth-child(2)',table).addClass('target').attr({'contenteditable':'plaintext-only'});
		// 					// $('tr',table).each(function(i,tr){
		// 					// 	$(tr).prepend($('<td class="no"></td>').text(i+1));
		// 					// });
		// 					// $('#works').append(table);
		// 				}
		// 			}
		// 		}
		// 		console.log(a)
		// 		y();
		// 	});
		// });
		// p.then(()=>{
		// 	workPasting=false;
		// 	pushlog('[Finish] Pasted Missions!');
		// });
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


	$('#worksFontSize').on('keydown change input', changeWorksFontSize);

	// 查找内容
	var prevFocusTarget;
	$(document).on('focus', '#works .target', function (e) {
		// 焦点太卡了。记录上一次的焦点吧。
		if (prevFocusTarget === e.target && $('#works td.target').length > 1) return false;
		prevFocusTarget = e.target;

		// 词典提示
		if ($('#useDictTip').prop('checked')) {
			// t: target text
			// a: dict search result
			// 

			let t = $(e.target).prev('.source').text().trim();
			let similarPercent = Number($('#similarPercent').val());


			{
				// 转移给worker执行
				// var a=dict.search(t,similarPercent);
				$('#tips').html('<strong style="color:blue;font-size:12px">검색 중입니다...</strong>');
				if (lwsd.done !== true) {
					lwsd.connect();
				}
				lwsd.target = e.target;
				lwsd.send(100, t, similarPercent, dict.array);
				lwsd.done = false;
			}



			{
				// 焦点,上方自动显示
				// var a=dict.search(t,similarPercent);
				$('#statusDict').html('<strong style="color:blue;font-size:12px">검색 중입니다...</strong>');
				if (lwsd2.done !== true) {
					lwsd2.connect();
				}
				lwsd2.target = $(e.target).parent().find('td.source').get(0);
				lwsd2.send(100, lwsd2.target.textContent, dict.array);
				lwsd2.done = false;
			}

			// 获取最后一个格子的大小尺寸位置
			// var last=$(e.target).parent().find('td:last()');
			// var offset = last.offset();
			// offset.width=last.width();
			// offset.height=last.height();
			// console.warn(offset)


			// 转移到localeWorker中
			// 提示内容
			// var table=ao.arrayToTable(a);
			// $('td:nth-child(4)',table).addClass('index');
			// $('td:nth-child(3)',table).addClass('similar');
			// $('td:nth-child(2)',table).attr({'contenteditable':'plaintext-only'}).addClass('target');
			// $('td:nth-child(1)',table).attr({'contenteditable':'plaintext-only'}).addClass('source');
			// $('tr',table).each(function(i,tr){
			// 	$(tr).prepend($('<td class="no"></td>').text(i+1));
			// });
			// $('#tips').html(table.innerHTML).prop('scrollTop',0);
			// // .css({position:'absolute',
			// // 	top:offset.top+offset.height+60+document.body.scrollTop,left:8});	
			// 	// left:offset.left+offset.width+document.body.scrollLeft});	
			// // 规则A：对于如果最后一个编辑的内容，不要采取自动插入。
			// if($('#auto100').prop('checked') && a && a[0] &&a[0][2]==100) {
			// 	$(this).text(a[0][1]).css({background:$('#ctrlEnterColor').val()});
			// }



			// 新型算法。长度渐进法 lenSearch()
			// let p=new Promise((y,n)=>{
			// 	setTimeout(n,2000);
			// 	let lenSearchRes=lenSearch(t, dict.array);
			// 	y(lenSearchRes);
			// });
			// p.then((v)=>{
			// 	if(v.length>0){
			// 		let res=v.map((e,i)=>{
			// 			let tr=$('<tr>');
			// 			$('<td class="no"></td>').text(i+1).appendTo(tr);
			// 			$('<td class="source"></td>').text(e[0]).appendTo(tr);
			// 			$('<td class="target"></td>').text(e[1]).appendTo(tr);
			// 			return tr;
			// 		})
			// 		console.log(res)
			// 		$('#statusDict').empty().append(res);
			// 	}
			// }).catch(()=>{console.warn('[timeout] lenSearch');})
		}

		// 显示谷歌等
		var g = $('#useGoogle').prop('checked'), n = $('#useNaver').prop('checked'), d = $('#useDaum').prop('checked');
		if (g || n || d) {
			var s = $(e.target).parent('tr').find('.source').text().trim();
			if (s) {
				var t = $('#netTarget').val();
				function net(n, s, t) {
					if (net.count === undefined) net.count = 0;
					net.count++;
					$('#' + n + 'Result').text('Loading...(' + net.count + ')');
					this[n](s, t, function (o) {
						$('#' + n + 'Result').text(o.error || o.result[0][1]);
					});
				}
				if (g) net('google', s, t);
				// if(n) net('naver',  s,t);
				// if(d) net('daum',   s,t);
			}
		}

		// 当前行高亮显示
		$('#works tr').removeClass('currentEditRow');
		$(e.target).parent().addClass('currentEditRow');
	});


	// autoSizeDictWindow
	let uiTips = document.querySelector('#tips');
	$('#autoSizeDictWindow').click(e => {
		uiTips.style.height = uiTips.style.height ? '' : '20em';
	});


	// 全局按键侦听
	$(window).on('keydown', function (e) {
		if (e.keyCode === 87 && e.ctrlKey) return e.preventDefault();

		if ($(e.target).is('.currentEditRow .target')) SM.lastTargetRange = undefined;
		if (e.keyCode === 87 && e.ctrlKey) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		} else if (e.keyCode === 113) {// 113:F2
			// 移动到未翻译内容td上
			e.preventDefault();
			// $('#gotoUntranslationTarget').trigger('click');
			nextEmptyTarget(e.ctrlKey);
		} else if (e.keyCode === 114 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {// 114:F3
			// 移动到未翻译内容td上
			e.preventDefault();
			$('#downloadWorkT').trigger('click');
		} else if (e.keyCode === 112) {// 112:F1
			// 自动匹配100%内容
			e.preventDefault();
			var event = {
				type: 'click',
				ctrlKey: e.ctrlKey,
				altKey: e.altKey,
				shiftKey: e.shiftKey,
				metaKey: e.metaKey
			};
			$('#MatchWork100').trigger(event);
			pushlog('Automatically enter to translate content.');
		} else if (e.keyCode === 192 && e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {// Alt＋`  逐个词典匹配
			e.preventDefault();
			var v = '';
			var t = $(e.target);
			t = $(t);
			if (t.is('#works td.source')) {
				var source = t;
				var target = t.next('td.target');
				var sourceText = source.text();
				var arr = sourceText.split(/\s+/g)
				arr.forEach(function (text) {
					v = dict.search(text, 100)[0];
					v = (v === undefined ? text : v[1]);
					target.text(target.text() + v);
					pushlog(v);
				});
			} else if (t.is('#works td.target')) {
				var target = t;
				var source = target.prev('td.source');
				var sourceText = source.text();
				var arr = sourceText.split(/\s+/g);
				arr.forEach(function (text) {
					v = dict.search(text, 100)[0];
					v = (v === undefined ? text : v[1]);
					target.text(target.text() + v);
					pushlog(v);
				});
			}
		} else if (e.keyCode === 119 || e.keyCode === 19) {// Pause Break- get google,naver,daum
			// 119:F8
			e.preventDefault();
			// 改变功能为切割长文章
			let tar = $(e.target);
			if (tar.is('#works .currentEditRow .target') && !tar.is('.split')) {
				if (e.altKey || e.ctrlKey) {
					let text = $('#works tr.split').find('.target').text();
					$('#works .splitTarget').focus().text(text).removeClass('splitTarget');
					console.log(text);
					$('#works tr.split').remove();
				} else {
					let p = tar.parent();
					let s = p.find('.source');
					let st = s.text();
					let t = tar;
					let tt = t.text();

					let res = splitLongSource(st);

					if (res.length > 1) {
						tar.addClass('splitTarget');
						let id = Date.now();
						let first;
						res.forEach((e, i) => {
							let tr = $(`<tr class="split">`).appendTo('#works');
							let no = $('<td class="no">').text(i + 1).appendTo(tr);
							let s = $('<td class="source">').text(e).appendTo(tr)
							let t = $('<td class="target" contenteditable="plaintext-only">').appendTo(tr);
							if (i === 0) first = t;
							if (e.trim() === '') tr.addClass('hide2');
							else if (e.indexOf('\\n') > -1) {
								t.text(e);
								tr.addClass('hide2');
							}
							console.log(e)
						});
						let w = document.getElementById('works');
						w.scrollTo(0, w.scrollHeight);
						first.focus();
					} else {
						let rect = tar.offset();
						showTip({ text: '분해할 수 없습니다', x: rect.left, y: rect.top, css: { transform: 'translate(0,-100%)' } });
					}
				}
			}
			// {
			// 			let tar=$('#works .currentEditRow .target')
			// 				let p=tar.parent();
			// 				let s=p.find('.source');
			// 				let st=s.text();
			// 				let t=tar;
			// 				let tt=t.text();

			// 				let re=/(?=(?!\d)\.)|\{\\r\\n\}|\\n/g;
			// let arr=[];
			// let i=0;
			// let r=st.replace(re,function(...a){
			//   //console.log(a);
			//   let aLastIndex=a.length-1;
			//   let aIndex=aLastIndex-1;
			//   let index=a[aIndex];
			//   let str=a[aLastIndex];
			//   i=index+a[0].length;
			//   let c=str.slice(i,index);
			//   console.log(index,i, c,str);
			//   return str.slice(i,index);
			// });

			// //console.log(r);

			// }
			// e.preventDefault();
			// var s=window.getSelection().toString();
			// if(!s.trim()) return $('#googleResult').text('No selected content.');
			// var g=$('#useGoogle').prop('checked'),n=$('#useNaver').prop('checked'),d=$('#useDaum').prop('checked');
			// // if(g||n||d){
			// 	var s=lastSourceSelectionText;
			// 	if(s && s.trim()){
			// 		var t=$('#netTarget').val();
			// 		function net(n,s,t){
			// 			if(net.count===undefined) net.count=0;
			// 			net.count++;
			// 			$('#'+n+'Result').text('Loading...('+net.count+')');
			// 			this[n](s,t,function(o){
			// 				$('#'+n+'Result').text(o.error||o.result.join('\n'));
			// 			});
			// 		}
			// 		net('google', s,t);
			// 		// net('naver',  s,t);
			// 		// net('daum',   s,t);
			// 	}
			// // }
		} else if (e.ctrlKey && e.keyCode === 81 && !e.shiftKey && !e.altKey && !e.metaKey) {
			// Enter，ctrl+Q，ctrl+S 来保存到词库
			e.preventDefault();
			let lsst = $('#lsst');
			let stst = $('#ltst');
			let lsstt = lsst.text().trim();
			let ststt = stst.text().trim();

			if (lsstt && ststt) {
				// 保存
				var l = dict.array.length;
				dict.add(lsstt, ststt);
				let rect, rect2;

				rect = lsst.offset();
				rect2 = $('#dictArrayLengthUI').offset();
				showTip({
					text: lsstt,
					css: { background: '#f00', color: '#fff' },
					x: rect.left, y: rect.top,
					animate: [{ left: rect.left - 10 }, { left: rect2.left, top: rect2.top, opacity: 0 }]
				});

				rect = stst.offset();
				showTip({
					text: ststt,
					css: { background: '#f00', color: '#fff' },
					x: rect.left, y: rect.top,
					animate: [{ left: rect.left - 10 }, { left: rect2.left, top: rect2.top, opacity: 0 }]
				});
			} else {
				pushlog('[Warning] Need content.');
			}
		} else if (e.keyCode === 68 && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
			//ctrl+shift+d  复制上面.target的内容
			e.preventDefault();
			var c = $(document.activeElement);
			s = c.parent().prevAll().not('.hide,.hide2').first().find(Array.prototype.map.call(document.activeElement.classList, function (e) { return '.' + e; }).join(' '));
			if (s.length) {
				c.text(c.text() + s.text());
				pushlog('Copy: ' + s.text());
			} else {
				pushlog('No copy.');
			}
		} else if (e.keyCode === 83 && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			//ctrl+s 保存内容
			e.preventDefault();
			saveDatas();

			try {
				pushlog('[Save]', dict.array.length);
			} catch (err) {
				pushlog('[Error]', err.message);
			}
		}
	});

	$(document).on('keydown', '.target', function (e) {
		if (e.ctrlKey && (e.keyCode === 17) && e.repeat) return;// ctrlKey 反复
		if (e.keyCode === 13) {// Enter 提交数据，并跳转下一行。
			let current;
			let tar = $(e.target);
			e.preventDefault();

			if (tar.text().trim().length === 0) {
				// target没有内容，不需要做任何操作。
				pushlog('No content');
				return;
			}

			if ($(tar).is('#statusDict td.target, #tips td.target')) {
				// 如果是翻译记录或词库的target
				if ($(tar).is('#tips td.target')) $('#statusDict').empty();
				if ($(tar).is('#statusDict td.target')) $('#tips').empty();
				var p = tar.parent();
				// var no=$('.no',p);
				// no.animate({backgroundColor:$('#ctrlEnterColor').val()});
				tar.addClass('done');
				var s = $('.source', p);
				var t = $('.target', p);
				s = s.text().trim();
				t = t.text().trim();
				// s或t的值为空，则跳到下一个。

				if (s.length === 0 || t.length === 0) {
					// return p.next().find('.target').focus();
					// console.log('next')
					current = p.nextAll().not('.hide,.hide1,.hide2,.emptyRow').find('td.target');
					if (e.ctrlKey) {
						current = current.not('.done,.doneAuto,.doneAutoSpace');
					}
					let c = current.eq(0);
					if (c.length > 0) {
						c.focus();
					} else {
						c = tar.parent();
						if (c.is('#works table')) {
							c = c.next();
							console.log(c);
						}
					}
					return;
				}
				var i = $('td:last()', p).text().trim();
				if (dict.array[i]) {
					var l = dict.array.length;
					dict.array[i][0] = s;
					dict.array[i][1] = t;
					dict.from(dict.array);
					pushloghtml($('<p>').append($('<h6>').text('[+]')).append($('<span>').text(s)).append($('<br>')).append($('<p>').text(t)));
				}

				// ctrl+enter 换色
				// var t=$(e.target);
				// if($('#ctrlEnter').prop('checked')){
				// 	t.animate({background:$('#ctrlEnterColor').val()});
				// }
			} else {
				var p = tar.parent();
				// var no=$('.no',p);
				// no.animate({backgroundColor:$('#ctrlEnterColor').val()},function(){no.removeAttr('style');});
				tar.addClass('done')
				var s = $('.source', p);
				var t = $('.target', p);
				t = t.text().trim().replace(/\{\\r\\n\}/g, '\\n');
				s = s.text().trim().replace(/\{\\r\\n\}/g, '\\n');
				var l = dict.array.length;
				dict.array.push([s, t]);
				dict.from(dict.array);
				pushloghtml($('<p>').append($('<h6>').text('[+]')).append($('<span>').text(s)).append($('<br>')).append($('<p>').text(t)));
				// ctrl+enter 换色
				// var t=$(e.target);
				// if($('#ctrlEnter').prop('checked')){
				// 	t.css({background:$('#ctrlEnterColor').val()})
				// }
				// 改变状态为已完成
				tar.removeClass('doneAuto').removeClass('doneAutoSpace').addClass('done');

				{// 检查数值是否正确
					let b = numCheck(s, t);
					if (!b.done) {
						let tip = p.find('.tip');
						if (tip.length === 0) tip = $('<td class="tip"><span class="sd"></span><span class="td"></span></td>').appendTo(p).css({
							color: '#ff0',
							display: 'grid',
							'grid-template-columns': '1fr 1fr',
						});
						setTimeout(() => tip.remove(), 5000);
						let sd = tip.find('.sd');
						let td = tip.find('.td');
						b.sa.forEach(e => $('<span>').css({ background: '#f00', margin: '1px'}).text(e).appendTo(sd));
						b.ta.forEach(e => $('<span>').css({ background: '#00f', margin: '1px'}).text(e).appendTo(td));
					}


				}

				wpClac();
			}

			// current = p.nextAll().not('.hide,.hide1,.hide2,.emptyRow').find('td.target');
			current = p.nextAll().filter((i, e) => e.style.display !== 'none').eq(0).find('.target').trigger('focus')

			if (e.ctrlKey) {
				current = current.not('.done,.doneAuto,doneAutoSpace');
			}
			current.eq(0).focus();

			// 延迟时间保存
			// saveDatas();
			if (typeof window.privateTimeout === 'number') {
				clearTimeout(window.privateTimeout);
				window.privateTimeout = setTimeout(() => {
					saveDatas();
				}, 1000);
			}
		} else if (e.ctrlKey) {
			// console.debug('ctrl+ 1~0 在work快速插入找到的内容')
			let code = e.originalEvent.code;
			// ctrl+ 1~0 在work快速插入找到的内容
			if (e.keyCode === 45) {// <insert>
				var t = $(e.target);
				if (t.is('#works .target')) {
					SM.text = t.parent().find('.source').text();
				}
			}
		}
		// else if(e.shiftKey){
		// 	e.preventDefault();
		// 		// shift键 
		// 		let key=parseInt(e.key);
		// 		switch(e.key) {
		// 			case '1':
		// 			case '2':
		// 			case '3':
		// 			case '4':
		// 			case '5':
		// 			case '6':
		// 			case '7':
		// 			case '8':
		// 			case '9':{
		// 				key=parseInt(e.key)-1;
		// 			}
		// 			case '0':{
		// 				key=9;
		// 			}
		// 			case '`':{
		// 				key=0;
		// 			}
		// 			default:{
		// 				e.preventDefault();
		// 				var target=$(e.target);
		// 				var sourceText=target.prev('.source').text().trim();
		// 				var tr=$('#tips').find('tr').eq(key);
		// 				var s=tr.find('.source').text().trim();
		// 				var t=tr.find('.target').text().trim();
		// 				var v=smartMatch(sourceText, [s,t]);
		// 				target.append(v);// ctrl+num
		// 				console.log(key)
		// 				// console.log(v)
		// 				// console.log(target,v)
		// 				// replaceTD(t);
		// 				return ;
		// 			}
		// 		}
		// }
		else if (e.keyCode === 27) {
			//esc
			$('#tips').empty();
			$('#statusDict').empty();
			$('.tipSelect').remove();
		}
	});


	// 记录最后的source和target的内容
	$(document).on('mouseup', '#works td.source, #works td.target', function (e) {
		var s = window.getSelection();// 选择文字
		if (s.baseNode !== s.extentNode) return;// 不是一个Node时，不做任何事情。
		var t = $(e.target);
		if (t.is('.source')) {
			lastSourceSelectionText = s.toString().trim();
			$('#lsst').text(lastSourceSelectionText);

			// 查找词典内容
			// if($('#useDictTip').prop('checked') && lastSourceSelectionText){
			if (lastSourceSelectionText) {
				var tar = $(e.target);
				var t = lastSourceSelectionText;
				var a = dict.search(t, Number($('#similarPercent').val()));
				// 提示内容
				var table = ao.arrayToTable(a);
				$('td:nth-child(4)', table).addClass('index');
				$('td:nth-child(3)', table).addClass('similar').each((_, e) => e.textContent = parseInt(e.textContent) + '%');
				$('td:nth-child(2)', table).attr({ 'contenteditable': 'plaintext-only' }).addClass('target');
				$('td:nth-child(1)', table).attr({ 'contenteditable': 'plaintext-only' }).addClass('source');
				$('tr', table).each(function (i, tr) {
					$(tr).prepend($('<td class="no"></td>').text(i + 1));
				});
				$('#statusDict').html(table.innerHTML).prop('scrollTop', 0);
			}
			// google,naver,daum
			var g = $('#useGoogle').prop('checked'), n = $('#useNaver').prop('checked'), d = $('#useDaum').prop('checked');
			if (g || n || d) {
				var s = lastSourceSelectionText;
				if (s && s.trim()) {
					var t = $('#netTarget').val();
					function net(n, s, t) {
						if (net.count === undefined) net.count = 0;
						net.count++;
						$('#' + n + 'Result').text('Loading...(' + net.count + ')');
						this[n](s, t, function (o) {
							$('#' + n + 'Result').text(o.error || o.result.join('\n'));
						});
					}
					if (g) net('google', s, t);
					if (n) net('naver', s, t);
					if (d) net('daum', s, t);
				}
			}



		} else if (t.is('.target')) {
			lastTargetSelectionText = window.getSelection().toString().trim();
			$('#ltst').text(lastTargetSelectionText);
		}
	});

	// 锁定未翻译目标
	$('#gotoUntranslationTarget').click(function (e) {
		nextEmptyTarget(e.ctrlKey);
		// let ts=$('#works .target:empty()');
		// let t=ts.eq(0).trigger('focus');
		// if(ts.length){
		// 	var w=$('#works');
		// 	w.prop('scrollTop', t.prop('offsetTop')-w.prop('offsetTop')-10);

		// 	let countChar=0;
		// 	let countRow=ts.each((_,e)=>{
		// 		countChar+=$(e).prev('td.source').text().length;
		// 	}).length;
		// 	pushlog('No translated item is '+countRow+'ea('+countChar+'byte).');

		// }else{
		// 	pushlog('No target... ^ ^');
		// }
		// delete ts,t;
	});

	// 下载词库
	$('#downloadDict').click(function () {
		try {
			dict.array.forEach(function (e) {
				e.forEach(function (v, i, a) {
					a[i] = String(v).trim().replace(/\r|\n|\{\\r\\n\}/g, '\\n');
				});
			});
		} catch (_) {
			dict = new Reference(ao.ls.get('dict') || []);
			dict.array.forEach(function (e) {
				e.forEach(function (v, i, a) {
					a[i] = String(v).trim().replace(/\r|\n|\{\\r\\n\}/g, '\\n');
				});
			});
		}
		dict.from(dict.array);
		downloadFile('dict', ao.arrayToString(dict.array));
	});
	$('#downloadDictXLS').click(function () {
		let fn = formatName(location.search) + '_dict_' + Date.now() + '.xls';
		let sheet = XLSX.utils.aoa_to_sheet(dict.array);
		let html = XLSX.utils.sheet_to_html(sheet);
		let table = $(html).filter('table').get(0)
		let wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
		XLSX.writeFile(wb, fn);
	});

	// 提交所有翻译内容
	$('#mergeDict').on('click', function (e) {
		if (confirm('[Warning] Are you sure you want to overwrite your work with dict?')) {
			// $('#useDictTip').add('#useGoogle').add('#useNaver').add('#useDaum').prop('checked',false);
			// $('#works td.target:not(:empty())').trigger({type:'keydown',keyCode:13,ctrlKey:true});
			// $('#useDictTip').prop('checked',true);
			$('#works tr').each((i, e) => {
				let source = $(e).find('.source').text().trim();
				let target = $(e).find('.target').text().trim();
				if (source && target) {
					// 保存
					dict.add(source, target);

					pushloghtml($('<p>').append($('<h6>').text('[+]')).append($('<p>').text(source)).append($('<p>').text(target)))
				}
			});
		}
	});

	// 下载任务
	$('#downloadWorksExcel').on('click', function (e) {
		showTip('잠시만 기다려 주십시오.(최대 30초 대기)');
		var fn = formatName(location.search) + '_works_' + Date.now() + '.xls';
		doit($('works').get(0), fn, 'xls');
	});
	$('#downloadWork').click(function (e) {
		showTip('잠시만 기다려 주십시오.(최대 30초 대기)');
		let
			ctrl = e.ctrlKey,
			shift = e.shiftKey,
			alt = e.altKey,
			meta = e.metaKey;

		$('#works table').each(function (_, table) {
			let r = [], hasTextKey = false;
			if ($('td.textKey').length) r.push('[FieldNames]\nTextKey\tText\tComment\n[Table]');

			$('tr', table).clone().find('td.no').remove().end().each(function (i, tr) {
				var k = $('td.textKey', tr);
				var c = $('td.targetComment', tr).text().trim();
				var row = [];
				if (k.length) {
					hasTextKey = true;
					var t = $('td.target', tr);
					row.push(k.get(0).textContent.trim());
					row.push(t.get(0).textContent.trim());
					if (ctrl) {
						// empty comment add datetime
						if (!Boolean(c)) c = new Date().toISOString();
					} else if (shift) {
						// all comment replace datetime
						c = new Date().toISOString();
					}
					row.push(c);
					r.push(row.join('\t'));
				} else {
					var row = [];
					$('td', tr).each(function (i, td) {
						row.push(td.textContent.trim());
					});
					r.push(row.join('\t'));
				}
			});

			let name = table.getAttribute('dataname');
			console.log(name);

			var data = r.join('\n');
			// 下载works时，textKey。
			if (hasTextKey || ctrl || shift || alt || meta) {
				if (hasTextKey) {
					downloadFileUcs2(name + 'work', data);
				} else {
					downloadFile(name + 'work', data);
				}
			} else {
				copyToTempResult(data);
			}
		});

		if ($('#works table').length === 0 && $('#works tr') !== 0) {
			$('#works').each(function (_, tbody) {
				let r = [], hasTextKey = false;
				if ($('td.textKey').length) r.push('[FieldNames]\nTextKey\tText\tComment\n[Table]');
				$('tr', tbody).clone().find('td.no').remove().end().each(function (i, tr) {
					var k = $('td.textKey', tr);
					var c = $('td.targetComment', tr).text().trim();
					var row = [];
					if (k.length) {
						hasTextKey = true;
						var t = $('td.target', tr);
						row.push(k.get(0).textContent.trim());
						row.push(t.get(0).textContent.trim());
						if (ctrl) {
							// empty comment add datetime
							if (!Boolean(c)) c = new Date().toISOString();
						} else if (shift) {
							// all comment replace datetime
							c = new Date().toISOString();
						}
						row.push(c);
						r.push(row.join('\t'));
					} else {
						var row = [];
						$('td', tr).each(function (i, td) {
							row.push(td.textContent.trim());
						});
						r.push(row.join('\t'));
					}
				});

				let name = '';

				var data = r.join('\n');
				// 下载works时，textKey。
				if (hasTextKey || ctrl || shift || alt || meta) {
					if (hasTextKey) {
						downloadFileUcs2(name + 'work', data);
					} else {
						downloadFile(name + 'work', data);
					}
				} else {
					copyToTempResult(data);
				}
			});
		}









	});
	$('#downloadWorkT').click(function (e) {
		let data;
		var r = [], ctrl = e.ctrlKey, shift = e.shiftKey, alt = e.altKey, meta = e.metaKey;
		dict.array.forEach(function (e) {
			e.forEach(function (v, i, a) {
				a[i] = String(v).trim();
			});
		});
		$('#works td.target').each(function (i, td) {
			r.push(td.textContent.trim());
		});
		// var table=$('<table>').append($('#works').find('tr').clone()).get(0);
		// console.log(table);

		if (ctrl || shift || meta) {
			downloadFile('work-t', data);
			return;
		}

		if (alt) {
			r = r.filter(function (e) { return e.length > 0; });
		}
		data = r.join('\n');
		copyToTempResult(data);
	});

	// 清空任务
	$('#clearWork').click(function (e) {
		$('#works').empty();
		$('#tips').empty();

		let { x, y, height } = e.target.getBoundingClientRect();
		y = Math.max(y - height, 0);
		showTip({ text: '삭제완료', x, y, animate: { top: Math.max(y - 10, 0) }, delay: 1000 });
	});
	// 清空任务
	$('#clearDict').click(function () {
		if (confirm('Warning! Delete the dictionary?')) {
			$('#tips').empty();
			$('#downloadDict').trigger('click');
			setTimeout(function () {
				window.dictarray0 = dict.array;
				pushlog('번역기록이 전부 삭제 되었습니다.');
				dict.array.length = 0;
				$('#works tr .target').removeAttr('style').removeClass('done');
				$('#dictArrayLengthUI').text(dict.array.length);
				saveDatas();
			}, 100);
		}
	});


	// 选择任务
	$('#selectWorks').click(function () {
		var s = window.getSelection();
		s.removeAllRanges();
		s.selectAllChildren($('#works').get(0));
		document.execCommand('copy', true);
	})

	// 过滤词典
	function myFilter(id, cls) {
		var _cls = cls.slice(0, 1).toUpperCase() + cls.slice(1).toLowerCase();
		$('#' + id + _cls + 'Filter').on('input', function (e) {
			var tar = e.target, v = tar.value;
			if (v.length > 0) {
				$('#' + id).find('.' + cls).each(function (i, e) {
					var regexp = Search.getRegExp(v, 'gim', $('#' + id + _cls + 'RegExp').prop('checked'));
					if (regexp.test(e.textContent)) {
						$(e).parent().removeClass('hide');
					} else {
						$(e).parent().addClass('hide')
					}
				});
			} else {
				$('#' + id).find('.' + cls).parent().removeClass('hide hide2');
			}
		});
	}

	myFilter('statusDict', 'source');
	myFilter('statusDict', 'target');
	myFilter('works', 'source');
	myFilter('works', 'target');
	myFilter('tips', 'source');
	myFilter('tips', 'target');

	function mySearch(id, cls) {
		var _cls = cls.slice(0, 1).toUpperCase() + cls.slice(1).toLowerCase();
		$('#' + id + _cls + 'Search').on('input', function (e) {
			var t = e.target, v = t.value;
			if (v.length > 0) {
				$('#' + id).find('.' + cls).each(function (i, e) {
					var regexp = Search.getRegExp(v, 'gim', $('#' + id + _cls + 'RegExp').prop('checked'));
					if (regexp.test(e.textContent)) {
						$(e).parent().removeClass('hide2');
					} else {
						$(e).parent().addClass('hide2')
					}
				});
			} else {
				$('#' + id).find('tr').removeClass('hide2');
			}
		});
	}

	mySearch('statusDict', 'source');
	mySearch('statusDict', 'target');
	mySearch('works', 'source');
	mySearch('works', 'target');
	mySearch('tips', 'source');
	mySearch('tips', 'target');

	function myReplace(id, cls) {
		var _cls = cls.slice(0, 1).toUpperCase() + cls.slice(1).toLowerCase();
		$('#' + id + _cls + 'Replace').on('keydown', function (e) {
			if (e.keyCode === 13 && confirm('Are you sure you want to replace?')) {
				console.log('myReplace')
				e.preventDefault();
				var s = $('#' + id + _cls + 'Search').val();
				var r = $('#' + id + _cls + 'Replace').val();
				var regexp = Search.getRegExp(s, 'gim', $('#' + id + _cls + 'RegExp').prop('checked'));
				// 过滤替换
				$('#' + id + ' tr:not(.hide,.hide2) td.' + cls).each(function (i, e) {
					e.textContent = e.textContent.replace(regexp, r).trim();
				});
				setTimeout(function () {
					$('#' + id + _cls + 'Search,#' + id + _cls + 'Replace').val('');
					$('#' + id + _cls + 'Search').trigger('input');
				});
			}
		});
	}

	myReplace('statusDict', 'source');
	myReplace('statusDict', 'target');
	myReplace('works', 'source');
	myReplace('works', 'target');
	myReplace('tips', 'source');
	myReplace('tips', 'target');


	$('#tipsSourceFilterAll').on('change', function (e) {
		var id = '#tips';
		$(id).empty();
		var v = e.target.value;
		if (v.length > 0) {
			var regexp = Search.getRegExp(v, 'gim', $(id + 'SourceRegExp').prop('checked'));
			console.log(regexp);
			var a = dict.array, i = a.length, e, tr, s, t, m, count = 1;
			while (true) {
				if (--i === -1) break;
				regexp.lastIndex = undefined;
				e = a[i];
				if (e) {
					s = e[0];
					t = e[1];
					if (s && t) {
						m = regexp.test(s);
						if (m) {
							regexp.lastIndex = undefined;
							no = $('<td class="no"></td>').text(count++);
							m = $('<td class="match"></td>').text(Array.from(s.match(regexp)).join('\n'));
							s = $('<td class="source" contenteditable="plaintext-only"></td>').text(s);
							t = $('<td class="target" contenteditable="plaintext-only"></td>').text(t);
							$('<tr>')
								.append(no)
								.append(s)
								.append(t)
								.append(m)
								.append($('<td class="index"></td>').text(i))
								.appendTo(id);
							regexp.lastIndex = undefined;
							console.log()
						}
					} else {
						a.splice(i, 1);
					}
				} else {
					a.splice(i, 1);
				}
			}
		} else {
			$(id).empty();
		}
	});

	$('#tipsTargetFilterAll').on('change', function (e) {
		var id = '#tips';
		$(id).empty();
		var v = e.target.value;
		if (v.length > 0) {
			var regexp = Search.getRegExp(v, 'gim', $(id + 'TargetRegExp').prop('checked'));
			console.log(regexp);
			var a = dict.array, i = a.length, e, tr, s, t, m, count = 0;
			while (true) {
				if (--i === -1) break;
				regexp.lastIndex = undefined;
				e = a[i];
				if (e) {
					s = e[0];
					t = e[1];
					if (s && t) {
						m = regexp.test(t);
						if (m) {
							regexp.lastIndex = undefined;
							no = $('<td class="no"></td>').text(count++);
							m = $('<td class="match"></td>').text(Array.from(t.match(regexp)).join('\n'));
							s = $('<td class="source" contenteditable="plaintext-only"></td>').text(s);
							t = $('<td class="target" contenteditable="plaintext-only"></td>').text(t);
							$('<tr>')
								.append(no)
								.append(s)
								.append(t)
								.append(m)
								.append($('<td class="index"></td>').text(i))
								.appendTo(id);
							regexp.lastIndex = undefined;
							console.log()
						}
					} else {
						a.splice(i, 1);
					}
				} else {
					a.splice(i, 1);
				}
			}
		} else {
			$(id).empty();
		}
	});

	// if(dict && dict.array) pushlog('Update Dictionary: '+dict.array+length+'ea');

	$('#useDictTip').on('click', function (e) {
		if (e.target.checked === false) {
			$('#tips').empty();
			$('#statusDict').empty();
		}
	});


	// 需要从记录中全文匹配，如果没有则智能匹配。auto100
	$('#MatchWork100').click(function (clickEvent) {
		clickEvent.preventDefault();
		var o = {};
		dict.array.forEach(function (e) {
			// 去掉左右空白后，再整理出键值对。
			e[0] = String(e[0]).trim();
			e[1] = String(e[1]).trim();
			if (e[0] && e[1]) {
				o[e[0]] = e[1];
			}
		});
		$('#works').find('tr').each(function (i, tr) {
			var s = $(tr).find('.source');
			var st = s.text().replace(/\{\\r\\n\}/g, '\\n').trim();
			var t = $(tr).find('.target');

			// 直接找到一致内容。
			if (st in o) {
				// t  需要填充的该target单元格
				// ot t单元格的当前内容
				// tt 需要填充的100%匹配的最新内容
				let ot, tt;
				ot = t.text();
				tt = o[st];
				// 已经填好的内容与100%内容一致时，直接退出操作。
				if (ot === tt) return t.removeClass('doneAuto').addClass('done');
				if (clickEvent.altKey) return t.parent().remove();
				return t.text(tt).removeClass('done').addClass('doneAuto');
			}

			// 如果没有直接找到一致内容，则需要只能匹配了。
			// 智能忽略空格匹配
			if (st.length === 0) { return; }
			var regexp = new RegExp('^' + Search.getRegExp(st).source + '$');
			for (var k in o) {
				if (regexp.test(k)) {
					// 找到一致内容
					if (clickEvent.altKey) return t.parent().remove();
					return t.text(o[k]).addClass('doneAutoSpace');// 淡灰色
				}
			}
			// 只能忽略数字英文符号等的匹配。
			var filterRegExp = /[\x00-\xff]/g, _k, _v;
			for (var k in o) {
				_k = k.replace(filterRegExp, '');
				if (_k == st.replace(filterRegExp, '')) {
					let v = smartMatch(st, [k, o[k]]);
					t.text(v).addClass('doneSmart');// 红色
					return;
				}
			}

			// 实在是没有找到，需要做最后的处理。
			// 按下ctrl时，保留原来内容。按下alt时，删除找到的内容。找到内容时，自动替换背景颜色为灰色。
			if (!clickEvent.ctrlKey) {
				t.text('').removeAttr('style');
			}
		});
	});


	let isNumQA = false;
	$('#numQA').click(function (e) {
		if (isNumQA) {
			$('#works tr').not('.emptyRow').removeClass('hide hide2 hide3').find('td.qa').remove();
			isNumQA = false;
			return;
		}
		isNumQA = true;

		// Number QA 核心算法 --start
		function numberQA(s, t) {
			let r = /[-+]?\d{1,3}((,?)\d{3})?(\.\d+)?[%]?/gmi

			s = s.match(r) || [];
			t = t.match(r) || [];

			return arrayDiff(s, t);
		}
		function arrayDiff(a, b) {
			let _a = [], _b = [];
			a.forEach((e, i) => {
				if (b.indexOf(e) === -1) {
					_a.push({ value: e, index: i });
				}
			});
			b.forEach((e, i) => {
				if (a.indexOf(e) === -1) {
					_b.push({ value: e, index: i });
				}
			});

			let ok = true, _al = _a.length, _bl = _b.length;
			if (_al === _bl) {
				if (a.join('\x02') !== b.join('\x02')) {
					ok = false;
				}
			} else {
				ok = false;
			}
			return { arr1: a, arr2: b, diff1: _a, diff2: _b, ok };
		}
		// Number QA 核心算法 --start

		$('#works td.qa').remove();
		$('#numQA').prop('running', !$('#numQA').prop('running'))
		if (!$('#numQA').prop('running')) {
			$('#worksTargetFilter').val('').trigger('input');
			$('#useDictTip').prop('checked', true);
			$('#numQA').css('boxShadow', '');
			return;
		}

		$('#numQA').css('boxShadow', '0 0 4px #F0F');
		$('#useDictTip').prop('checked', false);

		$('#worksTargetFilter').val('숫자QA');
		var count = 0;
		$('#works tr').removeClass('hide,hide1,hide2');
		$('#works tr').not('.emptyRow').each(function (i, tr) {
			var qa = $(tr).find('.qa');
			if (qa.length === 0) {
				qa = $('<td class="qa">').appendTo(tr);
			}

			var source = $(tr).find('td.source').eq(0).text() || '';
			var target = $(tr).find('td.target').eq(0).text() || '';

			let result = numberQA(source, target);
			if (result.ok) {
				$(tr).addClass('hide');
			} else {
				let table = $('<table>').appendTo(qa);
				for (let i = 0, len = Math.max(result.arr1.length, result.arr2.length); i < len; i++) {
					let tr = $('<tr>').appendTo(table);
					let s = result.arr1[i];
					let t = result.arr2[i];
					tr.append($('<td>').text(s || '').css({ textAlign: 'right' }).addClass('qa-index-' + i));
					tr.append($('<td>').text(t || '').addClass('qa-index-' + i));
					if (s !== t) tr.css({ color: '#f00', fontWeight: 'bold' });
				}
				result.diff1.forEach(e => {
					table.find('td.qa-index-' + e.index).eq(0).css({ background: '#ff0' });
				});
				result.diff2.forEach(e => {
					table.find('td.qa-index-' + e.index).eq(1).css({ background: '#ff0' });
				});
			}

			// var s,t,sm,tm;
			// sm=source.match(asciiNospace);
			// s=sm ? Array.from(sm) : [];


			// tm=target.match(asciiNospace);
			// t=tm ? Array.from(tm) : [];
			// if(s.join('').split('').sort().join('')===t.join('').split('').sort().join('')) return ;

			// if(s.length!==t.length){

			// 	// $(tr).find('td.target').css('background','#f96');
			// 	count++;
			// 	if(s) {
			// 		let _s=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
			// 		for(let i=0, len=s.length, v; i<len; i++){
			// 			$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(s[i]).appendTo(_s);
			// 		}
			// 	}
			// 	if(t) {
			// 		let _t=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
			// 		for(let i=0, len=t.length, v; i<len; i++){
			// 			$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(t[i]).appendTo(_t);
			// 		}
			// 	}
			// 	qa.css('background','#fdd');
			// }else{
			// 	var resplan='B';
			// 	s.sort();
			// 	t.sort();
			// 	// $(tr).find('td.target').css('background','#f69');
			// 	if(s) {
			// 		let _s=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
			// 		for(let i=0, len=s.length, v; i<len; i++){
			// 			$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(s[i]).appendTo(_s);
			// 		}
			// 	}
			// 	if(t) {
			// 		let _t=$('<p>').css({borderBottom:'1px solid #900',paddingBottom:2}).appendTo(qa);
			// 		for(let i=0, len=t.length, v; i<len; i++){
			// 			$('<span>').css({borderBottom:'1px solid #900',paddingBottom:2}).text(t[i]).appendTo(_t);
			// 		}
			// 	}
			// 	if(s.join('').split('').sort().join('')===t.join('').split('').sort().join('')) {
			// 		resplan='C';
			// 		// $(tr).find('td.target').css('background','#ff9');
			// 		return qa.css('background','#ffd');
			// 	}
			// 	qa.css('background','#fee');
			// 	count++;

			// }
		});
		$('#works td.qa:empty()').parent().addClass('hide');
		if (count) pushlog('🍀', 'Found numeric mismatchs, ' + count + 'ea, Good luck!');
		else pushlog('☘', 'Did not find numeric mismatchs.');
	});

	$('#dictQA').on('click', function () {
		$('#worksTargetFilter').val('dictQA');
		var tmpDict = filterDict();

		$('#works tr').each(function (_, tr) {
			var qa = $(tr).find('.qa');
			if (qa.length === 0) {
				qa = $('<td class="qa">').appendTo(tr);
			}
			var qars = [];
			var s = $(tr).find('.source');
			var t = $(tr).find('.target');

			tmpDict.forEach(function (e, i) {
				// **** qa ddb
				var ds = e[0], dt = e[1];
				if (Search.getRegExp(ds).test(s.text())) {
					if (!Search.getRegExp(dt).test(t.text())) {
						qars.push($('<li>').text(ds + '👁' + dt).get(0).outerHTML);
					}
				}
			});
			qa.html('<ol>' + qars.join('') + '</ol>');
		});
	});


	// import text lines
	$('#ImportTextLines').click(function (e) {
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
			function () {
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
			function () {
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
				e.target.textContent = v;
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
	function activeSRButton(id) {
		$('#' + id).on('click', function (e) {
			if (!confirm('Are you sure you want to replace?')) return false;

			var id = e.target.getAttribute('id').replace('Button', '');
			if (id) {
				$('#' + id).trigger({ type: 'keydown', keyCode: 13 });
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




	setTimeout(function () {
		if (dict && dict.array && dict.array.length) {
			pushlog('Dictionary have ' + dict.array.length + 'ea.', { 'background': '#00F', color: '#FFF' });
		}
	}, 1000);

})

var lastSourceSelectionText, lastTargetSelectionText;
window.addEventListener('loaddropfiles', function (e) {
	// e.datas  [ {type, name, data} ,...]
	// return console.log(e.datas);
	let ls = ao.ls, table, datas = e.datas, name, type, data;
	for (let i = 0, len = datas.length; i < len; i++) {
		name = datas[i].name;
		type = datas[i].type;
		data = datas[i].data;
		table = ao.tmstringToTable(data);
		// console.log('-'.repeat(32));
		// console.log(name);
		// console.log(type);
		// console.log(data);

		$(table)
			.find('.target').each(function (i, e) {
				$(e).attr('tabindex', i + 1000000);// 1000000~开始给tabindex序号
			})
			.end().attr({ dataType: type, dataName: name });

		$(table).find('.source').each(function (i, e) {
			$(e).text($(e).text().replace(/\{\\r\\n\}/g, '\\n'));
		});

		if (type === 'tmtool') table.classList.add('tmtoolfile');
		$('#works').append(table);
	}
}, true);



// loadDatas
$(function () {
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

	let tm = localforage.createInstance({ name: 'tm' });
	tm.getItem(formatName(location.search) + 'works', (j, v) => {
		if (j) { console.warn('[Error] No read works. ' + j.message) } else if (v) {
			$('#works').html(v).find('tr').removeClass('hide hide2 hide3');
			wpClac();
			// 自动移动光标
			$('#works .currentEditRow td.target').focus()
		}
	});
	tm.getItem(formatName(location.search) + 'dict', (j, v) => { if (j) { console.warn('[Error] No read dict . ' + j.message); addDict() } else if (v) { addDict(v); } });
	// tm.getItem(formatName(location.search)+'ctrlEnterColor', (j,v)=>{ if(j){ console.warn('[Error] No read ctrlEnterColor . '+j.message); }else if(v){ $('#ctrlEnterColor').val(v); } });
	tm.getItem(formatName(location.search) + 'useGoogle', (j, v) => { if (j) { console.warn('[Error] No read useGoogle . ' + j.message); } else if (v) { $('#useGoogle').prop('checked', v); console.log('google', v); } });
	tm.getItem(formatName(location.search) + 'useNaver', (j, v) => { if (j) { console.warn('[Error] No read useNaver . ' + j.message); } else if (v) { $('#useNaver').prop('checked', v); console.log('naver', v); } });
	tm.getItem(formatName(location.search) + 'useDaum', (j, v) => { if (j) { console.warn('[Error] No read useDaum . ' + j.message); } else if (v) { $('#useDaum').prop('checked', v); console.log('daum', v); } });
	tm.getItem(formatName(location.search) + 'useDictTip', (j, v) => { if (j) { console.warn('[Error] No read useDictTip . ' + j.message); } else if (v) { $('#useDictTip').prop('checked', v); console.log('useDictTip', v); } });
	tm.getItem(formatName(location.search) + 'worksFontSize', (j, v) => { if (j) { console.warn('[Error] No read fontSize . ' + j.message); } else if (v) { $('#worksFontSize').val(v); console.log('font-size', v); changeWorksFontSize(); } });
	tm.getItem(formatName(location.search) + 'netTarget', (j, v) => { if (j) { console.warn('[Error] No read fontSize . ' + j.message); } else if (v) { $('#netTarget').val(v); } });

});


function backup() {
	let bd = localforage.createInstance({ name: 'backup' }), date = new Date(), dictArrayLength, length;
	if (typeof dict !== 'undefined' && dict.array && (dictArrayLength = dict.array.length)) {

		bd.getItem(formatName(location.search) + 'dict', (j, v) => {
			if (v && Array.isArray(v) && (length = v.length) > dictArrayLength) {
				if (!confirm('[Warning] Do you replace? ' + length + '(old)--->(new)' + dictArrayLength)) return console.error('Failed to back up.');
			}
			bd
				.setItem(formatName(location.search) + 'dict', dict.array)
				.catch((e) => { if (e) { alert('[Error] no save dict. ' + e.message); } })

			bd.setItem(formatName(location.search) + 'backuptime', date.getTime())
				.catch(e => { if (e) { alert('[Error] no save time. ' + e.message); } })

			bd.setItem(formatName(location.search) + 'backuptimestring', date.toLocaleString())
				.catch(e => { if (e) { alert('[Error] no save time. ' + e.message); } })
		});
	}
}


function restore() {
	let bd = localforage.createInstance({ name: 'backup' });
	if (typeof dict === 'undefined') window.dict = new Reference();
	bd.getItem(formatName(location.search) + 'dict',
		(j, v) => {
			if (j) {
				console.warn('[Error] No read dict . ' + j.message);
				addDict();
			} else if (v) {
				addDict(v);
			}
		});
}

setTimeout(() => {
	let message = '[Auto backup]';
	backup();
	pushlog(message);
	console.info(message);
}, 60000 * 30);




function saveDatas() {
	// var ls=ao.ls;
	// try{ls.set('works', $('#works').html()); }catch(err){ pushlog('😱 no save works.'); }
	// try{ ls.set('dict',dict.array); } catch(err) { pushlog('😱 no save dict.'); }
	// try{ ls.set('ctrlEnterColor', $('#ctrlEnterColor').val()); } catch(err) { pushlog('😱 no save ctrlEnterColor.'); }
	// try{ ls.set('useGoogle', $('#useGoogle').prop('checked')); } catch(err) { pushlog('😱 no save useGoogle'); }
	// try{ ls.set('useNaver', $('#useNaver').prop('checked')); } catch(err) { pushlog('😱 no save useNaver'); }
	// try{ ls.set('useDaum', $('#useDaum').prop('checked')); } catch(err) { pushlog('😱 no save useDaum'); }
	// try{ ls.set('netTarget', $('#netTarget').val()); } catch(err) { pushlog('😱 no save netTarget'); }
	// pushlog('😊 save datas',{position:'fixed',bottom:100});
	let length;
	let tm = localforage.createInstance({ name: 'tm' });

	tm.setItem(formatName(location.search) + 'works', $('#works').html()).catch((e) => { if (e) { alert('[Error] no save works. ' + e.message); } });

	if (dict && dict.array && (length = dict.array.length)) {
		dict.array = uniqueDictionaryArray(dict.array);
		tm.setItem(formatName(location.search) + 'dict', dict.array)
			.catch((e) => { if (e) { alert('[Error] no save dict. ' + e.message); } });

		$('#dictArrayLengthUI').text(length);
	}
	// tm.setItem(formatName(location.search)+'ctrlEnterColor', $('#ctrlEnterColor').val()).catch((e)=>{ if(e){alert('[Error] no save ctrlEnterColor. '+e.message);}});
	tm.setItem(formatName(location.search) + 'useGoogle', $('#useGoogle').prop('checked')).catch((e) => { if (e) { alert('[Error] no save useGoogle. ' + e.message); } });
	tm.setItem(formatName(location.search) + 'useNaver', $('#useNaver').prop('checked')).catch((e) => { if (e) { alert('[Error] no save useNaver. ' + e.message); } });
	tm.setItem(formatName(location.search) + 'useDaum', $('#useDaum').prop('checked')).catch((e) => { if (e) { alert('[Error] no save useDaum. ' + e.message); } });
	tm.setItem(formatName(location.search) + 'useDictTip', $('#useDictTip').prop('checked')).catch((e) => { if (e) { alert('[Error] no save useDictTip. ' + e.message); } });
	tm.setItem(formatName(location.search) + 'worksFontSize', $('#worksFontSize').val()).catch((e) => { if (e) { alert('[Error] no save worksFontSize. ' + e.message); } });
	tm.setItem(formatName(location.search) + 'netTarget', $('#netTarget').val()).catch((e) => { if (e) { alert('[Error] no save worksFontSize. ' + e.message); } });
}


let lastAutoSaveTimeStamp;
// autoSaveData
$(window).on('blur', (e) => {
	e.preventDefault();

	// 保存间隔不至少 30s
	lastAutoSaveTimeStamp = lastAutoSaveTimeStamp || 0;
	if ((Date.now() - lastAutoSaveTimeStamp) > 30000) {
		saveDatas();
		lastAutoSaveTimeStamp = Date.now();
	}
});

/*
1	11
2	22
3	33
*/
function pushlog() {
	var clog = createCustomLog.apply(null, arguments);
	if (clog) {
		clog.prependTo('#clogs');
	}
}

function pushloghtml(v) {
	$(`<p class="clog">`).prependTo(`#clogs`).html(v);
}




// arg为string时，视为信息。arg为object时，视为css。
function createCustomLog(...args) {
	let length = args.length, header, content, style = {}, contents = [];

	if (length === 0) {
		return;
	} else {
		let tr = $('<tr class="clog"></tr>');
		args.forEach(e => {
			let type = typeof e;
			if (type === 'string' || type === 'number') {
				contents.push(e);
			} else if (e === 'object') {
				Object.assign(style, e);
			}
		});

		content = contents.join('\n');
		tr.append($('<td>').text(content).css(style));

		return tr;
	}
}




function downloadFile(filename, content) {
	var a = document.createElement('a');
	var blob = new Blob([content]);
	var url = window.URL.createObjectURL(blob);
	filename = filename + formatName(location.search) + '_' + Date.now() + '.txt';

	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

function downloadFile2(fileName, content) {
	var aLink = document.createElement('a');
	var blob = new Blob([content]);
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.dispatchEvent(evt);
}

var t;
// function replaceTD(t){
// 	var w=window.getSelection();
// 	var bn=w.baseNode;
// 	var b=w.baseOffset;
// 	var en=w.extentNode;
// 	var e=w.extentOffset;
// 	if(bn===en){
// 		window.bn=bn;
// 		console.log(bn);
// 	}
// }

// 格式化名称
function formatName(n) {
	return n.replace(/[\\\/\:\*\?\"\<\>\|\&\-\+\=\`\~\%\!\@\#\$\%\^\,\.\;\:\'\(\)\{\}\[\]\s]/g, '_');
}

// 过滤dictArray的source空格分隔数小于等于n
function filterStep(arr, n = 0) {
	return arr.filter(function (e) {
		var v = e[0];
		if (v) {
			v = v.trim().match(/\s+/g);
			if (v) {
				return v.length <= n;
			} else {
				return true;
			}
		}
		return false;
	});
}

// 过滤一些标签
function filterTag(arr) {
	var rs = [], regExp = /\[[a-z0-9\-]+?\]|\{[\d+?]\}|[\(\)\[\]\{\}\<\>\"\'\`\!\！\,\，\.\。\…\?\？]|^\d+$/ig;
	arr.forEach(function (e) {
		var s = e[0], t = e[1];
		if (s) {
			s = s.trim();
			if (s) {
				s = s.replace(regExp, '');
				if (t) {
					t = t.replace(regExp, '');
				}
				rs.push([s, t]);
			}
		}
	});
	return rs;
}

function filterLength(arr, max = 16, min = 2) {
	return arr.filter(function (e) {
		var s = e[0];
		if (s) {
			s = s.trim();
			if (s) {
				var length = s.length;
				return length <= max && length >= min;
			}
		}
		return false;
	})
}

function filterDict() {
	var rs = filterStep(dict.array, 0);
	rs = filterTag(rs);
	rs = filterLength(rs, 10);
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


$(document).on('keydown', function (e) {
	let oe = e.originalEvent;
	let code = oe.code;
	// let repeat=oe.repeat;
	// if(repeat) return oe.preventDefault();
	switch (code) {
		case 'Digit0':
		case 'Digit1':
		case 'Digit2':
		case 'Digit3':
		case 'Digit4':
		case 'Digit5':
		case 'Digit6':
		case 'Digit7':
		case 'Digit8':
		case 'Digit9':
		case 'Numpad0':
		case 'Numpad1':
		case 'Numpad2':
		case 'Numpad3':
		case 'Numpad4':
		case 'Numpad5':
		case 'Numpad6':
		case 'Numpad7':
		case 'Numpad8':
		case 'Numpad9': {

			// alt+num
			let tipName;
			if (e.ctrlKey) {// ctrl+num
				e.preventDefault();
				tipName = '#tips';
			} else if (e.altKey) {// alt+num
				e.preventDefault();
				tipName = '#statusDict';
			}
			if (tipName && $(tipName).find('tr').length) {
				let tar = $(e.target);

				oe.preventDefault();
				let key = parseInt(code.match(/\d/));
				if (key === 0) key = 10;
				key--;
				let t = $(tipName).find('tr').eq(key).find('.target').text().trim();

				// $('.currentEditRow .target').focus();
				if (SM.lastTargetRange) SM.range = SM.lastTargetRange;
				if (
					(SM.range.endContainer.nodeType === 3
						&& $(SM.range.endContainer.parentNode).is('#works .target')
						&& SM.range.startContainer.nodeType === 3
						&& $(SM.range.startContainer.parentNode).is('#works .target'))
					||
					(SM.range.endContainer.nodeType === 1
						&& $(SM.range.endContainer).is('#works .target')
						&& SM.range.startContainer.nodeType === 1
						&& $(SM.range.startContainer).is('#works .target'))
				) {
					SM.text = t;// selection.range
					if (e.ctrlKey) {// show diff  -- dmp
						if (t.length) {
							let t1 = $(tipName).find('tr').eq(key).find('.source').text().trim();
							let t2 = $(e.target).parent().find('.source').text().trim();
							let dmp = new diff_match_patch();
							let dmpHTML = dmp.diff_prettyHtml(dmp.diff_main(t1, t2));
							pushloghtml(dmpHTML);

							let { x, y, height } = tar.get(0).getBoundingClientRect();
							// showTip({html:dmpHTML, x, y:Math.max(y-height,0)});
							showTip({ html: dmpHTML, x, y, delay: 5000, css: { transform: 'translate(0,-100%)' } });
						}
					}
				}
				break;
			}
		}
	}
});


$(document).on('mousedown', '#tips td, #statusDict td', function (e) {
	if (e.which === 3) {// e.which===3  rightclick contextmenu
		let tar = $(e.target);

		$('#statusDict,#tips').empty();// 删除一个就得隐藏，否则序号全部会错乱。

		e.preventDefault();
		let p, s, t;
		p = $(e.target).parent('tr')
		n = p.find('td.no').text()
		s = p.find('td.source').text()
		t = p.find('td.target').text()
		i = parseInt(p.find('td.index').text())

		if ((s !== dict.array[i][0]) && (t !== dict.array[i][1])) {
			// 字典中没有找到原文译文匹配的记录时，不进行删除，以免误删该索引上的记录。
			pushlog('Failed to delete! Unable to find the corresponding record.');
			return false;
		}

		if (confirm(`< Warning > Do you want to delete?
No: - ${n} -
source: ${s}
target: ${t}
index: - ${i} -`)) {
			var l = dict.array.length;
			var item = dict.array.splice(i, 1);
			$(e.target).parent('tr').remove();
			console.info(`[ Deleted ] ${i} ${item.join('\n')}`);
			pushlog(`[ Deleted ] ${i} ${item.join('\n')}`);
		}
	}
});

// downloadExcel
function doit(table, fn, type, dl) {
	var elt = document.getElementById('works');
	var wb = XLSX.utils.table_to_book(elt, { sheet: "Sheet1" });
	return dl ?
		XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
		XLSX.writeFile(wb, fn || ('test.' + (type || 'xlsx')));
}

function smartMatch(source, sourceTargetArray) {
	var ret = '';
	var o = strDiff(source, sourceTargetArray[0]);
	var d1 = o.diff1, d2 = o.diff2, len1 = d1.length, len2 = d2.length, d1Value, d2Value;
	var regexp = /^[\x01-\xff]+$/;
	if (len1 === len2) {// 不同点个数一样
		var startResult = [];
		startResult.push('⁉ Replace');
		ret = sourceTargetArray[1];
		for (var i = 0; i < len1; i++) {
			d1Value = d2Value = '';
			if (regexp.test(d1[i])) {
				ret = ret.replace(d2[i], d1[i]);
				startResult.push(d2[i] + ' -> ' + d1[i]);
			} else {
				dict.array.some(function (e) {
					if (e && (typeof e[0] === 'string') && e[0] && (typeof e[1] === 'string') && e[1]) {
						if (e[0].trim() === d1[i].trim()) d1Value = e[1].trim();
						if (e[0].trim() === d2[i].trim()) d2Value = e[1].trim();
						if (d1Value && d2Value) return true;
					}
				});
				if (d2Value) {
					ret = ret.replace(d2Value, d1Value || d1[i]);
					if (d1Value) {
						startResult.push(d2Value + ' -> ' + d1Value);
					} else {
						startResult.push(d2Value + ' *> ' + d1[i]);
					}
				} else {
					if (d1Value) {
						startResult.push(d2[i] + ' *> ' + d1Value);
					} else {
						startResult.push(d2[i] + ' *> ' + d1[i]);
					}
				}
			}
		}
		startResult.push('[Use] ' + sourceTargetArray[1]);
		pushlog.apply(null, startResult);
	} else if (len1 == 0) {
		// len2多，所以要删除多余的部分
		var startResult = [];
		startResult.push('⁉ Remove');
		ret = sourceTargetArray[1];
		for (var i = 0; i < len2; i++) {
			d2Value = '';
			if (regexp.test(d2[i])) {
				ret = ret.replace(d2[i], '');
			} else {
				dict.array.some(function (e) {
					if (e && (typeof e[0] === 'string') && e[0] && (typeof e[1] === 'string') && e[1]) {
						if (e[0].trim() === d2[i].trim()) {
							d2Value = e[1];
							return true;
						}
					}
				});
				if (d2Value) {
					ret = ret.replace(d2Value, '');
					startResult.push('[x] ' + d2Value);
				} else {
					startResult.push('[*] ' + d2[i]);
				}
			}
		}
		startResult.push('[Use] ' + sourceTargetArray[1]);
		pushlog.apply(null, startResult);
	} else if (len2 == 0) {
		// len1多，所以要找到内容，添加进去
		var startResult = [];
		ret = sourceTargetArray[1];
		startResult.push('‼ Add');
		for (var i = 0; i < len1; i++) {
			d1Value = '';
			if (regexp.test(d1[i])) {
				startResult.push('[*]' + d1[i]);
			} else {
				dict.array.some(function (e) {
					if (e && (typeof e[0] === 'string') && e[0] && (typeof e[1] === 'string') && e[1]) {
						if (e[0].trim() === d1[i].trim()) {
							d1Value = e[1];
							return true;
						}
					}
				});
				if (d1Value) {
					startResult.push('[*] ' + d1Value);
				} else {
					startResult.push('[*] ' + d1[i]);
				}
			}
		}
		startResult.push('[Use] ' + sourceTargetArray[1]);
		pushlog.apply(null, startResult);
	} else {
		ret = sourceTargetArray[1];
		var startResult = [];
		startResult.push('❌ No smart');
		startResult.push('[*]' + d1.join('|') + ' <- ' + d2.join('|'));
		pushlog.apply(null, startResult);
		// ❌💯‼️⁉️
	}
	return ret;
}

function strDiff(str1, str2, separator) {
	str1 = str1 || "";
	str2 = str2 || "";
	// separator = separator || /\b|[\s,\.\!_\-\+]+|\{\\r\\n\}|\\n/;// 原来的
	separator = separator || /[\s,\.\!_\-\+]+|\{\\r\\n\}|\\n/;
	// arr中有ele元素
	function hasElement(arr, ele) {
		// 内存循环
		var hasItem1 = false;
		for (var i2 = 0; i2 < arr.length; i2++) {
			//
			var item2 = arr[i2] || "";
			if (!item2) {
				continue;
			}
			//
			if (ele == item2) {
				hasItem1 = true;
				break;
			}
		}
		return hasItem1;
	};
	function inAnotB(a, b) { // 在A中，不在B中
		var res = [];
		for (var i1 = 0; i1 < a.length; i1++) {
			var item1 = a[i1] || "";
			if (!item1) {
				continue;
			}
			var hasItem1 = hasElement(b, item1);
			if (!hasItem1) {
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
		diff1: diff1,
		diff2: diff2,
		separator: separator
	};
	return result;
};


// 查找表情符号用
function imo(begin, count) { while (count-- > 0) console.log(String.fromCharCode(55357, begin++)); }


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
	document.execCommand('copy', true);

	var length = data.length;
	pushlog('Copyed', length > 50 ? (data.slice(0, 50) + '...(' + length + ')') : data);
}

function downloadFileUcs2(filename, content) {
	content = content.replace(/\n/g, '\r\n');
	content = punycode.ucs2.decode(content);
	content.unshift(0xfeff);
	content = Uint16Array.from(content);
	var a = document.createElement('a');
	var blob = new Blob([content]);
	var url = window.URL.createObjectURL(blob);
	filename = filename + formatName(location.search) + '_' + Date.now() + '.txt';

	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

$(document).on('contextmenu', '#works td.no', function (e) {
	e.preventDefault();
	if (confirm('[Warning] Delete row ' + e.target.textContent + '?!')) {
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

function maskScreen() {
	let mask = $('#mask')
	if (mask.length === 0) {
		mask = $('<div id="mask">').css({
			width: '100%', height: '100%',
			position: 'fixed', left: 0, top: 0,
			background: 'rgba(255,255,255,.8)'
		})
		// .on('contextmenu',(e)=>{ e.preventDefault() mask.detach() })
	}
	mask.appendTo('body')
	return mask;
}

function get2DArrayMaxLength(arr) {
	let maxLength = 0;
	arr.forEach(row => {
		maxLength = Math.max(row.length, maxLength);
	});
	return maxLength;
}

function createControlTr(maxLength) {
	let tr = $('<tr class="control">');
	while (maxLength-- > 0) {
		$('<td>').appendTo(tr)
			.append(createRadioButton('source'))
			.append(createRadioButton('target'))
			.append(createCheckButton('edit'))
	}
	return tr;
}

function createRadioButton(name, checked) {
	let
		label = $('<label class="button">').text(name),
		radio = $('<input type="radio">').attr({ name, checked }).prependTo(label)
	radio.after('<br>')
	return label
}
function createCheckButton(name, checked) {
	let
		label = $('<label class="button">').text(name),
		radio = $('<input type="checkbox">').attr({ name, checked }).prependTo(label)
	radio.after('<br>')
	return label
}


$(function () {
	$('#flipDict').click(function (e) {
		dict.array.forEach(e => e.reverse());
		pushlog('[Flip Dictionary]');

		let mask = maskScreen();
		let table = ao.arrayToTable(dict.array.slice(0, 10));
		mask.append(table).one('click', function () {
			mask.remove();
		});
		mask.find('table').css({ maxWidth: '60em', margin: 'auto auto', opacity: .7, userSelect: 'none' });
	})
});


function wpClac() {
	let c = wpClac2(), p;

	p = parseInt(c.source.progress.char * 100) + '%';
	$('#wp .char')
		.find('rect').attr({ width: p })
		.end()
		.find('text').text('字:' + c.source.have.char + '/' + c.source.char + `(${p})`);
	p = parseInt(c.source.progress.cell * 100) + '%';
	$('#wp .cell')
		.find('rect').attr({ width: p })
		.end()
		.find('text').text('行:' + c.source.have.cell + '/' + c.source.cell + `(${p})`);
}
function wpClac2() {
	let r = {
		source: {
			cell: 0, char: 0, have: { cell: 0, char: 0 }, progress: {
				get cell() {
					return r.source.have.cell / r.source.cell;
				},
				get char() {
					return r.source.have.char / r.source.char;
				}
			}
		},
		target: {
			cell: 0, char: 0, have: { cell: 0, char: 0 }, progress: {
				get cell() {
					return r.target.have.cell / r.target.cell;
				},
				get char() {
					return r.target.have.char / r.target.char;
				}
			}
		},
	};

	$('#works tr').each((i, e) => {
		e = $(e)
		if (e.is('.emptyRow')) return;
		let s = e.find('.source');
		let t = e.find('.target');
		let st = s.text();
		let tt = t.text();
		let stl = st.length;
		let ttl = tt.length;

		if (stl) {
			if (ttl) {
				r.source.have.char += stl;
				r.source.have.cell++;
				if (t.is('.done')) {
					r.target.have.char += ttl;
					r.target.have.cell++;
				}
			}
			r.source.char += stl;
			r.source.cell++;
			r.target.char += ttl;
			r.target.cell++;
		}
	});
	return r;
}


function changeWorksFontSize() {
	let size = Math.max(parseInt($('#worksFontSize').val()), 8);
	$('#activeStyle').text(`#works td.source,#works td.target{
		font-size:${size}pt;
	}`);
}


$(() => {
	$(window).on('keydown', e => {
		if (e.keyCode === 121 && e.ctrlKey) {// F10 backup
			e.preventDefault();
			backup();
			pushlog('[Manual backup]');
			console.info('[Manual backup]');
		}
	});
});


$(() => {
	let visible = false;
	$('#helpHeader').click(() => {
		visible = !visible;
		ui = $('#helpContent')[visible ? 'fadeIn' : 'fadeOut']();
	})
});

$(() => {
	$('#restoreButton').click(() => {
		let bd = localforage.createInstance({ name: 'backup' });
		bd.getItem(formatName(location.search) + 'backuptime',
			(j, v) => {
				if (j) {
					console.warn('[Error] No backup.');
				} else if (v) {
					if (confirm('Last backup time is:  ' + (new Date(v)).toLocaleString())) {
						restore();
					}
				}
			});
	});

	$('#toggleComments').click(() => $('#works td').not('.no,.source,.target').toggle());
});


function uniqueDictionaryArray(a) {
	a.reverse();
	a = a.map(e => e.join('\x00'))
	a = Array.from(new Set(a))
	a = a.map(e => e.split('\x00'))
	a.reverse();
	return a;
}


$(() => {
	let projectName = location.search.slice(1);
	$('#projectName').text(projectName);
	document.title = location.search.slice(1);
});


function addTip(text, dom) {
	let t = $('<div>').appendTo('body').one('click', (e) => e.target.remove());
	let rect;
	if (dom && dom.getBoundingClientRect) {
		rect = dom.getBoundingClientRect();
	} else {
		let s = window.getSelection();
		if (s.type !== 'None') {
			let r = s.getRangeAt(0);
			rect = r.getBoundingClientRect();
		} else {
			return;
		}
	}
	let { top, left } = rect;
	t.css({ background: 'rgba(255,255,0,0.5)', position: 'fixed', left }).text(text)
	t.css({ top: top + Math.max(t.height(), 20) })

}

{// 插入特殊符号
	let chars = '\\{\\r\\n\\}|\\n|[' + '`~!@#$%^&*()_+-=[]{}\\|:;\'"/<>?'.split('').map(e => '\\' + e).join('') + ']+';
	// let chars='['+'`~!@#$%^&*()_+-=[]{}\\|:;\'",./<>?'.split('').map(e=>'\\'+e).join('')+']+';
	let _customChars = '[\\x00-\\x19\\x21-\\xff★※]+';
	$(window).on('keydown', e => {
		if (e.keyCode === 120) {// 120:F9

			// ctrl+shift+alt+f9 配置
			if (e.ctrlKey && e.shiftKey && e.altKey) {
				return _customChars = prompt('매칭 할 내용을 넣어 주세요', _customChars) || _customChars;
			}
			e.preventDefault();
			insertTips(e);// 插入找到的内容
		}
	});
	function insertTips(e) {// 插入找到的内容
		let t = $(e.target);
		if (t.is('#works .target')) {
			let s = t.parent().find('.source');

			let regExp = new RegExp((e.ctrlKey || e.altKey) ? _customChars : chars, 'gm');
			let r = s.text().match(regExp).join('').replace('：', ':');
			// console.debug(regExp,r);
			if (e.altKey) {
				r = r.replace(/'([\s\S]*?)'/g, '「$1」');
				r = r.replace(/"([\s\S]*?)"/g, '『$1』');
				// r=r.replace(/:/g,'：');
			}
			SM.text = r;
		}
	}
}


function ctrl(e) {
	let target = $(e.target), source, targetText, sourceText;
	if (target.is('#works .target')) {
		source = target.parent().find('.source');
		targetText = target.text();
		sourceText = source.text();
		// console.debug(sourceText,targetText);

		createSelect(source, target);

		// let dmp=new diff_match_patch();
		// let dmpHTML=dmp.diff_prettyHtml(dmp.diff_main(t1,t2));

	}
	function createSelect(workSource, workTarget) {
		let tips = [];

		$('#tips tr').toArray().forEach((e) => {
			let tipSource, tipTarget;
			tipSource = $(e).find('.source').text();
			tipTarget = $(e).find('.target').text();
			if (tipSource && tipTarget) {
				tips.push({ tipSource, tipTarget });
			}
		});

		let { top, left, width, height } = workTarget.get(0).getBoundingClientRect();
		let select = $('<select class="tipSelect">')
			.appendTo('body')
			.prop({ size: Math.min(10, tips.length) })
			.css({ position: 'fixed', left, top: top + height, width })
			.on('change', e => {
				console.debug(SM.text, e.target.value);
			})
			.on('keyup', e => {
				let code = e.originalEvent.code || e.code;
				let value = e.target.value;
				if (code === 'Enter') {
					select.data('workTarget').text(value).focus();
					SM.range.setEndAfter(SM.range.endContainer);
					console.log(SM.range)
					$('.tipSelect').remove();
				} else if (code === 'Escape') {
					$('.tipSelect').remove();
				}
			})
			.one('click', e => { SM.text = e.target.value; e.currentTarget.remove(); })
			.data({ workTarget, workSource })

		let focusSelect = function (e) {
			// 方向键下时激活提示框
			let code = e.originalEvent.code || e.code;
			if (code === 'ArrowDown') {
				e.preventDefault();
				select.focus().find('option:first').prop({ selected: true });
			} else {
				$(window).off('keydown', focusSelect);
			}
		};
		$(window).one('keydown', focusSelect);

		tips.forEach(e => {
			let dmp, dmpMain, dmpHTML, label, value;
			dmp = new diff_match_patch();
			dmpMain = dmp.diff_main(e.tipSource, workSource.text());
			dmpHTML = dmp.diff_prettyHtml(dmpMain);
			// label=value=e.tipTarget;

			label = value = dmpMain.reduce((r, e) => {
				if (e[0] === -1) {
					// r=dict.search(e[1],100).reduce((v,e)=>{
					// 	console.log(e);
					// 	return v.replace(e[2],);
					// },r);
				}
				// return r.replace(e[1], )
				console.log(e)
				return r;
			}, e.tipTarget);
			console.debug(dmpMain);

			$('<option>').prop({ label, value }).appendTo(select)
		});
	}
}




{
	$(function () {
		$('#main .utilsource').on('contextmenu', e => {
			if (e.originalEvent.target === e.originalEvent.currentTarget) {
				console.log(e)
				e.preventDefault();
				$('#worksSourceFilter').val('').trigger('input');
			}
		});
	});
}


{
	$(function () {
		let t = true;
		$('#sort').on('click', e => {
			$('#works tr').sort((a, b) => {
				if (t) {
					a = $(a).find('.source').text().length;
					b = $(b).find('.source').text().length;
				} else {
					a = parseInt($(a).find('.no').text());
					b = parseInt($(b).find('.no').text());
				}
				return a > b ? 1 : (a < b ? -1 : 0);
			}).detach().appendTo('#works');
			t = !t;
			$('#sort').find('span').last().text((t ? '길이' : '순서') + '배열');
		});
	});
}


// 编辑下一个空格子
function nextEmptyTarget(ctrlKey = false) {
	let e = $('#works tr').not('.hide,.hide2,.hide3,.emptyRow');
	if (!ctrlKey) {
		e = e.filter((i, e) => $(e).find('.target').is(':empty()'));
	} else {
		e = e.filter((i, e) => !$(e).find('.target').is('.done'));
	}
	return e.eq(0).find('.target').focus();
}



// function WorksRange(){
// 	this.ranges = {};
// 	this.parents = {};
// 	this.selection;
// }
// Object.defineProperty(WorksRange.prototype,'selection',{
// 	get(){
// 		if(!this._selection) Object.defineProperty(this,'_selection',{value:window.getSelection()});
// 		return this._selection;
// 	}
// });
// Object.defineProperty(WorksRange.prototype,'range',{
// 	get(){
// 		return this.selection.rangeCount ? this.selection.getRangeAt(0) : null;
// 	}
// });
// WorksRange.prototype.flush = function (){
// 	let r=this.range;
// 	if(!r) return;
// 	let n = r.endContainer;
// 	while(true)	{
// 		if(!n) break;
// 		if($(n).is('#works .target')) {
// 			this.ranges.target=r;
// 			this.parents.target=n.parentElement;
// 			break;
// 		}
// 		if($(n).is('#works .source')) {
// 			this.ranges.source=r;
// 			this.parents.source=n.parentElement;
// 			break;
// 		}
// 		n=n.parentElement;
// 	}
// 	// console.log(JSON.stringify(this.ranges,function(k,v){
// 	// 	if(k==='target' || k==='source') {
// 	// 		return v.toString();
// 	// 	}
// 	// 	return v;
// 	// }))
// 	// console.log(this.parents)
// }
// Object.defineProperty(WorksRange.prototype, 'isSameParent', {
// 	get(){
// 		return this.parents.source === this.parents.target;
// 	}
// });
// WorksRange.prototype.start = function(){
// 	$(window).on('mouseup keyup', this.defaultHandle.bind(this));
// }
// WorksRange.prototype.stop = function(){
// 	$(window).off('mouseup keyup', this.defaultHandle.bind(this));
// }
// WorksRange.prototype.defaultHandle = function(e){
// 	e.preventDefault();
// 	this.flush();
// }
// let wr=new WorksRange()
// wr.start()


$(document).on('blur', '#works .target', function (e) {
	let r = SM.range;
	SM.lastTargetRange = r;
});


function showTip(opt) {
	if (opt === undefined || opt === null) return;
	let type = typeof opt;
	if (type !== 'object') {
		opt = { text: opt };
	}
	let ui;
	ui = $('<div></div>').appendTo('body').fadeIn().css({
		position: 'fixed',
		left: opt.x || 0,
		top: opt.y || 0,
		zIndex: 999,
		opacity: 1,
	}).css(Object.assign({
		opacity: 0.1,
		margin: 0,
		padding: 6,
		border: '2px solid #000',
		background: '#fffe',
		color: '#000',
		borderRadius: 6,
		fontWeight: 'bold'
	}, opt.css));
	if (opt.html) ui.html(opt.html);
	else if (opt.text) ui.text(opt.text);
	if (opt.animate) {
		if (Array.isArray(opt.animate)) {
			opt.animate.forEach(e => {
				ui = ui.animate(e);
			});
		} else {
			ui = ui.animate(opt.animate);
		}
	}
	ui.delay(opt.delay || 1500).fadeOut(() => ui.remove());
	return ui;
}

function numCheck(s, t) {
	let numRE = /[\+\-]?\d+(,\d{3})*(\.\d+)?(?:[Ee][\+\-]?\d+)?%?/g;
	// let s='1,001291 asfas  0.12  100,1000,00.0'
	// let t='asfas  0.12  100,1000,00.0  1,00129'

	let sa = s.match(numRE)
	let ta = t.match(numRE)

	// console.log(sa);
	// console.log(ta);

	function clac(sa, ta) {
		sa = sa || [];
		ta = ta || [];
		let r = {}
		if (sa.length === ta.length) {
			if (sa.join('\u200c') === ta.join('\u2000c')) {
				r.done = true;
				return r;
			} else {
				r.done = false;
			}
		}
		sa.forEach((e, i) => {
			let index = ta.indexOf(e);
			if (index !== -1) {
				delete ta[index];
				delete sa[i];
			}
		});
		sa = sa.filter(e => e !== undefined);
		ta = ta.filter(e => e !== undefined);
		return { sa, ta }
	}

	// console.log(clac(sa,ta))
	return clac(sa, ta);
}

// function splitLongSource(s) {
// 	let r = /(?!\d)\s*(?:\.|\?|\!)\s*(?!\d)|{\\r\\n}|\\n/g;
// 	let a1 = s.split(r);
// 	let l1 = a1.length;
// 	if (l1 < 2) return false;
// 	let a2 = s.match(r);
// 	let l2 = a2.length;
// 	console.warn(a1, a2)
// 	let a = [];
// 	let len = Math.max(l1, l2);
// 	let i = 0;
// 	while (i < len) {
// 		let v1 = a1[i], v2 = a2[i] || '', chunk;
// 		if (v2.indexOf('.') === -1 || v2.indexOf('!')===-1 || v2.indexOf('?')===-1) {
// 			chunk = [v1, v2];
// 		} else {
// 			chunk = [v1 + v2];
// 		}
// 		a = a.concat(chunk);
// 		i++;
// 	}
// 	a = a.filter(e => e.length > 0);
// 	return a;
// }

function splitLongSource(str) {
	return longSegmentSplit(str)
}

{
	// 让.source可以编辑
	$(window).on('contextmenu', e => {
		let t = e.target, k = 'contenteditable', v = 'plaintext-only';
		if ($(t).is('.source')) {
			e.originalEvent.preventDefault();
			if (t.hasAttribute(k)) {
				t.removeAttribute(k);
			} else {
				t.setAttribute(k, v);
			}
		}
	});

	// 下方格子向上合并
	$(window).on('keydown', e => {
		let t = $(e.target), p = $(t).parent(), pn = p.next();
		if (e.keyCode === 69 && e.ctrlKey) {
			e.originalEvent.preventDefault();
			if (t.is('.target') && p.is('.split') && pn.is('.split')) {
				let s = p.find('.source');
				let sn = pn.find('.source');
				s.text(s.text() + sn.text());

				let tn = pn.find('.target');
				t.text(t.text() + tn.text());
				pn.remove();
			}
		}
	});
}



{
	// 让单按Alt键失效（否则总会失真）
	$(window).on('keyup', e => {
		disableAlt.call(e);
	});

	function disableAlt() {
		// this === KeyboardEvent
		if (this.keyCode) this.preventDefault();
	}
}
