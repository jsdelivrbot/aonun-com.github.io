var term = [
["轻松","輕鬆"],
["恢复","恢復"],
["对准","對準"],
["复制","複製"],
["粘贴","貼上"],
["粘糊糊","黏糊糊"],
["关系","關係"],
["复仇","復仇"],
["骷髅","骷髏"],
["个人资料","個人資訊"],
["个人战","個人賽"],
["界面","介面"],
["雇用","僱用"],
["共享","分享"],
["几率","機率"],
["贵宾","VIP"],
["起点","出發地"],
["昵称","暱称"],
["图标","圖示"],
["等级","階段"],
["登录","登入"],
["链接","連結"],
["列表","清單"],
["论坛","粉絲團"],
["利卡","莉卡"],
["网络","網路"],
["每月限量礼包","每月限定礼包"],
["默认","預設"],
["反复","反復"],
["反复任务","購入任務"],
["发布","發佈"],
["服务器","伺服器"],
["比赛道具","初始道具"],
["社区","社團"],
["橡皮筋","橡膠橡膠"],
["设置","設定"],
["城市","都市"],
["世界频道","極限頻道"],
["修改","修复"],
["搜索","搜尋"],
["袭击","突擊"],
["信息","情報"],
["拽过来","拉過來"],
["邮件","信件"],
["邮箱","信箱"],
["咨询","詢問"],
["账号","帳號"],
["精选","精彩"],
["周","週"],
["创建","創建"],
["超级建造","草雞建造"],
["出售","販賣"],
["充值","儲值"],
["通过","透過"],
["投注","投註"],
["炮击","砲擊"],
["合并服务器","整合伺服器"],
["合服","整合伺服器"],
["验证","認證"],
["炮","砲"],
["夺取","掠奪"],
["国际标准","UTC"],
["脸书","Facebook"],
["亚特兰蒂斯","亞特蘭提斯"],
["制","製"],
// ["制作","製作"],
// ["制造","製造"],
// ["铁制","鐵製"],
// ["铜制","銅製"],
// ["皮制","皮製"],
["收获","收穫"],
["采集","採集"],
["心脏","心臟"],
["占领","佔領"],
["东印司","EIC"],
["挑战点数","擊殺點數"],
["布置","佈置"],
["剩余","剩餘"],
["卷轴","捲軸"],
["格洛里娅","格洛裏娅"],
]


function jian2(str) {
	var row, re=new RegExp
	for(var i in term) {
		row=term[i]
		re.compile(row[1],'g')
		str = str.replace(re,row[0])
	}
	return str
}

function fan2(str) {
	var row,re=new RegExp
	for(var i in term) {
		row=term[i]
		re.compile(row[0],'g')
		str = str.replace(re,row[1])
	}
	return str
}

