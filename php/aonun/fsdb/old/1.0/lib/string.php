<?php
namespace aonun;
class String {
	private $_data;
	public function __construct($v) {
		$this->_data = strval($v);
	}

	public function split($pattern=''){
		$ret=null;
		if($pattern==='')  $ret=preg_split('//', $this->_data, -1, PREG_SPLIT_NO_EMPTY);
		else  $ret=split($pattern, $this->_data);
		return $ret;
	}


	function replace(){}
	function indexOf(){}
	function lastIndexOf(){}
	function search(){}
	function charAt(){}
	function charCodeAt(){}
	function trim(){}
	function trimLeft(){}
	function trimRight(){}
	
	static public function from($v) {
		return new self($v);
	}


	public function __get($k){
		$ret=null;
		if($k==='length') $ret=strlen($this->_data);
		return $ret;
	}
}
