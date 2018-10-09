<?php
namespace aonun;

class util {
	static public function datetime(){
		return date('Ymd-his-').substr(microtime(),2,8);
	}
	static public function now(){
		$t=microtime();
		$t=substr($t,11).substr($t,2,3);
		return $t;
	}
}


