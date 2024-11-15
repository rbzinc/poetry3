import instance from "@/api/index.js";

/**
 * 上传图像接口
 * @param file
 * @returns {*}
 */
export const userLuntanUpdateImagePostApi = (file) => instance({
  url:'/user/luntan/updateImage',
  method:'post',
  data: {
    file
  }
})

/**
 * 发布帖子接口
 * @param data 更改测试
 * @returns {*}
 */
export const userLuntanFabutieziPostApi = ({content,images,poemid,title,type,poemword}) => instance({
  url:'/user/luntan/fabutiezi',
  method:'post',
  data: {
    content,
    images,
    poemid,
    title,
    type,
    poemword
  }
})

/**
 * 获取帖子列表接口
 * @param pageNum
 * @param pageSize
 * @param type
 * @returns {*}
 */
export const userLuntanSelecttiezTypesGetApi = (pageNum,  pageSize, type) => instance({
  url:`/user/luntan/selecttiez`,
  method:'get',
  params: {
    pageNum,
    pageSize,
    type
  }
})

/**
 * 查询帖子详情接口
 * @param blogid
 * @returns {*}
 */
export const userLuntanSelectxiangxiGetApi = (blogid) => instance({
  url:'/user/luntan/selectxiangxi',
  method:'get',
  params: {
    blogid
  }
})

/**
 * 帖子点赞接口
 * @param blogid
 * @returns {*}
 */
export const  userLuntanDianzanGetApi = (blogid) => instance({
  url:'/user/luntan/dianzan',
  method:'get',
  params: {
    blogid
  }
})

/**
 * 获取前五个点赞用户接口
 * @param blogid
 * @returns {*}
 */
export const userLuntanDianzanrankGetApi = (blogid) => instance({
  url:'/user/luntan/dianzanrank',
  method:'get',
  params: {
    blogid
  }

})

/**
 * 好友关注，先判断用户有没有关注
 * @param followUserid
 * @returns {*}
 */
export const userLuntanIsguanzhuGetApi = (followUserid) => instance({
  url:'/user/luntan/isguanzhu',
  method:'get',
  params:{
    followUserid
  }
})

/**
 * 好友关注
 * @param followUserid
 * @param isFollow
 * @returns {*}
 */
export const userLuntanGuanzhuGetApi = (followUserid,isFollow) => instance({
  url:'/user/luntan/guanzhu',
  method:'get',
  params:{
    followUserid,
    isFollow
  }
})

/**
 * 查看别人的主页
 * @param followid
 * @returns {*}
 */
export const userLuntanSelectUserFollowid =(followid) => instance({
  url:`/user/luntan/select/user/${followid}`,
  method:'get'
})

/**
 * 查看一个人发布的全部笔记
 * @param pageNum
 * @param pageSize
 * @param followid
 * @returns {*}
 */
export const userLuntanSelectBlogFollowid = (pageNum,pageSize,followid ) => instance({
  url:`/user/luntan/select/blog/${followid}`,
  method:'get',
  params:{
    pageNum,
    pageSize
  }
})
