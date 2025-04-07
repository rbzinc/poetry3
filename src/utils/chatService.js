import { ref } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { aiChatGetApi, aiPicturePostApi, userAIDraowSdadwadwPostApi } from '@/api/modules/aiChat.js'
import { useUserInfoStore } from '@/stores/modules/user.js'

/**
 * 创建聊天服务
 * @returns {Object} 聊天服务对象
 */
export function useChatService() {
  const messages = ref([])
  const loading = ref(false)
  const controller = new AbortController()
  const userStore = useUserInfoStore()

  /**
   * 初始化消息列表
   * @param {Array} initialMessages 初始消息列表
   */
  const initMessages = (initialMessages = []) => {
    messages.value = initialMessages
  }

  /**
   * 添加消息
   * @param {String} text 消息文本
   * @param {Boolean} self 是否是用户发送的消息
   * @param {String} type 消息类型 (text, image, html)
   */
  const addMessage = (text, self = false, type = 'text') => {
    messages.value.push({ text, self, type })
  }

  /**
   * 更新最后一条AI消息
   * @param {String} text 新的消息文本
   */
  const updateLastAiMessage = (text) => {
    const lastMessage = messages.value.findLast((msg) => !msg.self)
    if (lastMessage) {
      lastMessage.text += text
    } else {
      addMessage(text, false)
    }
  }

  /**
   * 发送消息到AI
   * @param {String|Number} targetId 目标ID (诗人ID或特殊ID)
   * @param {String} message 消息内容
   */
  const sendToAI = async (targetId, message) => {
    try {
      loading.value = true
      addMessage(message, true)
      await aiChatGetApi(targetId, message)
    } catch (error) {
      console.error('发送消息失败:', error)
      addMessage('发送失败，请稍后重试', false)
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送图片生成请求
   * @param {String} prompt 提示词
   */
  const generateImage = async (prompt) => {
    try {
      loading.value = true
      addMessage(prompt, true)
      const res = await userAIDraowSdadwadwPostApi(prompt)
      if (res && res.data) {
        addMessage(res.data, false, 'image')
      }
    } catch (error) {
      console.error('生成图片失败:', error)
      addMessage('生成图片失败，请稍后重试', false)
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送图片转诗请求
   * @param {String} message 消息内容
   * @param {String} imageUrl 图片URL
   */
  const generatePoemFromImage = async (message, imageUrl) => {
    try {
      loading.value = true
      addMessage(message, true)
      const res = await aiPicturePostApi(message, imageUrl)
      if (res && res.data) {
        addMessage(res.data, false)
      }
    } catch (error) {
      console.error('生成诗词失败:', error)
      addMessage('生成诗词失败，请稍后重试', false)
    } finally {
      loading.value = false
    }
  }

  /**
   * 启动SSE连接
   */
  const startSSEConnection = () => {
    fetchEventSource('http://fuze1.nat300.top/ai/submita', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: userStore.userInfo.token,
      },
      signal: controller.signal,
      openWhenHidden: true,
      onmessage(event) {
        try {
          const data = JSON.parse(event.data)
          if (!event.data.includes('\\ndata')) {
            if (data) {
              updateLastAiMessage(data)
            }
          }
        } catch (error) {
          console.error('处理SSE消息失败:', error)
        }
      },
      onerror(error) {
        console.error('SSE连接错误:', error)
        addMessage('连接出现问题，请稍后再试。', false)
      },
    })
  }

  /**
   * 清理资源
   */
  const cleanup = () => {
    controller.abort()
  }

  return {
    messages,
    loading,
    initMessages,
    addMessage,
    sendToAI,
    generateImage,
    generatePoemFromImage,
    startSSEConnection,
    cleanup,
  }
}
