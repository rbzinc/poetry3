<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { userSearchStore } from '@/stores/modules/search.js'
import { goPoetClass } from '@/router/helpers.js'
import { getPoetSearch, getSenSearch, getWriterSearch } from '@/api/index.js'

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
    userSearch.updateSearchResults({
      list: res.data.records,
      total: res.data.total,
    })

    // 搜索古诗词 - 直接在当前页面执行搜索
  } else if (route.path.search('/poet/writer') === 0) {
    // 搜索诗人 - 这里可以实现诗人搜索逻辑
    const res = await getWriterSearch(input.value)
    userSearch.updateWriterResults(res.data)
  } else if (route.path.search('/poet/sentence') === 0) {
    // 搜索句子 - 这里可以实现句子搜索逻辑
    const res = await getSenSearch(input.value, 1, 10)
    userSearch.updateSentenceResults({
      list: res.data.records,
      total: res.data.total,
    })
  } else {
    goPoetClass()
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
