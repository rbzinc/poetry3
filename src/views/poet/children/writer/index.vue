<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Close, ArrowDown, Document } from '@element-plus/icons-vue'
import Writeritem from '@/components/poet/writeritem/index.vue'
import { usePoetDataStore } from '@/stores/modules/poetData.js'
import { getPoetRandomData, getWriterData } from '@/api/modules/poePavilion.js'
import { goPoetWriterDetail } from '@/router/helpers.js'
import { userSearchStore } from '@/stores/index.js'

const poetDataStore = usePoetDataStore()
const DYNASTY_CONFIG = poetDataStore.getDynastyConfig
const userSearch = userSearchStore()

/**
 * 定义数据
 */
const isOpen = ref(false)
const randomList = ref([])
const currentDynasty = ref('')
const pageNum = ref(1)
const pageSize = ref(12)
const pageTotal = ref(0)
const loading = ref(false)
const isSearchMode = ref(false)

// 获取随机数据
const getRandom = async () => {
  loading.value = true
  const res = await getPoetRandomData(pageNum.value, pageSize.value)
  randomList.value = res.data.records
  pageTotal.value = res.data.total
  loading.value = false
}

// 获取朝代数据
const fetchData = async (dynastyName, page) => {
  pageNum.value = page
  try {
    loading.value = true
    currentDynasty.value = dynastyName
    const res = await getWriterData(dynastyName, page)
    randomList.value = res.data.records
    pageTotal.value = res.data.total
  } catch (error) {
    console.error('获取朝代数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换展开/收起
const toggleSection = () => {
  isOpen.value = !isOpen.value
}

// 分页处理
const handlePageChange = (page) => {
  if (!currentDynasty.value) {
    getRandom()
  } else {
    fetchData(currentDynasty.value, page)
  }
  pageNum.value = page
}

// 清除搜索
const clearSearch = () => {
  isSearchMode.value = false
  userSearch.clearSearch()
  getRandom()
}

// 监听搜索结果
watch(
  () => userSearch.searchResults,
  (newResults) => {
    if (newResults && newResults.length > 0) {
      randomList.value = newResults
      pageTotal.value = userSearch.total
      pageNum.value = 1
      isSearchMode.value = true
    }
  }
)

onMounted(getRandom)
</script>

<template>
  <div class="modern-writer-container">
    <!-- 搜索状态提示 -->
    <div v-if="isSearchMode" class="search-status-banner">
      <div class="status-content">
        <el-icon class="status-icon" :size="20"><Search /></el-icon>
        <span class="status-text">搜索 "<strong>{{ userSearch.userInput }}</strong>" 的结果，共找到 <strong>{{ pageTotal }}</strong> 位诗人</span>
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
          <span class="filter-icon">🏛️</span>
          <span class="filter-title">{{ DYNASTY_CONFIG.title }}</span>
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
          v-for="option in DYNASTY_CONFIG.options"
          :key="option"
          class="filter-tag"
          :class="{ active: currentDynasty === option }"
          @click="fetchData(option, 1)"
        >
          {{ option }}
        </div>
      </div>
    </div>

    <!-- 诗人网格列表 -->
    <div class="writer-grid" v-loading="loading">
      <template v-if="randomList.length">
        <Writeritem
          v-for="item in randomList"
          :key="item?.id"
          :name="item.name"
          :content="item.simpleIntro"
          :dynasty="item.dynasty"
          :id="item.id"
          @click="goPoetWriterDetail(item.id)"
        />
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
.modern-writer-container {
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
  
  // 诗人网格布局
  .writer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    min-height: 300px;
    
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
  .modern-writer-container {
    .search-status-banner {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    .modern-filter-box {
      padding: 16px;
    }
    
    .writer-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>