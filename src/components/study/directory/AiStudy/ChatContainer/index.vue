<script setup>
import { ref, watch, nextTick, defineProps, defineEmits, computed, onMounted } from 'vue'
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
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['send', 'image-click', 'update:modelValue'])
// 输入消息
const inputMessage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 修改 ref 名称，指向 el-scrollbar 实例
const messagesScrollbarRef = ref(null)
// 新增 ref，指向内部消息容器 div
const messagesInnerContainerRef = ref(null)

// 发送消息
const sendMessage = () => {
  const trimmedInput = inputMessage.value.trim()
  if (trimmedInput) {
    emit('send', trimmedInput)
    emit('update:modelValue', '') // 清空输入框
  }
}

// 改进滚动到底部的函数
const scrollToBottom = async () => {
  // 使用 nextTick 确保 DOM 更新完成
  await nextTick()
  if (messagesScrollbarRef.value && messagesInnerContainerRef.value) {
    // 获取内部容器的实际高度
    const scrollHeight = messagesInnerContainerRef.value.scrollHeight
    // 使用 el-scrollbar 的 scrollTo 方法进行滚动
    messagesScrollbarRef.value.scrollTo({ top: scrollHeight, behavior: 'smooth' }) // 添加 behavior: 'smooth' 实现平滑滚动
  }
}

// 处理图片点击
const handleImageClick = (imageUrl) => {
  emit('image-click', imageUrl)
}

// 监听消息变化，并在 DOM 更新后滚动
watch(
  () => props.messages,
  () => {
    // 调用改进后的滚动函数
    scrollToBottom()
  },
  { deep: true, immediate: true }, // immediate 保证初始加载时也尝试滚动
)

// 在组件挂载后也执行一次滚动，确保初始状态正确
onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-container">
    <!-- 消息列表区域 -->
    <!-- 更新 ref 名称 -->
    <el-scrollbar ref="messagesScrollbarRef" class="messages-scrollbar">
      <!-- 添加内部容器 div 并设置 ref -->
      <div ref="messagesInnerContainerRef" class="messages-inner-container">
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

    <!-- 输入区域 (保持不变) -->
    <div v-if="showInput" class="input-area">
      <slot name="input-prefix"></slot>

      <el-input
        v-model="inputMessage"
        :placeholder="placeholder"
        @keyup.enter="sendMessage"
        class="message-input"
        :disabled="loading"
      />

      <!-- 添加默认发送按钮插槽 -->
      <slot name="send-button">
        <el-button type="primary" @click="sendMessage" :loading="loading" :disabled="!inputMessage.trim()">
          发送
        </el-button>
      </slot>
    </div>

    <!-- 自定义输入区域 (保持不变) -->
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
    overflow-y: auto; // el-scrollbar 会处理滚动，但保留无妨

    // 将原 .messages-container 的样式和内容移到这里
    .messages-inner-container {
      padding: 16px; // 将 padding 移到内部容器，避免滚动条覆盖
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