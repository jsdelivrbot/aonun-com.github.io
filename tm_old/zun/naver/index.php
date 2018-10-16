<?php
//테스트 http://localhost:8888/demo/translate/naver/?q=%EB%AC%B4%EC%A0%81%EC%9D%98%20%EC%9A%A9%EC%82%AC
//테스트 http://zun.aonun.com/tm/naver/?q=%EB%AC%B4%EC%A0%81%EC%9D%98%20%EC%9A%A9%EC%82%AC
header("Content-Type: text/html; charset=UTF-8");
if(empty($_GET['q'])) exit();
require 'phpQuery.php';

$text = $_GET['q'];
//$text = '무적';
//$text = '무적의 용사가 싸움에서 이기다';
$url = 'http://cndic.naver.com/search/all?q='. urlencode($text) .'&direct=false';
$url2 = 'http://dict-channelgw.naver.com/cndic/zh/kozh/entry/[uid]/detail.dict';
// $html = file_get_contents($url);
// phpQuery::newDocumentHtml($html);
phpQuery::newDocumentFile($url);
// phpQuery::newDocumentFile('test.xml');
// echo pq("#container")->html();
$cont = pq("#container");

$rs = [];
$rs['keyword'] = $text;//검색어 

//번역결과
 $items = $cont->find(".trans_result .sc"); 
foreach ($items as $item) {
    $rs['trans_result'][] = pq($item)->text();
}


//단어 검색결과
$items2 = $cont->find('.word_result');
foreach ($items2 as  $item) {

	//$href = pq($item)->find('a.kr');
	// foreach ($href as $v) {
	// 	$rs['papago']['href'][] =pq($v)->attr('href');
	// }
	// for ($i=0, $leng=count($rs['papago']['href']); $i < $leng; $i++) { 
	// 	$rs['papago']['uid'][$i] = explode('=', $rs['papago']['href'][$i])[1];
	// 	$rs['papago']['url'][$i] = str_replace('[uid]', $rs['papago']['uid'][$i], $url2);
	// 	phpQuery::newDocumentFile($rs['papago']['url'][$i]);
	// 	$arr=json_decode(pq('')->html(),1)['data'];
	// 	$rs['papago']['json2'][$i]['entryName']= $arr['entryName'];
	// 	foreach ($arr['means'] as  $v) {
	// 		$rs['papago']['json2'][$i]['mean'][] = $v['mean'];
	// 		$rs['papago']['json2'][$i]['part'][] = $v['part'];
	// 		foreach($v['exams'] as $o){
	// 			$rs['papago']['json2'][$i]['exams'][] = $o['example'];
	// 			$rs['papago']['json2'][$i]['transl'][] = $o['translationList'][0]['mean'];
	// 		}
	// 	}
	// }
	// unset($rs['papago']['href']);
	// unset($rs['papago']['url']);


	$obj = pq($item)->find('a.kr');
	foreach ($obj as $sc) {
		$rs['word_result']['origin'][] = pq($sc)->text();
	}
	$obj = pq($item)->find('dd');
	foreach ($obj as $sc) {
		$rs['word_result']['trans'][] = trim(pq($sc)->text());
	}
}
if(!empty($rs['word_result']['origin'])){
	$rs['word_result']['unique'] = array_unique($rs['word_result']['origin']);//分词
}


//본문 검색결과
$items3 = $cont->find('.search_result dl');
foreach ($items3 as  $item) {
	$obj = pq($item)->find('a.sc');
	foreach ($obj as $sc) {
		$rs['search_result']['origin'][] = trim(pq($sc)->text());
	}
	$obj = pq($item)->find('dd');
	foreach ($obj as $sc) {
		$rs['search_result']['trans'][] = trim(pq($sc)->text());
	}
}

//예문 검색결과
$items4 = $cont->find('.term_result_list');
foreach ($items4 as  $item) {
	$obj = pq($item)->find('dt>span.sc');
	foreach ($obj as $sc) {
		$rs['term_result']['origin'][] = trim(pq($sc)->text());
	}
	$obj = pq($item)->find('dd');
	foreach ($obj as $sc) {
		$rs['term_result']['trans'][] = trim(pq($sc)->text());
	}
}



// echo '<textarea style="width:800px;height:500px;">';
// print_r($rs);
// echo '</textarea>';
echo json_encode($rs,JSON_UNESCAPED_UNICODE);

