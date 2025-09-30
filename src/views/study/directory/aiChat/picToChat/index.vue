<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/index.js'
import { aiPicturePostApi } from '@/api/modules/aiChat.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'

// 步骤管理
const currentStep = ref(0)
const steps = [
  { title: '上传图片', icon: 'Upload', desc: '选择您的诗意图片' },
  { title: '配置参数', icon: 'Setting', desc: '设置诗词生成参数' },
  { title: '生成古诗', icon: 'Document', desc: 'AI为您创作古诗' },
]

// 图片相关
const uploadedImage = ref('')
const uploadRef = ref(null)
const previewUrl = ref('')

// 配置参数
const config = ref({
  genre: '',
  emotion: '',
  theme: '',
  title: '',
})

// 下拉选项
const genreOptions = ref([
  { value: '五言律诗', label: '五言律诗' },
  { value: '七言绝句', label: '七言绝句' },
  { value: '古风', label: '古风' },
])

const emotionOptions = ref([
  { value: '亲情', label: '亲情' },
  { value: '友情', label: '友情' },
  { value: '爱情', label: '爱情' },
])

const themeOptions = ref([
  { value: '春意', label: '春意' },
  { value: '秋思', label: '秋思' },
  { value: '江雪', label: '江雪' },
])

// 添加自定义选项
const customDialogVisible = ref(false)
const customType = ref('')
const customValue = ref('')

// 生成结果
const generatedPoems = ref([])
const loading = ref(false)

// 用户信息
const userStore = useUserInfoStore()
const headers = ref({
  token: userStore.userInfo.token,
})

// 计算属性
const canProceedStep1 = computed(() => uploadedImage.value !== '')
const canProceedStep2 = computed(() => {
  return config.value.genre && config.value.emotion && config.value.theme && config.value.title
})

// 图片上传成功
const handleUploadSuccess = (res) => {
  if (res && res.data) {
    uploadedImage.value = res.data
    previewUrl.value = res.data
    ElMessage.success('图片上传成功')
    currentStep.value = 1
  }
}

// 图片上传失败
const handleUploadError = () => {
  ElMessage.error('图片上传失败，请重试')
}

// 移除图片
const removeImage = () => {
  uploadedImage.value = ''
  previewUrl.value = ''
  uploadRef.value?.clearFiles()
}

// 添加自定义选项
const openCustomDialog = (type) => {
  customType.value = type
  customDialogVisible.value = true
  customValue.value = ''
}

const confirmCustom = () => {
  if (!customValue.value) {
    ElMessage.warning('请输入自定义内容')
    return
  }

  const option = { value: customValue.value, label: customValue.value }
  
  if (customType.value === 'genre') {
    genreOptions.value.push(option)
    config.value.genre = customValue.value
  } else if (customType.value === 'emotion') {
    emotionOptions.value.push(option)
    config.value.emotion = customValue.value
  } else if (customType.value === 'theme') {
    themeOptions.value.push(option)
    config.value.theme = customValue.value
  }

  customDialogVisible.value = false
  customValue.value = ''
}

// 生成古诗
const generatePoem = async () => {
  if (!canProceedStep2.value) {
    ElMessage.warning('请完成所有配置')
    return
  }

  try {
    loading.value = true

    const message = `${config.value.genre}${config.value.emotion}${config.value.theme}${config.value.title}`
    const res = await aiPicturePostApi(message, uploadedImage.value)

    if (res && res.data) {
      generatedPoems.value.push({
        id: Date.now(),
        poem: res.data,
        image: uploadedImage.value,
        config: { ...config.value },
        time: new Date().toLocaleString(),
      })

      currentStep.value = 2
      ElMessage.success('古诗生成成功！')
    }
  } catch (error) {
    console.error('生成失败:', error)
    ElMessage.error('生成失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重新开始
const reset = () => {
  currentStep.value = 0
  uploadedImage.value = ''
  previewUrl.value = ''
  config.value = {
    genre: '',
    emotion: '',
    theme: '',
    title: '',
  }
  uploadRef.value?.clearFiles()
}

// 复制诗词
const copyPoem = (poem) => {
  navigator.clipboard.writeText(poem)
  ElMessage.success('诗词已复制到剪贴板')
}

// 切换步骤
const goToStep = (step) => {
  if (step === 0) {
    currentStep.value = 0
  } else if (step === 1 && canProceedStep1.value) {
    currentStep.value = 1
  } else if (step === 2 && canProceedStep2.value && generatedPoems.value.length > 0) {
    currentStep.value = 2
  }
}
</script>

<template>
  <div class="pic-to-chat-container">
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
            clickable: (index === 0) || (index === 1 && canProceedStep1) || (index === 2 && generatedPoems.length > 0)
          }"
          @click="goToStep(index)"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-info">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
          <div v-if="index < steps.length - 1" class="step-connector"></div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 步骤1: 上传图片 -->
      <transition name="slide-fade">
        <div v-if="currentStep === 0" class="step-panel step-upload">
          <div class="panel-header">
            <h2>
              <el-icon><Upload /></el-icon>
              上传图片
            </h2>
            <p>上传一张富有诗意的图片，AI将为您创作相应的古诗词</p>
          </div>

          <div class="upload-section">
            <el-upload
              ref="uploadRef"
              class="image-uploader"
              :action="UPLOAD_ADDRESS"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
              drag
            >
              <div v-if="!previewUrl" class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">
                  <div class="main-text">点击或拖拽图片到此处</div>
                  <div class="sub-text">支持 JPG、PNG、GIF 格式，不超过 10MB</div>
          </div>
        </div>
              <div v-else class="preview-container">
                <img :src="previewUrl" class="preview-image" />
                <div class="preview-mask">
                  <el-button circle @click.stop="removeImage">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-upload>

            <div class="upload-tips">
              <el-alert type="info" :closable="false" show-icon>
                <template #title>
                  <span style="font-weight: 500;">图片建议</span>
      </template>
                <ul class="tips-list">
                  <li>选择具有意境的自然风光图片效果更佳</li>
                  <li>图片清晰度越高，生成效果越好</li>
                  <li>避免过于复杂或抽象的图片</li>
                </ul>
              </el-alert>
            </div>
          </div>

          <div class="action-footer">
            <el-button
              type="primary"
              size="large"
              :disabled="!canProceedStep1"
              @click="currentStep = 1"
            >
              下一步
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
      </div>
    </div>
      </transition>

      <!-- 步骤2: 配置参数 -->
      <transition name="slide-fade">
        <div v-if="currentStep === 1" class="step-panel step-config">
          <div class="panel-header">
            <h2>
              <el-icon><Setting /></el-icon>
              配置参数
            </h2>
            <p>设置古诗词的体裁、情感和主题，让AI更好地创作</p>
      </div>

          <div class="config-section">
            <div class="config-preview">
              <img :src="previewUrl" alt="预览图" class="config-preview-img" />
    </div>

      <div class="config-form">
        <div class="form-row">
          <div class="form-item">
                  <label class="form-label">
                    <span class="required">*</span>
                    体裁
                  </label>
            <el-select
                    v-model="config.genre"
                    placeholder="请选择诗词体裁"
                    size="large"
                    class="form-select"
                  >
                    <el-option
                      v-for="item in genreOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
              <template #footer>
                      <el-button text @click="openCustomDialog('genre')">
                        <el-icon><Plus /></el-icon>
                        自定义体裁
                  </el-button>
              </template>
            </el-select>
          </div>

          <div class="form-item">
                  <label class="form-label">
                    <span class="required">*</span>
                    情感
                  </label>
            <el-select
                    v-model="config.emotion"
                    placeholder="请选择情感类型"
                    size="large"
                    class="form-select"
                  >
                    <el-option
                      v-for="item in emotionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
              <template #footer>
                      <el-button text @click="openCustomDialog('emotion')">
                        <el-icon><Plus /></el-icon>
                        自定义情感
                  </el-button>
              </template>
            </el-select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
                  <label class="form-label">
                    <span class="required">*</span>
                    主题
                  </label>
            <el-select
                    v-model="config.theme"
                    placeholder="请选择诗词主题"
                    size="large"
                    class="form-select"
                  >
                    <el-option
                      v-for="item in themeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
              <template #footer>
                      <el-button text @click="openCustomDialog('theme')">
                        <el-icon><Plus /></el-icon>
                        自定义主题
                  </el-button>
              </template>
            </el-select>
          </div>

          <div class="form-item">
                  <label class="form-label">
                    <span class="required">*</span>
                    标题
                  </label>
                  <el-input
                    v-model="config.title"
                    placeholder="请输入诗词标题"
                    size="large"
                    maxlength="20"
                    show-word-limit
                    class="form-input"
                  />
          </div>
        </div>

              <div class="config-summary">
                <div class="summary-title">配置预览：</div>
                <div class="summary-content">
                  <el-tag v-if="config.genre" type="info">{{ config.genre }}</el-tag>
                  <el-tag v-if="config.emotion" type="success">{{ config.emotion }}</el-tag>
                  <el-tag v-if="config.theme" type="warning">{{ config.theme }}</el-tag>
                  <el-tag v-if="config.title" type="danger">《{{ config.title }}》</el-tag>
                  <span v-if="!canProceedStep2" class="summary-hint">请完成所有必填项</span>
                </div>
              </div>
            </div>
          </div>

          <div class="action-footer">
            <el-button size="large" @click="currentStep = 0">
              <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
              上一步
            </el-button>
            <el-button
              type="primary"
              size="large"
              :disabled="!canProceedStep2"
              :loading="loading"
              @click="generatePoem"
            >
              <el-icon v-if="!loading"><MagicStick /></el-icon>
              {{ loading ? '生成中...' : '开始生成' }}
            </el-button>
                </div>
            </div>
      </transition>

      <!-- 步骤3: 生成结果 -->
      <transition name="slide-fade">
        <div v-if="currentStep === 2" class="step-panel step-result">
          <div class="panel-header">
            <h2>
              <el-icon><Document /></el-icon>
              生成结果
            </h2>
            <p>您的古诗词已创作完成</p>
          </div>

          <div class="result-section">
            <div v-if="generatedPoems.length > 0" class="result-container">
              <div
                v-for="(item, index) in generatedPoems"
                :key="item.id"
                class="result-card"
              >
                <div class="result-image-wrapper">
                  <img :src="item.image" alt="诗意图片" class="result-image" />
        </div>

                <div class="result-content">
                  <div class="poem-header">
                    <h3 class="poem-title">《{{ item.config.title }}》</h3>
                    <div class="poem-meta">
                      <el-tag size="small">{{ item.config.genre }}</el-tag>
                      <el-tag size="small" type="success">{{ item.config.emotion }}</el-tag>
                      <el-tag size="small" type="warning">{{ item.config.theme }}</el-tag>
        </div>
      </div>

                  <div class="poem-body">
                    <pre class="poem-text">{{ item.poem }}</pre>
                  </div>

                  <div class="poem-footer">
                    <div class="poem-time">生成时间: {{ item.time }}</div>
                    <div class="poem-actions">
                      <el-button size="small" @click="copyPoem(item.poem)">
                        <el-icon><DocumentCopy /></el-icon>
                        复制
                      </el-button>
                      <el-button size="small" type="primary">
                        <el-icon><Share /></el-icon>
                        分享
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-footer">
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
      </transition>
    </div>

    <!-- 自定义选项对话框 -->
    <el-dialog
      v-model="customDialogVisible"
      :title="`自定义${customType === 'genre' ? '体裁' : customType === 'emotion' ? '情感' : '主题'}`"
      width="400px"
    >
      <el-input
        v-model="customValue"
        :placeholder="`请输入自定义${customType === 'genre' ? '体裁' : customType === 'emotion' ? '情感' : '主题'}`"
        size="large"
      />
      <template #footer>
        <el-button @click="customDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCustom">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.pic-to-chat-container {
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
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      align-items: center;

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

        .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f5f5f5;
          border: 2px solid #d9d9d9;
      display: flex;
      align-items: center;
      justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: #999;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .step-info {
          .step-title {
            font-size: 15px;
            font-weight: 600;
            color: #666;
            margin-bottom: 4px;
            transition: all 0.3s ease;
          }

          .step-desc {
            font-size: 12px;
            color: #999;
          }
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e8e8e8;
          margin: 0 16px;
          transition: all 0.3s ease;
        }

        &.active {
          .step-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .step-title {
            color: #667eea;
          }
        }

        &.completed {
          .step-number {
            background: #52c41a;
            border-color: transparent;
            color: white;
          }

          .step-title {
            color: #333;
          }

          .step-connector {
            background: #52c41a;
          }
        }
      }
    }
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 40px;

    .step-panel {
      max-width: 1000px;
      margin: 0 auto;

      .panel-header {
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

      .action-footer {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 40px;
      }
    }

    .step-upload {
      .upload-section {
        .image-uploader {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;

          :deep(.el-upload) {
            width: 100%;
            max-width: 600px;
          }

          :deep(.el-upload-dragger) {
            width: 100%;
            height: 400px;
            border: 2px dashed #d9d9d9;
            border-radius: 16px;
            background: #fafafa;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;

          &:hover {
              border-color: #667eea;
              background: rgba(102, 126, 234, 0.05);
            }
          }

          .upload-placeholder {
            text-align: center;

            .upload-icon {
              font-size: 80px;
              color: #d9d9d9;
              margin-bottom: 20px;
            }

            .upload-text {
              .main-text {
                font-size: 18px;
                color: #666;
                margin-bottom: 8px;
                font-weight: 500;
              }

              .sub-text {
                font-size: 14px;
                color: #999;
              }
            }
          }

          .preview-container {
            position: relative;
            width: 100%;
            height: 100%;

            .preview-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 12px;
            }

            .preview-mask {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s ease;
              border-radius: 12px;

      &:hover {
                opacity: 1;
              }
            }
          }
        }

        .upload-tips {
          max-width: 600px;
          margin: 0 auto;

          .tips-list {
            margin: 8px 0 0 0;
            padding-left: 20px;

            li {
              margin: 6px 0;
              font-size: 13px;
            }
          }
        }
      }
    }

    .step-config {
      .config-section {
    display: flex;
        gap: 40px;

        .config-preview {
          flex-shrink: 0;
          width: 300px;

          .config-preview-img {
            width: 100%;
            height: auto;
            max-height: 400px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }
        }

        .config-form {
    flex: 1;

          .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 24px;
          }

          .form-item {
    .form-label {
              display: block;
      font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 12px;

              .required {
                color: #f56c6c;
                margin-right: 4px;
              }
            }

            .form-select,
    .form-input {
      width: 100%;
    }
  }

          .config-summary {
            padding: 20px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
            border-radius: 12px;
            margin-top: 32px;

            .summary-title {
              font-size: 14px;
              font-weight: 600;
              color: #666;
              margin-bottom: 12px;
            }

            .summary-content {
          display: flex;
              flex-wrap: wrap;
              gap: 12px;
          align-items: center;

              .summary-hint {
                font-size: 13px;
                color: #999;
                font-style: italic;
              }
            }
          }
        }
      }
    }

    .step-result {
      .result-section {
        .result-container {
          .result-card {
            display: flex;
            gap: 32px;
            padding: 32px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            margin-bottom: 24px;

            .result-image-wrapper {
              flex-shrink: 0;
              width: 300px;

              .result-image {
          width: 100%;
                height: auto;
                max-height: 400px;
          object-fit: cover;
                border-radius: 12px;
              }
            }

            .result-content {
              flex: 1;
              display: flex;
              flex-direction: column;

              .poem-header {
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;

                .poem-title {
                  margin: 0 0 12px 0;
                  font-size: 24px;
                  color: #333;
                }

                .poem-meta {
        display: flex;
        gap: 8px;
                }
              }

              .poem-body {
                flex: 1;
                margin-bottom: 20px;

                .poem-text {
                  margin: 0;
                  font-family: 'KaiTi', '楷体', serif;
                  font-size: 18px;
                  line-height: 2;
                  color: #333;
                  white-space: pre-wrap;
                }
              }

              .poem-footer {
    display: flex;
                justify-content: space-between;
                align-items: center;
    padding-top: 16px;
                border-top: 1px solid #f0f0f0;

                .poem-time {
                  font-size: 13px;
                  color: #999;
                }

                .poem-actions {
                  display: flex;
                  gap: 8px;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 过渡动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 滚动条样式
.content-area::-webkit-scrollbar {
  width: 8px;
}

.content-area::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

// 响应式
@media (max-width: 992px) {
  .pic-to-chat-container {
    .steps-wrapper {
      padding: 20px;

      .steps-container {
        flex-direction: column;
        align-items: flex-start;

        .step-item {
          width: 100%;

          .step-connector {
            display: none;
          }
        }
      }
    }

    .content-area {
      padding: 20px;

      .step-config {
        .config-section {
          flex-direction: column;

          .config-preview {
            width: 100%;

            .config-preview-img {
              max-height: 300px;
            }
          }

          .config-form {
            .form-row {
              grid-template-columns: 1fr;
            }
          }
        }
      }

      .step-result {
        .result-card {
          flex-direction: column !important;

          .result-image-wrapper {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>