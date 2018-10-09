const MongoClient = require('mongodb').MongoClient;

const dbName='db1';
const url = `mongodb://localhost:27017/${dbName}`;// 4.0 
const opt = {
  useNewUrlParser: true
};

console.log(url);

MongoClient.connect(url, opt, function(err, client) {
  let db=client.db();// 默认读取url中的dbName
  // let db=client.db('test2');
  db.createCollection('site', function (err, res) {
    if (err) throw err;
    console.log("创建集合!");
    // Q:如何关闭连接?
    console.log(`即将关闭连接`);
    client.close();// !!!关闭了
  });
});


//可以参考 http://www.runoob.com/nodejs/nodejs-mongodb.html
//参考2   http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html