import axios from 'axios'
import { useUserInfoStore } from '@/stores/index.js'
const userStore = useUserInfoStore()

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 确保这里的URL是正确的，没有多余的字符
  headers: {
    'Content-Type': 'application/json',
    token: userStore.userInfo?.token,
  },
  timeout: 50000,
})

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers['token'] = userStore.userInfo?.token || ''
    return config
  },
  function (error) {
    // 对请求错误做些什么
    console.error(error)
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      alert('请登录之后再进行操作')
    }
    console.error(err) // 将错误记录到控制台
    return Promise.reject(err)
  },
)

export default instance
