<script setup>
import { ref, onMounted, watch } from 'vue'
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
const pageSize = ref(10)
const pageTotal = ref(0)
const loading = ref(false)
const isSearchMode = ref(false)

// 获取随机数据
const getRandom = async () => {
  try {
    loading.value = true
    const res = await getPoetRandomData(pageNum.value, pageSize.value)
    randomList.value = res.data.records
    pageTotal.value = res.data.total
  } catch (error) {
    console.error('获取随机数据失败:', error)
  } finally {
    loading.value = false
  }
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
//TODO由于后端没有做分页，导致现在分页还不能用
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

// 添加清除搜索方法
const clearSearch = () => {
  isSearchMode.value = false
  userSearch.clearSearch()
  getRandom() // 重新获取随机数据
}

watch(
  () => userSearch.searchResults,
  (newResults) => {
    console.log('搜索结果变化:', userSearch.searchResults)
    if (newResults && newResults.length > 0) {
      randomList.value = newResults
      pageTotal.value = userSearch.total
      pageNum.value = 1 // 重置页码
      isSearchMode.value = true // 设置搜索状态
    }
  },
)

onMounted(getRandom)
</script>

<template>
  <div class="content-container">
    <div v-if="isSearchMode" class="search-status">
      <p>搜索"{{ userSearch.userInput }}"的结果，共 {{ pageTotal }} 条</p>
      <el-button type="text" @click="clearSearch">清除搜索</el-button>
    </div>
    <div class="filter-box">
      <div class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ DYNASTY_CONFIG.title }}:</span>
          <div class="filter-options" :class="{ expanded: isOpen }">
            <button
              v-for="option in DYNASTY_CONFIG.options"
              :key="option"
              class="option-btn"
              :class="{ active: currentDynasty === option }"
              @click="fetchData(option, 1)"
            >
              {{ option }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleSection">
            <img
              :class="{ 'rotate-180': isOpen }"
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
        <Writeritem
          v-for="item in randomList"
          :key="item?.id"
          :name="item.name"
          :content="item.simpleIntro"
          :dynasty="item.dynasty"
          @click="goPoetWriterDetail(item.id)"
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
      padding: 10px 0;

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
.pagination {
  margin-bottom: 20px;
}
</style>
