// 学习页面
const studyMain = [
  {
    path: '/study/poetryAi/chattochat/:id',
    component: () => import('@/views/study/directory/aiChat/chatToChat/index.vue')
  },
  {
    path: '/study/poetryAi/chattopic',
    component: () => import('@/views/study/directory/aiChat/chatToPic/index.vue')
  },
  {
    path: '/study/poetryAi/pictochat',
    component: () => import('@/views/study/directory/aiChat/picToChat/index.vue')
  },
  {
    path: '/study/poetryAi/poemrefine',
    component: () => import('@/views/study/directory/aiChat/poemRefine/index.vue')
  }
]
const dictionaryMain = [
  {
    path: '/study/dictionary',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue.vue'),
  },
  {
    path: '/study/dictionary/textlist',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/textList/index.vue'),
  },
  {
    path: '/study/dictionary/poetgame',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue'),
  },
  {
    path: '/study/dictionary/fillpoetgame',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue'),
  },
]
const vrExhibitionMain = {
  path: '/study/vrExhibition/vrExhibitionDetail/:id',
  component: () => import('@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue')
}

const main = [
  {
    path: '/study/poetryAi',
    component: () => import('@/views/study/index.vue'),
    children: [...studyMain]
  },
  {
    path: '/study/dictionary',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue.vue'),
    children: [...dictionaryMain]
  },
  {
    path: '/study/vrExhibition',
    component: () => import('@/views/study/directory/vrExhibition/index.vue'),
    children: [vrExhibitionMain]
  }
]

const study = {
  path: '/study',
  redirect: '/study/poetryAi',
  children: [...main]
}
export default study
