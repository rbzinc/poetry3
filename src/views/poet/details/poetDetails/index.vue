<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Document, Reading, ChatDotRound, VideoPlay, VideoPause } from '@element-plus/icons-vue'
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
const isopen = ref(true)
const isTranslationOpen = ref(true)
const isContentOpen = ref(true)

// 媒体相关
const audioPlayer = ref(null)
const audioUrl = ref('')
const imageUrl = ref('')

// 计算属性
const playIcon = computed(() => (isPlaying.value ? VideoPause : VideoPlay))
const playText = computed(() => (isPlaying.value ? '暂停朗读' : '开始朗读'))
const expandText = computed(() => (isopen.value ? '展开完整赏析' : '收起赏析内容'))
const expandTranslationText = computed(() => (isTranslationOpen.value ? '展开完整译文' : '收起译文内容'))
const expandContentText = computed(() => (isContentOpen.value ? '展开完整内容' : '收起诗词内容'))

// 判断赏析内容是否需要展开按钮
const needExpand = computed(() => {
  if (!shangxi.value) return false
  // 去除HTML标签后计算纯文本长度
  const plainText = shangxi.value.replace(/<[^>]+>/g, '')
  return plainText.length > 20
})

// 判断译文是否需要展开按钮
const needTranslationExpand = computed(() => {
  if (!translation.value) return false
  return translation.value.length > 20
})

// 判断诗词内容是否需要展开按钮
const needContentExpand = computed(() => {
  if (!content.value) return false
  // 去除HTML标签后计算纯文本长度
  const plainText = content.value.replace(/<[^>]+>/g, '')
  return plainText.length > 50
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

    // 设置页面标题
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

// 译文展开/收起
const toggleTranslation = () => {
  isTranslationOpen.value = !isTranslationOpen.value
}

// 诗词内容展开/收起
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

  // 添加音频播放结束事件监听
  if (audioPlayer.value) {
    audioPlayer.value.addEventListener('ended', handleAudioEnded)
  }
})

// 组件销毁前清理事件监听
onBeforeUnmount(() => {
  if (audioPlayer.value) {
    audioPlayer.value.removeEventListener('ended', handleAudioEnded)
  }
})
</script>

<template>
  <div class="poem-page" v-loading.fullscreen.lock="isLoading && !dialogFormVisible">
    <div class="poem-container">
      <!-- 诗词主体内容区 -->
      <section class="main-content">
        <div class="poem-header">
          <h1 class="title">{{ poemtitle }}</h1>
          <p class="author">{{ writer }} · {{ dynasty }}</p>
        </div>

        <div class="poem-content" :class="{ collapsed: isContentOpen && needContentExpand }">
          <div class="poem-body" v-html="content"></div>
        </div>

        <div class="expand-button" v-if="needContentExpand" @click="togglePoemContent">
          {{ expandContentText }}
        </div>

        <div class="action-buttons">
          <audio ref="audioPlayer" :src="audioUrl" class="hidden" preload="none"></audio>
          <el-button class="action-btn" type="primary" @click="handlePlayClick" :disabled="isLoading">
            <el-icon><component :is="playIcon" /></el-icon>
            <span>{{ playText }}</span>
          </el-button>

          <el-button
            class="action-btn"
            type="success"
            @click="showImageDialog"
            :loading="isLoading && dialogFormVisible"
            :disabled="isLoading && !dialogFormVisible"
          >
            <el-icon><Picture /></el-icon>
            <span>AI意境图</span>
          </el-button>
        </div>
      </section>

      <!-- 翻译区域 -->
      <section class="translation-section" v-if="translation">
        <div class="section-content" :class="{ collapsed: isTranslationOpen && needTranslationExpand }">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>译文赏析</span>
          </div>
          <div class="translation-content">{{ translation }}</div>
        </div>
        <div class="expand-button" v-if="needTranslationExpand" @click="toggleTranslation">
          {{ expandTranslationText }}
        </div>
      </section>

      <!-- 赏析区域 -->
      <section class="appreciation-section" v-if="shangxi">
        <div class="section-content" :class="{ collapsed: isopen && needExpand }">
          <div class="section-title">
            <el-icon><Reading /></el-icon>
            <span>诗词赏析</span>
          </div>
          <div class="appreciation-content" v-html="shangxi"></div>
        </div>
        <div class="expand-button" v-if="needExpand" @click="toggleContent">
          {{ expandText }}
        </div>
      </section>

      <!-- 评论区域 -->
      <section class="comments-section" v-if="remarks">
        <div class="section-title">
          <el-icon><ChatDotRound /></el-icon>
          <span>评论鉴赏</span>
        </div>
        <div class="section-content">{{ remarks }}</div>
      </section>
    </div>

    <!-- AI图片对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="AI意境图"
      width="800px"
      destroy-on-close
      class="image-dialog"
      :close-on-click-modal="false"
    >
      <div class="image-container" v-loading="isLoading && dialogFormVisible">
        <img v-if="imageUrl" :src="imageUrl" alt="AI生成的意境图" />
        <div v-else class="no-image">正在生成意境图，请稍候...</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="showImageDialog()" :loading="isLoading && dialogFormVisible">
            重新生成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.poem-page {
  min-height: 100vh;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  padding: 40px 20px;

  .poem-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 40px rgba(0, 0, 0, 0.15);
    }
  }

  .main-content {
    text-align: center;
    padding: 0;
    overflow: hidden;

    .poem-header {
      padding: 30px 30px 0;
      margin-bottom: 20px;

      .title {
        font-size: 2.5em;
        color: #2c3e50;
        margin-bottom: 15px;
        font-weight: 600;
      }

      .author {
        font-size: 1.3em;
        color: #34495e;
        margin: 0;
      }
    }

    .poem-content {
      padding: 0 30px;
      transition: all 0.3s ease;

      &.collapsed {
        max-height: 200px;
        overflow: hidden;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
        }
      }

      .poem-body {
        font-size: 1.4em;
        line-height: 2;
        color: #2c3e50;
        margin: 20px 0;
        text-align: center;
      }
    }

    .expand-button {
      padding: 15px;
      text-align: center;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(238, 238, 238, 0.9));
      cursor: pointer;
      font-size: 1.1em;
      color: #2c3e50;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(238, 238, 238, 1));
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
      padding: 0 30px 30px;

      .action-btn {
        padding: 12px 24px;
        font-size: 1.1em;
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 1.2em;
        }
      }
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.3em;
    color: #2c3e50;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #eee;

    .el-icon {
      font-size: 1.2em;
    }
  }

  .section-content {
    font-size: 1.1em;
    line-height: 1.8;
    color: #34495e;
  }

  .translation-section {
    padding: 0;
    overflow: hidden;

    .section-content {
      padding: 30px;
      transition: all 0.3s ease;

      &.collapsed {
        max-height: 200px;
        overflow: hidden;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
        }
      }
    }

    .expand-button {
      padding: 15px;
      text-align: center;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(238, 238, 238, 0.9));
      cursor: pointer;
      font-size: 1.1em;
      color: #2c3e50;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(238, 238, 238, 1));
      }
    }
  }

  .appreciation-section {
    padding: 0;
    overflow: hidden;

    .section-content {
      padding: 30px;
      transition: all 0.3s ease;

      &.collapsed {
        max-height: 200px;
        overflow: hidden;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
        }
      }
    }

    .expand-button {
      padding: 15px;
      text-align: center;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(238, 238, 238, 0.9));
      cursor: pointer;
      font-size: 1.1em;
      color: #2c3e50;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(238, 238, 238, 1));
      }
    }
  }

  .comments-section {
    padding: 30px;
  }
}

.image-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;

    .el-dialog__header {
      margin: 0;
      padding: 20px;
      background: #f8f9fa;
    }

    .el-dialog__body {
      padding: 30px;
    }
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;

    img {
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .no-image {
      color: #909399;
      font-size: 16px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding-top: 20px;
  }
}

.hidden {
  display: none;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .poem-page {
    padding: 20px 10px;

    .poem-container {
      gap: 20px;
    }

    section {
      padding: 20px;
    }

    .main-content {
      .poem-header {
        .title {
          font-size: 2em;
        }
        .author {
          font-size: 1.1em;
        }
      }

      .poem-content {
        .poem-body {
          font-size: 1.2em;
        }
      }
    }

    .action-buttons {
      flex-direction: column;
      .action-btn {
        width: 100%;
      }
    }
  }
}
</style>
