<script setup>
import {ref, onMounted} from 'vue'
import Poetryitem from '@/components/poetryitem/index.vue'
import {userSearchStore} from '@/stores/modules/search.js'
import {getpoemRandomData, getDynastyData, getClassData, getWriterPoemData} from '@/api/modules/index.js'
const searchStore = userSearchStore()
console.log(searchStore.userInput)

/**
 * 常量定义
 */
const FILTER_CONFIG = {
  dynasty: {
    title: '朝代',
    options: ['唐代', '宋代', '明代', '清代', '元代', '当代', '两汉', '南北朝', '金朝', '现代', '先秦', '隋代', '五代', '未知']
  },
  class: {
    title: '分类',
    options: ['古诗三百首', '小学古诗', '早教古诗100首', '初中古诗', '初中文言文', '乐府', '民歌', '咏物', '叙事', '抱负', '赞美', '写景', '写人', '品格', '孤独', '爱情']
  },
  poet: {
    title: '诗人',
    options: ['李白', '杜甫', '李清照', '白居易', '苏轼', '李商隐', '刘禹锡', '高适', '孟浩然', '王安石', '欧阳修', '王勃', '曹植', '晏殊', '杨万里', '黄庭坚', '杜牧', '元贺', '元稹', '纳兰性德']
  }
}

/**
 * 数据定义
 */
const state = ref({
  // 打开状态
  openStates: {
    dynasty: false, // 朝代
    class: false, // 分类
    poet: false // 诗人
  },
  currentType: '', // 当前选择的类型
  currentName: '', // 当前选择的名称
  pageNum: 1, // 当前页
  pageSize: 6, // 每页显示数量
  pageTotal: 0, // 总页数
  loading: false, // 加载状态
  randomList: [] // 随机列表
})

// 3. 提取公共方法
const toggleSection = (section) => {
  state.value.openStates[section] = !state.value.openStates[section]
}

/**
 * 将三个逻辑相同数据请求封装成函数
 * @param type
 * @param name
 * @param page
 * @param pageSize
 * @returns {Promise<void>}
 */
const fetchData = async (type, name, page = 1, pageSize = state.value.pageSize) => {
  try {
    state.value.loading = true
    state.value.currentType = type
    state.value.currentName = name
    const apiMap = {
      dynasty: getDynastyData,
      class: getClassData,
      poet: getWriterPoemData
    }
    const res = await apiMap[type](name, page, pageSize)
    state.value.randomList = res.data.records
    state.value.pageTotal = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
    // 可以添加错误提示
  } finally {
    state.value.loading = false
  }
}

/**
 * 根据不同类型获取数据分页处理
 * @param page
 */
const handlePageChange = (page) => {
  state.value.pageNum = page
  fetchData(state.value.currentType, state.value.currentName, page, state.value.pageSize)
}

/**
 * 随机获取数据
 */
// TODO: 优化随机数据获取 优化分页器相关逻辑
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
  <div class="poetry-container">
    <div class="filter-box">
      <div v-for="(config, type) in FILTER_CONFIG"
           :key="type"
           class="filter-section">
        <div class="filter-row">
          <span class="filter-title">{{ config.title }}:</span>
          <div class="filter-options" :class="{ 'expanded': state.openStates[type] }">
            <button v-for="option in config.options"
                    :key="option"
                    class="option-btn"
                    :class="{ 'active': state.currentName === option }"
                    @click="fetchData(type, option)">
              {{ option }}
            </button>
          </div>
          <button class="toggle-btn" @click="toggleSection(type)">
            <img :class="{ 'rotate-180': state.openStates[type] }"
                 src="https://ziyuan.guwendao.net/siteimg/jianBtn.png"
                 alt="toggle"
                 width="13"
                 height="13">
          </button>
        </div>
      </div>
    </div>


    <div class="poetry-list" v-loading="state.loading">
      <template v-if="state.randomList.length">
        <Poetryitem v-for="item in state.randomList"
                    :key="item?.id"
                    v-bind="{
                       ...item,
                       id: String(item.id)
                     }"
                    @click="$router.push(`/poetDetails?id=${item.id}`)"/>
      </template>
      <div v-else class="empty-state">
        暂无数据
      </div>
    </div>
    <!-- 9. 分页器优化 -->
    <el-pagination v-if="state.pageTotal > 0"
                   :current-page="state.pageNum"
                   :page-size="state.pageSize"
                   :total="state.pageTotal"
                   background
                   layout="prev, pager, next"
                   @current-change="handlePageChange"/>
  </div>
</template>

<style lang="scss" scoped>
.poetry-container {
  .filter-box {
    background: #f3f2f2;
    border-radius: 8px;
    padding: 0 10px;

    .filter-section {
      border-bottom: 1px solid #b5b5b5;
      padding: 10px 0;

      &:last-child {
        border-bottom: none;
      }

      .filter-row {
        display: flex;
        align-items: center;
        width: 100%;

        .filter-title {
          width: 60px;
          font-size: 17px;
          flex-shrink: 0;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          height: 35px;
          overflow: hidden;
          transition: height 0.3s ease;

          &.expanded {
            height: auto;
          }
        }

        .toggle-btn {
          width: 30px;
          border: none;
          cursor: pointer;
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

  .poetry-list {

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  }

  .option-btn {
    height: 35px;
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

  // 响应式优化
  @media (max-width: 768px) {
    padding: 15px;

    .filter-options {
      height: auto;
      max-height: 150px;
      overflow-y: auto;
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

