// 论坛页面
const main = [
  {
    path:'/forum/edit',
    component: () => import('@/views/talksquare/editTalk/index.vue')
  },
  {
    path:'forum/detail',
    component: () => import('@/views/talksquare/talksquareDetail/index.vue')
  }
]

const forum = {
  path: '/forum',
  component: () => import('@/views/talksquare/index.vue'),
  children:[...main]
}

export default forum
