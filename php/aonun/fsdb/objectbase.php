<?php
namespace aonun\fsdb;

// 基本类
class ObjectBase {
	protected $obj;
	protected $opt;
	public function __construct(){
		$this->obj=new \stdClass();
		$this->opt=new \stdClass();
	}
	public function __set($k,$v) {
		return $this->obj->{$k} = $v;
	}
	public function __get($k) {
		return is_string($k)&&strlen($k) ? @$this->obj->{$k} : null;
	}

	// opt(k)		读取。k默认为name。
	// opt(k,v)		设置。v===null时，内部调用unset。
	public function opt(){
		$args=func_get_args();
		$k=isset($args[0]) ? $args[0] : 'name';
		if(func_num_args()>1){
			$v=$args[1];
			if(is_null($v)) {
				unset($this->opt->{$k});
			} else {
				$this->opt->{$k} = $v;
			}
			return $v;

		}
		return (is_string($k)&&strlen($k)) ? @$this->opt->{$k} : null;
	}
	public function option(){
		return call_user_func_array(array($this,'opt'), func_get_args());
	}
}


// $o=new ObjectBase('demo');
// $o->option('name','NNNNN');
// var_dump($o->opt('opt','opt.opt'));
// var_dump($o);

// $o->name='propertyName';
// $o->opt('nam','manager');
// var_dump($o->mg);
// var_dump($o);

