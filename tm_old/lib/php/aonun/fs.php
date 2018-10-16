<?php
namespace aonuncom;

class fs{
	static function nameFilter($name='TEST') {
		return preg_replace( '/["\s\\\'\/:*?$&\{\}<>\|\.]+/',  '_',  $name);
	}
	static function pathFilter($name='TEST') {
		return preg_replace( '/["\':*?$&\{\}<>\|\.]+/',  '',  $name);
	}
}

// $arr = preg_split('//','"\':*?$&\{\}<>\|\.', -1, PREG_SPLIT_NO_EMPTY);





