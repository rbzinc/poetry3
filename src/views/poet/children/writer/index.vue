<script setup>
import { ref, onMounted } from 'vue'
import Writeritem from '@/components/poet/writeritem/index.vue'
import { usePoetDataStore } from "@/stores/modules/poetData.js";
import { getPoetRandomData, getWriterData } from '@/api/modules/poePavilion.js'

const poetDataStore = usePoetDataStore();
const DYNASTY_CONFIG = poetDataStore.getDynastyConfig;

/**
 * 定义数据
 */
const state = ref({
  isOpen: false,
  randomList: [],
  currentDynasty: '',
  pageNum: 1,
  pageSize: 5,
  pageTotal: 0,
  loading: false
})

// 获取随机数据
const getRandom = async () => {
  try {
    state.value.loading = true
    const res = await getPoetRandomData()
    state.value.randomList = res.data
  } catch (error) {
    console.error('获取随机数据失败:', error)
  } finally {
    state.value.loading = false
  }
}

// 获取朝代数据
const fetchData = async (dynastyName, page = 1) => {
  try {
    state.value.loading = true
    state.value.currentDynasty = dynastyName
    const res = await getWriterData(dynastyName, page)
    state.value.randomList = res.data.records
    state.value.pageTotal = res.data.total
  } catch (error) {
    console.error('获取朝代数据失败:', error)
  } finally {
    state.value.loading = false
  }
}

// 切换展开/收起
const toggleSection = () => {
  state.value.isOpen = !state.value.isOpen
}

// 分页处理
const handlePageChange = (page) => {
  fetchData(state.value.currentDynasty, page)
}

onMounted(getRandom)
</script>

<template>
  <div class="content-container">
    <div class="filter-box">
      <div class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ DYNASTY_CONFIG.title }}:</span>
          <div class="filter-options" :class="{ 'expanded': state.isOpen }">
            <button v-for="option in DYNASTY_CONFIG.options"
                    :key="option"
                    class="option-btn"
                    :class="{ 'active': state.currentDynasty === option }"
                    @click="fetchData(option)">
              {{ option }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleSection">
            <img :class="{ 'rotate-180': state.isOpen }"
                 src="https://ziyuan.guwendao.net/siteimg/jianBtn.png"
                 alt="toggle"
                 width="13"
                 height="13">
          </button>
        </div>
      </div>
    </div>

    <div class="content-list" v-loading="state.loading">
      <template v-if="state.randomList.length">
        <Writeritem v-for="item in state.randomList"
                    :key="item?.id"
                    :name="item.name"
                    :content="item.simpleIntro"
                    :dynasty="item.dynasty"
                    @click="$router.push(`/poet/writer/writer?id=${item.id}`)" />
      </template>
      <div v-else class="empty-state">
        暂无数据
      </div>
    </div>

    <el-pagination v-if="state.pageTotal > 0"
                   :current-page="state.pageNum"
                   :page-size="state.pageSize"
                   :total="state.pageTotal"
                   background
                   layout="prev, pager, next"
                   @current-change="handlePageChange" />
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
      color: #409EFF;
    }

    &.active {
      color: #409EFF;
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
        color: #409EFF;
        border-color: #409EFF;
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
          color: #409EFF;
          border-color: #409EFF;
        }

        &.is-active {
          background-color: #409EFF;
          color: #fff !important;
          border-color: #409EFF;
          position: relative;
          z-index: 1;
        }
      }
    }
  }
}
</style>