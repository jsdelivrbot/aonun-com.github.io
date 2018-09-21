Number.prototype.pad=function(len,x){
	x=(x||0).toString();
	var r=this.toString(),l=r.length,i=len-l;
	if(r<l) return this.toString();
	while(i-->0) r=x+r;
	return r;
}


console.log((10).pad(8,9));