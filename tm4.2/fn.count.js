function count() {
    return ++count.current;
}
count.current=-1;


// console.log(count());// 0
// console.log(count());// 1
// console.log(count());// 2
// console.log(count());// 3
// console.log(count.current);// 3

