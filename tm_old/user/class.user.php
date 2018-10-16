<?php

class User {
	public $name = 'user';
	public $pdo = null;

	public function __construct($name=null){
		if(!empty($name)) $this->name = $name;
		$this->pdo = new PDO('sqlite:'.$this->name);
		$pdo = $this->pdo;
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->exec('CREATE TABLE IF NOT EXISTS "main"."u" ("mail"  TEXT NOT NULL, "password" TEXT, "nickname" TEXT, "activated" INTEGER NOT NULL DEFAULT 0, "code" TEXT,  PRIMARY KEY ("mail") ) ; ');
	}

	public function find($mail){
		if(empty($mail)) return null;

		$h = $this->pdo->prepare('select * from u where mail=? limit 1');
		$h->bindValue(1, $mail);
		$h->execute();
		return $h->fetch();
	}

	public function regist($mail) {
		$pdo=$this->pdo;


		// 查询mail是否存在
		$user=$this->find($mail);
		if($user){
			// var_dump('邮箱账号已存在');
			return false;
		}else{
			$h=$pdo->prepare('insert into u (mail) values (?)');
			$h->bindParam(1,$mail);
			$r= $h->execute();
			$this->sendActiveMail($mail);
			return $r;
		}
	}
	public function sendActiveMail($mail) {
		// 检查activated状态为0时发送邮件
		$user=$this->find($mail);
		if($user && $user['activated']==0) {
			require_once('phpmailer/send.php');
			$code = mt_rand(1000,9999);
			$h=$this->pdo->prepare('update u set code=? where mail=?');
			$h->bindParam(1,$code);
			$h->bindParam(2,$mail);
			$h->execute();
			return sendMail($mail, $mail, 'Active Mail - Code:'.$code, 'Welcome! Your activation code is '.$code.'.');
		}else{
			return false;
		}
	}

	public function active($mail,$code) {
		$user=$this->find($mail);
		if($user) {
			if($user['activated']==1) return true;
			if($user['code']==$code) {
				$this->pdo->exec('update u set code=null,activated=1,password='.$code);
				return true;
			}
		}
		return false;
	}

	public function change($key,$value,$mail,$password) {
		$user=$this->find($mail);
		if($user && ($user['password']==$password)) {
			$h=$this->pdo->prepare('update u set '.$key.'=?');
			$h->bindValue(1, $value);
			return $h->execute();
		}
		return false;
	}

	public function login($mail,$password) {
		$user=$this->find($mail);
		if($user) {
			if($user['activated']){
				return $user['password']==$password;//密码核对
			}else{
				return 0;// 未激活
			}
		}else{
			return null;//无用户
		}
	}

}





// $u=new User('../db/user');
// $r = $u->login("ddb@gamedex.co.kr","kkkk1");

// $r = $u->change('nickname','ddb','ddb@gamedex.co.kr','kkkk');
// // $r = $u->find('ddb@gmail.com');

// $r = $u->add('ddb1@gmail.com','34','ddb1');
// $r = $u->cnicnamechangeNickname()
// var_dump($r);

/*
用户输入邮箱地址，可激活后
输入昵称、密码
注册成功。

登录（邮箱+密码）

修改密码（邮箱+密码）

操作（邮箱+密码）


添加项目,删除项目。
*/