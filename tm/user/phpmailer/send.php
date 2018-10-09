<?php
include_once('class.phpmailer.php'); //下载的文件必须放在该文件所在目录

// echo sendMail('ddb@gamedex.co.kr','用户A','注册咨询','你好，<b>用户A</b>。'."\r\n".'很高兴您的加入！');

function sendMail($address='',$name='',$title='[AoNun]',$content="Hello\r\n",$alt=''){
	// global $isMail;
	// if(empty($isMail)){
	// 	$isMail=true;
	// 	include_once('class.phpmailer.php'); //下载的文件必须放在该文件所在目录
	// }
	$mail = new PHPMailer(); //建立邮件发送类
	$mail->IsSMTP(); // 使用SMTP方式发送
	$mail->Host = 'smtp.aonun.com'; // 您的企业邮局域名
	// $mail->Port=598; //SMTP 端口
	$mail->Port=25; //SMTP 端口
	$mail->SMTPAuth = true; // 启用SMTP验证功能
	$mail->Username = 'ai@aonun.com'; // 邮局用户名(请填写完整的email地址)
	$mail->Password = 'n@MiUTE3'; // 邮局密码
	$mail->From = 'ai@aonun.com'; //邮件发送者email地址
	// $mail->FromName = 'AI';
	// $mail->SMTPSecure = 'tls';
	$mail->ContentType = 'text/html';
	$mail->CharSet = 'utf-8';

	$mail->AddAddress($address,$name);//收件人地址，可以替换成任何想要接收邮件的email信箱,格式是AddAddress('收件人email','收件人姓名')
	//$mail->AddReplyTo('', '');
	
	//$mail->AddAttachment('/var/tmp/file.tar.gz'); // 添加附件
	//$mail->IsHTML(true); // set email format to HTML //是否使用HTML格式
	
	$mail->Subject = $title;//'邮件标题 PHPMailer测试邮件'; //邮件标题
	$mail->Body = $content;//'邮件内容 Hello,这是测试邮件'; //邮件内容
	$mail->AltBody = '';//附加信息 This is the body in plain text for non-HTML mail clients'; //附加信息，可以省略
	
	if(!$mail->Send()) {
		file_put_contents('error.log', time().' - '.$mail->ErrorInfo."\n");
		return false;
	}else{
		return true;
	}
}



/*************************************************

附件：
phpmailer 中文使用说明（简易版）
A开头：
$AltBody--属性
出自：PHPMailer::$AltBody
文件：class.phpmailer.php
说明：该属性的设置是在邮件正文不支持HTML的备用显示
AddAddress--方法
出自：PHPMailer::AddAddress()，文件：class.phpmailer.php
说明：增加收件人。参数1为收件人邮箱，参数2为收件人称呼。例 AddAddress('eb163@eb163.com','eb163')，但参数2可选，AddAddress(eb163@eb163.com)也是可以的。
函数原型：public function AddAddress($address, $name = '') {}
AddAttachment--方法
出自：PHPMailer::AddAttachment()
文件：class.phpmailer.php。
说明：增加附件。
参数：路径，名称，编码，类型。其中，路径为必选，其他为可选
函数原型：
AddAttachment($path, $name = '', $encoding = 'base64', $type = 'application/octet-stream'){}
AddBCC--方法
出自：PHPMailer::AddBCC()
文件：class.phpmailer.php
说明：增加一个密送。抄送和密送的区别请看[SMTP发件中的密送和抄送的区别] 。
参数1为地址，参数2为名称。注意此方法只支持在win32下使用SMTP，不支持mail函数
函数原型：public function AddBCC($address, $name = ''){}
AddCC --方法
出自：PHPMailer::AddCC()
文件：class.phpmailer.php
说明：增加一个抄送。抄送和密送的区别请看[SMTP发件中的密送和抄送的区别] 。
参数1为地址，参数2为名称注意此方法只支持在win32下使用SMTP，不支持mail函数
函数原型：public function AddCC($address, $name = '') {}
AddCustomHeader--方法
出自：PHPMailer::AddCustomHeader()
文件：class.phpmailer.php
说明：增加一个自定义的E-mail头部。
参数为头部信息
函数原型：public function AddCustomHeader($custom_header){}
AddEmbeddedImage --方法
出自：PHPMailer::AddEmbeddedImage()
文件：class.phpmailer.php
说明：增加一个嵌入式图片
参数：路径,返回句柄[,名称,编码,类型]
函数原型：public function AddEmbeddedImage($path, $cid, $name = '', $encoding = 'base64', $type = 'application/octet-stream') {}
提示：AddEmbeddedImage(PICTURE_PATH. 'index_01.jpg ', 'img_01 ', 'index_01.jpg ');
在html中引用
AddReplyTo--方法
出自：PHPMailer:: AddRepl
*************************************************/


