// 该模块需要依恋关系 m 模块
define(['m'], (m)=>{
	return {
		parent:m,
		say(){
			console.warn('child module')
		}
	}
})