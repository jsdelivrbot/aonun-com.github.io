let o=require('../index.js');
global.term=o.term;
global.toCN=global.jianti=o.toCN;
global.toTW=global.fanti=o.toTW;

o=require('./term.js');


// 使用上面的定义，进行最终的简体繁体转换。



// 读取文件
const fs=require('fs');
var dirname = 'E:/Downloads/';
var filenames = fs.readdirSync(dirname);

filenames =filenames.filter(function(filename){
  return /(?!\.NAN)\.txt$/ .test(filename);
});



function read(path,n){
  // console.log(path);    //filename
  var text  = fs.readFileSync(path,{flag:'r',encoding:'UTF-16LE'});
  return fanti(text);
}

filenames.forEach(function (filename,index){
  // console.log(filename);
  var data=read(dirname+filename);
  // console.log(data);

  // fs.writeFileSync(dirname+filename.replace('.txt','.NAN.txt'), data, {encoding:'ucs2'});
  fs.writeFileSync(dirname+filename, data, {encoding:'ucs2'});
});
