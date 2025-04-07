// 游戏助学栏目
const dictionaryRoutes = [
  {
    path: '/study/dictionary',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue'),
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

const dictionary = {
  path: '/study',
  component: () => import('@/views/study/index.vue'),
  children: [...dictionaryRoutes],
}

export default dictionary
