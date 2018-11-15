import { a } from './m.js';
console.log(a);

import { B } from './m.js';
console.log(B);

import { c as _c } from './m.js';
console.log(_c);

// import d from './m.js';
// import {default as D} from './m.js';
// console.log(d, D);

import { f } from './m.js';
// f.prop = 66;
// f = 6;// TypeError: readonly

import d, {e,g} from './m.js';
console.log(d,e,g);

import * as all from './m.js';
console.log(all);
