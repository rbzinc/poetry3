<script setup>
import { defineProps, ref } from 'vue'
import { Star, VideoPlay, ArrowRight } from '@element-plus/icons-vue'
import { userCollectPoem } from '@/api/index.js'
import { goPoetClassDetail } from '@/router/helpers.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  content: String,
  dynasty: String,
  id: String,
  islike: Boolean,
  title: String,
  type: String,
  writer: String,
})

const isCollected = ref(props.islike)
const isHovering = ref(false)

const poetDetails = () => {
  goPoetClassDetail(props.id)
}

const collect = async (event) => {
  event.stopPropagation()
  try {
    const res = await userCollectPoem(props.id)
    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '收藏成功' : '取消收藏')
  } catch (error) {
    console.error('收藏失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}
</script>

<template>
  <div 
    class="poetry-modern-card"
    @click="poetDetails"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 卡片背景装饰 -->
    <div class="card-background">
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 头部 -->
      <div class="card-header">
        <div class="title-section">
          <h3 class="poem-title">{{ title }}</h3>
          <div class="type-badge" v-if="type">{{ type }}</div>
        </div>
        <div class="author-info">
          <span class="author-name">{{ writer }}</span>
          <span class="dynasty-tag">{{ dynasty || '未知朝代' }}</span>
        </div>
      </div>
      
      <!-- 诗词内容 -->
      <div class="card-body">
        <p class="poem-content">{{ content }}</p>
      </div>
      
      <!-- 底部操作栏 -->
      <div class="card-footer">
        <div class="actions">
          <button 
            class="action-btn collect-btn"
            :class="{ 'collected': isCollected }"
            @click.stop="collect"
          >
            <el-icon :size="18"><Star /></el-icon>
            <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
          </button>
          
          <button class="action-btn play-btn" @click.stop>
            <el-icon :size="18"><VideoPlay /></el-icon>
            <span>朗读</span>
          </button>
        </div>
        
        <div class="view-more">
          <span>查看详情</span>
          <el-icon class="arrow-icon" :class="{ 'hovering': isHovering }">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>
    
    <!-- 悬浮边框效果 -->
    <div class="hover-border"></div>
  </div>
</template>

<style scoped lang="scss">
.poetry-modern-card {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
    
    .gradient-overlay {
      opacity: 1;
    }
    
    .hover-border {
      opacity: 1;
    }
    
    .poem-title {
      color: #667eea;
    }
  }
  
  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }
  }
  
  .card-content {
    position: relative;
    padding: 24px;
    z-index: 1;
  }
  
  .card-header {
    margin-bottom: 16px;
    
    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      .poem-title {
        font-size: 24px;
        font-weight: 700;
        color: #2C3E50;
        margin: 0;
        transition: color 0.3s ease;
        font-family: 'STKaiti', '楷体', serif;
      }
      
      .type-badge {
        display: inline-block;
        padding: 4px 12px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        color: #667eea;
        font-size: 12px;
        font-weight: 600;
        border-radius: 12px;
      }
    }
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .author-name {
        font-size: 15px;
        color: #7F8C8D;
        font-weight: 500;
      }
      
      .dynasty-tag {
        display: inline-block;
        padding: 2px 8px;
        background: #F8F9FA;
        color: #7F8C8D;
        font-size: 12px;
        border-radius: 8px;
      }
    }
  }
  
  .card-body {
    margin-bottom: 16px;
    
    .poem-content {
      font-size: 16px;
      line-height: 1.8;
      color: #34495E;
      margin: 0;
      font-family: 'STKaiti', '楷体', serif;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid #ECF0F1;
    
    .actions {
      display: flex;
      gap: 8px;
      
      .action-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #F8F9FA;
        border: none;
        border-radius: 10px;
        font-size: 13px;
        color: #7F8C8D;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #ECF0F1;
          transform: translateY(-2px);
        }
        
        &.collect-btn.collected {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
          color: #FFA726;
          
          .el-icon {
            color: #FFC107;
          }
        }
        
        &.play-btn:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
        }
      }
    }
    
    .view-more {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #667eea;
      font-weight: 500;
      
      .arrow-icon {
        transition: transform 0.3s ease;
        
        &.hovering {
          transform: translateX(4px);
        }
      }
    }
  }
  
  .hover-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 2px;
  }
}

// 响应式
@media (max-width: 768px) {
  .poetry-modern-card {
    .card-content {
      padding: 16px;
    }
    
    .card-header {
      .title-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        
        .poem-title {
          font-size: 20px;
        }
      }
    }
    
    .card-footer {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
      
      .actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
}
</style>