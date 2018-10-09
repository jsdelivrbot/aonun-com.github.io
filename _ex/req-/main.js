require.config({
	// baseUrl:'/lib',	// 默认的根目录路
	paths:{
		jquery:'/lib/jquery.min',			// 自定义jquery的目录
		// jquery172:'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
		dropfile:'./lib/dropfile',			// 自定义jquery的目录
		localforage:'/lib/localforage'
	}
})

require(['jquery','dropfile'], ($,dropfile)=>{
	console.log($, dropfile)
})