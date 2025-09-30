<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Document, Reading, ChatDotRound, VideoPlay, VideoPause, ArrowDown, ArrowLeft, Star, MagicStick } from '@element-plus/icons-vue'
import { aiAudioGetApi, userAIDraowGetApi } from '@/api/modules/aiChat.js'
import { getPoemDetatils } from '@/api/index.js'

const router = useRouter()

// 基础状态
const poemtitle = ref('')
const writer = ref('')
const dynasty = ref('')
const content = ref('')
const translation = ref('')
const shangxi = ref('')
const remarks = ref('')
const routerPathId = ref('')

// UI 状态
const isLoading = ref(false)
const isPlaying = ref(false)
const dialogFormVisible = ref(false)
const isopen = ref(false)
const isTranslationOpen = ref(false)
const isContentOpen = ref(false)

// 媒体相关
const audioPlayer = ref(null)
const audioUrl = ref('')
const imageUrl = ref('')

// 计算属性
const playIcon = computed(() => (isPlaying.value ? VideoPause : VideoPlay))
const playText = computed(() => (isPlaying.value ? '暂停朗读' : '开始朗读'))

// 获取朝代主题
const getDynastyTheme = computed(() => {
  const themeMap = {
    '唐': {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lightBg: 'rgba(102, 126, 234, 0.08)',
      color: '#667eea',
      icon: '🏛️'
    },
    '宋': {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      lightBg: 'rgba(240, 147, 251, 0.08)',
      color: '#f093fb',
      icon: '🎨'
    },
    '元': {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      lightBg: 'rgba(79, 172, 254, 0.08)',
      color: '#4facfe',
      icon: '🏹'
    },
    '明': {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      lightBg: 'rgba(67, 233, 123, 0.08)',
      color: '#43e97b',
      icon: '🏯'
    },
    '清': {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      lightBg: 'rgba(250, 112, 154, 0.08)',
      color: '#fa709a',
      icon: '📜'
    }
  }
  return themeMap[dynasty.value] || themeMap['唐']
})

// 判断内容是否需要展开按钮
const needExpand = computed(() => {
  if (!shangxi.value) return false
  const plainText = shangxi.value.replace(/<[^>]+>/g, '')
  return plainText.length > 200
})

const needTranslationExpand = computed(() => {
  if (!translation.value) return false
  return translation.value.length > 200
})

const needContentExpand = computed(() => {
  if (!content.value) return false
  const plainText = content.value.replace(/<[^>]+>/g, '')
  return plainText.length > 150
})

// 获取诗词详情
const fetchPoemDetails = async (id) => {
  try {
    isLoading.value = true
    const { data } = await getPoemDetatils(id)
    if (!data || !data.length) {
      throw new Error('未找到诗词数据')
    }

    const poemData = data[0]
    routerPathId.value = poemData.id
    poemtitle.value = poemData.title
    writer.value = poemData.writer
    dynasty.value = poemData.dynasty
    content.value = poemData.content
    translation.value = poemData.translation || '暂无译文'
    shangxi.value = poemData.shangxi || '暂无赏析'
    remarks.value = poemData.remarks || '暂无评论'

    document.title = `${poemtitle.value} - ${writer.value} | 墨韵书院`
  } catch (error) {
    ElMessage.error('获取诗词详情失败：' + error.message)
    console.error('获取诗词详情失败：', error)
  } finally {
    isLoading.value = false
  }
}

// 音频控制
const handlePlayClick = async () => {
  if (!audioPlayer.value) return

  try {
    if (!audioUrl.value) {
      isLoading.value = true
      const { data } = await aiAudioGetApi(routerPathId.value)
      if (!data) throw new Error('获取音频失败')
      audioUrl.value = data
    }

    if (isPlaying.value) {
      await audioPlayer.value.pause()
    } else {
      await audioPlayer.value.play()
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    ElMessage.error('播放失败：' + error.message)
    console.error('音频播放错误：', error)
  } finally {
    isLoading.value = false
  }
}

// AI意境图
const showImageDialog = async () => {
  dialogFormVisible.value = true
  if (imageUrl.value) return

  try {
    isLoading.value = true
    const { data } = await userAIDraowGetApi(routerPathId.value)
    if (!data) throw new Error('获取图片失败')
    imageUrl.value = data
  } catch (error) {
    ElMessage.error('生成意境图失败：' + error.message)
    console.error('图片生成错误：', error)
    dialogFormVisible.value = false
  } finally {
    isLoading.value = false
  }
}

// 内容展开/收起
const toggleContent = () => {
  isopen.value = !isopen.value
}

const toggleTranslation = () => {
  isTranslationOpen.value = !isTranslationOpen.value
}

const togglePoemContent = () => {
  isContentOpen.value = !isContentOpen.value
}

// 返回书阁
const goBack = () => {
  router.back()
}

// 处理音频播放结束事件
const handleAudioEnded = () => {
  isPlaying.value = false
}

// 生命周期
onMounted(async () => {
  const route = useRoute()
  const poemId = route.query.id
  if (!poemId) {
    ElMessage.error('未找到诗词ID')
    return
  }
  await fetchPoemDetails(poemId)

  if (audioPlayer.value) {
    audioPlayer.value.addEventListener('ended', handleAudioEnded)
  }
})

onBeforeUnmount(() => {
  if (audioPlayer.value) {
    audioPlayer.value.removeEventListener('ended', handleAudioEnded)
  }
})
</script>

<template>
  <div class="poem-details-page" v-loading.fullscreen.lock="isLoading && !dialogFormVisible">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回典藏</span>
    </div>

    <div class="page-container">
      <!-- Hero区域 - 诗词展示核心 -->
      <section class="poem-hero">
        <!-- 背景装饰 -->
        <div class="hero-background">
          <div class="bg-gradient" :style="{ background: getDynastyTheme.gradient }"></div>
          <div class="bg-circles">
            <div class="circle circle-1" :style="{ background: getDynastyTheme.gradient }"></div>
            <div class="circle circle-2" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          <div class="chinese-pattern"></div>
        </div>

        <!-- 主要内容 -->
        <div class="hero-content">
          <!-- 标题区域 -->
          <div class="poem-header">
            <div class="header-decoration">
              <span class="decoration-dot" :style="{ background: getDynastyTheme.color }"></span>
              <span class="decoration-line" :style="{ background: getDynastyTheme.gradient }"></span>
              <span class="decoration-dot" :style="{ background: getDynastyTheme.color }"></span>
            </div>
            
            <h1 class="poem-title">{{ poemtitle }}</h1>
            
            <div class="poem-meta">
              <div 
                class="meta-badge dynasty"
                :style="{ 
                  background: getDynastyTheme.gradient,
                  boxShadow: `0 4px 20px ${getDynastyTheme.color}40`
                }"
              >
                <span class="badge-icon">{{ getDynastyTheme.icon }}</span>
                <span class="badge-text">{{ dynasty }}</span>
              </div>
              <div class="meta-divider">·</div>
              <div class="meta-author">
                <span class="author-label">作者</span>
                <span class="author-name">{{ writer }}</span>
              </div>
            </div>
          </div>

          <!-- 诗词内容主体 -->
          <div class="poem-content-area">
            <div class="content-decoration-left">
              <span class="quote-mark">"</span>
            </div>
            
            <div 
              class="poem-body" 
              :class="{ 'collapsed': !isContentOpen && needContentExpand }"
            >
              <div class="poem-text" v-html="content"></div>
              <div class="fade-overlay" v-if="!isContentOpen && needContentExpand"></div>
            </div>
            
            <div class="content-decoration-right">
              <span class="quote-mark">"</span>
            </div>

            <button 
              v-if="needContentExpand" 
              class="expand-btn content-expand"
              :style="{ color: getDynastyTheme.color }"
              @click="togglePoemContent"
            >
              <span>{{ isContentOpen ? '收起' : '展开全文' }}</span>
              <el-icon class="expand-icon" :class="{ 'rotated': isContentOpen }">
                <ArrowDown />
              </el-icon>
            </button>
          </div>

          <!-- 操作按钮 -->
          <div class="action-section">
            <audio ref="audioPlayer" :src="audioUrl" class="hidden" preload="none"></audio>
            
            <button 
              class="action-btn primary"
              :style="{ background: getDynastyTheme.gradient }"
              @click="handlePlayClick" 
              :disabled="isLoading"
            >
              <el-icon class="btn-icon" :size="22">
                <component :is="playIcon" />
              </el-icon>
              <span class="btn-text">{{ playText }}</span>
              <div class="btn-glow"></div>
            </button>

            <button
              class="action-btn secondary"
              :style="{ 
                borderColor: getDynastyTheme.color,
                color: getDynastyTheme.color
              }"
              @click="showImageDialog"
              :disabled="isLoading && !dialogFormVisible"
            >
              <el-icon class="btn-icon" :size="22"><MagicStick /></el-icon>
              <span class="btn-text">AI意境图</span>
            </button>

            <button
              class="action-btn secondary"
              :style="{ 
                borderColor: getDynastyTheme.color,
                color: getDynastyTheme.color
              }"
            >
              <el-icon class="btn-icon" :size="22"><Star /></el-icon>
              <span class="btn-text">收藏</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 内容区域网格 -->
      <div class="content-grid">
        <!-- 译文卡片 -->
        <section 
          class="content-card" 
          v-if="translation && translation !== '暂无译文'"
        >
          <div class="card-header">
            <div 
              class="card-icon"
              :style="{ background: getDynastyTheme.lightBg, color: getDynastyTheme.color }"
            >
              <el-icon :size="24"><Document /></el-icon>
            </div>
            <h2 class="card-title">译文</h2>
            <div class="card-decoration" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div 
            class="card-body"
            :class="{ 'collapsed': !isTranslationOpen && needTranslationExpand }"
          >
            <p class="card-text">{{ translation }}</p>
            <div class="fade-overlay" v-if="!isTranslationOpen && needTranslationExpand"></div>
          </div>
          
          <button 
            v-if="needTranslationExpand"
            class="expand-btn"
            :style="{ color: getDynastyTheme.color }"
            @click="toggleTranslation"
          >
            <span>{{ isTranslationOpen ? '收起内容' : '展开阅读' }}</span>
            <el-icon class="expand-icon" :class="{ 'rotated': isTranslationOpen }">
              <ArrowDown />
            </el-icon>
          </button>

          <div class="card-footer">
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
          </div>
        </section>

        <!-- 赏析卡片 -->
        <section 
          class="content-card" 
          v-if="shangxi && shangxi !== '暂无赏析'"
        >
          <div class="card-header">
            <div 
              class="card-icon"
              :style="{ background: getDynastyTheme.lightBg, color: getDynastyTheme.color }"
            >
              <el-icon :size="24"><Reading /></el-icon>
            </div>
            <h2 class="card-title">赏析</h2>
            <div class="card-decoration" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div 
            class="card-body"
            :class="{ 'collapsed': !isopen && needExpand }"
          >
            <div class="card-text" v-html="shangxi"></div>
            <div class="fade-overlay" v-if="!isopen && needExpand"></div>
          </div>
          
          <button 
            v-if="needExpand"
            class="expand-btn"
            :style="{ color: getDynastyTheme.color }"
            @click="toggleContent"
          >
            <span>{{ isopen ? '收起内容' : '展开阅读' }}</span>
            <el-icon class="expand-icon" :class="{ 'rotated': isopen }">
              <ArrowDown />
            </el-icon>
          </button>

          <div class="card-footer">
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
          </div>
        </section>

        <!-- 评论鉴赏卡片 -->
        <section 
          class="content-card" 
          v-if="remarks && remarks !== '暂无评论'"
        >
          <div class="card-header">
            <div 
              class="card-icon"
              :style="{ background: getDynastyTheme.lightBg, color: getDynastyTheme.color }"
            >
              <el-icon :size="24"><ChatDotRound /></el-icon>
            </div>
            <h2 class="card-title">评论鉴赏</h2>
            <div class="card-decoration" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div class="card-body">
            <p class="card-text">{{ remarks }}</p>
          </div>

          <div class="card-footer">
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
            <span class="dot" :style="{ background: getDynastyTheme.color }"></span>
          </div>
        </section>
      </div>
    </div>

    <!-- AI图片对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="AI意境图"
      width="90%"
      :style="{ maxWidth: '900px' }"
      destroy-on-close
      class="modern-image-dialog"
    >
      <div class="image-container" v-loading="isLoading && dialogFormVisible">
        <img v-if="imageUrl" :src="imageUrl" alt="AI生成的意境图" class="ai-image" />
        <div v-else class="loading-placeholder">
          <el-icon class="loading-icon" :size="64"><Picture /></el-icon>
          <p class="loading-text">正在生成意境图，请稍候...</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="large">关闭</el-button>
          <el-button 
            type="primary" 
            @click="showImageDialog()" 
            :loading="isLoading && dialogFormVisible"
            size="large"
          >
            重新生成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.poem-details-page {
  position: relative;
  min-height: 100vh;
  background: #F8F9FA;
  padding-bottom: 60px;
  
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  // Hero区域
  .poem-hero {
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
        left: 0;
        width: 100%;
        height: 200px;
        opacity: 0.08;
      }
      
      .bg-circles {
        position: absolute;
        width: 100%;
        height: 100%;
        
        .circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.05;
          
          &.circle-1 {
            width: 400px;
            height: 400px;
            top: -200px;
            right: -100px;
          }
          
          &.circle-2 {
            width: 300px;
            height: 300px;
            bottom: -150px;
            left: -80px;
          }
        }
      }
      
      .chinese-pattern {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.02;
        background-image: 
          repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(102, 126, 234, 0.1) 50px, rgba(102, 126, 234, 0.1) 51px),
          repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(102, 126, 234, 0.1) 50px, rgba(102, 126, 234, 0.1) 51px);
      }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      padding: 80px 60px;
      
      .poem-header {
        text-align: center;
        margin-bottom: 60px;
        
        .header-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          
          .decoration-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          
          .decoration-line {
            width: 60px;
            height: 3px;
            border-radius: 2px;
          }
        }
        
        .poem-title {
          font-size: 56px;
          font-weight: 800;
          color: #2C3E50;
          margin: 0 0 32px 0;
          font-family: 'STKaiti', '楷体', serif;
          letter-spacing: 4px;
          line-height: 1.3;
        }
        
        .poem-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          
          .meta-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            border-radius: 30px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            
            .badge-icon {
              font-size: 20px;
            }
          }
          
          .meta-divider {
            font-size: 24px;
            color: #BDC3C7;
          }
          
          .meta-author {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .author-label {
              font-size: 14px;
              color: #7F8C8D;
            }
            
            .author-name {
              font-size: 18px;
              font-weight: 600;
              color: #2C3E50;
            }
          }
        }
      }
      
      .poem-content-area {
        position: relative;
        max-width: 800px;
        margin: 0 auto 50px;
        
        .content-decoration-left,
        .content-decoration-right {
          position: absolute;
          top: -20px;
          
          .quote-mark {
            font-size: 120px;
            font-family: Georgia, serif;
            color: rgba(102, 126, 234, 0.06);
            font-weight: bold;
          }
        }
        
        .content-decoration-left {
          left: -80px;
        }
        
        .content-decoration-right {
          right: -80px;
          
          .quote-mark {
            transform: rotate(180deg);
          }
        }
        
        .poem-body {
          position: relative;
          padding: 40px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 0.95) 100%);
          border-radius: 24px;
          transition: max-height 0.4s ease;
          
          &.collapsed {
            max-height: 300px;
            overflow: hidden;
          }
          
          .poem-text {
            font-size: 24px;
            line-height: 2.5;
            color: #2C3E50;
            text-align: center;
            font-family: 'STKaiti', '楷体', serif;
            white-space: pre-wrap;
            
            :deep(p) {
              margin: 0;
            }
            
            :deep(br) {
              display: block;
              content: '';
              margin-top: 20px;
            }
          }
          
          .fade-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: linear-gradient(to bottom, transparent 0%, white 80%);
            pointer-events: none;
          }
        }
        
        .content-expand {
          margin-top: 20px;
        }
      }
      
      .action-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
        
        .action-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          
          .btn-icon {
            z-index: 1;
          }
          
          .btn-text {
            z-index: 1;
          }
          
          .btn-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
          }
          
          &.primary {
            color: white;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
            
            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
              
              .btn-glow {
                width: 300px;
                height: 300px;
              }
            }
          }
          
          &.secondary {
            background: white;
            border: 2px solid;
            
            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%);
            }
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
        }
      }
    }
  }
  
  // 内容网格
  .content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    
    .content-card {
      position: relative;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.4s ease;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 50px rgba(0, 0, 0, 0.12);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 2px solid #F0F2F5;
        position: relative;
        
        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .card-title {
          flex: 1;
          font-size: 26px;
          font-weight: 700;
          color: #2C3E50;
          margin: 0;
        }
        
        .card-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s ease;
        }
      }
      
      &:hover .card-decoration {
        transform: scaleX(1);
      }
      
      .card-body {
        position: relative;
        transition: max-height 0.4s ease;
        
        &.collapsed {
          max-height: 300px;
          overflow: hidden;
        }
        
        .card-text {
          font-size: 17px;
          line-height: 2.2;
          color: #34495e;
          margin: 0;
          
          :deep(p) {
            margin: 0 0 20px 0;
            text-indent: 2em;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
          
          :deep(strong) {
            color: #667eea;
            font-weight: 600;
          }
        }
        
        .fade-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, transparent 0%, white 70%);
          pointer-events: none;
        }
      }
      
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 28px;
        padding-top: 24px;
        border-top: 1px solid #F0F2F5;
        
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
      }
      
      &:hover .card-footer .dot {
        opacity: 0.6;
        animation: pulse-dot 1.5s ease-in-out infinite;
        
        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }
  }
  
  // 展开按钮
  .expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 24px;
    padding: 14px 24px;
    background: #F8F9FA;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    .expand-icon {
      transition: transform 0.3s ease;
      
      &.rotated {
        transform: rotate(180deg);
      }
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
    }
  }
  
  // 隐藏的音频元素
  .hidden {
    display: none;
  }
}

// AI图片对话框
.modern-image-dialog {
  :deep(.el-dialog__header) {
    padding: 24px 24px 16px;
    border-bottom: 2px solid #F0F2F5;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  .image-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F8F9FA;
    
    .ai-image {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .loading-placeholder {
      text-align: center;
      padding: 60px 20px;
      
      .loading-icon {
        color: #BDC3C7;
        margin-bottom: 20px;
      }
      
      .loading-text {
        font-size: 16px;
        color: #7F8C8D;
        margin: 0;
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

// 动画
@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.8;
  }
}

// 响应式
@media screen and (max-width: 1024px) {
  .poem-details-page {
    .poem-hero .hero-content {
      padding: 60px 40px;
      
      .poem-content-area {
        .content-decoration-left,
        .content-decoration-right {
          display: none;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .poem-details-page {
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
    
    .poem-hero {
      border-radius: 20px;
      margin-bottom: 32px;
      
      .hero-content {
        padding: 40px 24px;
        
        .poem-header {
          margin-bottom: 40px;
          
          .poem-title {
            font-size: 36px;
          }
          
          .poem-meta {
            flex-direction: column;
            gap: 12px;
            
            .meta-divider {
              display: none;
            }
            
            .meta-badge {
              padding: 10px 24px;
              font-size: 14px;
            }
          }
        }
        
        .poem-content-area {
          margin-bottom: 36px;
          
          .poem-body {
            padding: 28px 20px;
            
            .poem-text {
              font-size: 20px;
              line-height: 2.2;
            }
          }
        }
        
        .action-section {
          gap: 12px;
          
          .action-btn {
            flex: 1;
            min-width: 0;
            padding: 14px 20px;
            font-size: 14px;
            
            .btn-text {
              display: none;
            }
          }
        }
      }
    }
    
    .content-grid {
      gap: 24px;
      
      .content-card {
        padding: 28px 20px;
        
        .card-header {
          .card-icon {
            width: 44px;
            height: 44px;
          }
          
          .card-title {
            font-size: 22px;
          }
        }
        
        .card-body .card-text {
          font-size: 15px;
          line-height: 2;
        }
      }
    }
  }
}
</style>