var term = [
['放松','放鬆'],
['松散','鬆散'],
['突然死亡','驟死'],
["个人信息","個人資訊"],
["推送","推播"],
["验证","認證"],
["合并服务器","整合伺服器"],
["合服","整合伺服器"],
["皮制","皮製"],
["布置","佈置"],
["炮击","砲擊"],
["炮","砲"],
["投注","投註"],
["通过","透過"],
["夺取","掠奪"],
["充值","儲值"],
["出售","販賣"],
["超级建造","草雞建造"],
["铁制","鐵製"],
["采集","採集"],
["创建","創建"],
["周","週"],
["制造","製造"],
["制作","製作"],
["精选","精彩"],
["占领","佔領"],
["账号","帳號"],
["剩余","剩餘"],
["邮箱","信箱"],
["邮件","信件"],
["拽过来","拉過來"],
["心脏","心臟"],
["袭击","突擊"],
["收获","收穫"],
["搜索","搜尋"],
["修改","修复"],
["世界频道","極限頻道"],
["城市","都市"],
["设置","設定"],
["橡皮筋","橡膠橡膠"],
["社区","社團"],
["比赛道具","初始道具"],
["服务器","伺服器"],
["发布","發佈"],
["反复任务","購入任務"],
["反复","反復"],
["默认","預設"],
["每月限量礼包","每月限定礼包"],
["网络","網路"],
["论坛","粉絲團"],
["列表","清單"],
["链接","連結"],
["登录","登入"],
["铜制","銅製"],
["图标","圖示"],
["昵称","暱称"],
["起点","出發地"],
["贵宾","VIP"],
["几率","機率"],
["卷轴","捲軸"],
["国际标准","UTC"],
["共享","分享"],
["雇用","僱用"],
["界面","介面"],
["脸书","Facebook"],
["点赞","讚好"],
["关注","追蹤"],
["个人资料","個人資訊"],
["个人战","個人賽"],
["发布","發布"],
["复制","複製"],
["咨询","諮詢"],
["信息","資訊"],
["注销","註銷"],
["标准","標準"],
["回复","回复"],
["恢复","恢復"],
['准备','準備'],
['合并','合併'],
[ '￥1,175.62', '$199.99' ],
[ '￥1,763.52', '$299.99' ],
[ '￥2,351.42', '$399.99' ],
[ '￥1,763.52', '$299.99' ],
[ '￥293.86', '$49.99' ],
[ '￥117.54', '$19.99' ],
[ '￥587.72', '$99.99' ],
[ '￥176.32', '$29.99' ],
[ '￥58.77', '$9.99' ],
[ '￥5,880', '$999.99' ],
[ '￥52.89', '$8.99' ],
[ '￥17.64', '$2.99' ],
[ '￥2,940', '$499.99' ],
[ '￥5.88', '$0.99' ],
[ '￥29.3', '$4.99' ],
[ '￥588', '$89.99' ],
[ '￥12', '$1.99' ]
];


function jian2(str) {
	var row, re=new RegExp
	for(var i in term) {
		row=term[i]
		if(row && row[0] && row[1]){
			// row[1]='\\'+row[1].split('').join('\\');
			// row[0]=row[0].replace(/\$/.g,'\\$');
			re.compile(row[1],'g')
			str = str.replace(re,row[0])
			console.log(re)
		}
	}
	return str
}

function fan2(str) {
	var row,re=new RegExp
	for(var i in term) {
		row=term[i]
		if(row && row[0] && row[1]){
			// row[0]='\\'+row[0].split('').join('\\');
			// row[1]=row[1].replace(/\$/.g,'\\$');
			re.compile(row[0],'g')

			console.log(re)
			str = str.replace(re,row[1])
		}
	}
	return str
}

