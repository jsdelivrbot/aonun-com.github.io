 <?php
namespace fsdb;

// 基本类
class Base{
	public $obj;
	public $opt;
	public function __construct($name='test'){
		$this->obj=new \stdClass();
		$this->opt=new \stdClass();
		$this->opt->name=$name;
	}
	public function __set($name,$value) {
		return $this->obj->{$name} = $value;
	}
	public function __get($name) {
		return @$this->obj->{$name};
	}
	public function getName(){
		return $this->opt->name;
	}
}

