// 书阁页面
const main = [
  {
    path: '/poet/class',
    component: () => import('@/views/poet/index.vue'),
  },
  {
    path: '/poet/sentence',
    component: () => import('@/views/poet/children/sentence/index.vue'),
  },
  {
    path: '/poet/writer',
    component: () => import('@/views/poet/children/writer/index.vue'),
  }
]

const poet = {
  path: '/poet',
  redirect :'/poet/class',
  children:[...main]
}

export default poet
