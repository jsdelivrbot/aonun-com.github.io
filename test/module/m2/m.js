var a = 1;
let b = 2;
const c = 3;
export {a,b,c}

export const d = 4;
export function e() {return 5;}

function f(){
	return 6;
}
export {f}

export {
	a as A,
	b as B,
}

export default d;

export const g = 7;

export * from './p.js';
// 该文件无法访问 x,y,z。但index.js可以访问到。