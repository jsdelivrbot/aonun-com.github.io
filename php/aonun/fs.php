<?php
namespace aonun;

class fs{
	static function nameFilter($name='test') {
		return preg_replace( '/[\/\'":;,`~!@%#=\*\?\+\-\^\$\&\|\{\}\<\>\[\]\(\) ]/', '_', $name);
	}
	static function pathFilter($name='test') {
		$arr =preg_split('/^([a-z]):/i',$name,2);
		if(isset($arr[1])){
			$name=substr($name,0,2).preg_replace( '/[\'":;,`~!@%#=\*\?\+\-\^\$\&\|\{\}\<\>\[\]\(\) ]/',  '_', $arr[1]);
			$name=preg_replace('/[\/]+/', self::s(), $name);
			return $name;
		}
		$name=preg_replace( '/[\'":;,`~!@%#=\*\?\+\-\^\$\&\|\{\}\<\>\[\]\(\) ]/',  '_', $name);
		$name=preg_replace('/[\/]+/', self::s(), $name);
		return $name;
	}

	static function win(){
		return (bool) preg_match('/^win/i',PHP_OS);
	}

	static function linux(){
		return (bool) preg_match('/^linux/i',PHP_OS);
	}

	static public function s(){
		return self::win() ? '\\' : '/';
	}
}

// $arr = preg_split('//','"\':*?$&\{\}<>\|\.', -1, PREG_SPLIT_NO_EMPTY);


// echo fs::pathFilter('a./*&^$\%[.js].f s');

// var_dump(fs::linux());


// 修复错误： windows 下路劲错误
// $name = 'X:/a/b/c/../d:b';
// var_dump(fs::pathFilter($name));
// $name = 'X/a/b/c/../d:b';
// var_dump(fs::pathFilter($name));
