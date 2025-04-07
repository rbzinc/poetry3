<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useUserInfoStore } from '@/stores/index.js'
import { aiChatGetApi } from '@/api/modules/aiChat.js'
import ChatContainer from '@/components/study/directory/AiStudy/ChatContainer/index.vue'

const userInfo = useUserInfoStore()
const messages = ref([{ text: '选择优化类型，并且输入您的古诗，我会帮您进行优化。', self: false }])
const inputMessage = ref('')
const typeIndex = ref(1)
const loading = ref(false)
const controller = new AbortController()

const sendMessage = async () => {
  const trimmedInput = ref('')
  if (typeIndex.value === 1) {
    trimmedInput.value = '修改' + inputMessage.value.trim()
  } else if (typeIndex.value === 2) {
    trimmedInput.value = '批改' + inputMessage.value.trim()
  } else if (typeIndex.value === 3) {
    trimmedInput.value = '剖析' + inputMessage.value.trim()
  }

  if (trimmedInput.value) {
    messages.value.push({ text: trimmedInput.value, self: true })
    loading.value = true
    try {
      await aiChatGetApi(10086, trimmedInput.value)
    } catch (err) {
      console.error('API请求失败:', err)
      ElMessage.error('请求失败')
    } finally {
      loading.value = false
    }
    inputMessage.value = ''
  } else {
    ElMessage.error('请输入内容')
  }
}

const changeType = (event) => {
  typeIndex.value = event
}

const placeholderText = computed(() => {
  const placeholders = [
    '请选择类型',
    '请输入您的古诗，我会帮你修改',
    '请输入您的古诗，我会帮你批改',
    '请输入您的古诗，我会帮你剖析',
  ]
  return placeholders[typeIndex.value] || placeholders[0]
})

const GetSSE = () => {
  const sseService = fetchEventSource('http://fuze1.nat300.top/ai/submita', {
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
            messages.value.push({ text: data, self: false })
          }
        }
      }
    },
    onerror(event) {
      console.log('错误:', event)
      messages.value.push({ text: '连接出现问题，请稍后再试。', self: false })
    },
  })
}

onBeforeUnmount(() => {
  controller.abort()
})

onMounted(() => {
  // GetSSE()
})
</script>

<template>
  <div class="poem-refine-container">
    <ChatContainer
      :messages="messages"
      :loading="loading"
      :user-avatar="userInfo.userInfo.touxiang"
      :placeholder="placeholderText"
      @send="sendMessage"
    >
      <template #input-prefix>
        <el-dropdown split-button type="primary" size="large">
          发送
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="sendMessage">发送</el-dropdown-item>
              <el-dropdown-item @click="changeType(1)">修改</el-dropdown-item>
              <el-dropdown-item @click="changeType(2)">批改</el-dropdown-item>
              <el-dropdown-item @click="changeType(3)">剖析</el-dropdown-item>
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

  :deep(.input-area) {
    .el-dropdown {
      margin-right: 12px;
    }

    .el-input {
      flex: 1;
    }
  }
}

@media (max-width: 768px) {
  .poem-refine-container {
    width: 95%;
    height: calc(100vh - 120px);
    margin: 10px auto;
  }
}
</style>
