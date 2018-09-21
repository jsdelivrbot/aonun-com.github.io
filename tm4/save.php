<?php
$_POST['dictKey']='one';
$_POST['dictValue']='[["수비","防守"]]';


if(empty($_POST['dictKey']) || empty($_POST['dictValue'])) {
	exit('{"message":"需要dict的key和value"}');
}

switch($_POST['dictKey']) {
	case 'chars':
	case 'one':
	case 'god':
	case 'potc':
	case 'gnss':
	case 'gunship':
	case 'warship':
		break;
	default:
		exit('{"message":"词典键名错误"}');
}


try{
	file_put_contents('terms/'.$_POST['dictKey'].'.json', $_POST['dictValue']);
	exit('{"messaeg":"存档成功"}');
}catch(Exception $error){
	var_dump($error);
	// exit('{"message":"存档失败。"'.$error.''}');
}




