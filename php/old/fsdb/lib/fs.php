<?php
namespace aonuncom;

class fs{
	static $namefilter
	static function nameFilter($name='TEST') {
		return preg_replace( '/["\s\\\'\/:*?$&\{\}<>\|\.]+/',  '_',  $name);
	}
	static function pathFilter($name='TEST') {
		return preg_replace( '/["\':*?$&\{\}<>\|\.]+/',  '',  $name);
	}
	static function pathFilter2($name='TEST') {
		$arr = array('');
		return preg_replace( '/["\':*?$&\{\}<>\|\.]+/',  '',  $name);
	}


}


$n=fs::pathFilter('asdkjf/////asdfklasjf/');
var_dump($n);

$arr = preg_split('//','"\':*?$&\{\}<>\|\.', -1, PREG_SPLIT_NO_EMPTY);





