<?php
header('content-type:application/json;charset=utf-8');

require_once './lib/func.json_parse.php';
require_once './lib/func.filename_filter.php';
require_once './lib/func.pathinfo_parse.php';
require_once './lib/Database.php';
require_once './lib/Collection.php';
require_once './lib/LogCollection.php';
require_once './lib/UserDatabase.php';
require_once './lib/User.php';
// 设置数据库文件目录

fsdb\Database::$path='./db/';


// 数据库操作所需提交
$pathinfo  = pathinfo_parse();
$dbname    = $pathinfo[0];// default dbname is 'test'
$tablename = $pathinfo[1];// default tablename is 'test'

function doRequest($req) {
	global $dbname, $tablename;

	$db    = new fsdb\Database($dbname);
	$table = $db->getCollection($tablename);
	if(empty($req)){
		$ret = $table->valueOf();
	}else{
		$ret = new stdClass();
		foreach($req as $key => $value) {
			if(strtolower($value)==='null'){
				unset($table->$key);
			}else if(strlen($value)>0){
				$table->{$key} = json_parse($value);
			}else{
				$ret->{$key} = $table->{$key};
			}
		}
	}
	return $ret;
}



$ret = doRequest(array_merge($_GET,$_POST));
echo count($ret) ? json_encode($ret) : 'null';

// var_dump($_REQUEST);
// var_dump($_SERVER['PATH_INFO']);
// var_dump($_COOKIE);


/*
index.php/dbname/tablename?id=1(setValue)&name=null(deleteValue)&sex(getValue)

设置变量
zun.aonun.com/fsdb/request.php/dbname/tablename?id=序列&name=名字

删除变量
zun.aonun.com/fsdb/request.php/dbname/tablename?id=null

获取变量
zun.aonun.com/fsdb/request.php/dbname/tablename?name

获取全部变量
zun.aonun.com/fsdb/request.php/dbname/tablename
*/