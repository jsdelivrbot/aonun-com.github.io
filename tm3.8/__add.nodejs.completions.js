const SublimeTextCompletions=require('./SublimeTextCompletions.js');

var s=new SublimeTextCompletions();

// s.add('SublimeTextCompletions','SublimeTextCompletions');
// s.save();


function all(o){
	Object.getOwnPropertyNames(o).forEach(function(e){
		s.add(e,e);
	});
	if(o.prototype) {
		Object.getOwnPropertyNames(o.prototype).forEach(function(e){
			s.add(e,e);
		});
	}else if(o.__proto__) {
		Object.getOwnPropertyNames(o.__proto__).forEach(function(e){
			s.add(e,e);
		});
	}
	s.save();
}


s.add('stopPropagation\tevent','stopPropagation')
s.save()