// 模拟请求接口假数据
import poetrydata from './poetrydata'
// import dynasty from './dynasty'
// import libai from './libai'


// 商品列表 (搜索)
function apiPoetry({page,limit,keyword}){
	return new Promise((resolute, reject)=>{
			let data = {
					list:[],//数据列表
					totalCount:0,//总数量
					totalPage:0,//总页数
					hasNext:false
				}
				
				// 符合关键字的记录
				let keywordList = []
				if (!keyword || keyword == "全部") {
					// 搜索全部数据
					keywordList = poetrydata
				} else {
					// 关键字搜索
					if (keyword == "李白") keyword="李" //为这个关键词展示多条数据
					for(let i = 0; i < goods.length; i++) {
						let good = poetrydata[i]
						if (good.goodName.indexOf(keyword) !== -1) {
							keywordList.push(good)
						}
					}
				}
				
				// 分页
				for (let i = (page - 1) * limit;i < page * limit; i++) {
					if (i > keywordList.length) break
					data.list.push(keywordList[i])
				}
				
				// 汇总数据
				data.totalCount = keywordList.length //总数量
				// 总页数 = 总数量 / 每月条数
				data.totalPage = Math.ceil(data.totalCount/page) //总页数
				// 判断是否有下一页 
				data.hasNext = page < data.totalPage
				
				// 模拟接口请求成功
				resolute(data)
			}).catch(err=>{
				// 模拟接口请求成功
				reject(err)
			})
		
}
export default {
	apiPoetry
}
