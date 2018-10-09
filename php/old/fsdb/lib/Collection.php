<?php
namespace fsdb;
// 创建表和数据
class Collection {
  public $obj=null;
  
  public function __construct($name='test',$primary=true, $pdo=null){
    if(is_null($pdo)) $pdo=new Database();
    $obj=$this->obj=new \stdClass;
    $obj->name=$name;
    $obj->pdo=$pdo;
    $q='CREATE TABLE  IF NOT EXISTS "'.static::quote($obj->name).'" (k REAL NOT NULL COLLATE BINARY '.($primary?'PRIMARY KEY':'').', v REAL NOT NULL DEFAULT "N;")';
    // var_dump($q);
    $pdo->exec($q);
  }
  public function __set($k,$v){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $h=$pdo->prepare('replace into "'.static::quote($obj->name).'" values (?,?)');
    $h->bindValue(1,$k,\PDO::PARAM_STR);
    $h->bindValue(2,serialize($v));
    $h->execute();
    return $v;
  }
  public function __get($k){
    // var_dump($k);
    $obj=$this->obj;
    $pdo=$obj->pdo;
    // $q='SELECT rowid AS id, v FROM '.static::quote($obj->name).' WHERE k=?';
    $q='SELECT v FROM "'.static::quote($obj->name).'" WHERE k=?';
    // var_dump($q);
    $h=$pdo->prepare($q);
    $h->bindValue(1,$k,\PDO::PARAM_STR);
    $r=$h->execute();
    // var_dump($r);
    $v=$h->fetch();
    // var_dump($v);
    return is_object($v) ? unserialize($v->v) : null;
  }
  public function __unset($name){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $q = 'DELETE FROM "'.static::quote($obj->name).'" WHERE k=?';
    $h=$pdo->prepare($q);
    $h->bindValue(1,$name,\PDO::PARAM_STR);
    $h->execute();
    return $h->rowCount();
  }
  public function getName(){
    return $this->obj->name;
  }
  public function valueOf(){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $q = 'SELECT * FROM "'.static::quote($obj->name).'"';
    $h=$pdo->prepare($q);
    $h->execute();
    $rs=[];
    while($r=$h->fetch()) {
      $r->v=unserialize($r->v);
      $o=new \stdClass();
      $rs[$r->k]=$r->v;
    }
    return $rs;
  }
  static public function quote($s) {
    return str_replace('"', '""', $s);
  }
}
