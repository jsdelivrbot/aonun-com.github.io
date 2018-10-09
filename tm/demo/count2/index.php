<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<script type="text/javascript" src="/lib/jquery.min.js"></script>
	<script type="text/javascript" src="/lib/jquery-ui.min.js"></script>
	<title>count</title>
</head>
<body>
Source:<br>
<textarea id="source" cols="60" rows="10"></textarea><br>
Search:<br>
<input type="text" id="search"><br>
Result:<br>
<pre id="result"></pre>
</body>
</html>
<script type="text/javascript">
$(function(){

function count(source, search){
	if(source.length===0 || search.length===0){
		return false;
	}
	var re=new RegExp(search,'g');
	var r=0;
	while(re.exec(source)){
		r++;
	}
	return r;
}

function run(){
	var _source = $('#source').val()
	var _search = $('#search').val()
	var _result = count(_source, _search)
	$('#result').text(_search + ':' + _result)
}

$('#source').on('paste input',run)
$('#search').on('paste input', run)
})
</script>