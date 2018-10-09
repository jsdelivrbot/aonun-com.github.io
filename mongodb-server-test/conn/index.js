// 用于2.curd.js开始的文件导入连接数据库的统一接口
// require('conn')(function(db){})

// 怎么实现???
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://localhost:27017/test`;
const opt = {
  useNewUrlParser: true
};


module.exports = function(callback){
	MongoClient.connect(url, opt).then(client=>{
		callback(null, client);
	}).catch(error=>{
		callback(error, null);
	});
};