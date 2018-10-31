{
	let re = new RegExp( '\\d+(a)', 'g');
	let r = '123a456a123'.replace(re, (...args)=>{
		console.log(JSON.stringify(args));
		

		return '*';
	});
	console.log(r);
}