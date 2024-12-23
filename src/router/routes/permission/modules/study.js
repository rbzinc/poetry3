// 学习页面
const studyMain = [
  {
    path: '/study/poetryAi/chattochat/:id',
    component: () => import('@/views/aiChat/chatToChat/index.vue')
  },
  {
    path: '/study/poetryAi/chattopic',
    component: () => import('@/views/aiChat/chatToPic/index.vue')
  },
  {
    path: '/study/poetryAi/pictochat',
    component: () => import('@/views/aiChat/picToChat/index.vue')
  },
  {
    path: '/study/poetryAi/poemrefine',
    component: () => import('@/views/aiChat/poemRefine/index.vue')
  }
]
const dictionaryMain = [
  {
    path: '/study/dictionary',
    component: () => import('@/views/game/dictionary.vue'),
  },
  {
    path: '/study/dictionary/textlist',
    component: () => import('@/views/game/textlist.vue'),
  },
  {
    path: '/study/dictionary/poetgame',
    component: () => import('@/views/game/poetgame.vue'),
  },
  {
    path: '/study/dictionary/fillpoetgame',
    component: () => import('@/views/game/fillpoetgame.vue'),
  },
]
const vrExhibitionMain = {
  path: '/study/vrExhibition/vrExhibitionDetail/:id',
  component: () => import('@/views/vrExhibition/vrExhibitionDetail/index.vue')
}

const main = [
  {
    path: '/study/poetryAi',
    component: () => import('@/views/poetryAi/poetryAi.vue'),
    children: [...studyMain]
  },
  {
    path: '/study/dictionary',
    component: () => import('@/views/game/dictionary.vue'),
    children: [...dictionaryMain]
  },
  {
    path: '/study/vrExhibition',
    component: () => import('@/views/vrExhibition/index.vue'),
    children: [vrExhibitionMain]
  }
]

const study = {
  path: '/study',
  redirect: '/study/poetryAi',
  children: [...main]
}
export default study
