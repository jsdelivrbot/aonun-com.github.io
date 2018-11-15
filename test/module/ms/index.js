// static import
import * as ms from './main.js';
import { CLASS } from './class.js';

console.log(ms.VAR);
console.log(ms.LET);
console.log(ms.CONST);
console.log(ms.FUNCTION());
console.log(new ms.CLASS().toString());
console.log(ms);

// export rename
import { _CONST } from './rename.js';
console.log('rename:', _CONST);

// import rename
import { _CONST as __CONST } from './rename.js';
console.log('rename:', __CONST);


import DEF from './default.js';
console.log(DEF);

import DEF2, { NOT_DEFAULT  } from './default.js';
console.log(DEF2, NOT_DEFAULT);

import * as all from './exportAll.js';
console.log(all);


// active import
import('./main.js').then(function(main){
	console.log(main);
}).catch(err=>console.error(err));
