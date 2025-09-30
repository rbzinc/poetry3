<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { userSearchStore } from '@/stores/modules/search.js'
import { goPoetClass } from '@/router/helpers.js'
import { getPoetSearch, getSenSearch, getWriterSearch } from '@/api/index.js'
import { ElMessage } from 'element-plus'

const userSearch = userSearchStore()
const input = ref('')
const route = useRoute()
const searching = ref(false)

// 不同类型的热门搜索词配置
const hotSearchConfig = {
  class: [
    { text: '静夜思', label: '诗词' },
    { text: '李白', label: '作者' },
    { text: '春晓', label: '诗词' },
    { text: '唐诗', label: '朝代' },
    { text: '水调歌头', label: '诗词' }
  ],
  writer: [
    { text: '李白', label: '诗仙' },
    { text: '杜甫', label: '诗圣' },
    { text: '苏轼', label: '宋代' },
    { text: '白居易', label: '唐代' },
    { text: '辛弃疾', label: '宋代' }
  ],
  sentence: [
    { text: '床前明月光', label: '静夜思' },
    { text: '春眠不觉晓', label: '春晓' },
    { text: '举头望明月', label: '思乡' },
    { text: '人生自古谁无死', label: '爱国' },
    { text: '天生我材必有用', label: '励志' }
  ]
}

/**
 * 执行搜索
 */
const handleSearch = async () => {
  if (!input.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  searching.value = true
  
  try {
    // 根据当前路由决定搜索行为
    if (route.path.search('/poet/class') === 0) {
      const res = await getPoetSearch(input.value, 1, 10)
      if (res.data && res.data.total > 0) {
        userSearch.updateSearchResults({
          list: res.data.records,
          total: res.data.total,
        })
        ElMessage.success(`找到 ${res.data.total} 条相关诗词`)
      } else {
        userSearch.updateSearchResults({ list: [], total: 0 })
        ElMessage.info('未搜索到相关诗词')
      }
    } else if (route.path.search('/poet/writer') === 0) {
      const res = await getWriterSearch(input.value)
      if (res.data && res.data.length > 0) {
        userSearch.updateWriterResults(res.data)
        ElMessage.success(`找到 ${res.data.length} 位相关诗人`)
      } else {
        userSearch.updateWriterResults([])
        ElMessage.info('未搜索到相关诗人')
      }
    } else if (route.path.search('/poet/sentence') === 0) {
      const res = await getSenSearch(input.value, 1, 10)
      if (res.data && res.data.total > 0) {
        userSearch.updateSentenceResults({
          list: res.data.records,
          total: res.data.total,
        })
        ElMessage.success(`找到 ${res.data.total} 条相关名句`)
      } else {
        userSearch.updateSentenceResults({ list: [], total: 0 })
        ElMessage.info('未搜索到相关名句')
      }
    } else {
      goPoetClass()
      ElMessage.info('已跳转到诗词分类，请重新搜索')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    searching.value = false
  }
}

// 根据当前路由计算placeholder文本
const placeholder = computed(() => {
  if (route.path.search('/poet/class') === 0) {
    return '搜索诗词名称、作者、朝代...'
  } else if (route.path.search('/poet/writer') === 0) {
    return '搜索诗人名字或朝代...'
  } else if (route.path.search('/poet/sentence') === 0) {
    return '搜索名句内容、作者...'
  }
  return '请输入搜索关键词...'
})

// 根据当前路由获取热门搜索词
const hotSearchWords = computed(() => {
  if (route.path.search('/poet/class') === 0) {
    return hotSearchConfig.class
  } else if (route.path.search('/poet/writer') === 0) {
    return hotSearchConfig.writer
  } else if (route.path.search('/poet/sentence') === 0) {
    return hotSearchConfig.sentence
  }
  return hotSearchConfig.class
})

// 点击热门搜索词
const handleHotSearch = (word) => {
  input.value = word
  handleSearch()
}

const handleClear = () => {
  input.value = ''
  userSearch.clearUserInput()
}

watch(
  () => input.value,
  (newVal) => {
    userSearch.userInput = newVal
  }
)
</script>

<template>
  <div class="modern-search-container">
    <div class="search-wrapper">
      <el-input
        v-model="input"
        class="search-input"
        :placeholder="placeholder"
        @keyup.enter="handleSearch"
        clearable
        @clear="handleClear"
        size="large"
      >
        <template #prefix>
          <el-icon class="search-icon" :size="20">
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button 
        class="search-button"
        type="primary"
        size="large"
        @click="handleSearch"
        :loading="searching"
      >
        <el-icon v-if="!searching"><Search /></el-icon>
        <span>{{ searching ? '搜索中...' : '搜索' }}</span>
      </el-button>
    </div>
    
    <!-- 搜索提示 -->
    <div class="search-tips">
      <span class="tip-label">热门搜索：</span>
      <div class="tip-tags">
        <span 
          v-for="(item, index) in hotSearchWords" 
          :key="index"
          class="tip-tag" 
          @click="handleHotSearch(item.text)"
        >
          <span class="tag-text">{{ item.text }}</span>
          <span class="tag-label">{{ item.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modern-search-container {
  width: 100%;
  
  .search-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
    
    .search-input {
      flex: 1;
      
      :deep(.el-input__wrapper) {
        background: #F8F9FA;
        border: 2px solid transparent;
        border-radius: 12px;
        padding: 12px 20px;
        box-shadow: none;
        transition: all 0.3s ease;
        
        &:hover {
          background: white;
          border-color: #E8F4FD;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        
        &.is-focus {
          background: white;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      }
      
      :deep(.el-input__inner) {
        font-size: 15px;
        color: #2C3E50;
        
        &::placeholder {
          color: #BDC3C7;
        }
      }
      
      .search-icon {
        color: #7F8C8D;
        transition: color 0.3s ease;
      }
      
      &:hover .search-icon,
      &.is-focus .search-icon {
        color: #667eea;
      }
    }
    
    .search-button {
      min-width: 120px;
      height: 48px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  .search-tips {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    
    .tip-label {
      font-size: 13px;
      color: #7F8C8D;
      font-weight: 500;
    }
    
    .tip-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .tip-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #F8F9FA;
        font-size: 13px;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid transparent;
        
        .tag-text {
          color: #2C3E50;
          font-weight: 500;
        }
        
        .tag-label {
          font-size: 11px;
          color: #BDC3C7;
          padding: 2px 8px;
          background: white;
          border-radius: 8px;
        }
        
        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-color: #667eea;
          transform: translateY(-2px);
          
          .tag-text {
            color: #667eea;
          }
          
          .tag-label {
            background: #667eea;
            color: white;
          }
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .modern-search-container {
    .search-wrapper {
      flex-direction: column;
      
      .search-button {
        width: 100%;
      }
    }
    
    .search-tips {
      .tip-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
  }
}
</style>