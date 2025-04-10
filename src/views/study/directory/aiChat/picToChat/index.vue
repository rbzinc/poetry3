<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/index.js'
import { aiPicturePostApi } from '@/api/modules/aiChat.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'
// import { fetchEventSource } from "@microsoft/fetch-event-source";

// 定义消息的响应式数据
const messages = ref([{ text: '发送你所需的情感类型，以及图片内容，我将为你生成古诗。', self: false, type: 'text' }])
const loading = ref(false)
const input = ref('')
const imgUrl = ref('')
const msg = ref('')
const url = ref('')
const previewImage = ref('')
const configVisible = ref(false)

// 处理图片上传的函数
const handleSuccess = (res) => {
  imgUrl.value = res.data
  previewImage.value = res.data
}

// 计算属性：判断是否已配置
const hasConfig = computed(() => {
  return genreValue.value && emotionValue.value && themeValue.value && input.value && previewImage.value
})

// 体裁相关的响应式数据
const genre = ref([
  { value: '五言律诗', label: '五言律诗' },
  { value: '七言绝句', label: '七言绝句' },
  { value: '古风', label: '古风' },
])
const genreValue = ref('')
const genreOptionName = ref('')
const genreAdding = ref(false)
const onGenreConfirm = () => {
  if (genreOptionName.value) {
    genre.value.push({
      label: genreOptionName.value,
      value: genreOptionName.value,
    })
    genreValue.value = genreOptionName.value
  }
  genreOptionName.value = ''
  genreAdding.value = false
}
const handleCancelGenre = () => {
  genreOptionName.value = ''
  genreAdding.value = false
}

const handleCancelEmotion = () => {
  emotionOptionName.value = ''
  emotionAdding.value = false
}

const handleCancelTheme = () => {
  themeOptionName.value = ''
  themeAdding.value = false
}
// 情感相关的响应式数据
const emotion = ref([
  { value: '亲情', label: '亲情' },
  { value: '友情', label: '友情' },
  { value: '爱情', label: '爱情' },
])
const emotionValue = ref('')
const emotionOptionName = ref('')
const emotionAdding = ref(false)
const onEmotionConfirm = () => {
  if (emotionOptionName.value) {
    emotion.value.push({
      label: emotionOptionName.value,
      value: emotionOptionName.value,
    })
    emotionValue.value = emotionOptionName.value
  }
  emotionOptionName.value = ''
  emotionAdding.value = false
}

// 主题相关的响应式数据
const theme = ref([
  { value: '春意', label: '春意' },
  { value: '秋思', label: '秋思' },
  { value: '江雪', label: '江雪' },
])
const themeValue = ref('')
const themeOptionName = ref('')
const themeAdding = ref(false)
const onThemeConfirm = () => {
  if (themeOptionName.value) {
    theme.value.push({
      label: themeOptionName.value,
      value: themeOptionName.value,
    })
    themeValue.value = themeOptionName.value
  }
  themeOptionName.value = ''
  themeAdding.value = false
}

const controller = new AbortController()

onBeforeUnmount(() => {
  controller.abort()
})

onMounted(() => {
  // GetSSE()
})

// 发送消息的函数
const sendMessage = async () => {
  // 验证所有必填项
  if (genreValue.value === '') {
    ElMessage.error('请选择体裁')
    return
  }
  if (emotionValue.value === '') {
    ElMessage.error('请选择情感')
    return
  }
  if (themeValue.value === '') {
    ElMessage.error('请选择主题')
    return
  }
  if (input.value === '') {
    ElMessage.error('请输入标题')
    return
  }
  if (imgUrl.value === '') {
    ElMessage.error('请上传图片')
    return
  }

  try {
    loading.value = true

    // 构建用户消息
    const userMessage = `我要生成一个体裁为${genreValue.value}, 情感为${emotionValue.value}, 主题为${themeValue.value}的古诗词，标题为${input.value}的古诗，请帮我生成一首古诗`

    // 添加用户消息
    messages.value.push({
      text: userMessage,
      self: true,
      type: 'text',
    })

    // 添加图片消息
    messages.value.push({
      text: imgUrl.value,
      self: true,
      type: 'image',
    })

    // 调用API
    msg.value = genreValue.value + emotionValue.value + themeValue.value + input.value
    url.value = imgUrl.value

    const res = await aiPicturePostApi(msg.value, url.value)

    // 添加AI回复
    messages.value.push({
      text: res.data,
      self: false,
      type: 'text',
    })

    // 重置表单
    genreValue.value = ''
    emotionValue.value = ''
    themeValue.value = ''
    imgUrl.value = ''
    input.value = ''
    previewImage.value = ''
    configVisible.value = false
  } catch (error) {
    console.error('生成失败:', error)
    ElMessage.error('生成失败，请稍后重试')
    messages.value.push({
      text: '生成失败，请稍后重试',
      self: false,
      type: 'text',
    })
  } finally {
    loading.value = false
  }
}

const userStore = useUserInfoStore()
const headers = ref({
  token: userStore.userInfo.token,
})

// 配置摘要
const configSummary = computed(() => {
  const parts = []
  if (genreValue.value) parts.push(`体裁: ${genreValue.value}`)
  if (emotionValue.value) parts.push(`情感: ${emotionValue.value}`)
  if (themeValue.value) parts.push(`主题: ${themeValue.value}`)
  if (input.value) parts.push(`标题: ${input.value}`)
  if (previewImage.value) parts.push('已上传图片')

  return parts.length > 0 ? parts.join(' | ') : '请配置生成参数'
})
</script>

<template>
  <div class="pic-to-chat-container">
    <!-- 消息区域 -->
    <div class="messages-area">
      <div v-if="messages.length === 0" class="empty-messages">
        <el-empty description="暂无消息" />
      </div>
      <template v-else>
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="{ 'my-message-wrapper': message.self, 'ai-message-wrapper': !message.self }"
        >
          <!-- AI头像 -->
          <div v-if="!message.self" class="avatar-container">
            <img
              :src="'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'"
              alt="AI头像"
              class="avatar"
            />
          </div>

          <!-- 消息内容 -->
          <div
            class="message"
            :class="{
              'my-message': message.self && message.type === 'text',
              'ai-message': !message.self && message.type === 'text',
              'image-message': message.type === 'image',
            }"
          >
            <!-- 文本消息 -->
            <p v-if="message.type === 'text'">{{ message.text }}</p>

            <!-- 图片消息 -->
            <img v-else-if="message.type === 'image'" :src="message.text" alt="图片消息" class="message-image" />
          </div>

          <!-- 用户头像 -->
          <div v-if="message.self" class="avatar-container">
            <img :src="userStore.userInfo.touxiang" alt="用户头像" class="avatar" />
          </div>
        </div>
      </template>

      <!-- 加载指示器 -->
      <div v-if="loading" class="loading-indicator">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <span>AI 正在思考...</span>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <!-- 使用 el-drawer 替代 el-popover -->
      <div class="config-summary" :class="{ 'has-config': hasConfig }" @click="configVisible = true">
        <el-icon>
          <Setting />
        </el-icon>
        <span>{{ configSummary }}</span>
      </div>

      <el-button type="primary" class="send-button" :loading="loading" :disabled="!hasConfig" @click="sendMessage">
        生成古诗
      </el-button>
    </div>

    <!-- 使用 el-drawer 替代 el-popover -->
    <el-drawer
      v-model="configVisible"
      title="古诗生成配置"
      direction="rtl"
      size="450px"
      :with-header="true"
      :destroy-on-close="false"
      :close-on-click-modal="false"
    >
      <div class="config-form">
        <!-- 体裁和情感选择 -->
        <div class="form-row">
          <!-- 体裁选择 -->
          <div class="form-item">
            <div class="form-label">体裁</div>
            <el-select
              v-model="genreValue"
              placeholder="请选择"
              size="default"
              class="form-input"
              :close-on-click-modal="false"
            >
              <el-option v-for="item in genre" :key="item.value" :label="item.label" :value="item.value" />
              <template #footer>
                <div class="custom-option">
                  <el-button v-if="!genreAdding" text size="small" @click="genreAdding = true">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    自定义
                  </el-button>
                  <div v-else class="custom-input-area">
                    <el-input v-model="genreOptionName" placeholder="请输入体裁" size="default" />
                    <div class="custom-buttons">
                      <el-button type="primary" size="small" @click="onGenreConfirm">确定</el-button>
                      <el-button size="small" @click="handleCancelGenre">取消</el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-select>
          </div>

          <!-- 情感选择 -->
          <div class="form-item">
            <div class="form-label">情感</div>
            <el-select
              v-model="emotionValue"
              placeholder="请选择"
              size="default"
              class="form-input"
              :close-on-click-modal="false"
            >
              <el-option v-for="item in emotion" :key="item.value" :label="item.label" :value="item.value" />
              <template #footer>
                <div class="custom-option">
                  <el-button v-if="!emotionAdding" text size="small" @click="emotionAdding = true">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    自定义
                  </el-button>
                  <div v-else class="custom-input-area">
                    <el-input v-model="emotionOptionName" placeholder="请输入情感" size="default" />
                    <div class="custom-buttons">
                      <el-button type="primary" size="small" @click="onEmotionConfirm">确定</el-button>
                      <el-button size="small" @click="handleCancelEmotion">取消</el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-select>
          </div>
        </div>

        <!-- 主题和标题 -->
        <div class="form-row">
          <!-- 主题选择 -->
          <div class="form-item">
            <div class="form-label">主题</div>
            <el-select
              v-model="themeValue"
              placeholder="请选择"
              size="default"
              class="form-input"
              :close-on-click-modal="false"
            >
              <el-option v-for="item in theme" :key="item.value" :label="item.label" :value="item.value" />
              <template #footer>
                <div class="custom-option">
                  <el-button v-if="!themeAdding" text size="small" @click="themeAdding = true">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    自定义
                  </el-button>
                  <div v-else class="custom-input-area">
                    <el-input v-model="themeOptionName" placeholder="请输入主题" size="default" />
                    <div class="custom-buttons">
                      <el-button type="primary" size="small" @click="onThemeConfirm">确定</el-button>
                      <el-button size="small" @click="handleCancelTheme">取消</el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-select>
          </div>

          <!-- 标题输入 -->
          <div class="form-item">
            <div class="form-label">标题</div>
            <el-input v-model="input" placeholder="请输入标题" size="default" class="form-input" />
          </div>
        </div>

        <!-- 图片上传 -->
        <div class="form-row">
          <div class="form-item upload-item">
            <div class="form-label">图片</div>
            <div class="upload-area">
              <el-upload
                class="image-uploader"
                :action="UPLOAD_ADDRESS"
                :headers="headers"
                :limit="1"
                :on-success="handleSuccess"
                :show-file-list="false"
              >
                <div v-if="!previewImage" class="upload-placeholder">
                  <el-icon>
                    <Plus />
                  </el-icon>
                  <span>上传图片</span>
                </div>
                <img v-else :src="previewImage" class="preview-img" />
              </el-upload>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="configVisible = false">确认</el-button>
          <el-button @click="configVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.pic-to-chat-container {
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: 20px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;

    .empty-messages {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      color: #909399;

      .el-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .message-wrapper {
      display: flex;
      align-items: flex-start;
      margin: 16px 0;
      width: 100%;

      &.my-message-wrapper {
        justify-content: flex-end;
      }

      &.ai-message-wrapper {
        justify-content: flex-start;
      }

      .avatar-container {
        flex-shrink: 0;
        margin: 0 12px;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #fff;
        }
      }

      .message {
        padding: 12px 16px;
        border-radius: 12px;
        max-width: 70%;
        word-wrap: break-word;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        p {
          margin: 0;
          line-height: 1.6;
          font-size: 15px;
        }
      }

      .image-message {
        background: none;
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 80%;

        .message-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

          &:hover {
            transform: scale(1.02);
          }
        }
      }

      .my-message {
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-top-right-radius: 4px;
      }

      .ai-message {
        background-color: #f5f5f5;
        border: 1px solid #e8e8e8;
        border-top-left-radius: 4px;
      }
    }
  }

  .input-area {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #ebeef5;
    background-color: rgba(245, 247, 250, 0.9);

    .config-summary {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background-color: #f5f7fa;
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
      color: #909399;
      cursor: pointer;
      transition: all 0.3s;
      margin-right: 12px;

      .el-icon {
        margin-right: 8px;
      }

      &:hover {
        border-color: #c0c4cc;
        color: #606266;
      }

      &.has-config {
        background-color: #f0f9eb;
        border-color: #e1f3d8;
        color: #67c23a;
      }
    }

    .send-button {
      min-width: 100px;
    }
  }
}

.config-form {
  padding: 20px;

  .form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-item {
    flex: 1;

    .form-label {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
    }
  }

  .upload-item {
    .upload-area {
      .image-uploader {
        .upload-placeholder {
          height: 100px;
          width: 100px;
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #8c939d;
          cursor: pointer;
          transition: border-color 0.3s;

          .el-icon {
            margin-bottom: 8px;
            font-size: 24px;
          }

          &:hover {
            border-color: #409eff;
          }
        }

        .preview-img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }
  }

  .custom-option {
    padding: 8px;

    .custom-input-area {
      margin-top: 8px;

      .custom-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style>