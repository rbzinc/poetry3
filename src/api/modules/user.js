import instance from '../index'
//用户登录
export const userLoginService = (username,password) => instance({
  url:'user/login', 
  method:'post',
  data:{
    username,
    password
  }
})
//用户注册
export const userRegisterService = ({username,password}) => {
  return instance.post('/user/register',{username,password})
}

//使用邮箱登录注册
export const userEmailService = (email,code) => instance({
  url:'/user/login/email', 
  method:'post',
  data:{
    email:email,
    code:code
  }
})

//发送验证码
export const getCodeService = (email) => {
  return instance.post('/user/login/code',
    { params:{ 
      phone:email
    }}
  )
}

//根据用户id获取用户信息
export const userGetMessage = (id) => {
  return instance.get(`/user/getmassagebyid/${id}`)
}
//用户修改自己的信息
export const userChangeMessage = ({params}) => {
  return instance.get('/user/updatemessagebyid',{params})
}
//用户收藏古诗
export const userCollectPoem = (data) => {
  return instance.post('/user/collect/addpem',
      {params:{
          poemid:data
        }})
}
//用户取消收藏古诗
export const userCancelPoem = ({params}) => {
  return instance.delete('/user/collect/deletepem',{params})
}
//查看用户收藏的古诗
export const lookUserCollect = ({params}) => {
  return instance.delete('/user/collect/{id}',{params})
}
//用户收藏名句
export const userCollectSentence = ({params}) => {
  return instance.post('/user/collect/addpem',{params})
}
//用户取消收藏名句
export const userCancelSentence = ({params}) => {
  return instance.delete('/user/collect/deletepem',{params})
}
//查看用户收藏的名句