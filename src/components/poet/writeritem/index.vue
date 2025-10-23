<script setup>
import { defineProps, ref } from 'vue'
import { Star, User, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  name: String,
  content: String,
  dynasty: String,
  id: [String, Number],
  item: Object
})
console.log(props.item)

const isCollected = ref(false)
const isHovering = ref(false)

const collect = async (event) => {
  event.stopPropagation()
  try {
    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '已收藏' : '取消收藏')
  } catch (error) {
    console.error('收藏失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 获取朝代颜色
const getDynastyColor = () => {
  const colorMap = {
    '唐': '#667eea',
    '宋': '#f093fb',
    '元': '#4facfe',
    '明': '#43e97b',
    '清': '#fa709a'
  }
  return colorMap[props.dynasty] || '#667eea'
}
</script>

<template>
  <div 
    class="writer-modern-card"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- 卡片装饰背景 -->
    <div class="card-decoration">
      <div class="decoration-circle" :style="{ background: getDynastyColor() }"></div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 头像区域 -->
      <div class="writer-avatar">
        <div 
          class="avatar-circle" 
          :style="{ 
            backgroundImage: item?.headImageUrl ? `url(${item.headImageUrl})` : 'none',
            background: item?.headImageUrl ? `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%), url(${item.headImageUrl})` : `linear-gradient(135deg, ${getDynastyColor()} 0%, ${getDynastyColor()}cc 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        >
          <el-icon v-if="!item?.headImageUrl" class="avatar-icon" :size="32"><User /></el-icon>
        </div>
        <div 
          class="dynasty-badge"
          :style="{ background: getDynastyColor() }"
        >
          {{ dynasty }}
        </div>
      </div>
      
      <!-- 诗人信息 -->
      <div class="writer-info">
        <h3 class="writer-name">{{ name }}</h3>
        <p class="writer-intro">{{ content }}</p>
      </div>
      
      <!-- 底部操作栏 -->
      <div class="card-footer">
        <button 
          class="collect-btn"
          :class="{ 'collected': isCollected }"
          @click.stop="collect"
        >
          <el-icon :size="18"><Star /></el-icon>
          <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
        </button>
        
        <div class="view-more">
          <span>查看详情</span>
          <el-icon class="arrow-icon" :class="{ 'hovering': isHovering }">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.writer-modern-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 50px rgba(102, 126, 234, 0.25);
    
    .decoration-circle {
      transform: scale(1.3);
      opacity: 0.15;
    }
    
    .avatar-circle {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
      
      .avatar-icon {
        transform: rotate(360deg) scale(1.1);
      }
    }
  }
  
  .card-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    
    .decoration-circle {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      top: -50px;
      right: -50px;
      opacity: 0.08;
      transition: all 0.4s ease;
    }
  }
  
  .card-content {
    position: relative;
    z-index: 1;
    padding: 24px;
    
    .writer-avatar {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 20px;
      
      .avatar-circle {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        
        .avatar-icon {
          color: white;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      
      .dynasty-badge {
        padding: 6px 16px;
        border-radius: 20px;
        color: white;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-top: 8px;
      }
    }
    
    .writer-info {
      margin-bottom: 20px;
      
      .writer-name {
        font-size: 24px;
        font-weight: 700;
        color: #2C3E50;
        margin: 0 0 12px 0;
        font-family: 'STKaiti', '楷体', serif;
      }
      
      .writer-intro {
        font-size: 15px;
        line-height: 1.8;
        color: #7F8C8D;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 60px;
      }
    }
    
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #ECF0F1;
      
      .collect-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 20px;
        background: #F8F9FA;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        color: #7F8C8D;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #ECF0F1;
          transform: translateY(-2px);
        }
        
        &.collected {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
          color: #FFA726;
          
          .el-icon {
            color: #FFC107;
          }
        }
      }
      
      .view-more {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
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
  }
}

// 响应式
@media (max-width: 768px) {
  .writer-modern-card {
    .card-content {
      padding: 20px;
      
      .writer-avatar {
        .avatar-circle {
          width: 60px;
          height: 60px;
          
          .avatar-icon {
            font-size: 28px;
          }
        }
      }
      
      .writer-info {
        .writer-name {
          font-size: 20px;
        }
        
        .writer-intro {
          font-size: 14px;
          min-height: auto;
        }
      }
    }
  }
}
</style>