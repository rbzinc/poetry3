<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useUserInfoStore } from '@/stores/index.js'
import { aiChatGetApi } from '@/api/modules/aiChat.js'
import ChatContainer from '@/components/study/directory/AiStudy/ChatContainer/index.vue'

const userInfo = useUserInfoStore()
const messages = ref([{ text: '选择优化类型，并且输入您的古诗，我会帮您进行优化。', self: false, type: 'text' }])
const loading = ref(false)
const typeIndex = ref(1)

const inputMessage = ref('') // 在父组件中定义输入内容

// 计算占位符文本
const placeholder = computed(() => {
  const placeholders = [
    '请选择类型',
    '请输入您的古诗，我会帮你修改',
    '请输入您的古诗，我会帮你批改',
    '请输入您的古诗，我会帮你剖析',
  ]
  return placeholders[typeIndex.value] || placeholders[0]
})

// 处理发送消息
const handleSend = async (message) => {
  if (!message) return

  try {
    loading.value = true
    let trimmedInput = ''

    // 根据类型添加前缀
    if (typeIndex.value === 1) {
      trimmedInput = '修改' + message.trim()
    } else if (typeIndex.value === 2) {
      trimmedInput = '批改' + message.trim()
    } else if (typeIndex.value === 3) {
      trimmedInput = '剖析' + message.trim()
    }

    // 添加用户消息
    messages.value.push({ text: trimmedInput, self: true, type: 'text' })

    // 调用API
    await aiChatGetApi(10086, trimmedInput)
  } catch (error) {
    console.error('API请求失败:', error)
    ElMessage.error('发送失败，请稍后重试')
    messages.value.push({ text: '发送失败，请稍后重试', self: false, type: 'text' })
  } finally {
    loading.value = false
  }
}

// 处理类型改变
const handleTypeChange = (type) => {
  typeIndex.value = type
}

const controller = new AbortController()
const handleDropdownClick = () => {
  handleSend(inputMessage.value)
   inputMessage.value = ''
}
const GetSSE = () => {
  fetchEventSource('http://120.27.234.36:8080/ai/submita', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: useUserInfoStore().userInfo.token,
    },
    signal: controller.signal,
    openWhenHidden: true,
    onmessage(event) {
      const data = JSON.parse(event.data)
      if (!event.data.includes('\\ndata')) {
        if (data) {
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && !lastMessage.self) {
            lastMessage.text += data
          } else {
            messages.value.push({ text: data, self: false, type: 'text' })
          }
        }
      } else {
        console.log('我没有\\ndata数据')
      }
    },
    onerror(event) {
      console.log('错误:', event)
      messages.value.push({ text: '连接出现问题，请稍后再试。', self: false, type: 'text' })
    },
  })
}

onBeforeUnmount(() => {
  controller.abort()
})

onMounted(() => {
  GetSSE()
})
</script>

<template>
  <div class="poem-refine-container">
    <ChatContainer
    :messages="messages"
      :loading="loading"
      :user-avatar="userInfo.userInfo.touxiang"
      :placeholder="placeholder"
      v-model="inputMessage"
      @send="handleSend"
    >
    <template #send-button>
        <el-dropdown 
          split-button 
          type="primary" 
          size="default"
          @click="handleDropdownClick"
        >
          发送
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleTypeChange(1)">修改</el-dropdown-item>
              <el-dropdown-item @click="handleTypeChange(2)">批改</el-dropdown-item>
              <el-dropdown-item @click="handleTypeChange(3)">剖析</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ChatContainer>
  </div>
</template>

<style lang="scss" scoped>
.poem-refine-container {
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: 20px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .poem-refine-container {
    width: 95%;
    height: calc(100vh - 120px);
    margin: 10px auto;
  }
}
</style>
