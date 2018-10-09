<?php
//테스트 http://localhost:8888/demo/translate/daum/?q=%EB%82%98%EB%AC%B4%EA%BE%BC%EC%9D%98%20%EC%88%B2
//테스트 http://zun.aonun.com/tm/daum/?q=%EB%82%98%EB%AC%B4%EA%BE%BC%EC%9D%98%20%EC%88%B2
header("Content-Type: text/html; charset=UTF-8");
if(empty($_GET['q'])) exit();
require 'phpQuery.php';

$text = $_GET['q'];
//$text = '무적';
//$text = '무적의 용사가 싸움에서 이기다';
$url = 'http://alldic.daum.net/search.do?q='. urlencode($text) .'&dic=ch';
// $html = file_get_contents($url);
// phpQuery::newDocumentHtml($html);
phpQuery::newDocumentFile($url);
// phpQuery::newDocumentFile('test.xml');
// echo pq("#container")->html();
$cont = pq("#mArticle");

$rs = [];
$rs['keyword'] = $text;//검색어


//단어/숙어 검색결과
$items1 = $cont->find('div[data-target=word] div');
foreach ($items1 as  $item) {
	$obj = pq($item)->find(' .kokc_type');
	foreach ($obj as $k => $sc) {
		// $rs['word_result'][$k][] = trim(pq($sc)->find('.txt_emph1')->text());
		// $rs['word_result'][$k][] = trim(pq($sc)->find('.sub_txt')->text());
		// $rs['word_result'][$k][] = preg_replace('/[\t ]/','',pq($sc)->find('.list_search')->text());

		$rs['word_result']['origin'][] = trim(pq($sc)->find('.txt_emph1')->text());
		$rs['word_result']['mean1'][] = trim(pq($sc)->find('.sub_txt')->text());
		$rs['word_result']['mean2'][] = preg_replace('/[\t ]/','',pq($sc)->find('.list_search')->text());
	}
}
if(!empty($rs['word_result']['origin'])){
	$rs['word_result']['unique'] = array_unique($rs['word_result']['origin']);//分词
}



//뜻 검색결과
$items2= $cont->find('div[data-target=mean] .search_box');
//echo $items2->html();
foreach ($items2 as  $k =>$item) {

	$obj = pq($item)->find('.txt_searchword');
	foreach ($obj as $k => $sc) {
		$rs['mean_result']['word'][] = trim(pq($sc)->text());
	}
	$obj = pq($item)->find('.txt_pronounce');
	foreach ($obj as $k => $sc) {
		$rs['mean_result']['pronounce'][] = trim(pq($sc)->text());
	}
	$obj = pq($item)->find('.list_search');
	foreach ($obj as $k => $sc) {
		$rs['mean_result']['mean'][] = preg_replace('/[\t ]/','',pq($sc)->text());
	}


	// $obj = pq($item)->find('.txt_searchword');
	// foreach ($obj as $k => $sc) {
	// 	$rs['mean_result'][$k][] = trim(pq($sc)->text());
	// }
	// $obj = pq($item)->find('.txt_pronounce');
	// foreach ($obj as $k => $sc) {
	// 	$rs['mean_result'][$k][] = trim(pq($sc)->text());
	// }
	// $obj = pq($item)->find('.list_search');
	// foreach ($obj as $k => $sc) {
	// 	$rs['mean_result'][$k][] = preg_replace('/[\t ]/','',pq($sc)->text());
	// }
}



// echo '<textarea style="width:800px;height:500px;">';
// print_r($rs);
// echo '</textarea>';
echo json_encode($rs,JSON_UNESCAPED_UNICODE);

