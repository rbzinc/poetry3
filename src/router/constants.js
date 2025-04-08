/**
 * 路由路径常量
 * 集中管理所有路由路径，避免硬编码
 */

// 基础路由
export const HOME = '/home'
export const LOGIN = '/login'
export const NOT_FOUND = '/404'

// 用户相关路由
export const USER = '/user'
export const USER_EDIT = '/user/edit-info'

// 学习模块路由
export const STUDY = '/study'
export const STUDY_AI = '/study/ai'
export const STUDY_AI_CHAT_WITH_ID = '/study/ai/chat-to-chat' // 添加基础路径
export const STUDY_AI_CHAT_TO_PIC = '/study/ai/chat-to-pic'
export const STUDY_AI_PIC_TO_CHAT = '/study/ai/pic-to-chat'
export const STUDY_AI_POEM_REFINE = '/study/ai/poem-refine'

// 游戏助学路由
export const DICTIONARY = '/study/dictionary'
export const DICTIONARY_INDEX = '/study/dictionary/index'
export const DICTIONARY_TEXT_LIST = '/study/dictionary/text-list'
export const DICTIONARY_POET_GAME = '/study/dictionary/poet-game'
export const DICTIONARY_FILL_POET_GAME = '/study/dictionary/fill-poet-game'

// VR展览路由
export const VR = '/vr'
export const VR_EXHIBITION = '/vr-exhibition'

// 论坛路由
export const FORUM = '/forum'
export const FORUM_EDIT = '/forum/edit'
export const FORUM_DETAIL = '/forum/detail'

// 诗人模块路由
export const POET = '/poet'
export const POET_CLASS = '/poet/class'
export const POET_SENTENCE = '/poet/sentence'
export const POET_WRITER = '/poet/writer'
export const POET_CLASS_DETAIL = '/poet/class/detail'
export const POET_WRITER_DETAIL = '/poet/writer/detail'

// 诗词详情页
export const POEM_DETAILS = '/poem-details'
