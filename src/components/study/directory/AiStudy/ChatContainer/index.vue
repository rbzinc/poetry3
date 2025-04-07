<script setup>
import { ref, watch, nextTick, defineProps, defineEmits } from 'vue'
import ChatMessage from '../ChatMessage/index.vue'

const props = defineProps({
  // 消息列表
  messages: {
    type: Array,
    required: true,
  },
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false,
  },
  // 用户头像
  userAvatar: {
    type: String,
    default: '',
  },
  // AI头像
  aiAvatar: {
    type: String,
    default: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  // 输入框占位符
  placeholder: {
    type: String,
    default: '请输入消息...',
  },
  // 是否显示输入区域
  showInput: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['send', 'image-click'])

// 输入消息
const inputMessage = ref('')
// 消息容器引用
const messagesContainer = ref(null)

// 发送消息
const sendMessage = () => {
  const trimmedInput = inputMessage.value.trim()
  if (trimmedInput) {
    emit('send', trimmedInput)
    inputMessage.value = ''
  }
}

// 监听消息变化，自动滚动到底部
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  },
)

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    const container = messagesContainer.value.$el || messagesContainer.value
    container.scrollTop = container.scrollHeight
  }
}

// 处理图片点击
const handleImageClick = (imageUrl) => {
  emit('image-click', imageUrl)
}
</script>

<template>
  <div class="chat-container">
    <!-- 消息列表区域 -->
    <el-scrollbar ref="messagesContainer" class="messages-scrollbar">
      <div class="messages-container">
        <chat-message
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :user-avatar="userAvatar"
          :ai-avatar="aiAvatar"
          @image-click="handleImageClick"
        />

        <!-- 加载指示器 -->
        <div v-if="loading" class="loading-indicator">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>正在思考...</span>
        </div>
      </div>
    </el-scrollbar>

    <!-- 输入区域 -->
    <div v-if="showInput" class="input-area">
      <slot name="input-prefix"></slot>

      <el-input
        v-model="inputMessage"
        :placeholder="placeholder"
        @keyup.enter="sendMessage"
        class="message-input"
        :disabled="loading"
      />

      <el-button type="primary" @click="sendMessage" :loading="loading" :disabled="!inputMessage.trim()">
        发送
      </el-button>

      <slot name="input-suffix"></slot>
    </div>

    <!-- 自定义输入区域 -->
    <slot name="custom-input"></slot>
  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .messages-scrollbar {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .messages-container {
      display: flex;
      flex-direction: column;

      .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        color: #909399;

        .el-icon {
          margin-right: 8px;
        }
      }
    }
  }

  .input-area {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    background-color: #f5f7fa;

    .message-input {
      flex: 1;
      margin: 0 12px;
    }
  }
}
</style>
