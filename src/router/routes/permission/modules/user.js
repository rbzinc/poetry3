const main = [
  {
    path:'/user/editUserInfo',
    component: () => import('@/views/user/editUserInfo/index.vue'),
  }
]

const user = {
  path:'/user',
  component: () => import('@/views/user/index.vue'),
  children:[...main]
}

export default user
