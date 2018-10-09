<?php
namespace aonun;

class header{
	static public function text($charset='utf8'){
		return header('content-type:text/plain;charset='.$charset);
	}

	static public function html($charset='utf8'){
		return header('content-type:text/html;charset='.$charset);
	}

	static public function json($charset='utf8'){
		return header('content-type:application/json;charset='.$charset);
	}
}

