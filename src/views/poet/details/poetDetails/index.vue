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
  <div class="poem-sanctuary" v-loading.fullscreen.lock="isLoading && !dialogFormVisible">
    <!-- 优雅的返回按钮 -->
    <button class="elegant-back-btn" @click="goBack">
      <el-icon class="back-icon"><ArrowLeft /></el-icon>
      <span class="back-text">返回书阁</span>
    </button>

    <div class="sanctuary-container">
      <!-- 诗词主展示区域 - 中国风卡片 -->
      <article class="poem-showcase">
        <!-- 朝代装饰条 -->
        <div class="dynasty-ribbon" :style="{ background: getDynastyTheme.gradient }">
          <span class="ribbon-icon">{{ getDynastyTheme.icon }}</span>
          <span class="ribbon-text">{{ dynasty }}</span>
        </div>

        <!-- 诗词头部 -->
        <header class="showcase-header">
          <div class="vertical-decoration left">
            <div class="seal-mark" :style="{ borderColor: getDynastyTheme.color }">诗</div>
          </div>
          
          <div class="header-content">
            <h1 class="poem-title-main">{{ poemtitle }}</h1>
            <div class="author-info">
              <span class="dynasty-tag" :style="{ background: getDynastyTheme.lightBg, color: getDynastyTheme.color }">
                {{ dynasty }}
              </span>
              <span class="author-divider">·</span>
              <span class="author-name">{{ writer }}</span>
            </div>
          </div>

          <div class="vertical-decoration right">
            <div class="seal-mark" :style="{ borderColor: getDynastyTheme.color }">词</div>
          </div>
        </header>

        <!-- 诗词正文 - 竖排风格 -->
        <section class="poem-main-content">
          <div class="content-wrapper" :class="{ 'collapsed': !isContentOpen && needContentExpand }">
            <div class="poem-verses" v-html="content"></div>
            <div class="content-fade-mask" v-if="!isContentOpen && needContentExpand"></div>
          </div>
          
          <button 
            v-if="needContentExpand" 
            class="expand-toggle"
            :style="{ color: getDynastyTheme.color }"
            @click="togglePoemContent"
          >
            <span>{{ isContentOpen ? '收起' : '展开全文' }}</span>
            <el-icon :class="{ 'rotated': isContentOpen }"><ArrowDown /></el-icon>
          </button>
        </section>

        <!-- 交互按钮组 -->
        <footer class="showcase-actions">
          <audio ref="audioPlayer" :src="audioUrl" class="hidden" preload="none"></audio>
          
          <div class="action-buttons">
            <button 
              class="poem-action-btn primary-action"
              :style="{ 
                background: getDynastyTheme.gradient,
                boxShadow: `0 8px 24px ${getDynastyTheme.color}40`
              }"
              @click="handlePlayClick" 
              :disabled="isLoading"
            >
              <el-icon :size="20"><component :is="playIcon" /></el-icon>
              <span>{{ playText }}</span>
              <div class="ripple-effect"></div>
            </button>

            <button
              class="poem-action-btn secondary-action"
              :style="{ borderColor: getDynastyTheme.color, color: getDynastyTheme.color }"
              @click="showImageDialog"
              :disabled="isLoading && !dialogFormVisible"
            >
              <el-icon :size="20"><MagicStick /></el-icon>
              <span>意境图</span>
            </button>

            <button
              class="poem-action-btn secondary-action"
              :style="{ borderColor: getDynastyTheme.color, color: getDynastyTheme.color }"
            >
              <el-icon :size="20"><Star /></el-icon>
              <span>收藏</span>
            </button>
          </div>
        </footer>
      </article>

      <!-- 附加内容区域 - 两栏布局 -->
      <div class="supplementary-content">
        <!-- 译文区块 -->
        <section 
          class="content-block translation-block" 
          v-if="translation && translation !== '暂无译文'"
        >
          <div class="block-header">
            <div class="header-badge" :style="{ background: getDynastyTheme.gradient }">
              <el-icon :size="20"><Document /></el-icon>
            </div>
            <h3 class="block-title">译文</h3>
            <div class="title-underline" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div class="block-content" :class="{ 'collapsed': !isTranslationOpen && needTranslationExpand }">
            <p class="content-text">{{ translation }}</p>
            <div class="read-more-fade" v-if="!isTranslationOpen && needTranslationExpand"></div>
          </div>
          
          <button 
            v-if="needTranslationExpand"
            class="read-more-btn"
            :style="{ color: getDynastyTheme.color }"
            @click="toggleTranslation"
          >
            {{ isTranslationOpen ? '收起' : '展开阅读' }}
            <el-icon :class="{ 'rotated': isTranslationOpen }"><ArrowDown /></el-icon>
          </button>
        </section>

        <!-- 赏析区块 -->
        <section 
          class="content-block appreciation-block" 
          v-if="shangxi && shangxi !== '暂无赏析'"
        >
          <div class="block-header">
            <div class="header-badge" :style="{ background: getDynastyTheme.gradient }">
              <el-icon :size="20"><Reading /></el-icon>
            </div>
            <h3 class="block-title">赏析</h3>
            <div class="title-underline" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div class="block-content" :class="{ 'collapsed': !isopen && needExpand }">
            <div class="content-text" v-html="shangxi"></div>
            <div class="read-more-fade" v-if="!isopen && needExpand"></div>
          </div>
          
          <button 
            v-if="needExpand"
            class="read-more-btn"
            :style="{ color: getDynastyTheme.color }"
            @click="toggleContent"
          >
            {{ isopen ? '收起' : '展开阅读' }}
            <el-icon :class="{ 'rotated': isopen }"><ArrowDown /></el-icon>
          </button>
        </section>

        <!-- 评论鉴赏区块 -->
        <section 
          class="content-block review-block" 
          v-if="remarks && remarks !== '暂无评论'"
        >
          <div class="block-header">
            <div class="header-badge" :style="{ background: getDynastyTheme.gradient }">
              <el-icon :size="20"><ChatDotRound /></el-icon>
            </div>
            <h3 class="block-title">评论鉴赏</h3>
            <div class="title-underline" :style="{ background: getDynastyTheme.gradient }"></div>
          </div>
          
          <div class="block-content">
            <p class="content-text">{{ remarks }}</p>
          </div>
        </section>
      </div>
    </div>

    <!-- AI意境图对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      width="90%"
      :style="{ maxWidth: '1000px' }"
      destroy-on-close
      class="ai-image-modal"
    >
      <template #header>
        <div class="modal-header">
          <el-icon :size="24" class="modal-icon"><MagicStick /></el-icon>
          <span class="modal-title">AI诗词意境图</span>
        </div>
      </template>
      
      <div class="modal-image-wrapper" v-loading="isLoading && dialogFormVisible">
        <img v-if="imageUrl" :src="imageUrl" alt="AI生成的诗词意境图" class="modal-image" />
        <div v-else class="image-loading-state">
          <el-icon class="loading-icon" :size="72"><Picture /></el-icon>
          <p class="loading-message">AI正在为您创作意境图...</p>
        </div>
      </div>
      
      <template #footer>
        <div class="modal-footer">
          <el-button @click="dialogFormVisible = false" size="large">关闭</el-button>
          <el-button 
            type="primary" 
            @click="showImageDialog()" 
            :loading="isLoading && dialogFormVisible"
            size="large"
          >
            <el-icon><MagicStick /></el-icon>
            <span>重新生成</span>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.poem-sanctuary {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fafbfc 0%, #f5f7fa 100%);
  padding: 40px 20px 80px;
  
  // 优雅的返回按钮
  .elegant-back-btn {
    position: fixed;
    top: 90px;
    left: 30px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 26px;
    background: white;
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-radius: 30px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 15px;
    font-weight: 600;
    color: #5a6c7d;
    
    .back-icon {
      transition: transform 0.4s ease;
    }
    
    &:hover {
      transform: translateX(-6px) scale(1.02);
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
      color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      
      .back-icon {
        transform: translateX(-4px);
      }
    }
  }
  
  .sanctuary-container {
    max-width: 1100px;
    margin: 0 auto;
  }
  
  // 诗词主展示区域
  .poem-showcase {
    position: relative;
    background: white;
    border-radius: 28px;
    overflow: visible;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.06);
    margin-bottom: 40px;
    padding: 48px 56px 40px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    // 朝代装饰条
    .dynasty-ribbon {
      position: absolute;
      top: 0;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      border-radius: 0 0 16px 16px;
      color: white;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
      transition: all 0.3s ease;
      
      .ribbon-icon {
        font-size: 18px;
      }
      
      &:hover {
        transform: translateY(2px);
      }
    }
    
    // 诗词头部
    .showcase-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 2px solid #f5f7fa;
      
      .vertical-decoration {
        display: flex;
        align-items: center;
        
        .seal-mark {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid;
          border-radius: 8px;
          font-size: 20px;
          font-weight: 800;
          font-family: 'STKaiti', '楷体', serif;
          transform: rotate(10deg);
          opacity: 0.4;
        }
      }
      
      .header-content {
        flex: 1;
        text-align: center;
        
        .poem-title-main {
          font-size: 48px;
          font-weight: 900;
          color: #2c3e50;
          margin: 0 0 20px 0;
          font-family: 'STKaiti', '楷体', serif;
          letter-spacing: 6px;
          line-height: 1.4;
        }
        
        .author-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          
          .dynasty-tag {
            padding: 6px 18px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .author-divider {
            color: #bdc3c7;
            font-size: 18px;
          }
          
          .author-name {
            font-size: 17px;
            font-weight: 600;
            color: #5a6c7d;
          }
        }
      }
    }
    
    // 诗词正文
    .poem-main-content {
      margin-bottom: 40px;
      
      .content-wrapper {
        position: relative;
        padding: 36px 48px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(255, 255, 255, 0.9) 100%);
        border-radius: 20px;
        border: 2px solid rgba(102, 126, 234, 0.08);
        transition: all 0.4s ease;
        
        &.collapsed {
          max-height: 350px;
          overflow: hidden;
        }
        
        .poem-verses {
          font-size: 26px;
          line-height: 2.6;
          color: #2c3e50;
          text-align: center;
          font-family: 'STKaiti', '楷体', serif;
          white-space: pre-wrap;
          
          :deep(p) {
            margin: 0;
          }
          
          :deep(br) {
            display: block;
            content: '';
            margin-top: 16px;
          }
        }
        
        .content-fade-mask {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 120px;
          background: linear-gradient(to bottom, transparent 0%, white 85%);
          pointer-events: none;
          border-radius: 0 0 20px 20px;
        }
      }
      
      .expand-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: auto;
        margin: 20px auto 0;
        padding: 10px 24px;
        background: transparent;
        border: none;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .el-icon {
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
        }
        
        &:hover {
          background: rgba(102, 126, 234, 0.06);
        }
      }
    }
    
    // 交互按钮组
    .showcase-actions {
      .action-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
        
        .poem-action-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          
          .ripple-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: translate(-50%, -50%);
            transition: width 0.5s ease, height 0.5s ease;
          }
          
          &.primary-action {
            color: white;
            border: none;
            
            &:hover:not(:disabled) {
              transform: translateY(-3px) scale(1.02);
              
              .ripple-effect {
                width: 250px;
                height: 250px;
              }
            }
          }
          
          &.secondary-action {
            background: white;
            border: 2px solid;
            
            &:hover:not(:disabled) {
              transform: translateY(-3px);
              background: rgba(102, 126, 234, 0.04);
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
            }
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  
  // 附加内容区域
  .supplementary-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    
    .content-block {
      background: white;
      border-radius: 24px;
      padding: 36px 40px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.4s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
      }
      
      .block-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;
        padding-bottom: 18px;
        position: relative;
        
        .header-badge {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .block-title {
          flex: 1;
          font-size: 22px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        
        .title-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          border-radius: 2px;
        }
      }
      
      .block-content {
        position: relative;
        transition: max-height 0.4s ease;
        
        &.collapsed {
          max-height: 320px;
          overflow: hidden;
        }
        
        .content-text {
          font-size: 16px;
          line-height: 2.1;
          color: #495057;
          margin: 0;
          
          :deep(p) {
            margin: 0 0 18px 0;
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
        
        .read-more-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, transparent 0%, white 75%);
          pointer-events: none;
        }
      }
      
      .read-more-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        margin-top: 20px;
        padding: 12px;
        background: #f8f9fa;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .el-icon {
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
        }
        
        &:hover {
          background: rgba(102, 126, 234, 0.08);
          transform: translateY(-2px);
        }
      }
    }
  }
  
  // 隐藏音频
  .hidden {
    display: none;
  }
}

// AI意境图对话框
.ai-image-modal {
  :deep(.el-dialog__header) {
    padding: 24px 28px 20px;
    border-bottom: 2px solid #f0f2f5;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .modal-icon {
      color: #667eea;
    }
    
    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
    }
  }
  
  .modal-image-wrapper {
    min-height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafbfc;
    
    .modal-image {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .image-loading-state {
      text-align: center;
      padding: 80px 30px;
      
      .loading-icon {
        color: #d0d7de;
        margin-bottom: 24px;
        animation: float 2.5s ease-in-out infinite;
      }
      
      .loading-message {
        font-size: 16px;
        color: #7f8c8d;
        margin: 0;
      }
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

// 响应式
@media screen and (max-width: 1024px) {
  .poem-sanctuary {
    .poem-showcase {
      padding: 40px 36px 32px;
      
      .showcase-header {
        .vertical-decoration {
          display: none;
        }
        
        .header-content .poem-title-main {
          font-size: 40px;
        }
      }
      
      .poem-main-content .content-wrapper .poem-verses {
        font-size: 22px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .poem-sanctuary {
    padding: 24px 16px 60px;
    
    .elegant-back-btn {
      top: 70px;
      left: 16px;
      padding: 10px 18px;
      
      .back-text {
        display: none;
      }
    }
    
    .poem-showcase {
      padding: 32px 24px 28px;
      border-radius: 20px;
      
      .dynasty-ribbon {
        right: 20px;
        font-size: 13px;
        padding: 8px 16px;
      }
      
      .showcase-header {
        gap: 0;
        margin-bottom: 32px;
        
        .header-content {
          .poem-title-main {
            font-size: 32px;
            letter-spacing: 3px;
          }
          
          .author-info {
            flex-wrap: wrap;
            
            .author-divider {
              display: none;
            }
          }
        }
      }
      
      .poem-main-content {
        .content-wrapper {
          padding: 24px 20px;
          
          .poem-verses {
            font-size: 20px;
            line-height: 2.3;
          }
        }
      }
      
      .showcase-actions .action-buttons {
        gap: 10px;
        
        .poem-action-btn {
          flex: 1;
          min-width: 0;
          padding: 12px 20px;
          font-size: 14px;
          
          span {
            display: none;
          }
        }
      }
    }
    
    .supplementary-content {
      gap: 20px;
      
      .content-block {
        padding: 28px 24px;
        border-radius: 20px;
        
        .block-header {
          .header-badge {
            width: 38px;
            height: 38px;
          }
          
          .block-title {
            font-size: 19px;
          }
        }
        
        .block-content .content-text {
          font-size: 15px;
          line-height: 2;
        }
      }
    }
  }
}

@media screen and (min-width: 1200px) {
  .poem-sanctuary {
    .supplementary-content {
      grid-template-columns: repeat(2, 1fr);
      
      .review-block {
        grid-column: 1 / -1;
      }
    }
  }
}
</style>
