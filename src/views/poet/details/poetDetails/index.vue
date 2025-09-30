<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Document, Reading, ChatDotRound, VideoPlay, VideoPause, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { aiAudioGetApi, userAIDraowGetApi } from '@/api/modules/aiChat.js'
import { getPoemDetatils } from '@/api/index.js'

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

// 判断赏析内容是否需要展开按钮
const needExpand = computed(() => {
  if (!shangxi.value) return false
  const plainText = shangxi.value.replace(/<[^>]+>/g, '')
  return plainText.length > 200
})

// 判断译文是否需要展开按钮
const needTranslationExpand = computed(() => {
  if (!translation.value) return false
  return translation.value.length > 200
})

// 判断诗词内容是否需要展开按钮
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

    document.title = `${poemtitle.value} - ${writer.value} | 诗词书阁`
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
      await audioPlayer.value.load()
      await audioPlayer.value.play()
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    ElMessage.error('音频播放失败：' + error.message)
    console.error('音频播放失败：', error)
    isPlaying.value = false
  } finally {
    isLoading.value = false
  }
}

// 图片处理
const showImageDialog = async () => {
  dialogFormVisible.value = true

  if (imageUrl.value) return

  try {
    isLoading.value = true
    const { data } = await userAIDraowGetApi(routerPathId.value)
    if (!data) throw new Error('生成图片失败')
    imageUrl.value = data
  } catch (error) {
    ElMessage.error('生成图片失败：' + error.message)
    console.error('生成图片失败：', error)
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
  <div class="modern-poem-page" v-loading.fullscreen.lock="isLoading && !dialogFormVisible">
    <div class="poem-container">
      <!-- Hero区域 - 诗词主体 -->
      <section class="poem-hero">
        <div class="hero-decoration">
          <div class="decoration-line line-1"></div>
          <div class="decoration-line line-2"></div>
        </div>
        
        <div class="poem-header">
          <h1 class="poem-title">{{ poemtitle }}</h1>
          <div class="poem-meta">
            <span class="dynasty-badge">{{ dynasty }}</span>
            <span class="author-name">{{ writer }}</span>
          </div>
        </div>

        <div class="poem-content-wrapper">
          <div 
            class="poem-body" 
            :class="{ 'collapsed': !isContentOpen && needContentExpand }"
            v-html="content"
          ></div>
          
          <button 
            v-if="needContentExpand" 
            class="expand-btn"
            @click="togglePoemContent"
          >
            <span>{{ isContentOpen ? '收起' : '展开全文' }}</span>
            <el-icon class="expand-icon" :class="{ 'rotated': isContentOpen }">
              <ArrowDown />
            </el-icon>
          </button>
        </div>

        <div class="action-buttons">
          <audio ref="audioPlayer" :src="audioUrl" class="hidden" preload="none"></audio>
          
          <button 
            class="modern-action-btn primary"
            @click="handlePlayClick" 
            :disabled="isLoading"
          >
            <el-icon class="btn-icon" :size="20">
              <component :is="playIcon" />
            </el-icon>
            <span class="btn-text">{{ playText }}</span>
          </button>

          <button
            class="modern-action-btn secondary"
            @click="showImageDialog"
            :disabled="isLoading && !dialogFormVisible"
          >
            <el-icon class="btn-icon" :size="20"><Picture /></el-icon>
            <span class="btn-text">AI意境图</span>
          </button>
        </div>
      </section>

      <!-- 译文区域 -->
      <section class="content-section" v-if="translation && translation !== '暂无译文'">
        <div class="section-header">
          <div class="section-icon">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <h2 class="section-title">译文</h2>
        </div>
        
        <div 
          class="section-body"
          :class="{ 'collapsed': !isTranslationOpen && needTranslationExpand }"
        >
          <p class="section-text">{{ translation }}</p>
        </div>
        
        <button 
          v-if="needTranslationExpand"
          class="expand-btn"
          @click="toggleTranslation"
        >
          <span>{{ isTranslationOpen ? '收起' : '展开全文' }}</span>
          <el-icon class="expand-icon" :class="{ 'rotated': isTranslationOpen }">
            <ArrowDown />
          </el-icon>
        </button>
      </section>

      <!-- 赏析区域 -->
      <section class="content-section" v-if="shangxi && shangxi !== '暂无赏析'">
        <div class="section-header">
          <div class="section-icon">
            <el-icon :size="24"><Reading /></el-icon>
          </div>
          <h2 class="section-title">赏析</h2>
        </div>
        
        <div 
          class="section-body"
          :class="{ 'collapsed': !isopen && needExpand }"
        >
          <div class="section-text" v-html="shangxi"></div>
        </div>
        
        <button 
          v-if="needExpand"
          class="expand-btn"
          @click="toggleContent"
        >
          <span>{{ isopen ? '收起' : '展开全文' }}</span>
          <el-icon class="expand-icon" :class="{ 'rotated': isopen }">
            <ArrowDown />
          </el-icon>
        </button>
      </section>

      <!-- 评论区域 -->
      <section class="content-section" v-if="remarks && remarks !== '暂无评论'">
        <div class="section-header">
          <div class="section-icon">
            <el-icon :size="24"><ChatDotRound /></el-icon>
          </div>
          <h2 class="section-title">评论鉴赏</h2>
        </div>
        
        <div class="section-body">
          <p class="section-text">{{ remarks }}</p>
        </div>
      </section>
    </div>

    <!-- AI图片对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="AI意境图"
      width="90%"
      :style="{ maxWidth: '800px' }"
      destroy-on-close
      class="modern-image-dialog"
    >
      <div class="image-container" v-loading="isLoading && dialogFormVisible">
        <img v-if="imageUrl" :src="imageUrl" alt="AI生成的意境图" class="ai-image" />
        <div v-else class="loading-placeholder">
          <el-icon class="loading-icon" :size="48"><Picture /></el-icon>
          <p>正在生成意境图，请稍候...</p>
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
.modern-poem-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px 60px;

  .poem-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  // Hero区域
  .poem-hero {
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
      
      .decoration-line {
        position: absolute;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
        
        &.line-1 {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          top: -150px;
          right: -100px;
        }
        
        &.line-2 {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          bottom: -100px;
          left: -50px;
          opacity: 0.5;
        }
      }
    }
    
    .poem-header {
      position: relative;
      z-index: 1;
      text-align: center;
      margin-bottom: 40px;
      
      .poem-title {
        font-size: 42px;
        font-weight: 700;
        color: #2C3E50;
        margin: 0 0 20px 0;
        font-family: 'STKaiti', '楷体', serif;
        letter-spacing: 2px;
      }
      
      .poem-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        
        .dynasty-badge {
          padding: 8px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .author-name {
          font-size: 20px;
          color: #7F8C8D;
          font-weight: 500;
        }
      }
    }
    
    .poem-content-wrapper {
      position: relative;
      z-index: 1;
      margin-bottom: 40px;
      
      .poem-body {
        font-size: 24px;
        line-height: 2.2;
        color: #2C3E50;
        text-align: center;
        font-family: 'STKaiti', '楷体', serif;
        transition: max-height 0.4s ease;
        
        &.collapsed {
          max-height: 300px;
          overflow: hidden;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: linear-gradient(to bottom, transparent, white);
            pointer-events: none;
          }
        }
      }
    }
    
    .action-buttons {
      position: relative;
      z-index: 1;
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      
      .modern-action-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 32px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .btn-icon {
          transition: transform 0.3s ease;
        }
        
        &.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.4);
            
            .btn-icon {
              transform: scale(1.1);
            }
          }
        }
        
        &.secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
            transform: translateY(-2px);
          }
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  // 内容区域
  .content-section {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #ECF0F1;
      
      .section-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #667eea;
      }
      
      .section-title {
        font-size: 24px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0;
      }
    }
    
    .section-body {
      transition: max-height 0.4s ease;
      
      &.collapsed {
        max-height: 300px;
        overflow: hidden;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to bottom, transparent, white);
          pointer-events: none;
        }
      }
      
      .section-text {
        font-size: 17px;
        line-height: 2;
        color: #34495e;
        margin: 0;
        text-indent: 2em;
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
    margin-top: 20px;
    padding: 12px;
    background: #F8F9FA;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    color: #7F8C8D;
    cursor: pointer;
    transition: all 0.3s ease;
    
    .expand-icon {
      transition: transform 0.3s ease;
      
      &.rotated {
        transform: rotate(180deg);
      }
    }
    
    &:hover {
      background: #ECF0F1;
      color: #667eea;
    }
  }
}

// 对话框样式
.modern-image-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;

    .el-dialog__header {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      .el-dialog__title {
        color: white;
        font-size: 20px;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
          font-size: 20px;
        }
      }
    }

    .el-dialog__body {
      padding: 32px;
    }
    
    .el-dialog__footer {
      padding: 20px 32px 32px;
    }
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    background: #F8F9FA;
    border-radius: 12px;

    .ai-image {
      max-width: 100%;
      max-height: 600px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .loading-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: #7F8C8D;
      
      .loading-icon {
        color: #BDC3C7;
      }
      
      p {
        margin: 0;
        font-size: 16px;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

.hidden {
  display: none;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .modern-poem-page {
    padding: 20px 12px 40px;

    .poem-container {
      gap: 16px;
    }

    .poem-hero {
      padding: 40px 24px;
      border-radius: 16px;
      
      .poem-header {
        margin-bottom: 32px;
        
        .poem-title {
          font-size: 28px;
        }
        
        .poem-meta {
          flex-direction: column;
          gap: 12px;
          
          .author-name {
            font-size: 16px;
          }
        }
      }
      
      .poem-content-wrapper {
        .poem-body {
          font-size: 18px;
          line-height: 2;
        }
      }
      
      .action-buttons {
        flex-direction: column;
        
        .modern-action-btn {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .content-section {
      padding: 24px 20px;
      border-radius: 16px;
      
      .section-header {
        .section-icon {
          width: 40px;
          height: 40px;
        }
        
        .section-title {
          font-size: 20px;
        }
      }
      
      .section-body {
        .section-text {
          font-size: 15px;
        }
      }
    }
  }
}
</style>