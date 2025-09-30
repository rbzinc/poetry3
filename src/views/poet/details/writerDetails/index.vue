<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Calendar, Reading, ArrowLeft, StarFilled } from '@element-plus/icons-vue'
import Writercontent from '@/components/poet/wriercontent/index.vue'
import { userWriterService } from '@/api/modules/writer'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const writerid = ref('')
const isLoading = ref(false)
const dataList = ref(null)
const writerList = ref([])
const writertitle = ref('')
const writercontent = ref('')

// 获取朝代颜色和主题
const getDynastyTheme = computed(() => {
  const dynasty = dataList.value?.dynasty || ''
  const themeMap = {
    '唐': {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lightBg: 'rgba(102, 126, 234, 0.08)',
      color: '#667eea',
      icon: '🏛️',
      desc: '盛世华章'
    },
    '宋': {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      lightBg: 'rgba(240, 147, 251, 0.08)',
      color: '#f093fb',
      icon: '🎨',
      desc: '风雅传承'
    },
    '元': {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      lightBg: 'rgba(79, 172, 254, 0.08)',
      color: '#4facfe',
      icon: '🏹',
      desc: '马背诗篇'
    },
    '明': {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      lightBg: 'rgba(67, 233, 123, 0.08)',
      color: '#43e97b',
      icon: '🏯',
      desc: '文化复兴'
    },
    '清': {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      lightBg: 'rgba(250, 112, 154, 0.08)',
      color: '#fa709a',
      icon: '📜',
      desc: '余韵绵长'
    }
  }
  return themeMap[dynasty] || themeMap['唐']
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取诗人详细信息
const getData = async () => {
  if (!writerid.value) {
    ElMessage.error('未找到作家ID')
    return
  }
  
  try {
    isLoading.value = true
    const res = await userWriterService(writerid.value)
    
    if (!res.data) {
      throw new Error('获取作家数据失败')
    }
    
    dataList.value = res.data
    writertitle.value = dataList.value.name || '未知作家'
    writercontent.value = dataList.value.simpleIntro || '暂无简介'
    writerList.value = res.data.detailIntro || []
    
    document.title = `${writertitle.value} - 文学大师 | 墨韵书院`
  } catch (error) {
    console.error('获取作家详情失败:', error)
    ElMessage.error('获取作家详情失败: ' + error.message)
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
  <div class="writer-details-page" v-loading="isLoading">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-container">
      <!-- Hero区域 - 全新布局 -->
      <section class="hero-section">
        <!-- 背景装饰 -->
        <div class="hero-background">
          <div class="bg-gradient" :style="{ background: getDynastyTheme.gradient }"></div>
          <div class="bg-pattern"></div>
          <div class="floating-particles">
            <span class="particle" v-for="i in 8" :key="i"></span>
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="hero-content">
          <!-- 左侧：头像和基本信息 -->
          <div class="hero-left">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div 
                  class="avatar-ring"
                  :style="{ 
                    background: getDynastyTheme.gradient,
                    boxShadow: `0 20px 60px ${getDynastyTheme.color}40`
                  }"
                >
                  <div class="avatar-inner">
                    <el-icon class="avatar-icon" :size="80"><User /></el-icon>
                  </div>
                </div>
                
                <!-- 朝代徽章 -->
                <div 
                  class="dynasty-badge-floating"
                  :style="{ background: getDynastyTheme.gradient }"
                >
                  <span class="dynasty-icon">{{ getDynastyTheme.icon }}</span>
                  <span class="dynasty-text">{{ dataList?.dynasty }}</span>
                </div>
              </div>

              <!-- 装饰性引用符号 -->
              <div class="quote-decoration">
                <span class="quote-mark left">"</span>
                <span class="quote-mark right">"</span>
              </div>
            </div>
          </div>

          <!-- 右侧：详细信息 -->
          <div class="hero-right">
            <!-- 作家名字 -->
            <div class="writer-title-section">
              <h1 class="writer-name">{{ writertitle }}</h1>
              <div class="title-decoration">
                <span class="decoration-line" :style="{ background: getDynastyTheme.gradient }"></span>
              </div>
            </div>

            <!-- 元数据标签 -->
            <div class="meta-tags">
              <div 
                class="meta-tag"
                :style="{ 
                  background: getDynastyTheme.lightBg,
                  borderColor: getDynastyTheme.color
                }"
                v-if="dataList?.dynasty"
              >
                <el-icon :size="18" :color="getDynastyTheme.color"><Calendar /></el-icon>
                <span :style="{ color: getDynastyTheme.color }">{{ dataList.dynasty }}·{{ getDynastyTheme.desc }}</span>
              </div>
              <div 
                class="meta-tag"
                :style="{ 
                  background: getDynastyTheme.lightBg,
                  borderColor: getDynastyTheme.color
                }"
              >
                <el-icon :size="18" :color="getDynastyTheme.color"><Reading /></el-icon>
                <span :style="{ color: getDynastyTheme.color }">文学大师</span>
              </div>
              <div 
                class="meta-tag featured"
                :style="{ 
                  background: getDynastyTheme.gradient,
                }"
              >
                <el-icon :size="18" color="white"><StarFilled /></el-icon>
                <span style="color: white">经典典藏</span>
              </div>
            </div>

            <!-- 简介卡片 -->
            <div 
              class="intro-card"
              :style="{ borderLeftColor: getDynastyTheme.color }"
            >
              <div class="intro-header">
                <div class="intro-icon" :style="{ background: getDynastyTheme.lightBg }">
                  <el-icon :size="20" :color="getDynastyTheme.color"><Reading /></el-icon>
                </div>
                <h3 class="intro-title">人物简介</h3>
              </div>
              <p class="intro-text">{{ writercontent }}</p>
              <div class="intro-footer">
                <span class="footer-decoration" :style="{ background: getDynastyTheme.gradient }"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细介绍区域 - 优化布局 -->
      <section class="details-section" v-if="writerList && writerList.length">
        <div class="section-header">
          <div class="header-decoration">
            <span class="decoration-icon" :style="{ background: getDynastyTheme.gradient }">📖</span>
          </div>
          <div class="header-text">
            <h2 class="section-title">详细生平</h2>
            <p class="section-subtitle">深入了解这位文学大师的传奇人生</p>
          </div>
          <div class="header-line" :style="{ background: getDynastyTheme.gradient }"></div>
        </div>
        
        <div class="details-grid">
          <Writercontent
            v-for="(item, index) in writerList"
            :key="index"
            :content="item.content"
            :title="item.title"
            :index="index"
            :theme-color="getDynastyTheme.color"
          />
        </div>
      </section>
      
      <!-- 空状态 -->
      <section class="empty-section" v-else-if="!isLoading">
        <div class="empty-card">
          <div class="empty-icon-wrapper">
            <el-icon class="empty-icon" :size="80"><Reading /></el-icon>
          </div>
          <h3 class="empty-title">暂无详细介绍</h3>
          <p class="empty-desc">该作家的详细生平资料正在整理中...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.writer-details-page {
  min-height: 100vh;
  background: #F8F9FA;
  padding-bottom: 60px;
  position: relative;
  
  // 返回按钮
  .back-button {
    position: fixed;
    top: 100px;
    left: 40px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 15px;
    font-weight: 500;
    color: #2C3E50;
    
    &:hover {
      transform: translateX(-4px);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
      color: #667eea;
    }
    
    .el-icon {
      transition: transform 0.3s ease;
    }
    
    &:hover .el-icon {
      transform: translateX(-2px);
    }
  }
  
  .page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  // Hero区域 - 全新设计
  .hero-section {
    position: relative;
    background: white;
    border-radius: 32px;
    overflow: hidden;
    box-shadow: 0 10px 60px rgba(0, 0, 0, 0.08);
    margin-bottom: 48px;
    
    .hero-background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      
      .bg-gradient {
        position: absolute;
        top: 0;
        right: 0;
        width: 60%;
        height: 100%;
        opacity: 0.06;
        clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%);
      }
      
      .bg-pattern {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.03;
        background-image: 
          repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(102, 126, 234, 0.1) 35px, rgba(102, 126, 234, 0.1) 70px);
      }
      
      .floating-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s infinite;
          
          &:nth-child(1) { left: 10%; top: 20%; animation-delay: -2.5s; animation-duration: 20s; }
          &:nth-child(2) { left: 30%; top: 60%; animation-delay: -5s; animation-duration: 22s; }
          &:nth-child(3) { left: 50%; top: 30%; animation-delay: -7.5s; animation-duration: 18s; }
          &:nth-child(4) { left: 70%; top: 70%; animation-delay: -10s; animation-duration: 25s; }
          &:nth-child(5) { left: 20%; top: 80%; animation-delay: -12.5s; animation-duration: 21s; }
          &:nth-child(6) { left: 80%; top: 40%; animation-delay: -15s; animation-duration: 19s; }
          &:nth-child(7) { left: 60%; top: 90%; animation-delay: -17.5s; animation-duration: 23s; }
          &:nth-child(8) { left: 90%; top: 50%; animation-delay: -20s; animation-duration: 24s; }
        }
      }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 60px;
      padding: 80px 60px;
      
      .hero-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .avatar-section {
          position: relative;
          
          .avatar-wrapper {
            position: relative;
            
            .avatar-ring {
              width: 220px;
              height: 220px;
              border-radius: 50%;
              padding: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: pulse-ring 3s ease-in-out infinite;
              
              .avatar-inner {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .avatar-icon {
                  color: #667eea;
                }
              }
            }
            
            .dynasty-badge-floating {
              position: absolute;
              bottom: 10px;
              right: -10px;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 30px;
              color: white;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
              animation: float-badge 3s ease-in-out infinite;
              
              .dynasty-icon {
                font-size: 20px;
              }
            }
          }
          
          .quote-decoration {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            
            .quote-mark {
              position: absolute;
              font-size: 120px;
              font-family: Georgia, serif;
              color: rgba(102, 126, 234, 0.08);
              font-weight: bold;
              
              &.left {
                top: -40px;
                left: -60px;
              }
              
              &.right {
                bottom: -40px;
                right: -60px;
                transform: rotate(180deg);
              }
            }
          }
        }
      }
      
      .hero-right {
        display: flex;
        flex-direction: column;
        gap: 32px;
        justify-content: center;
        
        .writer-title-section {
          .writer-name {
            font-size: 56px;
            font-weight: 800;
            color: #2C3E50;
            margin: 0 0 16px 0;
            font-family: 'STKaiti', '楷体', serif;
            letter-spacing: 2px;
            line-height: 1.2;
          }
          
          .title-decoration {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .decoration-line {
              height: 4px;
              width: 100px;
              border-radius: 2px;
            }
          }
        }
        
        .meta-tags {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          
          .meta-tag {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border-radius: 16px;
            border: 2px solid;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            
            &.featured {
              border: none;
              color: white;
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
          }
        }
        
        .intro-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 0.95) 100%);
          border-radius: 20px;
          padding: 32px;
          border-left: 6px solid;
          position: relative;
          backdrop-filter: blur(10px);
          
          .intro-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            
            .intro-icon {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .intro-title {
              font-size: 20px;
              font-weight: 600;
              color: #2C3E50;
              margin: 0;
            }
          }
          
          .intro-text {
            font-size: 17px;
            line-height: 2;
            color: #34495e;
            margin: 0;
            text-indent: 2em;
            font-family: 'STKaiti', '楷体', serif;
          }
          
          .intro-footer {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            
            .footer-decoration {
              height: 3px;
              width: 60px;
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
  
  // 详细介绍区域
  .details-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 48px;
      
      .header-decoration {
        .decoration-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          font-size: 28px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
        }
      }
      
      .header-text {
        flex: 1;
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #2C3E50;
          margin: 0 0 8px 0;
        }
        
        .section-subtitle {
          font-size: 16px;
          color: #7F8C8D;
          margin: 0;
        }
      }
      
      .header-line {
        height: 4px;
        width: 200px;
        border-radius: 2px;
      }
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 32px;
    }
  }
  
  // 空状态
  .empty-section {
    .empty-card {
      background: white;
      border-radius: 24px;
      padding: 100px 40px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      
      .empty-icon-wrapper {
        margin-bottom: 24px;
        
        .empty-icon {
          color: #BDC3C7;
        }
      }
      
      .empty-title {
        font-size: 24px;
        font-weight: 600;
        color: #7F8C8D;
        margin: 0 0 12px 0;
      }
      
      .empty-desc {
        font-size: 16px;
        color: #BDC3C7;
        margin: 0;
      }
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float-badge {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .writer-details-page {
    .hero-section .hero-content {
      grid-template-columns: 1fr;
      gap: 40px;
      padding: 60px 40px;
      
      .hero-left {
        .avatar-section .avatar-wrapper {
          .avatar-ring {
            width: 180px;
            height: 180px;
            
            .avatar-inner .avatar-icon {
              font-size: 60px;
            }
          }
        }
      }
      
      .hero-right .writer-title-section .writer-name {
        font-size: 42px;
      }
    }
    
    .details-section .details-grid {
      grid-template-columns: 1fr;
    }
  }
}

@media screen and (max-width: 768px) {
  .writer-details-page {
    .back-button {
      top: 80px;
      left: 20px;
      padding: 10px 16px;
      
      span {
        display: none;
      }
    }
    
    .page-container {
      padding: 20px 12px;
    }
    
    .hero-section {
      border-radius: 20px;
      margin-bottom: 32px;
      
      .hero-content {
        padding: 40px 24px;
        gap: 32px;
        
        .hero-left .avatar-section {
          .avatar-wrapper .avatar-ring {
            width: 150px;
            height: 150px;
          }
          
          .quote-decoration .quote-mark {
            font-size: 80px;
            
            &.left {
              top: -20px;
              left: -30px;
            }
            
            &.right {
              bottom: -20px;
              right: -30px;
            }
          }
        }
        
        .hero-right {
          gap: 24px;
          
          .writer-title-section .writer-name {
            font-size: 32px;
          }
          
          .meta-tags {
            gap: 12px;
            
            .meta-tag {
              padding: 10px 16px;
              font-size: 14px;
            }
          }
          
          .intro-card {
            padding: 24px;
            
            .intro-text {
              font-size: 15px;
            }
          }
        }
      }
    }
    
    .details-section {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 32px;
        
        .header-text .section-title {
          font-size: 28px;
        }
        
        .header-line {
          width: 100%;
        }
      }
      
      .details-grid {
        gap: 24px;
      }
    }
    
    .empty-section .empty-card {
      padding: 60px 24px;
    }
  }
}
</style>