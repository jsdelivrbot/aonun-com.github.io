<?php
namespace fsdb;

// 创建日志式表和数据
class LogCollection {
  public function __construct($name='testLogCollection', $pdo=null){
    if(is_null($pdo)) $pdo=new Database();
    $obj=$this->obj=new \stdClass;
    $obj->name=static::quote($name);
    $obj->pdo=$pdo;
    $q='CREATE TABLE  IF NOT EXISTS "'.$obj->name.'" ("id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "type"  TEXT NOT NULL, "data"  TEXT NOT NULL DEFAULT \'N;\', "mail"  TEXT NOT NULL, "time"  INTEGER NOT NULL)';
    // var_dump($q);
    $pdo->exec($q);

  }

  public function add($type,$data,$mail){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $time=floor(microtime(true)*1000);
    // var_dump($time);
    $h=$pdo->prepare('INSERT INTO "'.$obj->name.'" (type,data,mail,time) values (?,?,?,?)');
    $h->bindValue(1,$type);
    $h->bindValue(2,serialize($data));
    $h->bindValue(3,$mail,\PDO::PARAM_STR);
    $h->bindValue(4,$time);
    $h->execute();
    return $h->rowCount();
  }
  public function id($id){
    // var_dump($k);
    $obj=$this->obj;
    $pdo=$obj->pdo;
    // $q='SELECT rowid AS id, v FROM '.$obj->name.' WHERE k=?';
    $q='SELECT * FROM "'.$obj->name.'" WHERE id=?';
    // var_dump($q);
    $h=$pdo->prepare($q);
    $h->bindValue(1,$id,\PDO::PARAM_INT);
    $r=$h->execute();
    // var_dump($r);
    $v=$h->fetch();
    // var_dump($v);
    if(is_object($v)) {
      $v->data=unserialize($v->data);
      return $v;
    }
    return null;
  }
  public function last($begin=0,$length=1){
    var_dump($begin,$length);
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $q='SELECT * FROM "'.$obj->name.'" ORDER BY "id" DESC LIMIT ?,?';
    // var_dump($q);
    $h=$pdo->prepare($q);
    $h->bindValue(1,intval($begin),\PDO::PARAM_INT);
    $h->bindValue(2,intval($length),\PDO::PARAM_INT);
    $r=$h->execute();
    $v=$h->fetch();
    $rs=[];
    while($v=$h->fetch()){
      if(is_object($v)) {
        $v->data=unserialize($v->data);
        // $v->time=floatval($v->time);
        array_push($rs,$v);
      }
    }
    return array_reverse($rs);
  }
  public function first($begin=0,$length=1){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $q='SELECT * FROM "'.$obj->name.'" ORDER BY "id" ASC LIMIT ?,?';
    // var_dump($q);
    $h=$pdo->prepare($q);
    $h->bindValue(1,intval($begin),\PDO::PARAM_INT);
    $h->bindValue(2,intval($length),\PDO::PARAM_INT);
    $r=$h->execute();
    $rs=[];
    while($v=$h->fetch()){
      if(is_object($v)) {
        $v->data=unserialize($v->data);
        // $v->time=floatval($v->time);
        array_push($rs,$v);
      }
    }
    return $rs;
  }
  public function slice($start=0,$end=null) {
    $obj=$this->obj;
    $pdo=$obj->pdo;
    // $q='SELECT rowid AS id, v FROM '.$obj->name.' WHERE k=?';
    $q='SELECT * FROM "'.$obj->name.'" WHERE id>?';
    if($end) $q.=' AND id<=?';
    $h=$pdo->prepare($q);
    $h->bindValue(1, $start, \PDO::PARAM_INT);
    if($end) $h->bindValue(2, max($end-$start+1,0), \PDO::PARAM_INT);
    $r=$h->execute();
    $rs=[];
    while($v=$h->fetch()){
      if(is_object($v)) {
        $v->data=unserialize($v->data);
        // $v->time=floatval($v->time);
        array_push($rs,$v);
      }
    }
    return $rs;
  }
  public function getName(){
    return $this->obj->name;
  }
  public function count(){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $h=$pdo->query('SELECT count(id) AS c FROM "'.$obj->name.'"');
    return $h ? intval($h->fetch()->c) : $h;
  }
  public function init(){
    $obj=$this->obj;
    $pdo=$obj->pdo;
    $name=$obj->name;
    $pdo->exec('DROP TABLE IF EXISTS "'.$name.'";');
    $pdo->exec('CREATE TABLE  IF NOT EXISTS "'.$name.'" ("id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "type"  TEXT NOT NULL, "data"  TEXT NOT NULL DEFAULT \'N;\', "mail"  TEXT NOT NULL, "time"  INTEGER NOT NULL);');
  }
  static public function quote($s) {
    return str_replace('"', '""', $s);
  }
}
