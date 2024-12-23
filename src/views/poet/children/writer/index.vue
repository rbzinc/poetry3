<script setup>
import { ref, onMounted } from 'vue'
import { defineExpose } from 'vue'
import Writeritem from '@/components/writeritem/writeitem.vue'
import Search from '@/components/search/search.vue'
import { getPoetRandomData, getWriterData } from '@/api/modules/poePavilion.js'
import { useRouter } from 'vue-router'

// 1. 提取配置常量
const DYNASTY_OPTIONS = [
  '唐代', '宋代', '明代', '清代', '元代', '当代',
  '两汉', '南北朝', '金朝', '现代', '先秦', '隋代',
  '五代', '未知'
]

// 2. 状态管理优化
const state = ref({
  isOpen: false,
  randomList: [],
  currentDynasty: '',
  pageNum: 1,
  pageSize: 5,
  pageTotal: 0,
  loading: false
})

const router = useRouter()

// 3. 获取随机数据
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

// 4. 获取朝代数据
const getData = async (dynastyName, page = 1) => {
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

// 5. 切换展开/收起
const toggleOpened = () => {
  state.value.isOpen = !state.value.isOpen
}

// 6. 分页处理
const handlePageChange = (page) => {
  getData(state.value.currentDynasty, page)
}

// 7. 跳转详情页
const navigateToDetail = (id) => {
  router.push(`/writer?id=${id}`)
}

onMounted(getRandom)
</script>

<template>
  <div class="writer-container">
    <Search />

    <div class="filter-box">
      <div class="filter-section">
        <div class="filter-row">
          <span class="filter-title">朝代:</span>
          <div class="filter-options" :class="{ 'expanded': state.isOpen }">
            <button v-for="dynasty in DYNASTY_OPTIONS"
                    :key="dynasty"
                    class="option-btn"
                    :class="{ 'active': state.currentDynasty === dynasty }"
                    @click="getData(dynasty)">
              {{ dynasty }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleOpened">
            <img :class="{ 'rotate-180': state.isOpen }"
                 src="https://ziyuan.guwendao.net/siteimg/jianBtn.png"
                 alt="toggle"
                 width="13"
                 height="13">
          </button>
        </div>
      </div>
    </div>

    <div class="writer-list" v-loading="state.loading">
      <template v-if="state.randomList.length">
        <Writeritem v-for="item in state.randomList"
                    :key="item?.id"
                    :name="item.name"
                    :content="item.simpleIntro"
                    :dynasty="item.dynasty"
                    @click="navigateToDetail(item.id)" />
      </template>
      <div v-else class="empty-state">
        暂无数据
      </div>
    </div>

    <el-pagination v-if="state.pageTotal > 0"
                   :current-page="state.pageNum"
                   :page-size="state.pageSize"
                   :total="state.pageTotal"
                   :pager-count="7"
                   background
                   layout="prev, pager, next"
                   @current-change="handlePageChange" />
  </div>
</template>

<style lang="scss" scoped>
.writer-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;

  .filter-box {
    background: #f3f2f2;
    border-radius: 8px;
    padding:0 10px;
    margin-bottom: 20px;

    .filter-section {

      .filter-row {
        display: flex;
        align-items: center;

        .filter-title {
          width: 60px;
          font-size: 17px;
          flex-shrink: 0;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          height: 50px;
          overflow: hidden;
          transition: height 0.3s ease;

          &.expanded {
            height: auto;
          }
        }
      }
    }
  }

  .option-btn {
    height: 50px;
    padding: 0 15px;
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    font-size: 15px;

    &:hover {
      color: #409EFF;
    }

    &.active {
      color: #409EFF;
      font-weight: bold;
    }
  }

  .toggle-btn {
    width: 60px;
    height: 50px;
    border: none;
    background: none;
    cursor: pointer;
    display: grid;
    place-items: center;

    img {
      transition: transform 0.3s ease;
      &.rotate-180 {
        transform: scaleY(-1);
      }
    }
  }

  // 添加分页器样式
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
