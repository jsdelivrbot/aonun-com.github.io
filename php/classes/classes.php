<?php
class T {
	static public function getInstance() {
		return new static;// object(T)#1 (0) {}
	}

	static public function getClass(){
		return get_class(self::getInstance());// string(1) "T"
	}

	static public function getClassName() {
		return __CLASS__;// string(1) "T"
	}

	static public function getMethodName() {
		return __METHOD__;// string(16) "T::getMethodName"
	}

	function getMethod() {
		return __METHOD__;
	}
}

// var_dump(T::getInstance());
// var_dump(T::getMethodName());
// var_dump(T::getClassName());
// var_dump(T::getClass());

// $t=new T;
// var_dump($t->getMethod());
