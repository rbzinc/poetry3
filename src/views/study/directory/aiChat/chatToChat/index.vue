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
  fetchEventSource('http://localhost:8080/ai/submita', {
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
    <!-- 诗人信息侧边栏 -->
    <div class="sidebar-left">
      <div class="poet-profile">
        <div class="poet-avatar-wrapper">
          <img :src="PoemImg[poetId].url" :alt="PoemImg[poetId].title" class="poet-avatar" />
          <div class="online-indicator"></div>
        </div>
        <h3 class="poet-name">{{ PoemImg[poetId].title }}</h3>
        <p class="poet-desc">{{ PoemImg[poetId].content.substring(0, 60) }}...</p>
      </div>

      <!-- 经典名句 -->
      <div class="poems-section">
        <div class="section-header">
          <el-icon><Star /></el-icon>
          <span>经典名句</span>
        </div>

        <el-scrollbar height="calc(100vh - 480px)">
          <div v-if="poetPoem.length > 0" class="poem-list">
            <div v-for="item in poetPoem" :key="item.id" class="poem-item">
              <div class="poem-title">{{ item.fromm }}</div>
              <div class="poem-content">{{ item.name }}</div>
            </div>
          </div>

          <div v-else class="no-poems">
            <el-empty description="暂无经典名句" :image-size="80" />
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="main-content">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="header-left">
          <img :src="PoemImg[poetId].url" :alt="PoemImg[poetId].title" class="header-avatar" />
          <div class="header-info">
            <h3 class="header-name">{{ PoemImg[poetId].title }}</h3>
            <span class="header-status">
              <span class="status-dot"></span>
              在线
            </span>
          </div>
        </div>
        <div class="header-actions">
          <el-button circle>
            <el-icon><More /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 聊天容器 -->
      <div class="chat-content">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-to-chat-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 160px);
  background: white;

  .sidebar-left {
    width: 320px;
    background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    border-right: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .poet-profile {
      padding: 30px 24px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      .poet-avatar-wrapper {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 16px;

        .poet-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .online-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: #52c41a;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      }

      .poet-name {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 700;
      }

      .poet-desc {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        opacity: 0.9;
      }
    }

    .poems-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow: hidden;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #333;

        .el-icon {
          color: #f59e0b;
          font-size: 18px;
        }
      }

      .poem-list {
        .poem-item {
          margin-bottom: 20px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          cursor: pointer;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
            border-color: #667eea;
          }

          .poem-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }

          .poem-content {
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }
        }
      }

      .no-poems {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    overflow: hidden;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e8e8e8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      z-index: 10;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e8e8e8;
        }

        .header-info {
          .header-name {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .header-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #52c41a;

            .status-dot {
              width: 8px;
              height: 8px;
              background: #52c41a;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }
          }
        }
      }

      .header-actions {
        :deep(.el-button) {
          border: 1px solid #e8e8e8;
          color: #666;

          &:hover {
            border-color: #667eea;
            color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }
        }
      }
    }

    .chat-content {
      flex: 1;
      overflow: hidden;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式
@media (max-width: 1200px) {
  .chat-to-chat-container {
    .sidebar-left {
      width: 280px;
    }
  }
}

@media (max-width: 992px) {
  .chat-to-chat-container {
    .sidebar-left {
      display: none;
    }
  }
}
</style>
