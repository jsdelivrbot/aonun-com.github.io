<?php
function textHeader(){
	header('content-type:text/plain;charset=utf8');
}

function acessAllow( $pattern='/^(http|https):\/\/\w+\.aonun.com$/g' ) {
	$host     = $_SERVER['HTTP_ORIGIN'];
	$b        = preg_match($pattern, $host);
	if($b) {
		header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
	}
	return $b;
}

