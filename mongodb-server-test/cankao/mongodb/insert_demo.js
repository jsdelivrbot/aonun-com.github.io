﻿
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
var dbName = 'mydb';
var collectionName = 'customers';




// Insert Into Collection

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection(collectionName).insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});



// Insert Multiple Documents

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(dbName);
//   var myobj = [
//     { name: 'John', address: 'Highway 71'},
//     { name: 'Peter', address: 'Lowstreet 4'},
//     { name: 'Amy', address: 'Apple st 652'},
//     { name: 'Hannah', address: 'Mountain 21'},
//     { name: 'Michael', address: 'Valley 345'},
//     { name: 'Sandy', address: 'Ocean blvd 2'},
//     { name: 'Betty', address: 'Green Grass 1'},
//     { name: 'Richard', address: 'Sky st 331'},
//     { name: 'Susan', address: 'One way 98'},
//     { name: 'Vicky', address: 'Yellow Garden 2'},
//     { name: 'Ben', address: 'Park Lane 38'},
//     { name: 'William', address: 'Central st 954'},
//     { name: 'Chuck', address: 'Main Road 989'},
//     { name: 'Viola', address: 'Sideway 1633'}
//   ];
//   dbo.collection(collectionName).insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     db.close();
//   });
// });




// The _id Field

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  var myobj = [
    { _id: 154, name: 'Chocolate Heaven'},
    { _id: 155, name: 'Tasty Lemon'},
    { _id: 156, name: 'Vanilla Dream'}
  ];
  dbo.collection(collectionName).insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
  });
});