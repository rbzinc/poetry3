<script setup>
import { defineProps, defineEmits } from 'vue'

defineEmits(['image-click'])

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
</script>

<template>
  <div class="message-wrapper" :class="{ 'my-message-wrapper': message.self, 'ai-message-wrapper': !message.self }">
    <!-- AI头像 -->
    <div v-if="!message.self" class="avatar-container">
      <img :src="aiAvatar" alt="AI头像" class="avatar" />
    </div>

    <!-- 消息内容 -->
    <div 
      class="message" 
      :class="{ 
        'my-message': message.self && (!message.type || message.type === 'text'), 
        'ai-message': !message.self && (!message.type || message.type === 'text'),
        'image-message': message.type === 'image'
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
          @click="$emit('image-click', message.text)"
          loading="lazy"
        />
        <div class="image-overlay">
          <span class="view-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            点击查看
          </span>
        </div>
      </div>

      <!-- HTML内容 -->
      <div v-else-if="message.type === 'html'" v-html="message.text"></div>
    </div>

    <!-- 用户头像 -->
    <div v-if="message.self" class="avatar-container">
      <img :src="userAvatar" alt="用户头像" class="avatar" />
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
      object-fit: cover;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid #fff;
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
  
  // 图片消息样式 - 移除边框和背景
  .image-message {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    max-width: 80%;
    
    .image-container {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      
      &:hover {
        .image-overlay {
          opacity: 1;
        }
        
        .message-image {
          transform: scale(1.03);
        }
      }
    }
    
    .message-image {
      display: block;
      max-width: 100%;
      max-height: 250px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
      object-fit: cover;
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 8px;
      
      .view-icon {
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        
        svg {
          margin-bottom: 5px;
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

@media (max-width: 768px) {
  .message-wrapper {
    .message {
      max-width: 85%;
    }
    
    .image-message {
      max-width: 90%;
      
      .message-image {
        max-height: 200px;
      }
    }
  }
}
</style>