<?php
namespace fsdb;
require_once 'Base.php';
require_once 'Collection.php';
// 创建文件
class Database extends Base {
	static public $path = './db/';
	public function __construct($name='test') {
		parent::__construct($name);
		$opt = $this->opt;
		$opt->name = $name;
		$pdo = $opt->pdo = new \PDO('sqlite:'.self::$path.'/'.$name);
		$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, true);
		$pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE,\PDO::FETCH_OBJ);
	}
	public function getCollection($name='test',$primary=true,$pdo=null){
		if(is_null($pdo)) $pdo=$this->opt->pdo;
		$collection = new Collection($name,$primary,$pdo);
		return $collection;
	}
	public function __get($name){
		return $this->getCollection($name);
	}
	public function getName(){
		return $this->opt->name;
	}
	public function getPath(){
		return $this->path.$this->opt->name;
	}
	public function getPDO(){
		return $this->opt->pdo;
	}
	public function tables(){
		return $this->getCollectionByNames();
	}
	function getCollectionByNames() {
		$getCollectionName=function ($obj){
			return $obj->name;
		};
		
		$h=$this->opt->pdo->prepare('SELECT "name" FROM "sqlite_master" WHERE type=\'table\'');// type,name,tbl_name,rootpage,sql
		$h->execute();
		if($h) $v=$h->fetchAll();
		return is_array($v) ? array_map($getCollectionName, $v) : null;
	}

	function removeCollection($name) {
		$this->opt->pdo->exec('DROP TABLE IF EXISTS "'.Collection::quote($name).'"');
	}
}
