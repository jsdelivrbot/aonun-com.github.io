<?php
require_once 'func.filename_filter.php';

function pathinfo_parse(){
	if(is_null(@$_SERVER['PATH_INFO'])) {
		$db    = 'test';
		$table = 'test';
	}else{
		$pathinfo = array_slice(preg_split('/\//',@$_SERVER['PATH_INFO'],3),1);
		$db    = filename_filter(@$pathinfo[0]) or 'test';
		$table = filename_filter(@$pathinfo[1]) or 'test';
	}
	return array($db, $table, 'db'=>$db, 'table'=>$table);
}

