<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { userAIDraowSdadwadwPostApi } from '@/api/modules/aiChat.js'

// 步骤定义
const currentStep = ref(0)
const steps = [
  { title: '输入诗词', icon: 'Edit', desc: '输入想要转换的古诗词' },
  { title: '生成图片', icon: 'Picture', desc: 'AI为您生成诗意图片' },
  { title: '查看结果', icon: 'View', desc: '预览和下载图片' },
]

// 状态管理
const inputPoem = ref('')
const generatedImages = ref([])
const loading = ref(false)
const selectedImageIndex = ref(null)
const isModalVisible = ref(false)
const isFullscreen = ref(false)

// 历史记录
const history = ref([])

// 计算属性
const canProceed = computed(() => {
  if (currentStep.value === 0) return inputPoem.value.trim().length > 0
  if (currentStep.value === 1) return generatedImages.value.length > 0
  return true
})

const currentImage = computed(() => {
  if (selectedImageIndex.value !== null) {
    return generatedImages.value[selectedImageIndex.value]
  }
  return null
})

// 生成图片
const generateImage = async () => {
  if (!inputPoem.value.trim()) {
    ElMessage.warning('请输入古诗词内容')
    return
  }

  try {
    loading.value = true
    const res = await userAIDraowSdadwadwPostApi(inputPoem.value)
    
    if (res && res.data) {
      const newImage = {
        id: Date.now(),
        url: res.data,
        poem: inputPoem.value,
        time: new Date().toLocaleString(),
      }
      
      generatedImages.value.push(newImage)
      history.value.unshift(newImage)
      
      // 自动进入下一步
      currentStep.value = 2
      selectedImageIndex.value = 0
      
      ElMessage.success('图片生成成功！')
    }
  } catch (error) {
    console.error('图片生成失败:', error)
    ElMessage.error('图片生成失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 查看图片
const viewImage = (index) => {
  selectedImageIndex.value = index
  isModalVisible.value = true
  document.body.style.overflow = 'hidden'
}

// 关闭预览
const closeModal = () => {
  isModalVisible.value = false
  isFullscreen.value = false
  document.body.style.overflow = ''
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 下载图片
const downloadImage = (url, poem) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `${poem.substring(0, 10)}_${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('图片下载中')
}

// 重新开始
const reset = () => {
  inputPoem.value = ''
  generatedImages.value = []
  selectedImageIndex.value = null
  currentStep.value = 0
}

// 切换步骤
const goToStep = (step) => {
  if (step === 0) {
    currentStep.value = 0
  } else if (step === 1 && inputPoem.value.trim()) {
    currentStep.value = 1
  } else if (step === 2 && generatedImages.value.length > 0) {
    currentStep.value = 2
  }
}
</script>

<template>
  <div class="chat-to-pic-container">
    <!-- 步骤指示器 -->
    <div class="steps-wrapper">
      <div class="steps-container">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item"
          :class="{ 
            active: currentStep === index,
            completed: currentStep > index,
            clickable: (index === 0) || (index === 1 && inputPoem.trim()) || (index === 2 && generatedImages.length > 0)
          }"
          @click="goToStep(index)"
        >
          <div class="step-icon">
            <el-icon v-if="currentStep > index"><Check /></el-icon>
            <el-icon v-else><component :is="step.icon" /></el-icon>
          </div>
          <div class="step-info">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
          <div v-if="index < steps.length - 1" class="step-line"></div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 历史记录侧边栏 -->
      <div v-if="history.length > 0" class="history-sidebar">
        <div class="sidebar-header">
          <el-icon><Clock /></el-icon>
          <span>生成历史</span>
          <el-tag size="small">{{ history.length }}</el-tag>
        </div>
        <div class="history-list">
          <div
            v-for="item in history.slice(0, 5)"
            :key="item.id"
            class="history-item"
            @click="selectedImageIndex = generatedImages.findIndex(img => img.id === item.id); currentStep = 2"
          >
            <img :src="item.url" alt="历史图片" class="history-thumb" />
            <div class="history-info">
              <div class="history-poem">{{ item.poem.substring(0, 20) }}...</div>
              <div class="history-time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤1: 输入诗词 -->
      <transition name="fade">
        <div v-if="currentStep === 0" class="step-content step-input">
          <div class="content-header">
            <h2>
              <el-icon><Edit /></el-icon>
              输入古诗词
            </h2>
            <p>请输入您想要转换为图片的古诗词内容</p>
          </div>

          <div class="input-section">
            <el-input
              v-model="inputPoem"
              type="textarea"
              :rows="10"
              placeholder="例如：床前明月光，疑是地上霜。举头望明月，低头思故乡。"
              maxlength="500"
              show-word-limit
              class="poem-input"
            />

            <div class="quick-examples">
              <div class="examples-title">快速示例：</div>
              <div class="examples-list">
                <el-tag
                  v-for="(example, i) in [
                    '床前明月光，疑是地上霜',
                    '春眠不觉晓，处处闻啼鸟',
                    '大漠孤烟直，长河落日圆',
                  ]"
                  :key="i"
                  class="example-tag"
                  @click="inputPoem = example"
                >
                  {{ example }}
                </el-tag>
              </div>
            </div>

            <div class="action-buttons">
              <el-button
                type="primary"
                size="large"
                :disabled="!canProceed"
                @click="currentStep = 1"
              >
                下一步
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 步骤2: 生成图片 -->
      <transition name="fade">
        <div v-if="currentStep === 1" class="step-content step-generate">
          <div class="content-header">
            <h2>
              <el-icon><Picture /></el-icon>
              生成图片
            </h2>
            <p>确认诗词内容，点击生成按钮创建图片</p>
          </div>

          <div class="generate-section">
            <div class="poem-preview">
              <div class="preview-label">诗词内容：</div>
              <div class="preview-text">{{ inputPoem }}</div>
            </div>

            <div class="generate-info">
              <el-alert
                title="AI 图片生成提示"
                type="info"
                :closable="false"
                show-icon
              >
                <template #default>
                  <ul class="tips-list">
                    <li>生成过程需要 10-30 秒，请耐心等待</li>
                    <li>AI 会根据诗词意境自动创作图片</li>
                    <li>每次生成的图片可能会有所不同</li>
                  </ul>
                </template>
              </el-alert>
            </div>

            <div class="action-buttons">
              <el-button size="large" @click="currentStep = 0">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
                上一步
              </el-button>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="generateImage"
              >
                <el-icon v-if="!loading"><MagicStick /></el-icon>
                {{ loading ? '生成中...' : '开始生成' }}
              </el-button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 步骤3: 查看结果 -->
      <transition name="fade">
        <div v-if="currentStep === 2" class="step-content step-result">
          <div class="content-header">
            <h2>
              <el-icon><View /></el-icon>
              生成结果
            </h2>
            <p>您的诗意图片已生成完成</p>
          </div>

          <div class="result-section">
            <!-- 当前生成的图片 -->
            <div class="current-result">
              <div class="result-card">
                <img
                  :src="generatedImages[selectedImageIndex || 0]?.url"
                  alt="生成的图片"
                  class="result-image"
                  @click="viewImage(selectedImageIndex || 0)"
                />
                <div class="result-info">
                  <div class="result-poem">{{ generatedImages[selectedImageIndex || 0]?.poem }}</div>
                  <div class="result-time">{{ generatedImages[selectedImageIndex || 0]?.time }}</div>
                </div>
                <div class="result-actions">
                  <el-button
                    type="primary"
                    @click="downloadImage(generatedImages[selectedImageIndex || 0]?.url, generatedImages[selectedImageIndex || 0]?.poem)"
                  >
                    <el-icon><Download /></el-icon>
                    下载图片
                  </el-button>
                  <el-button @click="viewImage(selectedImageIndex || 0)">
                    <el-icon><ZoomIn /></el-icon>
                    查看大图
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button size="large" @click="reset">
                <el-icon class="el-icon--left"><RefreshLeft /></el-icon>
                重新开始
              </el-button>
              <el-button size="large" type="primary" @click="currentStep = 1">
                <el-icon class="el-icon--left"><Plus /></el-icon>
                继续生成
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 图片预览模态框 -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="isModalVisible" class="image-modal" :class="{ fullscreen: isFullscreen }">
          <div class="modal-overlay" @click="closeModal"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h3>图片预览</h3>
              <el-button circle @click="closeModal">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div class="modal-body" @click="toggleFullscreen">
              <img
                v-if="currentImage"
                :src="currentImage.url"
                alt="预览"
                class="modal-image"
              />
            </div>
            <div class="modal-footer">
              <el-button @click="downloadImage(currentImage.url, currentImage.poem)">
                <el-icon><Download /></el-icon>
                下载
              </el-button>
              <el-button @click="toggleFullscreen">
                <el-icon><FullScreen /></el-icon>
                {{ isFullscreen ? '退出全屏' : '全屏' }}
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.chat-to-pic-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  backdrop-filter: blur(10px);
  overflow: hidden;

  .steps-wrapper {
    background: white;
    border-bottom: 1px solid #f0f0f0;
    padding: 30px 40px;

    .steps-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .step-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        cursor: default;

        &.clickable {
          cursor: pointer;
        }

        .step-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #f5f5f5;
          border: 2px solid #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 24px;
            color: #999;
          }
        }

        .step-info {
          flex: 1;

          .step-title {
            font-size: 16px;
            font-weight: 600;
            color: #666;
            margin-bottom: 4px;
            transition: all 0.3s ease;
          }

          .step-desc {
            font-size: 13px;
            color: #999;
          }
        }

        .step-line {
          position: absolute;
          left: 70px;
          right: -50%;
          top: 28px;
          height: 2px;
          background: #e8e8e8;
          z-index: -1;
          transition: all 0.3s ease;
        }

        &.active {
          .step-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

            .el-icon {
              color: white;
            }
          }

          .step-title {
            color: #667eea;
          }
        }

        &.completed {
          .step-icon {
            background: #52c41a;
            border-color: transparent;

            .el-icon {
              color: white;
            }
          }

          .step-title {
            color: #333;
          }

          .step-line {
            background: #52c41a;
          }
        }
      }
    }
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;

    .step-content {
      flex: 1;
      padding: 40px;
      overflow-y: auto;

      .content-header {
        text-align: center;
        margin-bottom: 40px;

        h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 0 12px 0;
          font-size: 28px;
          color: #333;

          .el-icon {
            font-size: 32px;
            color: #667eea;
          }
        }

        p {
          margin: 0;
          font-size: 15px;
          color: #666;
        }
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 40px;
      }
    }

    .step-input {
      .input-section {
        max-width: 800px;
        margin: 0 auto;

        .poem-input {
          :deep(textarea) {
            font-size: 16px;
            line-height: 1.8;
            border-radius: 12px;
            border: 2px solid #e8e8e8;
            transition: all 0.3s ease;

            &:focus {
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
          }
        }

        .quick-examples {
          margin-top: 24px;

          .examples-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
          }

          .examples-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            .example-tag {
              cursor: pointer;
              padding: 8px 16px;
              font-size: 14px;
              transition: all 0.3s ease;

              &:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: transparent;
              }
            }
          }
        }
      }
    }

    .step-generate {
      .generate-section {
        max-width: 700px;
        margin: 0 auto;

        .poem-preview {
          padding: 24px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 12px;
          margin-bottom: 24px;

          .preview-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .preview-text {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
            white-space: pre-wrap;
          }
        }

        .generate-info {
          margin-bottom: 32px;

          .tips-list {
            margin: 0;
            padding-left: 20px;

            li {
              margin: 8px 0;
              font-size: 14px;
              line-height: 1.6;
            }
          }
        }
      }
    }

    .step-result {
      .result-section {
        max-width: 800px;
        margin: 0 auto;

        .current-result {
          margin-bottom: 32px;

          .result-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

            .result-image {
              width: 100%;
              height: auto;
              max-height: 500px;
              object-fit: contain;
              cursor: pointer;
              transition: transform 0.3s ease;
              background: #f5f5f5;

              &:hover {
                transform: scale(1.02);
              }
            }

            .result-info {
              padding: 20px 24px;
              border-bottom: 1px solid #f0f0f0;

              .result-poem {
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin-bottom: 8px;
              }

              .result-time {
                font-size: 13px;
                color: #999;
              }
            }

            .result-actions {
              padding: 20px 24px;
              display: flex;
              gap: 12px;
              justify-content: center;
            }
          }
        }
      }
    }

    .history-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      order: -1;

      .sidebar-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        font-weight: 600;
        color: #333;

        .el-icon {
          color: #667eea;
        }

        .el-tag {
          margin-left: auto;
        }
      }

      .history-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;

        .history-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;

          &:hover {
            background: rgba(102, 126, 234, 0.05);
          }

          .history-thumb {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            flex-shrink: 0;
          }

          .history-info {
            flex: 1;
            min-width: 0;

            .history-poem {
              font-size: 13px;
              color: #333;
              margin-bottom: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .history-time {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
}

// 图片预览模态框
.image-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  &.fullscreen .modal-content {
    width: 100%;
    height: 100%;
    max-width: 100%;
    border-radius: 0;

    .modal-body {
      height: calc(100% - 120px);

      .modal-image {
        max-height: 100%;
      }
    }
  }

  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }
    }

    .modal-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f5f5f5;
      cursor: pointer;
      overflow: auto;

      .modal-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 8px;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #f0f0f0;
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

// 滚动条样式
.step-content::-webkit-scrollbar,
.history-list::-webkit-scrollbar {
  width: 6px;
}

.step-content::-webkit-scrollbar-track,
.history-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.step-content::-webkit-scrollbar-thumb,
.history-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3px;
}

// 响应式
@media (max-width: 1200px) {
  .chat-to-pic-container {
    .content-wrapper {
      .history-sidebar {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .chat-to-pic-container {
    .steps-wrapper {
      padding: 20px;

      .steps-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;

        .step-item {
          width: 100%;

          .step-line {
            display: none;
          }
        }
      }
    }

    .content-wrapper {
      .step-content {
        padding: 20px;

        .content-header h2 {
          font-size: 24px;
        }
      }
    }
  }
}
</style>