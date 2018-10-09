<?php
namespace aonun\fsdb;
require_once __DIR__.'/objectbase.php';
require_once __DIR__.'/../fs.php';
require_once __DIR__.'/../util.php';
// 创建表和数据
class Collection extends ObjectBase {
	const NAME = 'test';
	static protected $id=0;
	// 初始化一个表，总是尝试创建。
	// 用 $this->opt() 函数设置了3个属性：{pdo,name,primary,id}。
	public function __construct($name='test',$primary=false, $database=null) {
		parent::__construct();
		$name=$this->setName($name);
		if(is_null($database)) $database=new Database();
		parent::opt('database',$database);
		$id=parent::opt('id', ++ self::$id);
		$pdo=parent::opt('pdo',$database->opt('pdo'));
		$q='CREATE TABLE  IF NOT EXISTS ['.$name.'] ([k] REAL NOT NULL COLLATE BINARY '.($primary?'PRIMARY KEY':'').', [v] REAL NOT NULL DEFAULT "N;", [u] REAL, [t] INTEGER)';
		$pdo->exec($q);
		parent::opt('primary', (boolean) $this->opt('primary'));// sqlite_master 表中查找是否是primary。
	}
	public function setName($n) {
		$n = is_string($n)&&strlen($n) ? $n : self::NAME;
		$n=\aonun\fs::nameFilter($n);
		parent::opt('name',$n);
		return $n;
	}
	// 内核使用了 serialize 序列化，没有采用 json_encode 。因为是PHP系统。
	public function __set($k,$v){
		$pdo=parent::opt('pdo');
		$h=$pdo->prepare('replace into ['.parent::opt('name').'] values (?,?,?,?)');
		$h->bindValue(1,$k,\PDO::PARAM_STR);
		$h->bindValue(2,serialize($v));
		$h->bindValue(3,parent::opt('u'));
		$h->bindValue(4,\aonun\util::now());
		$h->execute();
		return $v;
	}

	// 调用了__set 魔术函数
	public function set($k,$v){
		return $this->$k=$v;
	}

	// $this->a   获取a的最新值
	public function __get($k){
		$pdo=parent::opt('pdo');
		$like=' k='.$pdo->quote($k).' ORDER BY rowid ASC';
		return $this->like($like);
	}

	// get('a',2) 获取2个a的最新值
	// get('a') 获取10个a的最新值
	public function get($k,$log=true){
		$pdo=parent::opt('pdo');
		$like=' k='.$pdo->quote($k).' ORDER BY rowid ASC';
		return $this->like($like,$log);
	}

	// 执行sql语句，并返回内容。
	protected function q($q,$log=true){
		// if(parent::opt('primary')) $log=false;
		$b=false;
		$rs=new \stdClass;
		if(empty($q)) return $rs;
		$pdo=parent::opt('pdo');
		$h=$pdo->prepare($q);
		$h->execute();
		while($r=$h->fetch()) {
			$b=true;
			$k=$r->k; unset($r->k);
			$v=$r->v;
			if(is_string($v)&&strlen($v)) {
				$r->v=unserialize($v);
			}else{
				unset($r->v);
			}
			if(empty($r->u)) unset($r->u);
			if(empty($r->t)) unset($r->t);
			else $r->t=floatval($r->t);
			if(empty($r->i)) unset($r->i);
			else $r->i=floatval($r->i);

			if(!$log){
				$rs->$k=$r;
			}else{
				if(!isset($rs->$k) || !is_array($rs->{$k})) {
					$rs->$k=array();
				}
				array_push($rs->$k, $r);
			}
		}
		return $b? $rs: null;	
	}

	// 删除指定键值
	public function __unset($name){
		$pdo=parent::opt('pdo');
		$q = 'DELETE FROM ['.parent::opt('name').'] WHERE k=?';
		$h=$pdo->prepare($q);
		$h->bindValue(1,$name,\PDO::PARAM_STR);
		$h->execute();
		return $h->rowCount();
	}

	public function __toString() {
		return '1';
		
		return json_encode($this->all(false));
	}


	// all(true)   获取所有值
	// all(false)  获取最后一次更新的值
	public function all($log=true){
		$q = 'SELECT *,rowid as i FROM ['.parent::opt('name').']';
		if(!$log) $q.='GROUP BY k';
		return $this->q($q,$log);
	}

	public function time($t) {
		return $this->like('t>'.$t,true);
	}

	// 条件搜索结果
	public function like($like=null,$log=true) {
		$q = 'SELECT *,rowid as i FROM ['.parent::opt('name').']';
		if(is_string($like) && strlen(trim($like))) {
			$q.= ' WHERE '.$like;
		}
		return $this->q($q,$log);
	}

	// 就是 $this->opt() 函数的快捷方式
	public function getName(){
		return parent::opt('name');
	}

	function remove(){
		$pdo=parent::opt('pdo');
		$database=parent::opt('database');
		$q='DROP TABLE IF EXISTS ['.parent::opt('name').']';
		$r=$pdo->exec($q) !== false;
		return $r;
	}

	public function opt(){
		$num=func_num_args();
		$k=func_get_arg(0);
		$pdo=parent::opt('pdo');
		if($k==='primary') {
			if($num>1) {
				$private=$this->opt('private');
				parent::opt('private', $private);
				return $private;
			}else{
				$name=parent::opt('name');
				$q='SELECT sql FROM sqlite_master WHERE type=\'table\' AND name='.$pdo->quote($name);
				$h=$pdo->query($q);
				if(isset($h)&&isset($h->queryString)){
					$r=$h->fetch();
					if($r){
						$r=$r->sql;
						$r=preg_match('/PRIMARY KEY/i', $r);
						return (boolean) $r;
					}
					return false;
				}else{
					return $h;
				}
			}
		}
		return call_user_func_array(array('parent','opt'), func_get_args());
	}
}
