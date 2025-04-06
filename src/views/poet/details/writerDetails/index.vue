<script setup>
import { ref, onMounted } from 'vue'
import Writercontent from '@/components/poet/wriercontent/index.vue'
import { useRoute } from 'vue-router'
import { userWriterService } from "@/api/modules/writer"
import { ElMessage } from 'element-plus'

const route = useRoute()
const writerid = ref('')
const isLoading = ref(false)
const dataList = ref(null)
const writerList = ref([])
const writertitle = ref('')
const writercontent = ref('')

// 获取诗人详细信息
const getData = async () => {
  if (!writerid.value) {
    ElMessage.error('未找到诗人ID')
    return
  }
  
  try {
    isLoading.value = true
    const res = await userWriterService(writerid.value)
    
    if (!res.data) {
      throw new Error('获取诗人数据失败')
    }
    
    dataList.value = res.data
    writertitle.value = dataList.value.name || '未知诗人'
    writercontent.value = dataList.value.simpleIntro || '暂无简介'
    writerList.value = res.data.detailIntro || []
    
    // 设置页面标题
    document.title = `${writertitle.value} - 诗人详情 | 诗词书阁`
  } catch (error) {
    console.error('获取诗人详情失败:', error)
    ElMessage.error('获取诗人详情失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  writerid.value = route.query.id
  getData()
})
</script>

<template>
  <div class="writer-details" v-loading="isLoading">
    <div class="writer-container">
      <div class="writer-header">
        <h1 class="writer-title">{{ writertitle }}</h1>
      </div>
      
      <div class="writer-intro">
        <p>{{ writercontent }}</p>
      </div>
      
      <div class="writer-content-list">
        <template v-if="writerList && writerList.length">
          <Writercontent
            v-for="item in writerList"
            :key="item?.id"
            :content="item.content"
            :title="item.title"
          />
        </template>
        <div v-else class="empty-content">
          暂无详细介绍
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.writer-details {
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 30px 0;
  
  .writer-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .return-button {
    margin-bottom: 10px;
    padding: 0 20px;
  }
  
  .writer-header {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    padding: 20px 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .writer-title {
      font-size: 28px;
      color: #333;
      margin: 0;
      text-align: center;
      font-weight: 600;
    }
  }
  
  .writer-intro {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    padding: 25px 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    p {
      font-size: 16px;
      line-height: 1.8;
      color: #333;
      margin: 0;
      text-indent: 2em;
      white-space: pre-wrap;
    }
  }
  
  .writer-content-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .empty-content {
      background-color: rgba(255, 255, 255, 0.85);
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .writer-details {
    padding: 20px 15px;
    
    .writer-header {
      padding: 15px 20px;
      
      .writer-title {
        font-size: 24px;
      }
    }
    
    .writer-intro {
      padding: 20px;
      
      p {
        font-size: 15px;
      }
    }
  }
}
</style>