<?php
namespace aonun;
class JSON {

	// 如果json格式错误，则保留原来的字符串格式。
	static public function parse($v) {
		if(is_string($v)){
			$json=\json_decode($v,true);
			if($json===null && \strlen($v)>0 && \strtolower($v)!=='null') {
				$json=$v;
			}
			$v=$json;
		}
		return $v;	
	}

	// 仅在参数v不是String类型时则进行转换。
	static public function stringify($v) {
		return is_string($v) ? $v : json_encode($v);
	}
}

// $v= [0,63];
// $v='bbb';
$v=false;
// $ret = \json_decode($v,true);

// $ret=is_null($ret);
$ret=json::stringify($v);
var_dump($ret);


