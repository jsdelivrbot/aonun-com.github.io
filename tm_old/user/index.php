<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="/lib/jquery-3.2.1.min.js"></script>
	<style type="text/css">
		table{
			border:1px dashed #eee;
			background:#fff;
			/*position:absolute;*/
			width:400px;
			height:60px;
			overflow-y:"auto";
			left:0;
			right:0;
			top:0;
			bottom:0;
			position:relative;
			display: block;
		}
		td{
			text-align: left;
			vertical-align: middle;
		}

	</style>
	<title>user</title>
</head>
<body>

<div id="userRegistUI">
<table>
<tr>
	<td>Password:</td>
	<td><input type="text" name="password"></td>
	<td><input type="button" name="active" value="ACTIVE"></td>
</tr>
<tr>
	<td>Nickname:</td>
	<td><input type="text" name="nickname"></td>
	<td><input type="button" name="active" value="ACTIVE"></td>
</tr>
</table>

<table>
	<tr><td>Code:</td><td><input type="text" name="code"></td><td><input type="button" name="active" value="ACTIVE"></td></tr>
</table>

<table>
<tr>
	<td>Mail:</td>
	<td><input type="text" name="mail" value="ddb@gamedex.co.kr"></td>
	<td><input id="registBtn" type="button" value="Regist"></td>
	<td><input id="checkMailBtn" type="button" value="Check"></td>
	<td><input id="getActiveCodeBtn" type="button" value="Get Active Code"></td>
</tr>
</table>

</div>





</body>
</html>
<script type="text/javascript">

$('#checkMailBtn').on('click',function(){
	$.post('ajax.php', {action:'regist',mail:$('input[name=mail]').val()},function(data){
		console.log(data);
		if(data==='Can not be used, because the mailbox has been occupied.') $(this).css('background','#C6EFCE');
		else $(this).css('background','#FFC7CE')
	})
});
$('input[name=mail]').parent().next().find('input[type=button]').one('click',function(){
	$.post('ajax.php', {action:'regist',mail:$('input[name=mail]').val()},function(data){
		console.log(data);
	});
	$(this).on('click',function(){
		$.post('ajax.php', {action:'getActiveCode',mail:$('input[name=mail]').val()},function(data){
			console.log(data);
		});
	});
})
</script>