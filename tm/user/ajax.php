<?php
error_reporting(E_ALL);
// var_dump($_POST);

if(isset($_POST['action']) && $_POST['action']=='checkmail') {
	if(empty($_POST['mail'])) exit();

	require_once('class.user.php');

	$u=new User('../db/user');

	if($u->find($_POST['mail'])) {
		echo json_encode(['code'=>1000, 'message'=>'Can not be used, because the mailbox has been occupied.']);
	}else{
		echo 'can use.';
	}
	exit();
}else if(isset($_POST['action']) && $_POST['action']=='getActiveCode'){
	if(empty($_POST['mail'])) exit();
	require_once('class.user.php');
	$u=new User('../db/user');
	if($u->sendActiveMail($_POST['mail'])) {
		echo 'Sent activation code.';
	}else{
		echo 'Unable to send activation code.';
	}
	exit();
}else if(isset($_POST['action']) && $_POST['action']=='regist'){
	if(empty($_POST['mail'])) exit();
	require_once('class.user.php');
	$u=new User('../db/user');
	if($u->find($_POST['mail'])) {
		echo 'Can not be used, because the mailbox has been occupied.';
	}else{
		if($u->regist($_POST['mail'])){
			echo '请打开邮件确认激活码';
		}else{
			echo '无法注册';
		}
	}

	exit();
}