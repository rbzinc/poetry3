<template>
  <div class="chat-to-pic-container">
    <!-- 使用通用聊天容器组件 -->
    <ChatContainer
      :messages="messages"
      :loading="loading"
      :user-avatar="userInfo.userInfo.touxiang"
      placeholder="请输入古诗词，我将为你生成相应的图片..."
      @send="handleSend"
      @image-click="handleImageClick"
    />
    
    <!-- 自定义图片预览模态框 -->
    <Teleport to="body">
      <div v-if="isModalVisible" class="custom-modal" :class="{ 'fullscreen': isFullscreen }">
        <div class="modal-overlay" @click="closeImagePreview"></div>
        
        <div class="modal-container">
          <div class="modal-header">
            <h3>图片预览</h3>
            <button class="close-button" @click="closeImagePreview">×</button>
          </div>
          
          <div class="modal-body" @click="toggleFullscreen">
            <img :src="currentImageUrl" alt="预览图片" class="preview-image" />
          </div>
          
          <div class="modal-footer">
            <el-button @click="downloadImage">
              <el-icon><Download /></el-icon> 下载图片
            </el-button>
            <el-button @click="toggleFullscreen">
              <el-icon v-if="!isFullscreen"><FullScreen /></el-icon>
              <el-icon v-else><Aim /></el-icon>
              {{ isFullscreen ? '退出全屏' : '全屏查看' }}
            </el-button>
            <el-button type="primary" @click="window.open(currentImageUrl, '_blank')">
              <el-icon><Right /></el-icon> 在新窗口打开
            </el-button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "@/stores/modules/user.js";
import { userAIDraowSdadwadwPostApi } from "@/api/modules/aiChat.js";
import ChatContainer from "@/components/study/directory/AiStudy/ChatContainer/index.vue";

// 初始化消息数组和状态
const messages = ref([
  {text: '发送我一段一首古诗，我将为你生成相应的图片哦', self: false, type: 'text'}
]);
const loading = ref(false);
const userInfo = useUserInfoStore();
const isModalVisible = ref(false);
const currentImageUrl = ref('');
const isFullscreen = ref(false);

// 处理发送消息
const handleSend = async (message) => {
  if (!message) return;
  
  try {
    loading.value = true;
    // 添加用户消息
    messages.value.push({ text: message, self: true, type: 'text' });
    
    // 调用API生成图片
    const res = await userAIDraowSdadwadwPostApi(message);
    if (res && res.data) {
      // 添加AI回复的图片消息
      messages.value.push({ text: res.data, self: false, type: 'image' });
    }
  } catch (error) {
    console.error('图片生成失败:', error);
    ElMessage.error('图片生成失败，请稍后重试');
    messages.value.push({ text: '图片生成失败，请稍后重试', self: false, type: 'text' });
  } finally {
    loading.value = false;
  }
};

// 处理图片点击，显示大图
const handleImageClick = (imageUrl) => {
  currentImageUrl.value = imageUrl;
  isModalVisible.value = true;
  // 防止滚动
  document.body.style.overflow = 'hidden';
};

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 关闭图片预览
const closeImagePreview = () => {
  isModalVisible.value = false;
  isFullscreen.value = false;
  // 恢复滚动
  document.body.style.overflow = '';
};

// 下载图片
const downloadImage = () => {
  const link = document.createElement('a');
  link.href = currentImageUrl.value;
  link.download = `诗词图片_${new Date().getTime()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  ElMessage.success('图片下载中');
};
</script>

<style lang="scss" scoped>
.chat-to-pic-container {
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

// 自定义模态框样式
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &.fullscreen {
    .modal-container {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      
      .modal-body {
        height: calc(100% - 110px);
      }
      
      .preview-image {
        max-height: 100%;
      }
    }
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }
  
  .modal-container {
    position: relative;
    width: 80%;
    max-width: 1200px;
    max-height: 90vh;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 1;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
      
      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
      
      .close-button {
        background: none;
        border: none;
        font-size: 24px;
        color: #909399;
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover {
          color: #303133;
        }
      }
    }
    
    .modal-body {
      flex: 1;
      padding: 20px;
      overflow: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.02);
      cursor: pointer;
      
      .preview-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 4px;
        transition: transform 0.3s ease;
      }
    }
    
    .modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #ebeef5;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
  }
}

@media (max-width: 768px) {
  .chat-to-pic-container {
    width: 95%;
    height: calc(100vh - 120px);
    margin: 10px auto;
  }
  
  .custom-modal {
    .modal-container {
      width: 95%;
      
      .modal-footer {
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }
}
</style>