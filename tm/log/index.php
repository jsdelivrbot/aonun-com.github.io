<?php
// 根据serverName来判断phplib的位置。
if(preg_match('/(\w+\.)?aonun.com$/', $_SERVER['SERVER_NAME'])) {
	$libpath='/home/aonunfti/public_html/tm/lib/php/aonun/';
}else{
	$libpath='/web/lib/php/aonun/';
}

// 导入lib中的功能
require $libpath.'header.php';
require $libpath.'net.php';
require $libpath.'util.php';

// 页面访问返回text类型头
aonun\header::text();


$client=aonun\net::getClient();

if(isset($_POST['id'])) {
	$id=$_POST['id'];
}else{
	$id='';
}

// 写日志
$fh=fopen('access.log','a+');
$url=aonun\net::getURL();
$data=$client->ip .' '.aonun\util::datetime().' '.$id. ' '.$url. ' '.$client->agent .PHP_EOL;
$ret=fwrite($fh, $data);
fclose($fh);

echo $ret;
