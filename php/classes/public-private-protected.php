<?php

class T {
	static public $static='static.';
	public $public='public.';
	private $private='private.';
	protected $protected='protected.';
}


// $t=new T;
// echo $t->public;// public.
// echo $t->private;// Fatal error
// echo $t->protected;// Fatal error


/*
	继承public 和 protected。
*/
class ET extends T {
	function getVariables() {
		echo $this->public;// public.
		// echo $this->private;// Notice
		echo $this->protected;// protected.
	}

}

// $et=new ET;
// $et->getVariables();// public.protected.


/*
	改写不需要设置 override 关键字。
*/
class OET extends ET {
	protected $protected='override-protected.';
}
// $oet=new OET;
// $oet->getVariables();// public.override-protected.



/*
	访问静态变量
*/
// echo T::$static;// static.
// $className='T';
// echo $className::$static;// static.



/*
	访问父静态
*/
class PT {
	static public $public='PT-static-public.';
	protected $protected='PT-protected.';
}

class PCT extends PT {
	static public $public='PCT-static-public.';
	protected $protected='PCT-protected.';

	function test() {
		echo parent::$public;// 访问父的
		echo self::$public;// 访问自己的
		echo $this->protected;// 因父的被改写，只能访问自己的，无法访问父的。
	}
}

// $pct=new PCT();
// $pct->test();// PT-static-public.PCT-static-public.

