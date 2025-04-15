<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/index.js'
import { usePoemImgStore } from '@/stores/index.js'
import { aiChatGetApi } from '@/api/modules/aiChat.js'
import { getSentenceData } from '@/api/index.js'
import ChatContainer from '@/components/study/directory/AiStudy/ChatContainer/index.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

// 获取路由和存储
const route = useRoute()
const userInfo = useUserInfoStore()
const PoemImgStore = usePoemImgStore()
const PoemImg = PoemImgStore.poemImg
const poetId = Number(route.query.id) - 1
const inputMessage = ref('')
// 初始化状态
const messages = ref([{ text: PoemImg[poetId].content, self: false }])
const loading = ref(false)
const poetPoem = ref([])
const controller = new AbortController()

// 处理发送消息
const handleSend = async (message) => {
  if (!message) return
  try {
    loading.value = true
    // 添加用户消息
    messages.value.push({ text: message, self: true })

    // 调用API发送消息
    await aiChatGetApi(route.query.id, message)
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败，请稍后重试')
    messages.value.push({ text: '发送失败，请稍后重试', self: false })
  } finally {
    loading.value = false
  }
}

const startSSEConnection = () => {
  fetchEventSource('http://120.27.234.36:8080/ai/submita', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userInfo.userInfo.token,
    },
    signal: controller.signal,
    openWhenHidden: true,
    onmessage(event) {
      try {
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
      } catch (error) {
        console.error('处理SSE消息失败:', error)
      }
    },
    onerror(error) {
      console.error('SSE连接错误:', error)
      messages.value.push({ text: '连接出现问题，请稍后再试。', self: false })
    },
  })
}

// 获取诗人经典名句
const getSentence = async () => {
  try {
    const res = await getSentenceData(PoemImg[poetId].title, 1)
    poetPoem.value = res.data.records
  } catch (error) {
    console.error('获取名句失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  startSSEConnection()
  getSentence()
})

onBeforeUnmount(() => {
  controller.abort()
})
</script>

<template>
  <div class="chat-to-chat-container">
    <div class="main-content">
      <!-- 使用通用聊天容器组件 -->
      <ChatContainer
        :messages="messages"
        :loading="loading"
        :user-avatar="userInfo.userInfo.touxiang"
        :ai-avatar="PoemImg[poetId].url"
        v-model="inputMessage"
        placeholder="有什么想问的你都可以畅所欲言！"
        @send="handleSend"
      />
    </div>

    <!-- 诗人名句侧边栏 -->
    <el-scrollbar>
      <div class="sidebar">
        <el-card class="poem-card">
          <template #header>
            <div class="card-header">
              <span>{{ PoemImg[poetId].title }} -- 经典名句</span>
            </div>
          </template>

          <div v-if="poetPoem.length > 0" class="poem-list">
            <div v-for="item in poetPoem" :key="item.id" class="poem-item">
              <p class="poem-title">{{ item.fromm }}</p>
              <p class="poem-content">{{ item.name }}</p>
            </div>
          </div>

          <div v-else class="no-poems">
            <p>暂无经典名句</p>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.chat-to-chat-container {
  display: flex;
  width: 95%;
  height: 80vh;
  margin: 20px auto;
  gap: 10px;

  .main-content {
    flex: 1;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .sidebar {
    width: 300px;

    .poem-card {
      height: 100%;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .card-header {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .poem-list {
        overflow-y: auto;

        .poem-item {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #eee;

          &:last-child {
            border-bottom: none;
          }

          .poem-title {
            font-size: 16px;
            font-weight: 550;
            margin-bottom: 10px;
            color: #333;
          }

          .poem-content {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
          }
        }
      }

      .no-poems {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #999;
      }
    }
  }
}

@media (max-width: 992px) {
  .chat-to-chat-container {
    flex-direction: column;

    .sidebar {
      width: 100%;
      height: auto;
      max-height: 300px;
    }
  }
}
</style>
