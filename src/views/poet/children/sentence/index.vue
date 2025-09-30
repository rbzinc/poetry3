<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Close, ArrowDown, Document, Star, Share } from '@element-plus/icons-vue'
import { usePoetDataStore } from '@/stores/modules/poetData.js'
import { getsenRandomData, getSentenceCount, getSentenceData } from '@/api/modules/poePavilion.js'
import { userSearchStore } from '@/stores/index.js'
import { getSenSearch } from '@/api/index.js'
import { ElMessage } from 'element-plus'

const poetDataStore = usePoetDataStore()
const POET_CONFIG = poetDataStore.getPoetConfig
const userSearch = userSearchStore()

/**
 * 定义数据
 */
const isOpen = ref(false)
const currentPoet = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const pageTotal = ref(0)
const loading = ref(false)
const sentenceList = ref([])
const isSearchMode = ref(false)

// 数据获取方法
const fetchData = async (poetName, page = 1) => {
  try {
    pageNum.value = page
    loading.value = true
    currentPoet.value = poetName
    const res = await getSentenceData(poetName, page)
    sentenceList.value = res.data.records
    pageTotal.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 分页处理
const handlePageChange = async (page) => {
  if (isSearchMode.value) {
    try {
      loading.value = true
      const res = await getSenSearch(userSearch.userInput, page, pageSize.value)
      sentenceList.value = res.data.records
      pageTotal.value = res.data.total
      pageNum.value = page
    } catch (error) {
      console.error('搜索分页失败:', error)
    } finally {
      loading.value = false
    }
    return
  }

  if (currentPoet.value === '') {
    try {
      loading.value = true
      const res = await getsenRandomData(page, pageSize.value)
      sentenceList.value = res.data.records
      pageTotal.value = res.data.total
      pageNum.value = page
    } catch (error) {
      console.error('获取随机数据失败:', error)
    } finally {
      loading.value = false
    }
  } else {
    pageNum.value = page
    await fetchData(currentPoet.value, page)
  }
}

// 切换展开/收起
const toggleSection = () => {
  isOpen.value = !isOpen.value
}

const sentenceCount = async () => {
  const res = await getSentenceCount()
  pageTotal.value = res.data
}

// 清除搜索
const clearSearch = () => {
  isSearchMode.value = false
  userSearch.clearSearch()
  getInitialData()
}

// 获取初始数据
const getInitialData = async () => {
  try {
    loading.value = true
    const res = await getsenRandomData()
    sentenceList.value = res.data.records
    await sentenceCount()
  } catch (error) {
    console.error('获取随机数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 收藏名句
const collectSentence = (sentence, event) => {
  event.stopPropagation()
  ElMessage.success(`已收藏：${sentence.name}`)
}

// 分享名句
const shareSentence = (sentence, event) => {
  event.stopPropagation()
  ElMessage.success('分享功能开发中...')
}

// 监听搜索结果变化
watch(
  () => userSearch.searchResults,
  (newResults) => {
    if (newResults && newResults.length > 0) {
      sentenceList.value = newResults
      pageTotal.value = userSearch.total
      pageNum.value = 1
      isSearchMode.value = true
    }
  }
)

// 初始化数据
onMounted(getInitialData)
</script>

<template>
  <div class="modern-sentence-container">
    <!-- 搜索状态提示 -->
    <div v-if="isSearchMode" class="search-status-banner">
      <div class="status-content">
        <el-icon class="status-icon" :size="20"><Search /></el-icon>
        <span class="status-text">搜索 "<strong>{{ userSearch.userInput }}</strong>" 的结果，共找到 <strong>{{ pageTotal }}</strong> 条</span>
      </div>
      <el-button class="clear-btn" @click="clearSearch" size="small">
        <el-icon><Close /></el-icon>
        清除
      </el-button>
    </div>

    <!-- 筛选器 -->
    <div class="modern-filter-box">
      <div class="filter-header">
        <div class="filter-title-wrapper">
          <span class="filter-icon">✍️</span>
          <span class="filter-title">{{ POET_CONFIG.title }}</span>
        </div>
        <button class="expand-btn" @click="toggleSection">
          <span class="expand-text">{{ isOpen ? '收起' : '展开' }}</span>
          <el-icon class="expand-icon" :class="{ 'expanded': isOpen }">
            <ArrowDown />
          </el-icon>
        </button>
      </div>
      <div class="filter-options" :class="{ expanded: isOpen }">
        <div
          v-for="option in POET_CONFIG.options"
          :key="option"
          class="filter-tag"
          :class="{ active: currentPoet === option }"
          @click="fetchData(option)"
        >
          {{ option }}
        </div>
      </div>
    </div>

    <!-- 名句列表 -->
    <div class="sentence-grid" v-loading="loading">
      <template v-if="sentenceList.length">
        <div 
          v-for="item in sentenceList" 
          :key="item.id" 
          class="sentence-card"
        >
          <!-- 卡片背景装饰 -->
          <div class="card-decoration">
            <div class="quote-mark left">"</div>
            <div class="quote-mark right">"</div>
          </div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <p class="sentence-text">{{ item.name }}</p>
            <div class="sentence-source">
              <span class="source-label">出处：</span>
              <span class="source-name">{{ item.fromm }}</span>
            </div>
          </div>
          
          <!-- 卡片操作 -->
          <div class="card-actions">
            <button class="action-btn" @click="collectSentence(item, $event)">
              <el-icon :size="16"><Star /></el-icon>
              <span>收藏</span>
            </button>
            <button class="action-btn" @click="shareSentence(item, $event)">
              <el-icon :size="16"><Share /></el-icon>
              <span>分享</span>
            </button>
          </div>
        </div>
      </template>
      
      <!-- 空状态 -->
      <div v-else class="modern-empty-state">
        <el-icon class="empty-icon" :size="64"><Document /></el-icon>
        <p class="empty-text">暂无数据</p>
        <p class="empty-hint">试试调整筛选条件或搜索关键词</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="pageTotal > 0">
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
        class="modern-pagination"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-sentence-container {
  width: 100%;
  
  // 搜索状态提示
  .search-status-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-radius: 12px;
    margin-bottom: 24px;
    border-left: 4px solid #667eea;
    
    .status-content {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .status-icon {
        color: #667eea;
      }
      
      .status-text {
        font-size: 14px;
        color: #2C3E50;
        
        strong {
          color: #667eea;
          font-weight: 600;
        }
      }
    }
    
    .clear-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 8px;
    }
  }
  
  // 筛选器
  .modern-filter-box {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #ECF0F1;
    
    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .filter-title-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .filter-icon {
          font-size: 20px;
        }
        
        .filter-title {
          font-size: 16px;
          font-weight: 600;
          color: #2C3E50;
        }
      }
      
      .expand-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #F8F9FA;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .expand-text {
          font-size: 13px;
          color: #7F8C8D;
        }
        
        .expand-icon {
          color: #7F8C8D;
          transition: transform 0.3s ease;
          
          &.expanded {
            transform: rotate(180deg);
          }
        }
        
        &:hover {
          background: #ECF0F1;
        }
      }
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      max-height: 42px;
      overflow: hidden;
      transition: max-height 0.3s ease;
      
      &.expanded {
        max-height: 500px;
      }
      
      .filter-tag {
        padding: 8px 20px;
        background: #F8F9FA;
        border: 2px solid transparent;
        border-radius: 20px;
        font-size: 14px;
        color: #7F8C8D;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        
        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-color: rgba(102, 126, 234, 0.3);
          color: #667eea;
          transform: translateY(-2px);
        }
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }
    }
  }
  
  // 名句网格布局
  .sentence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    min-height: 300px;
    
    .sentence-card {
      position: relative;
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      
      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 16px 50px rgba(102, 126, 234, 0.25);
        
        .quote-mark {
          opacity: 0.15;
        }
        
        .card-actions {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .card-decoration {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        
        .quote-mark {
          position: absolute;
          font-size: 120px;
          font-family: Georgia, serif;
          color: #667eea;
          opacity: 0.06;
          font-weight: bold;
          transition: opacity 0.4s ease;
          
          &.left {
            top: -20px;
            left: 10px;
          }
          
          &.right {
            bottom: -60px;
            right: 10px;
            transform: rotate(180deg);
          }
        }
      }
      
      .card-content {
        position: relative;
        z-index: 1;
        margin-bottom: 16px;
        
        .sentence-text {
          font-size: 18px;
          line-height: 1.8;
          color: #2C3E50;
          margin: 0 0 16px 0;
          font-family: 'STKaiti', '楷体', serif;
          font-weight: 500;
          min-height: 60px;
        }
        
        .sentence-source {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #ECF0F1;
          
          .source-label {
            font-size: 13px;
            color: #7F8C8D;
          }
          
          .source-name {
            font-size: 14px;
            color: #667eea;
            font-weight: 500;
          }
        }
      }
      
      .card-actions {
        position: relative;
        z-index: 1;
        display: flex;
        gap: 8px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
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
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
            color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
          }
        }
      }
    }
    
    .modern-empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      
      .empty-icon {
        color: #BDC3C7;
        margin-bottom: 16px;
      }
      
      .empty-text {
        font-size: 18px;
        font-weight: 600;
        color: #7F8C8D;
        margin: 0 0 8px 0;
      }
      
      .empty-hint {
        font-size: 14px;
        color: #BDC3C7;
        margin: 0;
      }
    }
  }
  
  // 分页包装器
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #ECF0F1;
  }
}

// 响应式
@media (max-width: 768px) {
  .modern-sentence-container {
    .search-status-banner {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    .modern-filter-box {
      padding: 16px;
    }
    
    .sentence-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      
      .sentence-card {
        padding: 20px;
        
        .card-content {
          .sentence-text {
            font-size: 16px;
            min-height: auto;
          }
        }
        
        .card-actions {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}
</style>