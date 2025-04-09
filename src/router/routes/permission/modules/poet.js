import * as ROUTES from '../../../../constants/router.js'

// 诗人模块路由
const main = [
  {
    path: ROUTES.POET_CLASS.replace(ROUTES.POET + '/', ''),
    name: 'PoetClass',
    component: () => import('@/views/poet/children/class/index.vue'),
  },
  {
    path: ROUTES.POET_SENTENCE.replace(ROUTES.POET + '/', ''),
    name: 'PoetSentence',
    component: () => import('@/views/poet/children/sentence/index.vue'),
  },
  {
    path: ROUTES.POET_WRITER.replace(ROUTES.POET + '/', ''),
    name: 'PoetWriter',
    component: () => import('@/views/poet/children/writer/index.vue'),
  },
  {
    path: ROUTES.POET_CLASS_DETAIL.replace(ROUTES.POET + '/', ''),
    name: 'PoetClassDetail',
    component: () => import('@/views/poet/details/poetDetails/index.vue'),
  },
  {
    path: ROUTES.POET_WRITER_DETAIL.replace(ROUTES.POET + '/', ''),
    name: 'PoetWriterDetail',
    component: () => import('@/views/poet/details/writerDetails/index.vue'),
  },
]

const poet = {
  path: ROUTES.POET,
  name: 'Poet',
  component: () => import('@/views/poet/index.vue'),
  redirect: ROUTES.POET_CLASS,
  children: [...main],
}

export default poet
