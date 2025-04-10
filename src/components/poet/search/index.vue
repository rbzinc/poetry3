<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { userSearchStore } from '@/stores/modules/search.js'
import { goPoetClass } from '@/router/helpers.js'

const userSearch = userSearchStore()
const input = ref('')
const route = useRoute()
/**
 * 执行搜索
 */
const handleSearch = () => {
  if (!input.value.trim()) return
  userSearch.userInput = input.value
  // 根据当前路由决定搜索行为
  if (route.path.search('/poet/class') === 0) {
    // 搜索古诗词 - 直接在当前页面执行搜索
  } else if (route.path.search('/poet/writer') === 0) {
    // 搜索诗人 - 这里可以实现诗人搜索逻辑
    console.log('搜索诗人')
  } else if (route.path.search('/poet/sentence') === 0) {
    // 搜索句子 - 这里可以实现句子搜索逻辑
    console.log('搜索句子')
  } else {
    // 如果不在诗词页面，跳转到诗词页面并执行搜索
    goPoetClass()
    // 路由跳转后执行搜索
    setTimeout(() => {
      userSearch.performSearch(input.value)
    }, 100)
  }
}

const handleClear = () => {
  input.value = ''
  userSearch.userInput = ''
  userSearch.clearSearch()
}

watch(
  () => userSearch.userInput,
  (newVal) => {
    input.value = newVal
  },
)
</script>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <el-input
        v-model="input"
        class="search-input"
        placeholder="请输入诗词名、作者或内容关键词..."
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
