<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Close, ArrowDown, Document } from '@element-plus/icons-vue'
import Poetryitem from '@/components/poet/poetryitem/index.vue'
import {
  getpoemRandomData,
  getDynastyData,
  getClassData,
  getWriterPoemData,
  getPoetryCount,
  getPoetryPoemPage,
  getPoetSearch,
} from '@/api/index.js'
import { usePoetDataStore } from '@/stores/modules/poetData.js'
import { goPoetClassDetail } from '@/router/helpers.js'
import { userSearchStore } from '@/stores/index.js'
const userSearch = userSearchStore()
const poetDataStore = usePoetDataStore()
const FILTER_CONFIG = poetDataStore.getAllConfig
//TODO首屏显示收藏
/**
 * 数据定义
 */
// 打开状态
const openStates = ref({
  dynasty: false, // 朝代
  class: false, // 分类
  poet: false, // 诗人
})
const currentType = ref('') // 当前选择的类型
const currentName = ref('') // 当前选择的名称
const pageNum = ref(1) // 当前页
const pageSize = ref(10) // 每页显示数量
const pageTotal = ref(0) // 总页数
const loading = ref(false) // 加载状态
const randomList = ref([]) // 随机列表
const isSearchMode = ref(false)

// 切换展开/收起
const toggleSection = (section) => {
  openStates.value[section] = !openStates.value[section]
}

// 获取筛选器图标
const getFilterIcon = (type) => {
  const icons = {
    dynasty: '🏛️',
    class: '📁',
    poet: '✍️'
  }
  return icons[type] || '📌'
}

/**
 * 将三个逻辑相同数据请求封装成函数
 */
const fetchData = async (type, name, page = 1, size = pageSize.value) => {
  try {
    loading.value = true
    currentType.value = type
    currentName.value = name
    const apiMap = {
      dynasty: getDynastyData,
      class: getClassData,
      poet: getWriterPoemData,
    }
    const res = await apiMap[type](name, page, size)
    randomList.value = res.data.records
    pageTotal.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 分页处理
 */
const handlePageChange = async (page) => {
  // 判断是否在搜索模式
  if (isSearchMode.value) {
    // 在搜索模式下，使用搜索的分页
    const res = await getPoetSearch(userSearch.userInput, page, pageSize.value)
    randomList.value = res.data.records
    pageTotal.value = res.data.total
    pageNum.value = page
    return
  }

  // 非搜索模式下的原有逻辑
  if (currentType.value === '' || currentName.value === '') {
    const res = await getPoetryPoemPage(page, pageSize.value)
    randomList.value = res.data.records
    pageTotal.value = res.data.total
    pageNum.value = page
  } else {
    pageNum.value = page
    await fetchData(currentType.value, currentName.value, page, pageSize.value)
  }
}

const getPoemCount = async () => {
  const res = await getPoetryCount()
  pageTotal.value = res.data
}

/**
 * 初始化数据
 */
onMounted(async () => {
  try {
    const res = await getpoemRandomData()
    randomList.value = res.data
  } catch (error) {
    console.error('获取随机数据失败:', error)
  }
  await getPoemCount()
})
watch(
  () => userSearch.searchResults,
  (newResults) => {
    if (newResults && newResults.length > 0) {
      randomList.value = newResults
      pageTotal.value = userSearch.total
      pageNum.value = 1 // 重置页码
      isSearchMode.value = true
    }
  },
)
const clearSearch = () => {
  isSearchMode.value = false
  userSearch.clearSearch()
  // 重新加载初始数据
  handlePageChange(1)
}
//TODO后面有一个需求，搜索之后页面中带有这个关键字的高亮显示，暂时不知道思路
</script>

<template>
  <div class="modern-content-container">
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

    <!-- 筛选器区域 -->
    <div class="modern-filter-box">
      <div v-for="(config, type) in FILTER_CONFIG" :key="type" class="modern-filter-section">
        <div class="filter-header">
          <div class="filter-title-wrapper">
            <span class="filter-icon">{{ getFilterIcon(type) }}</span>
            <span class="filter-title">{{ config.title }}</span>
          </div>
          <button class="expand-btn" @click="toggleSection(type)">
            <span class="expand-text">{{ openStates[type] ? '收起' : '展开' }}</span>
            <el-icon class="expand-icon" :class="{ 'expanded': openStates[type] }">
              <ArrowDown />
            </el-icon>
          </button>
        </div>
        <div class="filter-options" :class="{ expanded: openStates[type] }">
          <div
            v-for="option in config.options"
            :key="option"
            class="filter-tag"
            :class="{ active: currentName === option }"
            @click="fetchData(type, option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
    </div>

    <!-- 内容列表 -->
    <div class="modern-content-list" v-loading="loading">
      <template v-if="randomList.length">
        <Poetryitem
          v-for="item in randomList"
          :key="item?.id"
          v-bind="{
            ...item,
            id: String(item.id),
          }"
          @click="goPoetClassDetail(item.id)"
        />
      </template>
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
.modern-content-container {
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
  
  // 现代化筛选器
  .modern-filter-box {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #ECF0F1;
    
    .modern-filter-section {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
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
  }
  
  // 现代化内容列表
  .modern-content-list {
    min-height: 300px;
    
    .modern-empty-state {
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
  .modern-content-container {
    .search-status-banner {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    .modern-filter-box {
      padding: 16px;
    }
  }
}
</style>
