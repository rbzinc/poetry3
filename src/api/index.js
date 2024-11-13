import axios from 'axios'
import { useUserInfoStore } from '../stores/modules/user.js'
const userStore = useUserInfoStore()

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL:" http://fuze1.nat300.top", 
  headers: {
    'Content-Type': 'application/json',
    'token': userStore.userInfo?.token
},
  timeout:2000
})

//请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['token'] = userStore.userInfo?.token || '';
  return config;
}, function (error) {
  // 对请求错误做些什么
  alert(error);
  return Promise.reject(error);
})

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code ===1) {
      return res.data
    }
    alert("error")
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    if (err.response && err.response.status === 401) {
      console.log("Unauthorized: Please login again")
    }
    return Promise.reject(err)
  }
)
export default instance