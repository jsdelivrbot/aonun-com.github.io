<?php
namespace aonun;
class Rand {
	
	const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyz0123456789';// 65-89,97-122,48-57
	// str()   str(64)
	static public function string($length = 32) {
		if(!is_int($length) || $length < 1) {
				$length=1;
		}
		$string = '';
		for($i = $length; $i > 0; $i--) {
				$string .= static::CHARS[mt_rand(0, 60)];
		}
		return $string;
	}

	// int() int(max)  int(max,min)
	static public function int() {
		$args=func_get_args();
		if(count($args)){
			$max=array_shift($args);
			$min=array_shift($args);
			if(is_null($min)) $min=0;
			$args=array($min,$max);
		}
		return call_user_func_array('mt_rand',$args);
	}
}
