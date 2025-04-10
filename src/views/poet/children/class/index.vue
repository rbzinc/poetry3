<script setup>
import { ref, onMounted, watch } from 'vue'
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
  <div class="content-container">
    <div v-if="isSearchMode" class="search-status">
      <p>搜索"{{ userSearch.userInput }}"的结果，共 {{ pageTotal }} 条</p>
      <el-button @click="clearSearch">清除搜索</el-button>
    </div>
    <div class="filter-box">
      <div v-for="(config, type) in FILTER_CONFIG" :key="type" class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ config.title }}:</span>
          <div class="filter-options" :class="{ expanded: openStates[type] }">
            <button
              v-for="option in config.options"
              :key="option"
              class="option-btn"
              :class="{ active: currentName === option }"
              @click="fetchData(type, option)"
            >
              {{ option }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleSection(type)">
            <img
              :class="{ 'rotate-180': openStates[type] }"
              src="https://ziyuan.guwendao.net/siteimg/jianBtn.png"
              alt="toggle"
              width="13"
              height="13"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="content-list" v-loading="loading">
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
      <div v-else class="empty-state">暂无数据</div>
    </div>

    <el-pagination
      v-if="pageTotal > 0"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="pageTotal"
      background
      layout="prev, pager, next"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  .filter-box {
    background: #f3f2f2;
    border-radius: 8px;
    padding: 0 10px;
    margin-bottom: 20px;

    .filter-section {
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 0;

      &:last-child {
        border-bottom: none;
      }

      .filter-row {
        display: flex;
        align-items: center;

        .filter-title {
          width: 60px;
          font-size: 16px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          height: 40px;
          overflow: hidden;
          transition: height 0.3s ease;

          &.expanded {
            height: auto;
          }
        }

        .toggle-btn {
          width: 40px;
          height: 40px;
          border: none;
          cursor: pointer;
          background: none;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          img {
            transition: transform 0.3s ease;

            &.rotate-180 {
              transform: scaleY(-1);
            }
          }
        }
      }
    }
  }

  .content-list {
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  }

  .option-btn {
    height: 40px;
    padding: 0 15px;
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
      color: #409eff;
    }

    &.active {
      color: #409eff;
      font-weight: bold;
    }
  }

  // 分页器样式
  :deep(.el-pagination) {
    margin-top: 30px;
    justify-content: center;

    .btn-prev,
    .btn-next {
      background-color: #fff;
      border: 1px solid #e0e0e0;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      margin: 0 4px;
      border-radius: 4px;

      &:hover:not(.is-disabled) {
        color: #409eff;
        border-color: #409eff;
      }

      &.is-disabled {
        color: #c0c4cc;
        background-color: #f4f4f5;
        border-color: #e0e0e0;
        cursor: not-allowed;
      }
    }

    .el-pager {
      li {
        background-color: #fff;
        border: 1px solid #e0e0e0;
        height: 32px;
        min-width: 32px;
        line-height: 32px;
        padding: 0 6px;
        margin: 0 4px;
        border-radius: 4px;
        font-weight: normal;
        color: #606266;

        &:hover:not(.is-active) {
          color: #409eff;
          border-color: #409eff;
        }

        &.is-active {
          background-color: #409eff;
          color: #fff !important;
          border-color: #409eff;
          position: relative;
          z-index: 1;
        }
      }
    }
  }
}
.pagination {
  margin-bottom: 20px;
}
.search-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 20px;

  p {
    margin: 0;
    color: #409eff;
  }
}
</style>
