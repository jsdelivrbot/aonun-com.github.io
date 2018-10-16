const fs=require('fs');

// 读取目录下的txt文件
var dirname = './xlsx/';
var filenames = fs.readdirSync(dirname);

filenames =filenames.filter(function(filename){
	return /\.xlsx$/ .test(filename);
});


filenames.forEach(function(fn){
	// console.log(dirname+fn, dirname+fn.replace(/\.xlsx$/i, '.xls'));
	fs.renameSync(dirname+fn, dirname+fn.replace(/\.xlsx$/i, '.xls'));
	// fs.renameSync(fn, fn.replace(/\.xlsx$/i, '.xls'));
});