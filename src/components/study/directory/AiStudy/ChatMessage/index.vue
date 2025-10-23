<script setup>
import { defineProps, defineEmits } from 'vue'
import { User, Avatar } from '@element-plus/icons-vue'

const emit = defineEmits(['image-click'])

defineProps({
  // 消息内容
  message: {
    type: Object,
    required: true,
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
})

// 处理图片加载错误
const handleImageError = (e) => {
  console.error('图片加载失败:', e)
  e.target.alt = '图片加载失败'
}

const handleImageClick = (imageUrl) => {
  if (!imageUrl) {
    console.warn('图片URL为空')
    return
  }
  emit('image-click', imageUrl)
}
</script>

<template>
  <div class="message-wrapper" :class="{ 'my-message-wrapper': message.self, 'ai-message-wrapper': !message.self }">
    <!-- AI头像 -->
    <div v-if="!message.self" class="avatar-container">
      <div 
        class="avatar" 
        :class="{ 'default-avatar': !aiAvatar }"
        :style="aiAvatar ? { backgroundImage: `url(${aiAvatar})` } : {}"
      >
        <el-icon v-if="!aiAvatar" :size="24"><Avatar /></el-icon>
      </div>
    </div>

    <!-- 消息内容 -->
    <div
      class="message"
      :class="{
        'my-message': message.self && (!message.type || message.type === 'text'),
        'ai-message': !message.self && (!message.type || message.type === 'text'),
        'image-message': message.type === 'image',
      }"
    >
      <!-- 文本消息 -->
      <p v-if="!message.type || message.type === 'text'">{{ message.text }}</p>

      <!-- 图片消息 -->
      <div v-else-if="message.type === 'image'" class="image-container">
        <img
          :src="message.text"
          alt="图片消息"
          class="message-image"
          @click="handleImageClick(message.text)"
          loading="lazy"
          @error="handleImageError"
        />
      </div>

      <!-- HTML内容 -->
      <div v-else-if="message.type === 'html'" v-html="message.text"></div>
    </div>

    <!-- 用户头像 -->
    <div v-if="message.self" class="avatar-container">
      <div 
        class="avatar" 
        :class="{ 'default-avatar': !userAvatar }"
        :style="userAvatar ? { backgroundImage: `url(${userAvatar})` } : {}"
      >
        <el-icon v-if="!userAvatar" :size="24"><User /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-wrapper {
  display: flex;
  align-items: flex-start;
  margin: 16px 0;
  width: 100%;

  &.my-message-wrapper {
    justify-content: flex-end;
  }

  &.ai-message-wrapper {
    justify-content: flex-start;
  }

  .avatar-container {
    flex-shrink: 0;
    margin: 0 12px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid #fff;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      
      &.default-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }

  .message {
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    p {
      margin: 0;
      line-height: 1.6;
      font-size: 15px;
    }
  }

  .image-message {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    max-width: 300px;
    margin: 8px 0;

    .image-container {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      background: none;

      .message-image {
        display: block;
        width: 100%;
        height: auto;
        max-height: 200px;
        border-radius: 8px;
        cursor: zoom-in;
        transition: transform 0.2s ease;
        object-fit: contain;
      }

     

      &:hover {
        .image-overlay {
          opacity: 1;
        }

        .message-image {
          transform: scale(1.02);
        }
      }
    }
  }

  .my-message {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-top-right-radius: 4px;
  }

  .ai-message {
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-top-left-radius: 4px;
  }
}
</style>
