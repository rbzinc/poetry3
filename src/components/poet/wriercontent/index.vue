<script setup>
import { defineProps, ref, computed } from 'vue'
import { ArrowDown, DocumentCopy } from '@element-plus/icons-vue'

const props = defineProps({
  title: String,
  content: String,
  index: Number,
  themeColor: {
    type: String,
    default: '#667eea'
  }
})

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 判断内容是否需要展开按钮
const needExpand = computed(() => {
  if (!props.content) return false
  const plainText = props.content.replace(/<[^>]+>/g, '')
  return plainText.length > 200
})

// 获取序号样式
const getIndexStyle = computed(() => {
  const colors = [
    '#667eea',
    '#f093fb',
    '#4facfe',
    '#43e97b',
    '#fa709a',
    '#30cfd0'
  ]
  const color = props.themeColor || colors[props.index % colors.length]
  return {
    background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
    color: color,
    borderColor: color
  }
})
</script>

<template>
  <div class="enhanced-writer-content">
    <div class="content-card">
      <!-- 序号装饰 -->
      <div class="card-index" :style="getIndexStyle" v-if="typeof index === 'number'">
        <span class="index-number">{{ String(index + 1).padStart(2, '0') }}</span>
      </div>

      <!-- 顶部装饰条 -->
      <div class="card-decoration" :style="{ background: themeColor }"></div>
      
      <!-- 标题区域 -->
      <div class="content-header" v-if="title">
        <div class="header-icon" :style="{ background: `${themeColor}15`, color: themeColor }">
          <el-icon :size="20"><DocumentCopy /></el-icon>
        </div>
        <h3 class="content-title" v-html="title"></h3>
      </div>
      
      <!-- 内容主体 -->
      <div 
        class="content-body"
        :class="{ 'collapsed': !isExpanded && needExpand }"
      >
        <div class="content-text" v-html="content"></div>
        <div class="fade-overlay" v-if="!isExpanded && needExpand"></div>
      </div>
      
      <!-- 展开/收起按钮 -->
      <button 
        v-if="needExpand"
        class="expand-btn"
        :style="{ 
          background: !isExpanded ? `${themeColor}10` : '#F8F9FA',
          color: !isExpanded ? themeColor : '#7F8C8D'
        }"
        @click="toggleExpand"
      >
        <span>{{ isExpanded ? '收起内容' : '展开阅读' }}</span>
        <el-icon class="expand-icon" :class="{ 'rotated': isExpanded }">
          <ArrowDown />
        </el-icon>
      </button>

      <!-- 底部装饰元素 -->
      <div class="card-footer-decoration">
        <span class="dot" :style="{ background: themeColor }"></span>
        <span class="dot" :style="{ background: themeColor }"></span>
        <span class="dot" :style="{ background: themeColor }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.enhanced-writer-content {
  width: 100%;
  
  .content-card {
    position: relative;
    background: white;
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 50px rgba(0, 0, 0, 0.12);
    }

    // 序号装饰
    .card-index {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 50px;
      height: 50px;
      border-radius: 14px;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      transition: all 0.3s ease;
      
      .index-number {
        transform: translateY(1px);
      }
    }

    &:hover .card-index {
      transform: rotate(10deg) scale(1.1);
    }
    
    // 顶部装饰条
    .card-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.6s ease;
    }

    &:hover .card-decoration {
      transform: scaleX(1);
    }
    
    // 标题区域
    .content-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #F0F2F5;
      
      .header-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .content-title {
        flex: 1;
        font-size: 22px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0;
        line-height: 1.4;
        
        :deep(strong) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    
    // 内容主体
    .content-body {
      position: relative;
      transition: all 0.4s ease;
      
      &.collapsed {
        max-height: 280px;
        overflow: hidden;
      }
      
      .content-text {
        font-size: 16px;
        line-height: 2.2;
        color: #34495e;
        
        :deep(p) {
          margin: 0 0 20px 0;
          text-indent: 2em;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        :deep(strong) {
          color: #667eea;
          font-weight: 600;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        :deep(em) {
          color: #7F8C8D;
          font-style: italic;
        }

        :deep(br) {
          display: block;
          content: '';
          margin-top: 8px;
        }
      }

      .fade-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: linear-gradient(to bottom, transparent 0%, white 70%, white 100%);
        pointer-events: none;
      }
    }
    
    // 展开按钮
    .expand-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      margin-top: 24px;
      padding: 14px 24px;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      .expand-icon {
        transition: transform 0.3s ease;
        font-size: 16px;
        
        &.rotated {
          transform: rotate(180deg);
        }
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }

    // 底部装饰
    .card-footer-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #F0F2F5;
      
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        opacity: 0.3;
        transition: all 0.3s ease;
      }
    }

    &:hover .card-footer-decoration .dot {
      opacity: 0.6;
      animation: pulse-dot 1.5s ease-in-out infinite;

      @for $i from 1 through 3 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.2}s;
        }
      }
    }
  }
}

// 动画
@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

// 响应式
@media (max-width: 768px) {
  .enhanced-writer-content {
    .content-card {
      padding: 28px 20px;
      
      .card-index {
        top: 16px;
        right: 16px;
        width: 42px;
        height: 42px;
        font-size: 16px;
      }
      
      .content-header {
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        
        .header-icon {
          width: 38px;
          height: 38px;
        }
        
        .content-title {
          font-size: 18px;
        }
      }
      
      .content-body {
        &.collapsed {
          max-height: 240px;
        }
        
        .content-text {
          font-size: 15px;
          line-height: 2;
        }
      }
      
      .expand-btn {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
  }
}
</style>