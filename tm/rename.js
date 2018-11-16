const fs = require('fs');
const path = require('path');

let dir = 'E:/Downloads';


fs.readdirSync(dir).forEach(name=>{
	if(!/\.txt$/.test(name)) return ;
	let name2 = name.match(/^.+?\./);
	if(name2) {
		name2 = name2[0]+'txt';
	}
	
	name  = path.resolve(dir, name);
	name2 = path.resolve(dir, name2);
	
	fs.renameSync(name, name2);
});