<?php
namespace aonun\fsdb;
require_once __DIR__.'/objectbase.php';
require_once __DIR__.'/collection.php';
require_once __DIR__.'/../fs.php';
// 创建文件
class Database extends ObjectBase {
	const PATH = 'db';
	const NAME = 'test';
	const FILE = 'db/test.db';
	static $cache = array();// pdo缓存。键：文件名，值：pdo。
	// $opt {pdo, name, path}

	public function __construct ($name='test',$path=null) {
		parent::__construct();
		$this->initPathName($path,$name);
		$this->flush();
		// var_dump($path);// *****
	}

	public function initPathName($path, $name){
		$this->setName($name);
		$this->setPath($path);
	}

	public function setPath($p) {
		$p = (is_string($p)&&strlen($p)>0) ? $p : self::PATH;
		$p=\aonun\fs::pathFilter($p);
		parent::opt('path',$p);
		return $p;
	}
	public function setName($n) {
		$n = is_string($n)&&strlen($n) ? $n : self::NAME;
		$n=\aonun\fs::nameFilter($n);
		parent::opt('name',$n);
		return $n;
	}
	public function getPath() {
		return parent::opt('path');
	}
	public function getName() {
		return parent::opt('name');
	}
	public function getFile(){
		$s=\aonun\fs::s();
		$p=parent::opt('path');
		$n=parent::opt('name');
		$f=$p.$s.$n.'.db';
		$f=preg_replace('/\\'.$s.'+/', $s, $f);
		return $f;
	}
	public function opt() {
		$num=func_num_args();
		$k=func_get_arg(0);
		if($num===1) {
			switch($k){
				case 'file':
					return $this->getFile();
					break;
				default:
					return parent::opt($k);
			}
		}else if($num>1){
			$k=func_get_arg(0);
			$v=func_get_arg(1);
			switch($k) {
				case 'name':
					$this->setName($k,$v);
					$this->flush();
					return $v;
					break;
				case 'path':
					$this->setPath($k,$v);
					$this->flush();
					return $v;
					break;
				default:
					return parent::opt($k,$v);
			}
		}
		return null;
	}

	public function flush() {
		// 若缓存没有被初始化，则重置为一个数组。
		if(!isset(self::$cache)||!is_array(self::$cache)) self::$cache=array();
		$f=$this->getFile();
		if(is_file($f) && isset(self::$cache[$f]) && is_resource(self::$cache[$f])) {
			// 调用缓存的pdo
			$pdo=self::$cache[$f];
		}else{
			// 先检查 path 是否存在
			$p=$this->getPath();
			if(!is_dir($p)) mkdir($p,0777,true);
			$pdo=new \PDO('sqlite:'.$f);
			// $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_SILENT);
			// $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
			$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
			$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, true);
			$pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE,\PDO::FETCH_OBJ);
			self::$cache[$f]=$pdo;
		}
		parent::opt('pdo',$pdo);
	}


	public function collection($name='test',$primary=true,$database=null) {
		if(is_null($database)) $database=$this;

		$name=\aonun\fs::nameFilter($name);
		$table = new Collection($name,$primary,$database);
		$this->{$name} = $table;
		return $table;
	}
	public function getTable($name='test',$primary=true,$database=null){
		return call_user_func_array(array($this,'collection'), func_get_args());
	}
	public function getCollection($name='test',$primary=true,$database=null) {
		return call_user_func_array(array($this,'collection'), func_get_args());
	}
	public function table($name='test',$primary=true,$database=null) {
		return call_user_func_array(array($this,'collection'), func_get_args());
	}

	public function __get($k){
		if(isset($this->obj->$k) && is_object($this->obj->$k)) {
			return $this->obj->$k;
		}else{
			return $this->obj->$k = $this->collection($k,false);
		}
	}
	public function __set($k,$v){
		if(!is_string($k) || strlen($k)===0) $k=self::NAME;
		$this->obj->$k = $v;
	}

	public function getPDO(){
		$pdo=parent::opt('pdo');
		if(is_null($pdo)) {
			// 用默认路径和名称建立数据库。
			parent::opt('name',self::NAME);
			parent::opt('path',self::PATH);
			$this->init();
			$pdo=parent::opt('pdo');
		}
		return $pdo;
	}

	// 获取所有表
	function all(){
		$getCollectionName=function ($obj){
			return $obj->name;
		};
		$pdo=$this->getPDO();
		
		$h=$pdo->prepare('SELECT "name" FROM "sqlite_master" WHERE type=\'table\'');// type,name,tbl_name,rootpage,sql
		$h->execute();
		if($h) $v=$h->fetchAll();
		return is_array($v) ? array_map($getCollectionName, $v) : null;
	}
	function tables(){
		return $this->all();
	}
	function collections(){
		return $this->all();
	}
	function getCollections() {
		return $this->all();
	}
	function getTables() {
		return $this->all();
	}

	// 删除数据库中的所有表
	public function remove() {
		$r=true;
		$s=$this->all();
		foreach ($s as $t) {
			$r = $r && $this->$t->remove();
		}
		$this->vacuum();
		return $r;
	}

	public function vacuum(){
		$pdo=$this->opt('pdo');
		return $pdo->exec('vacuum');
	}

	// 由于删除表，需要清除缓存obj中的连接，使其能新建Collection实例。
	public function __unset($k) {
		$b= $this->$k->remove();
		if($b) unset($this->obj->$k);
	}
}



// $db=new Database();
// $db->a;
// unset($db->a);
// $db->a->a=1;
// print_r($db->a->option());


// $db->remove();
// var_dump($db->all());


// $test=$db->test;
// $test->opt('u','ddb1494');
// $test->k=789123;
// $test->b=1;
// var_dump($db->getFile('file'));
// var_dump($test->k);

// $test2=$db->collection('test2',false);
// $test2->opt('u','ddb1249');
// unset($test2->c);
// $test2->a = 100;
// $test2->b = 4;
// $test2->b = 5;
// $test2->b = 6;
// $test2->c = 7;
// $test2->c = 8;
// $test2->c = 9;
// $test2->c = 333;
// $test2->{'고기'}='肉';

// print_r(json_encode($test2->like('t>1522597133977',true),JSON_PRETTY_PRINT));
// print_r(json_encode($test2->time(1522597134029),JSON_PRETTY_PRINT));
// print_r(json_encode($test2->all(true),JSON_PRETTY_PRINT));
// print_r(json_encode($test2->all(true),JSON_PRETTY_PRINT));

// require_once '../json.php';
// use \aonun as ao;
// var_dump(\aonun\JSON::stringify( $test2->all() ));

// $k='고기';


// echo floatval("1522589739213");