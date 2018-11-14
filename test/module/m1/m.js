export const name = 'jinxidong';
export const age = 19831014;
// 其它文件中导入时，需要名称一致。
// improt {name} from './m1/m.js'

export default name;
// 默认的好处
// 其它文件中导入时，可以自定义名称。
// import xxxx from './m1/m.js'
// xxxx 不可以是 {xxxx}

console.log('m1-m');