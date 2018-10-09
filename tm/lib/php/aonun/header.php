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

	static public function client(){
		$ret=apache_request_headers();
		$ret=array_flip($ret);
		$ret=array_map(function($e){
			return strtolower($e);
		}, $ret);
		$ret=array_flip($ret);
		return $ret;	
	}

	static public function server(){
		return apache_response_headers();
	}

	static public function allow( $pattern='/^(ws|wss|http|https)\:\/\/\w+\.aonun.com$/i' ) {
		// header('Access-Control-Allow-Origin: *');
		if(!empty($_SERVER['HTTP_REFERER'])) $host = $_SERVER['HTTP_REFERER'];
		else if(!empty($_SERVER['HTTP_ORIGIN'])) $host = $_SERVER['HTTP_ORIGIN'];
		else return false;
		$b = preg_match($pattern, $host);
		$s = 'Access-Control-Allow-Origin: '.$host;
		if($b) {
			header($s);
		}
		return $b;
	}
}

