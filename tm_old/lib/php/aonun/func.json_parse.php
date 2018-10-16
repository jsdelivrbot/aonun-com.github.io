<?php

// 如果json格式错误，则保留原来的字符串格式。
function json_parse($v) {
	$json=json_decode($v,true);
	if($json===null && strlen($v)>0 && strtolower($v)!=='null') {
		$json=$v;
	}
	$v=$json;
	return $v;	
}
