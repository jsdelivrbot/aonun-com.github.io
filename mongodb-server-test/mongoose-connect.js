'use strict';


// 导入
const mongoose=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;// 可以new的 ObjectId
// mongoose.Schema.ObjectId  供Schema的内部类型
const Schema=mongoose.Schema;

// 连接
// mongoose.connect('mongodb://0.0.0.0:3717/test', { useNewUrlParser: true });
// 数据库
// let db=mongoose.connection;

// 连接
let db=mongoose.createConnection('mongodb://0.0.0.0:3717/test', { useNewUrlParser: true });


let DocSchema=new mongoose.Schema({
	author:mongoose.Schema.ObjectId,
	title:String,
	body:String,
	date:Date
});


DocSchema.methods.getModel=function(){
  let m=this.model('Doc');
  return m;
}

DocSchema.methods.getSchema=function(){
  return this.schema;
}

let Doc=mongoose.model('Doa',DocSchema);



let doc=new Doc({title:'test99',body:'b99'});
doc.save().then(e=>console.log(e));
// console.log(doc.getModel()===Doc)
// console.log(doc.getSchema()===DocSchema)
// console.log(doc.schema===DocSchema)
// console.log(doc.model('Doc')===Doc)

// console.log(doc.model('Doc')===DocSchema)
// doc.say();
// let i=3;
// while(i<10){
//   let doc=new Doc({title:'Title'+i,body:'Body'+i,date:new Date()});
//   // doc.say();
//   doc.save();
//   i++;
// }

// doc.save();
// console.log(doc);

Doc.find().then(e=>{
  console.log(e);
  // process.exit();
});
// Doc.updateOne({_id:'5b82991683d49602a8ad8020'}, {$set:{title:'TEST',body:'TEST',no:1}})
// .then(e=>{
//   console.log(e)

//   Doc.find().then(res=>{
//     res.forEach(e=>console.log(JSON.stringify(e)));
//     process.exit();
//   });


// }).catch(e=>console.log(e))


// doc.insertOne();


// doc.find().then(e=>console.log(e));

// console.log(p)

// p.pre('save', function(next){
// 	let y=this.get('name');
// 	let x=notify(y);
// 	console.log(x,y);
// 	// next();
// 	console.log()
// })







// let options = {
// 	useNewUrlParser:true,
// 	// autoIndex: false,
// };

// let p;

// p = mongoose.connect('mongodb://0.0.0.0:27017/test', options);
// // Connection 实例为

// p.then(function(m, a){
// 	m.connection;// NativeConnection
// 	console.log(m==mongoose, a);

// 	console.log(mongoose.connection);
// 	// console.log(this===process);
// });

// // db.close();

