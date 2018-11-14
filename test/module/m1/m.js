export const name = 'jinxidong';
export const age = 19831014;
// 可以是多个
// 从其它文件中导入时需要保持名称一致
// 例： improt {name,age} from './m1/m.js'

export default name;
// 一个文件中只能有一个
// 从其它文件中导入时可以自定义名称
// 名称不用花括号，如：xxxx 即不可以是 {xxxx}
// 例：import xxxx from './m1/m.js'

console.log('m1-m');