import instance from '../instance.js'

/**
 * ai机器对话
 * @param idd
 * @param message
 * @returns {*}
 */
export const aiChatGetApi = (idd, message) =>
  instance({
    url: '/ai/chat11',
    method: 'POST',
    data: {
      idd: idd,
      message: message,
    },
  })

/**
 * 文字生成图片
 * @param ai
 * @returns {*}
 */
export const userAIDraowSdadwadwPostApi = (ai) =>
  instance({
    url: '/user/AI/draow/sdadwadw',
    method: 'POST',
    params: {
      ai,
    },
  })

/**
 * 图片生成文字
 * @param msg
 * @param url
 * @returns {*}
 */
export const aiPicturePostApi = (msg, url) =>
  instance({
    url: '/ai/picture',
    method: 'POST',
    params: {
      msg,
      url,
    },
  })

/**
 * 获取音频
 * @param id
 * @returns {*}
 */
export const aiAudioGetAPi = (id) =>
  instance({
    url: '/ai/audio',
    method: 'GET',
    params: {
      id,
    },
  })

/**
 * 获取音频
 * @param {*} id
 * @returns
 */
export const aiAudioGetApi = (id) =>
  instance({
    url: '/ai/audio',
    method: 'GET',
    params: {
      id,
    },
  })

/**
 * id获取图片
 * @param {*} id
 * @returns
 */
export const userAIDraowGetApi = (id) =>
  instance({
    url: '/user/AI/draow',
    method: 'POST',
    params: {
      id,
    },
  })

export const userForgetGetApi = (email, password, code) =>
  instance({
    url: '/user/forget',
    method: 'GET',
    data: {
      email,
      password,
      code,
    },
  })
