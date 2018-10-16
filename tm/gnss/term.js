let _term=``;

_term=_term.trim().split('\n').map(e=>e.split('\t'));

if(typeof module==='object' && typeof module.exports==='object') {
	let term=global.term;
}

if(typeof term==='object') term=term.concat(_term);

