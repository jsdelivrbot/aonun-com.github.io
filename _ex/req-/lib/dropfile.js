define(['jquery','localforage'],($,localforage)=>{
	let name='test';
	let storeName='files';
	let dbOption = { name,storeName };

	
	let db=window.db=localforage.createInstance(dbOption);

	window.totalDropFiles={
		get(k){
			console.log(db.config())
			db.getItem('files').then((file)=>{
				console.log(file)
			})
		}
	};
	let totalDropFiles=window.totalDropFiles;

	function pushlog(){
		console.info.apply(null,arguments)
	}

	$(window).add(document)

	.on('dragover',(e)=>{ e.preventDefault(); })

	.on('drop',function(e){
		e.preventDefault();
		e.stopPropagation();
		console.log(e.target)

		let files, length, E, onloadCount=0;
		files  = e.originalEvent.dataTransfer.files;// 被拖进的文件
		length = files.length;// 文件数量
		E=new Event('loaddropfiles');// 创建事件实例
		// E.files=files;// 加入文件
		// E.datas=[];// 加入数据

		console.log('拖入%s个文件',length)
		console.log(files)

		Array.from(files).forEach((file,i,a)=>{
			console.log(file,i,a)
			let r=db.setItem('files',files)
			console.log(r)
		});




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

	return totalDropFiles;
})