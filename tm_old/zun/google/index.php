<?php
// header("Content-Type: text/html; charset=UTF-8");

// //第一种利用curl：
// function translate($text,$language='en|zh-cn'){
// 	if(empty($text))return false;
// 		@set_time_limit(0);
// 		$html = "";
// 		$url = "https://translate.google.com/translate_t?langpair=".urlencode($language)."&text=".urlencode($text);
// 		$ch=curl_init();
// 		curl_setopt($ch,CURLOPT_HEADER,0);
// 		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
// 		curl_setopt($ch,CURLOPT_URL,$url);
// 		curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);
// 		$html=curl_exec($ch);
// 		if(curl_errno($ch))$html = "";
// 		curl_close($ch);
// 		if(!empty($html)){
// 		$x=explode("</span></span></div></div>",$html);
// 		$x=explode("onmouseout=\"this.style.backgroundColor='#fff'\">",$x[0]);
// 		return $x[1];
// 	}else{
// 		return false;
// 	}
// }

// print translate('hello');
//---------------

//第二种：利用get方式   (要有语言对应的编码表才能实现。)
// function googleTran($text){
// if(empty($text)) return "";
// //反间碟
// $wf=@file_get_contents('http://translate.google.cn/translate_t?sl=ko&tl=zh-cn&text='.$text.'#');
// if (false===$wf||empty($wf)){
// return false;
// }

// //截取相关信息
// $return = "";

// $star="style.backgroundColor='\#fff'\">";

// $end="</span></span></div>";
// $p = "#{$star}(.*){$end}#iU";//i表示忽略大小写，U禁止贪婪匹配
// if(preg_match_all($p,$wf,$rs))
// { print_r($rs);
// return $rs[1][0];}

// }
// echo '<pre>';
// print googleTran('안녕');
//---------------

header("Content-Type: text/html; charset=utf-8");
function ajax_google_search($text, $language='auto|zh-cn')
{
	$url = "https://translate.google.com/translate_t?langpair=".urlencode($language)."&text=".urlencode($text);
	$ch=curl_init();
	curl_setopt($ch,CURLOPT_HEADER,0);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);
	$data=curl_exec($ch);
	preg_match_all("/charset=(\S*)\" http-equiv/", $data, $match);
	//print_r($match[1][0]);
	$html = iconv($match[1][0], 'utf-8', $data);
	curl_close($ch);
	if(!empty($html)){
		$x=explode("</span></span></div></div>",$html);
		$x=explode("onmouseout=\"this.style.backgroundColor='#fff'\">",$x[0]);
		$html = $x[1];
	}
	return $html;
}
if(!empty($_GET['q'])){
	$html=ajax_google_search($_GET['q']);
	print  $html;
}
