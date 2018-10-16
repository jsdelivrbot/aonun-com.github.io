<?php
namespace aonun;

class util {
	static public function datetime(){
		return date('Ymd-his-').substr(microtime(),2,8);
	}
}

