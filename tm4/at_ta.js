function at(a){
	var t=$('<table />');
	a.forEach(function(e){
		var tr=$('<tr />').appendTo(t);
		e.forEach(function(v){
			var td=$('<td />').appendTo(tr).text(v);
		});
	});
	return t.get(0);
}
function ta(t){
	var a=[];
	$(t).find('tr').each(function(_,tr){
		var tr=a.push([]);
		$(tr).find('td').each(function(_,td){
			tr.push(td.innerText.trim());
		})
	})
	return a;
}

if(typeof ao==='undefined') var ao={};
ao.at=at;
ao.ta=ta;