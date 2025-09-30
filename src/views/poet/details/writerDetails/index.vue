<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { User, Calendar, BookOpen } from '@element-plus/icons-vue'
import Writercontent from '@/components/poet/wriercontent/index.vue'
import { userWriterService } from '@/api/modules/writer'
import { ElMessage } from 'element-plus'

const route = useRoute()
const writerid = ref('')
const isLoading = ref(false)
const dataList = ref(null)
const writerList = ref([])
const writertitle = ref('')
const writercontent = ref('')

// 获取朝代颜色
const getDynastyColor = () => {
  const dynasty = dataList.value?.dynasty || ''
  const colorMap = {
    '唐': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '宋': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '元': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    '明': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    '清': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
  return colorMap[dynasty] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

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
  <div class="modern-writer-details" v-loading="isLoading">
    <div class="writer-container">
      <!-- Hero区域 -->
      <section class="writer-hero">
        <div class="hero-decoration">
          <div class="decoration-circle" :style="{ background: getDynastyColor() }"></div>
        </div>
        
        <div class="hero-content">
          <!-- 诗人头像 -->
          <div class="writer-avatar-wrapper">
            <div class="avatar-circle" :style="{ background: getDynastyColor() }">
              <el-icon class="avatar-icon" :size="64"><User /></el-icon>
            </div>
            <div 
              class="dynasty-badge"
              :style="{ background: getDynastyColor() }"
              v-if="dataList?.dynasty"
            >
              {{ dataList.dynasty }}
            </div>
          </div>
          
          <!-- 诗人基本信息 -->
          <div class="writer-info">
            <h1 class="writer-name">{{ writertitle }}</h1>
            
            <div class="writer-meta" v-if="dataList">
              <div class="meta-item" v-if="dataList.dynasty">
                <el-icon :size="18"><Calendar /></el-icon>
                <span>{{ dataList.dynasty }}</span>
              </div>
              <div class="meta-item">
                <el-icon :size="18"><BookOpen /></el-icon>
                <span>诗词作家</span>
              </div>
            </div>
            
            <div class="writer-intro-card">
              <p class="intro-text">{{ writercontent }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细介绍区域 -->
      <section class="writer-details-section" v-if="writerList && writerList.length">
        <div class="section-header">
          <div class="header-line"></div>
          <h2 class="section-title">详细介绍</h2>
          <div class="header-line"></div>
        </div>
        
        <div class="details-list">
          <Writercontent
            v-for="(item, index) in writerList"
            :key="index"
            :content="item.content"
            :title="item.title"
          />
        </div>
      </section>
      
      <!-- 空状态 -->
      <section class="empty-section" v-else-if="!isLoading">
        <div class="empty-card">
          <el-icon class="empty-icon" :size="64"><BookOpen /></el-icon>
          <p class="empty-text">暂无详细介绍</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-writer-details {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px 60px;
  
  .writer-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  // Hero区域
  .writer-hero {
    position: relative;
    background: white;
    border-radius: 24px;
    padding: 60px 48px;
    box-shadow: 0 8px 40px rgba(102, 126, 234, 0.15);
    overflow: hidden;
    
    .hero-decoration {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;
      
      .decoration-circle {
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        top: -200px;
        right: -150px;
        opacity: 0.08;
      }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      
      .writer-avatar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        
        .avatar-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
          
          .avatar-icon {
            color: white;
          }
        }
        
        .dynasty-badge {
          padding: 10px 24px;
          border-radius: 24px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
      }
      
      .writer-info {
        width: 100%;
        text-align: center;
        
        .writer-name {
          font-size: 40px;
          font-weight: 700;
          color: #2C3E50;
          margin: 0 0 20px 0;
          font-family: 'STKaiti', '楷体', serif;
        }
        
        .writer-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 32px;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #F8F9FA;
            border-radius: 12px;
            color: #7F8C8D;
            font-size: 15px;
          }
        }
        
        .writer-intro-card {
          padding: 24px 32px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
          border-radius: 16px;
          border-left: 4px solid #667eea;
          
          .intro-text {
            font-size: 17px;
            line-height: 2;
            color: #34495e;
            margin: 0;
            text-align: left;
            text-indent: 2em;
          }
        }
      }
    }
  }
  
  // 详细介绍区域
  .writer-details-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      
      .header-line {
        flex: 1;
        height: 2px;
        background: linear-gradient(135deg, transparent 0%, #ECF0F1 50%, transparent 100%);
      }
      
      .section-title {
        font-size: 28px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0;
        white-space: nowrap;
      }
    }
    
    .details-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  
  // 空状态
  .empty-section {
    .empty-card {
      background: white;
      border-radius: 20px;
      padding: 80px 40px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      
      .empty-icon {
        color: #BDC3C7;
        margin-bottom: 16px;
      }
      
      .empty-text {
        font-size: 18px;
        color: #7F8C8D;
        margin: 0;
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .modern-writer-details {
    padding: 20px 12px 40px;
    
    .writer-container {
      gap: 16px;
    }
    
    .writer-hero {
      padding: 40px 24px;
      border-radius: 16px;
      
      .hero-content {
        gap: 24px;
        
        .writer-avatar-wrapper {
          .avatar-circle {
            width: 100px;
            height: 100px;
            
            .avatar-icon {
              font-size: 48px;
            }
          }
          
          .dynasty-badge {
            padding: 8px 20px;
            font-size: 14px;
          }
        }
        
        .writer-info {
          .writer-name {
            font-size: 28px;
          }
          
          .writer-meta {
            flex-direction: column;
            gap: 12px;
          }
          
          .writer-intro-card {
            padding: 20px 24px;
            
            .intro-text {
              font-size: 15px;
            }
          }
        }
      }
    }
    
    .writer-details-section {
      .section-header {
        .section-title {
          font-size: 22px;
        }
      }
      
      .details-list {
        gap: 16px;
      }
    }
    
    .empty-section {
      .empty-card {
        padding: 60px 24px;
      }
    }
  }
}
</style>