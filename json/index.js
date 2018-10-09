const fs=require('fs');

require('./JSON.deepParse.js');


let json = fs.readFileSync('data.txt', 'utf8');

let obj = JSON.deepParse(json);
console.log(obj);


// json = JSON.stringify(obj);
// console.log(json);