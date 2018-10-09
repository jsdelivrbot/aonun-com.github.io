<!DOCTYPE html><html><head><meta charset="UTF-8"><style>.file{color:#00F;}.dir{color:#090;}</style><title></title></head><body><?php
// http://doc/index.php/path/?demo=1/12345678
// $_SERVER['HTTP_HOST']='doc';
// $_SERVER['HTTP_CONNECTION']='keep-alive';
// $_SERVER['HTTP_ACCEPT']='text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
// $_SERVER['HTTP_USER_AGENT']='Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36';
// $_SERVER['HTTP_ACCEPT_ENCODING']='gzip, deflate, sdch';
// $_SERVER['HTTP_ACCEPT_LANGUAGE']='zh-CN,zh;q=0.8,en;q=0.6';
// $_SERVER['PATH']='D:\\program\\SQLite;D:\\web\\bin\\php;D:\\web\\bin\\apache\\bin;D:\\web\\bin\\mysql\\bin;D:\\program\\jsdb;C:\\Program Files (x86)\\Intel\\iCLS Client\\;C:\\Program Files\\Intel\\iCLS Client\\;C:\\windows\\system32;C:\\windows;C:\\windows\\System32\\Wbem;C:\\windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Program Files (x86)\\Intel\\OpenCL SDK\\2.0\\bin\\x86;C:\\Program Files (x86)\\Intel\\OpenCL SDK\\2.0\\bin\\x64;C:\\Program Files\\Intel\\Intel(R) Management Engine Components\\DAL;C:\\Program Files\\Intel\\Intel(R) Management Engine Components\\IPT;C:\\Program Files (x86)\\Intel\\Intel(R) Management Engine Components\\DAL;C:\\Program Files (x86)\\Intel\\Intel(R) Management Engine Components\\IPT;C:\\Users\\D\\AppData\\Roaming\\npm;';
// $_SERVER['SystemRoot']='C:\\windows';
// $_SERVER['COMSPEC']='C:\\windows\\system32\\cmd.exe';
// $_SERVER['PATHEXT']='.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC';
// $_SERVER['WINDIR']='C:\\windows';
// $_SERVER['SERVER_SIGNATURE']='';
// $_SERVER['SERVER_SOFTWARE']='Apache/2.4.9 (Win64)';
// $_SERVER['SERVER_NAME']='doc';
// $_SERVER['SERVER_ADDR']='127.0.0.1';
// $_SERVER['SERVER_PORT']='80';
// $_SERVER['REMOTE_ADDR']='127.0.0.1';
// $_SERVER['DOCUMENT_ROOT']='D:/web/public/doc';
// $_SERVER['REQUEST_SCHEME']='http';
// $_SERVER['CONTEXT_PREFIX']='';
// $_SERVER['CONTEXT_DOCUMENT_ROOT']='D:/web/public/doc';
// $_SERVER['SERVER_ADMIN']='shuibing01@msn.com';
// $_SERVER['SCRIPT_FILENAME']='D:/web/public/doc/index.php';
// $_SERVER['REMOTE_PORT']='61855';
// $_SERVER['GATEWAY_INTERFACE']='CGI/1.1';
// $_SERVER['SERVER_PROTOCOL']='HTTP/1.1';
// $_SERVER['REQUEST_METHOD']='GET';
// $_SERVER['QUERY_STRING']='demo=1/12345678';
// $_SERVER['REQUEST_URI']='/index.php/path/?demo=1/12345678';
// $_SERVER['SCRIPT_NAME']='/index.php';
// $_SERVER['PATH_INFO']='/path/';
// $_SERVER['PATH_TRANSLATED']='D:\\web\\public\\doc\\path\\';
// $_SERVER['PHP_SELF']='/index.php/path/';
// $_SERVER['REQUEST_TIME_FLOAT']=1442311257.8510001;
// $_SERVER['REQUEST_TIME']=1442311257;
// class String{
// 	protected $primitiveValue='';
// 	function __construct($obj=''){
// 		$this->primitiveValue=(string)$obj;
// 	}
// 	public function length(){
// 		return strlen($this->primitiveValue);
// 	}
// 	public function rpad($str,$len=1){
// 		return $this->primitiveValue=str_pad($this->primitiveValue,$len,$str,STR_PAD_RIGHT);
// 	}
// 	public function lpad($str,$len=1){
// 		return $this->primitiveValue=str_pad($this->primitiveValue,$len,$str,STR_PAD_LEFT);
// 	}
// 	public function pad($str,$len=1){
// 		return $this->primitiveValue=str_pad($this->primitiveValue,$len,$str,STR_PAD_BOTH);
// 	}
// 	public function valueOf(){
// 		return $this->primitiveValue;
// 	}
// }

// $s=new String('12345');
// $s->pad('_',6);
// var_dump($s);


// die;

// $request=array();
// // 遍历$_SERVER，收集并处理以HTTP_开头的键值。
// foreach ($_SERVER as $k=>$v){
// 	$k=strtolower($k);
// 	$b=preg_match('/^HTTP_(\w+)/i',$k,$r);
// 	if($b){
// 		$k=explode('_',$r[1]);
// 		$i=0;$len=count($k);
// 		while(++$i<$len){
// 			$k[$i]=strtoupper(substr($k[$i],0,1)).substr($k[$i],1);
// 		}
// 		$k=implode('',$k);
// 		$request['headers'][$k]=get_magic_quotes_gpc()?stripslashes($v):$v;
// 	}
// }
// unset($k,$v,$r,$i,$len);


// 处理URI
// if(isset($_SERVER['REQUEST_URI'])){
	// $request['uri']=urldecode($_SERVER['REQUEST_URI']);
// }

// 处理URI
// if(isset($_SERVER['PATH_INFO'])){
// 	$r=$_SERVER['PATH_INFO'];
// 	$r=explode('/',$r);
// 	foreach ($r as $v){
// 		if(!empty($v)) $request['pathInfo'][]=get_magic_quotes_gpc()?stripslashes($v):$v;
// 	}
// 	unset($r,$v);
// }
// $request['get']=&$_GET;
// $request['post']=&$_PSOT;
// $request['request']=&$_REQUEST;
// $request['cookie']=&$_COOKIE;
// $request['files']=&$_FILES;

// printf('<h3>%o</h3>',$_SERVER);
// // var_dump($request);
// exit;


$handle=opendir(__DIR__);
echo '<ul>';
while(false !== ($file=readdir($handle))){
	$file=iconv('GBK','UTF-8',$file);
	echo '<li><a href="'.$file.'" class="'.(is_dir($file)?'dir':'file').'">'.$file.'</a></li>';
}






echo '</ul>';
closedir($handle);
?></body></html>