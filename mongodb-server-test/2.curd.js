require('./conn')((err,client)=>{

    // client ----> socket ???
    // client.db()   ----> database
    // db.insert(), db.find(), db.update()

    let db=client.db('db1');

    // console.log(client.db().databaseName);

    // console.log(db.databaseName);

    // db.collections((err,collections)=>{
    //   collections.forEach(e=>{
    //     console.log(e.s.name);
    //   });
    // });


    let c=db.collection('col1');// table col1


    // {
    //   // { _id } 冲突时将会报错
    //   let arr = [
    //     {_id:1, name:'ddb1'},
    //     {_id:1, name:'ddb2'},
    //     {_id:1, name:'ddb3'},
    //   ];

    //   c.insertMany(arr, (err,res)=>{
    //     console.log(err.name, err.code, err.result.ok);
    //   });
    // }

    // {
    //   let arr = [
    //    { name: 'ddb'},
    //    { name: 'ddm'},
    //    { name: 'dd'}
    //   ];
      
    //   c.insertMany(arr, (err,res)=>{
    //     console.log(err||res);
    //   });
    // }

    // {
    //   c.updateMany({name:'dd'}, {'$set':{time:Date.now()}}, (err,res)=>{
    //     // console.log(err||res);
    //     // { n: 0, nModified: 0, ok: 1 }
    //     // { n: 3, nModified: 1, ok: 1 }
    //     // { result: { n: 1, nModified: 1, ok: 1 }, modifiedCount, upsertedId, upsertedCount, matchedCount }
    //     console.log(res.result);
    //   });
    // }

    // {
    //   c.deleteMany({name:'dd'}, (err,res)=>{
    //     // {result: { n: 3, ok: 1 },}
    //     console.log(res.result);
    //   })
    // }


    // {
    //   c.createIndex({name:-1}, null, (err,res)=>{
    //     console.log(res);// name_-1
    //   });
    // }


    {
      // void db.createCollection('fr_CA',{collation:{locale:'fr_CA'}}, (err,c)=>{
      //   // console.log(c.s.namespace, c.s.dbName, c.s.name);

      //   // c.insertMany([
      //   //   {name:'côte', _id:1},
      //   //   {name:'coté', _id:2}
      //   // ],(err,r)=>{
      //   //   console.log(err||r.reulst);
      //   // });

      //   c.find({name:{$lt:'coté'}}).toArray((err,res)=>{
      //     console.log(res);
      //   });

      // });

      // let c=db.collection('fr_CA');

      // c.createIndex(
      //   { 'name' : 1 },
      //   { 'unique' : 1 },
      //   { 'collation' : { 'locale' : 'en_US' } }, function(err, result) {
      //     console.log(result);
      // });

      // c.find({}).sort({_id:-1}).limit(2).toArray((err,res)=>{
      //   console.log(res);
      // }); 

    }

    {

      // db.collections((err,s)=>{
      //   if(!err){
      //     s.forEach(c=>console.log(c.s.name));
      //   }
      // });
      //   c.findOneAndUpdate( {name:'ddb'}, { '$set':{verified:'c3'} }, (x,y)=>{
      //     console.log(y.value);
      //     c.find({}).toArray((x,s)=>console.log(s))
      //   });
      console.log(db)
      db.dropCollsection('col1',xy);
      let c=db.collection('col1');
      c.bulkWrite([
        {insertOne:{a:1}},
        {insertOne:{a:2}},
        {updateOne:{ filter:{a:2}, update:{$set:{a:44443}} } }
      ], {ordered:true, w:1}, (x,y)=>{
        console.log(y);
      })
      c.find({}).toArray(xy)

    }

    // {
    //   // select table 
    //   c.find().toArray((err,res)=>{
    //       console.log(err||res);
    //   });
    // }

    // {
    //   c.find({name:'dd'}).toArray((err,rows)=>{
    //     console.log(err||rows);
    //   });
    // }

    client.close();
});

/*
All the flowers are gone away
he has gone away again
Carrantuohill and cliffs of Moher
And last night he came to me
I'll sing with my love Gaelic
Playing Bodhran with the harp
And it flows from cliff to sea
Reflect back and sigh and sigh
Waves shining like a star
Dancing with silver coats
Waves shining like a star
Dancing with gold bells shoes
Waves shining like a star
But he has gone away again

*/

function xy(x,y){
  console.table(x||y||y.result);
}