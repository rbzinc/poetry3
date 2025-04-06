<script setup>
import { ref, onMounted } from 'vue'
import Poetryitem from '@/components/poet/poetryitem/index.vue'
import { getpoemRandomData, getDynastyData, getClassData, getWriterPoemData } from '@/api/index.js'
import { usePoetDataStore } from '@/stores/modules/poetData.js'

const poetDataStore = usePoetDataStore()
const FILTER_CONFIG = poetDataStore.getAllConfig

/**
 * 数据定义
 */
const state = ref({
  // 打开状态
  openStates: {
    dynasty: false, // 朝代
    class: false, // 分类
    poet: false, // 诗人
  },
  currentType: '', // 当前选择的类型
  currentName: '', // 当前选择的名称
  pageNum: 1, // 当前页
  pageSize: 6, // 每页显示数量
  pageTotal: 0, // 总页数
  loading: false, // 加载状态
  randomList: [], // 随机列表
})

// 切换展开/收起
const toggleSection = (section) => {
  state.value.openStates[section] = !state.value.openStates[section]
}

/**
 * 将三个逻辑相同数据请求封装成函数
 */
const fetchData = async (type, name, page = 1, pageSize = state.value.pageSize) => {
  try {
    state.value.loading = true
    state.value.currentType = type
    state.value.currentName = name
    const apiMap = {
      dynasty: getDynastyData,
      class: getClassData,
      poet: getWriterPoemData,
    }
    const res = await apiMap[type](name, page, pageSize)
    state.value.randomList = res.data.records
    state.value.pageTotal = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    state.value.loading = false
  }
}

/**
 * 分页处理
 */
const handlePageChange = (page) => {
  state.value.pageNum = page
  fetchData(state.value.currentType, state.value.currentName, page, state.value.pageSize)
}

/**
 * 初始化数据
 */
onMounted(async () => {
  try {
    const res = await getpoemRandomData()
    state.value.randomList = res.data
  } catch (error) {
    console.error('获取随机数据失败:', error)
  }
})
</script>

<template>
  <div class="content-container">
    <div class="filter-box">
      <div v-for="(config, type) in FILTER_CONFIG" :key="type" class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ config.title }}:</span>
          <div class="filter-options" :class="{ 'expanded': state.openStates[type] }">
            <button
              v-for="option in config.options"
              :key="option"
              class="option-btn"
              :class="{ 'active': state.currentName === option }"
              @click="fetchData(type, option)"
            >
              {{ option }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleSection(type)">
            <img
              :class="{ 'rotate-180': state.openStates[type] }"
              src="https://ziyuan.guwendao.net/siteimg/jianBtn.png"
              alt="toggle"
              width="13"
              height="13"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="content-list" v-loading="state.loading">
      <template v-if="state.randomList.length">
        <Poetryitem
          v-for="item in state.randomList"
          :key="item?.id"
          v-bind="{
            ...item,
            id: String(item.id),
          }"
          @click="$router.push(`/poet/class/poet?id=${item.id}`)"
        />
      </template>
      <div v-else class="empty-state">暂无数据</div>
    </div>
    
    <el-pagination
      v-if="state.pageTotal > 0"
      :current-page="state.pageNum"
      :page-size="state.pageSize"
      :total="state.pageTotal"
      background
      layout="prev, pager, next"
      @current-change="handlePageChange"
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