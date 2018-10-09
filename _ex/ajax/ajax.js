$(function(){
	let methodUI=$('<select>').prependTo('body');

	$('<option value="POST">POST</option>').appendTo(methodUI)
	$('<option value="PUT">PUT</option>').appendTo(methodUI)
	$('<option value="DELETE">DELETE</option>').appendTo(methodUI)
	$('<option value="GET">GET</option>').appendTo(methodUI)


	let file=$('<input type="file" multiple>').appendTo('body').on('change',function(){
		let files=this.files, fd=new FormData, len;

		if(len=files.length){
			while(len-->0){
				fd.append('files',this.files[len]);
			}
			console.log(fd.getAll('files'))
			$.ajax({
				type:'POST',
				data:fd,
				processData:false,
				contentType:false,
				success:function(data){
					console.log(data);
				}
			})
		}
	});
	$('<input type="file">').appendTo('body').on('change',function(){
		let files=this.files, fd=new FormData, len;
		console.log(files)

		if(len=files.length){
			while(len-->0){
				fd.append('files',this.files[len]);
			}
			console.log(fd.getAll('files'))
			$.ajax({
				type:'POST',
				data:fd,
				processData:false,
				contentType:false,
				success:function(data){
					console.log(data);
				}
			})
		}
	});
	$('<button>').prependTo('body').text('post').click(function(e){
		let
		data={
			now:Date.now()
		};
		$.ajax({
			method: methodUI.val(),
			data: data,
			dataType: 'blob'
		}).done(function(data){
			console.log(data);
			$('pre').text(data);
		});
	});
});