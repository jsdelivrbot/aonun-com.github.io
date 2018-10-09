function highlight(str,re,rule){
	let f, s=String(str), b;

	b=re instanceof RegExp;
	if(!b) re=new RegExp(re,'gi');

	switch(typeof rule) {
		case 'function':
			f=rule;
			break;
		case 'string':
			f=function(v){
				return v?'<'+rule+'>'+v+'</'+rule+'>':'';
			};
			break;
		default:
			f=false;
	}

	let r, rs='', pos=0,i,v,l;
	while(r=re.exec(s)){
		i=r.index, v=r[0], l=v.length;
		rs+=s.slice(pos,i);
		if(f) {
			rs+=f(v)||'';
		}
		pos=i+l;
	}
	rs+=s.slice(pos);
	return rs;
}

// console.log(highlight('1231012313',101,'hi'))
// let re=/[-+]?\d+(,\d{3})*(\.\d+)?(e[-+]?\d+)*/g     数值正则