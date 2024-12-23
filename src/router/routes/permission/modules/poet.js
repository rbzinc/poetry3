// 书阁页面
const main = [
  {
    path: '/poet/class',
    component: () => import('@/views/poet/poet.vue'),
  },
  {
    path: '/poet/sentence',
    component: () => import('@/views/poet/sentence/porSence.vue'),
  },
  {
    path: '/poet/writer',
    component: () => import('@/views/poet/writer/poeWriter.vue'),
  }
]

const poet = {
  path: '/poet',
  redirect :'/poet/class',
  children:[...main]
}

export default poet
