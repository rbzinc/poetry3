<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { userSearchStore } from '@/stores/modules/search.js'
import { goPoetClass } from '@/router/helpers.js'
import { getPoetSearch, getSenSearch, getWriterSearch } from '@/api/index.js'
import { ElMessage } from 'element-plus'
const userSearch = userSearchStore()
const input = ref('')
const route = useRoute()
/**
 * 执行搜索
 */
 const handleSearch = async () => {
  if (!input.value.trim()) return
  // 根据当前路由决定搜索行为
  if (route.path.search('/poet/class') === 0) {
    const res = await getPoetSearch(input.value, 1, 10)
    console.log(res.data)
    // 新增：检查搜索结果数量
    if (res.data && res.data.total > 0) {
      userSearch.updateSearchResults({
        list: res.data.records,
        total: res.data.total,
      })
    } else {
      // 新增：如果 total 为 0 或数据不存在，清空旧结果并提示用户
      userSearch.updateSearchResults({ list: [], total: 0 })
      ElMessage('未搜索到相关诗词')
    }

    // 搜索古诗词 - 直接在当前页面执行搜索
  } else if (route.path.search('/poet/writer') === 0) {
    // 搜索诗人 - 这里可以实现诗人搜索逻辑
    const res = await getWriterSearch(input.value)
    // 新增：检查搜索结果是否为空数组
    if (res.data) {
      userSearch.updateWriterResults(res.data)
    } else {
      userSearch.updateWriterResults([])
      ElMessage('未搜索到相关诗人')
    }
  } else if (route.path.search('/poet/sentence') === 0) {
    // 搜索句子 - 这里可以实现句子搜索逻辑
    const res = await getSenSearch(input.value, 1, 10)
    // 新增：检查搜索结果数量
    if (res.data && res.data.total > 0) {
      userSearch.updateSentenceResults({
        list: res.data.records,
        total: res.data.total,
      })
    } else {
      // 新增：如果 total 为 0 或数据不存在，清空旧结果并提示用户
      userSearch.updateSentenceResults({ list: [], total: 0 })
      ElMessage('未搜索到相关句子')
    }
  } else {
    // 如果不在特定搜索页，默认跳转到诗词分类页并尝试搜索
    // 可以在这里添加一个默认行为或提示，或者保持跳转
    goPoetClass()
    // 可以在跳转后触发一次搜索，但这取决于 goPoetClass 是否会清空输入或 userSearch 状态
    // 或者提示用户已跳转到诗词分类页
    ElMessage('已跳转到诗词分类，请重新搜索')
  }
}

// 根据当前路由计算placeholder文本
const placeholder = computed(() => {
  if (route.path.search('/poet/class') === 0) {
    return '请输入诗词名、作者...'
  } else if (route.path.search('/poet/writer') === 0) {
    return '请输入诗人名字或朝代...'
  } else if (route.path.search('/poet/sentence') === 0) {
    return '请输入诗词名、作者...'
  }
  return '请输入搜索关键词...'
})

const handleClear = () => {
  input.value = ''
  userSearch.clearUserInput()
}

watch(
  () => input.value,
  (newVal) => {
    userSearch.userInput = newVal
  },
)
</script>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <el-input
        v-model="input"
        class="search-input"
        :placeholder="placeholder"
        @keyup.enter="handleSearch"
        clearable
        @clear="handleClear"
      >
        <template #prefix>
          <el-icon class="search-icon">
            <Search />
          </el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  width: 100%;
  padding: 15px 0;
  justify-content: center;

  .search-wrapper {
    width: 100%;
    max-width: 950px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 15px 20px;

    .search-input {
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        padding-left: 10px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;

        &:hover,
        &:focus {
          box-shadow: 0 0 0 1px #909399 inset;
        }
      }

      :deep(.el-input__inner) {
        font-size: 16px;
        height: 42px;
      }

      :deep(.el-input-group__append) {
        background-color: #666;
        border-color: #666;
        color: white;
        padding: 0 15px;

        .el-button {
          color: white;
          border: none;
          background: transparent;
          font-size: 16px;

          &:hover {
            color: #f0f0f0;
          }
        }
      }

      .search-icon {
        color: #909399;
        font-size: 18px;
      }
    }
  }
}
</style>
