//  tr的td个数

// 


class ParseTable {
	constructor(table) {
		this.table=table;
		return ;
	}

	tdLength(){
		let length=0;
		$('tr', this.table).each((_,tr)=>{
			length=Math.max(length, $('td',tr).length);
		});
		return length;
	}
}




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




$('<button>').on('click', new CycleArray(['SOURCE','TARGET','other']), (e)=>{
	$(e.target).text(e.data.next());
}).appendTo('body').text('-select-')