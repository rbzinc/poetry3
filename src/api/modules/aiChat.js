import instance from '../index'

/**
 * ai机器对话
 * @param idd
 * @param message
 * @returns {*}
 */
export const aiChatGetApi = (idd, message) => instance({
  url: '/ai/chat11',
  method: 'POST',
  data: {
    idd: idd,
    message: message
  }
})

/**
 * 文字生成图片
 * @param ai
 * @returns {*}
 */
export const userAIDraowSdadwadwPostApi = (ai) => instance({
  url: '/user/AI/draow/sdadwadw',
  method: 'POST',
  params: {
    ai
  }
})

/**
 * 图片生成文字
 * @param genre
 * @param emotion
 * @param theme
 * @param input
 * @param url
 * @returns {*}
 */
export const aiPicturePostApi = (genre,emotion,theme,input,url) => instance({
  url: '/ai/picture',
  method: 'POST',
  data: {
    genre,
    emotion,
    theme,
    input,
    url
  }
})

/**
 * 获取音频
 * @param id
 * @returns {*}
 */
export const aiAudioGetAPi = (id) => instance({
  url: '/ai/audio',
  method: 'GET',
  params: {
    id
  }
})

/**
 * 古诗优化
 * @param id
 * @param message
 * @returns {*}
 */
export const aiChatRefinePostApi = (id, message) => instance({
  url: '/ai/chat',
  method: 'POST',
  params: {
    id,
    message
  }
})
