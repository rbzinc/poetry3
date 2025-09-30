<script setup>
import { defineProps, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  title: String,
  content: String,
})

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 判断内容是否需要展开按钮
const needExpand = () => {
  if (!props.content) return false
  const plainText = props.content.replace(/<[^>]+>/g, '')
  return plainText.length > 200
}
</script>

<template>
  <div class="modern-writer-content">
    <div class="content-card">
      <h3 class="content-title" v-if="title" v-html="title"></h3>
      
      <div 
        class="content-body"
        :class="{ 'collapsed': !isExpanded && needExpand() }"
      >
        <div class="content-text" v-html="content"></div>
      </div>
      
      <button 
        v-if="needExpand()"
        class="expand-btn"
        @click="toggleExpand"
      >
        <span>{{ isExpanded ? '收起' : '展开全文' }}</span>
        <el-icon class="expand-icon" :class="{ 'rotated': isExpanded }">
          <ArrowDown />
        </el-icon>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modern-writer-content {
  width: 100%;
  
  .content-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .content-title {
      font-size: 22px;
      font-weight: 600;
      color: #2C3E50;
      margin: 0 0 20px 0;
      padding-bottom: 16px;
      border-bottom: 2px solid #ECF0F1;
      
      :deep(strong) {
        color: #667eea;
      }
    }
    
    .content-body {
      transition: max-height 0.4s ease;
      
      &.collapsed {
        max-height: 250px;
        overflow: hidden;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to bottom, transparent, white);
          pointer-events: none;
        }
      }
      
      .content-text {
        font-size: 16px;
        line-height: 2;
        color: #34495e;
        
        :deep(p) {
          margin: 0 0 16px 0;
          text-indent: 2em;
        }
        
        :deep(strong) {
          color: #667eea;
          font-weight: 600;
        }
        
        :deep(em) {
          color: #7F8C8D;
          font-style: italic;
        }
      }
    }
    
    .expand-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      margin-top: 20px;
      padding: 12px;
      background: #F8F9FA;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      color: #7F8C8D;
      cursor: pointer;
      transition: all 0.3s ease;
      
      .expand-icon {
        transition: transform 0.3s ease;
        
        &.rotated {
          transform: rotate(180deg);
        }
      }
      
      &:hover {
        background: #ECF0F1;
        color: #667eea;
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .modern-writer-content {
    .content-card {
      padding: 24px 20px;
      
      .content-title {
        font-size: 18px;
      }
      
      .content-body {
        .content-text {
          font-size: 15px;
        }
      }
    }
  }
}
</style>