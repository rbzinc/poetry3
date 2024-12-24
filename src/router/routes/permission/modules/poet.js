// 书阁页面
const poetMain = {
  path: '/poet/class/poetDetails',
  component: () => import('@/views/poet/details/poetDetails/index.vue')
}
const writerMain = {
  path: '/poet/writer/writerDetails',
  component: ()=> import ('@/views/poet/details/writerDetails/index.vue')
}
const main = [
  {
    path: '/poet/class',
    component: () => import('@/views/poet/index.vue'),
    children: [poetMain]
  },
  {
    path: '/poet/sentence',
    component: () => import('@/views/poet/children/sentence/index.vue'),
    children: [writerMain]
  },
  {
    path: '/poet/writer',
    component: () => import('@/views/poet/children/writer/index.vue'),
  }
]

const poet = {
  path: '/poet',
  redirect: '/poet/class',
  children: [...main]
}

export default poet
