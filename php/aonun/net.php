<?php
namespace aonun;
require_once 'fs.php';
class net {
	static public function getClient(){
		$ret=new \stdClass();
		$ret->agent=Client::agent();
		$ret->ip=Client::ip();
		return $ret;
	}

	static public function getURL(){
		$url='';
		if(isset($_SERVER['HTTP_REFERER'])) {
			$url=$_SERVER['HTTP_REFERER'];
		}
		else if(isset($_SERVER['REQUEST_URI'])) {
			$url=$_SERVER['REQUEST_URI'];
		}
		return $url;
	}

	static public function pathinfo(){
		if(!isset($_SERVER['PATH_INFO'])) {
			$db    = 'test';
			$table = 'test';
		}else{
			$pathinfo = array_slice(preg_split('/\//',@$_SERVER['PATH_INFO'],3),1);
			$db    = fs::nameFilter(@$pathinfo[0]);
			$table = fs::nameFilter(@$pathinfo[1]);
			if(empty($table)) $table='test';
			if(empty($db))    $db='test';
		}
		return array($db, $table, 'db'=>$db, 'table'=>$table);
	}
}



class Client {
	static public function agent(){
		return isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
	}

	static public function ip() {
	    $ipaddress = '';
	    if (isset($_SERVER['HTTP_CLIENT_IP']))
	        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
	    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
	    else if(isset($_SERVER['HTTP_X_FORWARDED']))
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
	    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
	        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
	    else if(isset($_SERVER['HTTP_FORWARDED']))
	        $ipaddress = $_SERVER['HTTP_FORWARDED'];
	    else if(isset($_SERVER['REMOTE_ADDR']))
	        $ipaddress = $_SERVER['REMOTE_ADDR'];
	    else
	        $ipaddress = 'UNKNOWN';
	    return $ipaddress;
	}
}
