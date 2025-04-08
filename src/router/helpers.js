import router from './index.js'
import * as ROUTES from './constants.js'

/**
 * 跳转到首页
 */
export const goHome = () => {
  router.push(ROUTES.HOME)
}

/**
 * 跳转到登录页
 */
export const goLogin = () => {
  router.push(ROUTES.LOGIN)
}

/**
 * 跳转到古诗词详情页
 * @param {string|number} id 诗词ID
 */
export const goPoetClassDetail = (id) => {
  router.push({
    path: ROUTES.POET_CLASS_DETAIL,
    query: { id },
  })
}

/**
 * 跳转到诗人详情页
 * @param {string|number} id 诗人ID
 */
export const goPoetWriterDetail = (id) => {
  router.push({
    path: ROUTES.POET_WRITER_DETAIL,
    query: { id },
  })
}

/**
 * 跳转到AI聊天页面
 * @param {string|number} id 聊天ID
 */
export const goChatToChat = (id) => {
  router.push({
    path: ROUTES.STUDY_AI_CHAT_WITH_ID,
    query: { id },
  })
}

/**
 * 文生图
 */
export const goChatToPic = () => {
  router.push(ROUTES.STUDY_AI_CHAT_TO_PIC)
}

/**
 * 图生文
 */
export const goPicToChat = () => {
  router.push(ROUTES.STUDY_AI_PIC_TO_CHAT)
}

/**
 * 文字狱优化
 */
export const goChatToRefine = () => {
  router.push(ROUTES.STUDY_AI_POEM_REFINE)
}

export const goDictionary = () => {
  router.push(ROUTES.DICTIONARY)
}

export const goDictionaryTextList = () => {
  router.push(ROUTES.DICTIONARY_TEXT_LIST)
}

export const goDictionaryPoemGame = () => {
  router.push(ROUTES.DICTIONARY_POET_GAME)
}

export const goDictionaryFillPoemGame = () => {
  router.push(ROUTES.DICTIONARY_FILL_POET_GAME)
}

export const goVrDetail = (id) => {
  router.push({
    path: ROUTES.VR_EXHIBITION,
    query: { id },
  })
}

/**
 * 跳转到论坛详情页
 * @param {string|number} id 论坛帖子ID
 */
export const goForumDetail = (id) => {
  router.push({
    path: ROUTES.FORUM_DETAIL,
    query: { id },
  })
}

export const goForum = () => {
  router.push(ROUTES.FORUM)
}

export const goForumEdit = () => {
  router.push(ROUTES.FORUM_EDIT)
}

/**
 * 跳转到用户编辑页面
 */
export const goUserEdit = () => {
  router.push(ROUTES.USER_EDIT)
}
