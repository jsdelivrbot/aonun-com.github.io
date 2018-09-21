class CycleArray {
	constructor(arr){
		this.array=arr
	}

	set array(arr){
		this._array=arr
		this._index=0
		this._length=arr.length
	}
	get array(){
		this._array
	}
	get index() {
		return this._index;
	}
	set current(v) {
		let i=this._array.indexOf(v)
		if(i!==-1) {
			this._index=i
		}else{
			this._index=0
		}
	}
	get current() {
		return this._array[this._index]
	}
	next() {
		let i=this._index+1
		if(i===this._length) i=0

		this._index=i
		return this._array[this.index]
	}
}
/*
let a=['source','target','other']
let ca=new CycleArray(a)

[r]
a.index

[wr]
a.current = 'source'
a.array

a.next()
*/

let r=new Roll(a)

console.log(r.current)
console.log(r.next)
console.log(r.next)
console.log(r.next)
console.log(r.next)
console.log(r.next)
console.log(r.next)
console.log(r.next)
console.log(r.next)



