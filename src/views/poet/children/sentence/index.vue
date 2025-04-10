<script setup>
import { ref, onMounted } from 'vue'
import { usePoetDataStore } from '@/stores/modules/poetData.js'
import { getsenRandomData, getSentenceCount, getSentenceData } from '@/api/modules/poePavilion.js'

const poetDataStore = usePoetDataStore()
const POET_CONFIG = poetDataStore.getPoetConfig

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

// 数据获取方法
const fetchData = async (poetName, page = 1) => {
  try {
    pageNum.value = page
    //TODO接口修复之后新增默认按钮
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
const handlePageChange = (page) => {
  pageNum.value = page
  fetchData(currentPoet.value, page)
}

// 切换展开/收起
const toggleSection = () => {
  isOpen.value = !isOpen.value
}

const sentenceCount = async () => {
  const res = await getSentenceCount()
  pageTotal.value = res.data
}

// 初始化数据
onMounted(async () => {
  try {
    const res = await getsenRandomData()
    sentenceList.value = res.data
  } catch (error) {
    console.error('获取随机数据失败:', error)
  }
  await sentenceCount()
})
</script>

<template>
  <div class="content-container">
    <div class="filter-box">
      <div class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ POET_CONFIG.title }}:</span>
          <div class="filter-options" :class="{ expanded: isOpen }">
            <button
              v-for="option in POET_CONFIG.options"
              :key="option"
              class="option-btn"
              :class="{ active: currentPoet === option }"
              @click="fetchData(option)"
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
      <template v-if="sentenceList.length">
        <div v-for="item in sentenceList" :key="item.id" class="sentence-item">
          <span class="content">{{ item.name }}</span>
          <span class="source">——{{ item.fromm }}</span>
        </div>
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
    .sentence-item {
      margin-bottom: 10px;
      padding: 20px;
      background-color: #f3f2f2;
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
      }

      .content {
        font-size: 16px;
        color: #333;
      }

      .source {
        color: #666;
        margin-left: 10px;
      }
    }

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
</style>
