<?php
// namespace fsdb;

// class User {
// 	private $_object;
// 	public function __construct($name='test', $pdo=null){
//     if(is_null($pdo)) $pdo=new UserDatabase();
//     $this->_object=new \stdClass;
//     $obj=$this->_object;
//     $obj->name=$name;
//     $obj->pdo=$pdo;
//     $q='CREATE TABLE  IF NOT EXISTS "'.static::quote($obj->name).'" ("k"  REAL NOT NULL COLLATE BINARY, "v"  REAL NOT NULL DEFAULT "N;", PRIMARY KEY ("k"))';
//     // var_dump($q);
//     // var_dump($pdo);
//     $pdo->exec($q);
// 	}
//   public function __set($k,$v){
//     $obj=$this->_object;
//     $pdo=$obj->pdo;
//     $h=$pdo->prepare('replace into "'.static::quote($obj->name).'" values (?,?)');
//     $h->bindValue(1,$k,\PDO::PARAM_STR);
//     $h->bindValue(2,serialize($v));
//     $h->execute();
//     return $v;
//   }
//   public function __get($k){
//     // var_dump($k);
//     $obj=$this->_object;
//     $pdo=$obj->pdo;
//     // $q='SELECT rowid AS id, v FROM '.static::quote($obj->name).' WHERE k=?';
//     $q='SELECT v FROM "'.static::quote($obj->name).'" WHERE k=?';
//     // var_dump($q);
//     $h=$pdo->prepare($q);
//     $h->bindValue(1,$k,\PDO::PARAM_STR);
//     $r=$h->execute();
//     // var_dump($r);
//     $v=$h->fetch();
//     // var_dump($v);
//     return is_object($v) ? unserialize($v->v) : null;
//   }
//   public function __unset($name) {
// 			$obj=$this->_object;
// 			$pdo=$obj->pdo;
// 			$q = 'DELETE FROM "'.static::quote($obj->name).'" WHERE k=?';
// 			$h=$pdo->prepare($q);
// 			$h->bindValue(1,$name,\PDO::PARAM_STR);
// 			$h->execute();
// 			return $h->rowCount();
// 	}
//   public function getName(){
//     return $this->_object->name;
//   }
//   static public function quote($s) {
//     return str_replace('"', '""', $s);
//   }
//   // 感觉有点多余
//   public function check($key,$value){
//   	return $this->{$key}===$value;
//   }
//   // 发送账号激活邮件，30秒内无法申请。
//   public function activeApply(){
//   	require_once '../phpmailer/send.php';
// 		if((time()-$this->requestActiveTime)>30) {
// 			$mail = $this->getName();
// 			$code = mt_rand(1000,9999);
// 			$this->activeCode = $code;
// 			$this->requestActiveTime = time();
// 			$b = sendMail($mail, $mail, '奥黁用户激活邮件'.$code, '尊敬的用户，您好！'."\r\n".'您正在激活在aonun.com注册的账号'.$mail.'，激活码为：<b>'.$code.'</b>。(如非本人操作，请无视该邮件！)');
//       return $b ? $code : false;// 成功时反馈激活码，发生错误时返回false
// 		}
// 		return '未免频繁申请激活邮件，请耐心等待30秒。';// 离上一次申请时间不足30秒
// 	}

// 	// 激活账号时需要设置密码，理论上支持空密码和空昵称。
// 	public function active($activeCode, $password, $nickname){
// 		if($this->activeCode===$activeCode) {
// 			$this->password = $password;
// 			$this->nickname = $nickname;
// 			unset($this->activeCode);
// 			unset($this->requestActiveTime);
// 			return true;
// 		}
// 		return false;
// 	}

// }




/*
账号密码登录
注册
登录
添加术语记录
添加语料记录
下载语料列表
下载语料记录
下载术语记录
下载术语列表


user database

user

*/


// class User {

//   const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyz0123456789';
//   static createToken(){

//   }
// }


// echo uniqid();







class Rand {
	const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyz0123456789';
	static public function str($length = 32) {
		if(!is_int($length) || $length < 1) {
				$length=1;
		}
		$string = '';
		for($i = $length; $i > 0; $i--) {
				$string .= static::CHARS[mt_rand(0, 60)];
		}
		return $string;
	}

	// int(max)  int(max,min)
	static public function int() {
		$args=func_get_args();
		if(count($args)){
			$max=array_shift($args);
			$min=array_shift($args);
			if(is_null($min)) $min=0;
			$args=array($min,$max);
		}
		return call_user_func_array('mt_rand',$args);
	}
}


$a=[];
var_dump( Rand::int(), mt_rand(1,9,199));

