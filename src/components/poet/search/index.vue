<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userSearchStore } from '@/stores/modules/search.js'
import { Search as SearchIcon } from '@element-plus/icons-vue'

const userSearch = userSearchStore()
const input = ref('')
const router = useRouter()

const handleSearch = () => {
  if (input.value.trim()) {
    userSearch.userInput = input.value
    //TODO搜索不会跳转到新的页面，而是改变poem页面的内容就行
    router.push('/poetsearch')
  }
}

const handleClear = () => {
  input.value = ''
}
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
          <el-icon class="search-icon"><SearchIcon /></el-icon>
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
