<script setup>
import { ref, watch, computed, reactive } from 'vue' // 引入 reactive
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/index.js'
import { userLuntanFabutieziPostApi, userLuntanSearchGetApi } from '@/api/modules/talkSquare.js'
import { getpoemRandomData } from '@/api/index.js'
import { goForum, goHome } from '@/router/helpers.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'
import { 
  Search, ArrowLeftBold, Document, Setting, FolderOpened, Promotion, Loading,
  EditPen, ArrowDown, Check, Plus, InfoFilled, Reading, Close, ArrowRight
} from '@element-plus/icons-vue'

// --- 状态管理 ---
const editorFormRef = ref(null) // 发文设置表单引用
const poemSearchInputRef = ref(null) // 诗词搜索输入框引用
const uploadRef = ref(null) // 上传组件引用

// 使用 reactive 聚合表单数据
const editForm = reactive({
  title: '',
  content: '',
  type: '', // 分类名称
  poemId: '',
  images: '', // 封面图片 URL
  poemWord: '',
})

// 其他状态
const state = reactive({
  contentLength: 0,
  isSettingsDialogVisible: false,
  isPoemDrawerVisible: false,
  poemSearchValue: '',
  poemData: [],
  choicePoemContent: '点此选择',
  isExcerptDisabled: true,
  selectedTagId: null,
  isLoadingSubmit: false, // 发布加载状态
  isLoadingPoems: false, // 抽屉诗词加载状态
  isShakeButton: false, // 按钮抖动状态 (用于错误提示)
})

// --- 计算属性 ---
const selectedTagName = computed(() => {
  if (state.selectedTagId === null) {
    return '分类选择'
  }
  const selectedTag = tagData.value.find((tag) => tag.id === state.selectedTagId)
  return selectedTag ? selectedTag.name : '分类选择'
})

// --- 表单验证规则 ---
const rules = reactive({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }], // 编辑器内容通常不直接用 rule 验证，依赖 submit 前检查
  type: [{ required: true, message: '请选择文章分类', trigger: 'change' }], // trigger 'change' 可能不适用 popover，依赖 submit 前检查
  images: [{ required: true, message: '请上传封面图片', trigger: 'change' }], // trigger 'change' 可能不适用 upload，依赖 submit 前检查
  // poemWord: [{ required: true, message: '请选择古诗并填写节选', trigger: 'blur' }], // 非必填项
})

// --- 方法 ---

// 重置表单和相关状态
const resetForm = () => {
  editorFormRef.value?.resetFields() // 重置 Element Plus 表单验证状态
  editForm.title = ''
  editForm.content = ''
  editForm.type = ''
  editForm.poemId = ''
  editForm.images = ''
  editForm.poemWord = ''
  state.selectedTagId = null
  state.choicePoemContent = '点此选择'
  state.isExcerptDisabled = true
  uploadRef.value?.clearFiles() // 清除已上传文件列表
  // 如果 mavon-editor 需要手动清空，也在这里操作
}

// 统一的消息提示
const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, duration: 2000 }) // 统一设置时长
  if (type === 'error') {
    state.isShakeButton = true
    setTimeout(() => {
      state.isShakeButton = false
    }, 500)
  }
}

/**
 * 发布博客
 */
const submitForm = async () => {
  // 1. 检查编辑器内容是否为空
  if (!editForm.content.trim()) {
    showMessage('请输入文章内容！')
    return
  }
  // 2. 检查其他必填项（分类和封面可能需要手动检查，因为触发时机问题）
  if (!editForm.type) {
    showMessage('请选择文章分类！')
    state.isSettingsDialogVisible = true // 打开设置弹窗提示用户
    return
  }
  if (!editForm.images) {
    showMessage('请上传封面图片！')
    state.isSettingsDialogVisible = true // 打开设置弹窗提示用户
    return
  }

  // 3. 触发表单验证 (主要验证标题)
  editorFormRef.value?.validate(async (valid) => {
    if (valid) {
      state.isLoadingSubmit = true
      const res = await userLuntanFabutieziPostApi(editForm)
      console.log('发布结果:', res)
      // 假设 API 成功返回特定字符串或状态码
      if (res.code === 1 || res.data === '发布成功') {
        // 根据你的 API 实际响应调整判断条件
        ElMessage.success('发布成功！')
        resetForm() // 发布成功后重置表单
        goForum() // 跳转到论坛页面
      } else {
        showMessage(res.message || '发布失败，请稍后重试')
      }
    } else {
      showMessage('请检查发文设置中的必填项！')
      state.isSettingsDialogVisible = true // 验证失败也打开设置弹窗
      return false
    }
  })
}

/**
 * 保存草稿 (待实现)
 */
const saveDraft = () => {
  if (!editForm.content.trim()) {
    showMessage('没有内容可以保存草稿！', 'warning')
    return
  }
  // TODO: 实现草稿保存逻辑，例如保存到 localStorage 或发送到后端接口
  console.log('当前内容:', editForm.content)
  showMessage('草稿保存成功！(功能待实现)', 'success')
}

/**
 * 保存发文设置 (仅关闭弹窗)
 */
const saveEditSettings = () => {
  // 可以在这里加一些基础校验，如果需要的话
  state.isSettingsDialogVisible = false
  // showMessage('发文设置已暂存！', 'info') // 可以给个提示，但不一定是“保存成功”
}

/**
 * 监听编辑器内容变化
 */
watch(
  () => editForm.content,
  (newVal) => {
    state.contentLength = newVal?.length || 0 // 安全访问 length
  },
)

// 跳转到首页
const toLayoutHome = () => {
  goHome()
}

// --- 图片上传相关 ---
const userStore = useUserInfoStore()
const headers = ref({
  token: userStore.userInfo.token,
})

// 上传成功
const handleUploadSuccess = (response, uploadFile) => {
  console.log('Upload Success:', response, uploadFile)
  if (response.code === 1 && response.data) {
    // 假设成功响应包含 code 和 data
    editForm.images = response.data // 保存图片 URL
    ElMessage.success('封面上传成功!')
    // 手动触发表单项验证（如果需要实时反馈）
    editorFormRef.value?.validateField('images')
  } else {
    ElMessage.error(response.message || '封面上传失败')
    uploadRef.value?.handleRemove(uploadFile) // 上传失败时移除文件列表项
  }
}

// 上传失败
const handleUploadError = (error) => {
  console.error('Upload Error:', error)
  ElMessage.error('封面上传失败，请检查网络或文件格式')
}

// 文件列表移除时
const handleUploadRemove = () => {
  editForm.images = '' // 清空图片 URL
}

// 超出数量限制
const handleUploadExceed = (files) => {
  ElMessage.warning(`只能上传 1 张封面图片，本次选择了 ${files.length} 张`)
}

// --- 分类选择 ---
const tagData = ref([
  { id: 1, name: '诗词创作' },
  { id: 2, name: '诗词赏析' },
  { id: 3, name: '诗词学习' },
  { id: 4, name: '诗词活动' },
  { id: 5, name: '诗词资源' },
  { id: 6, name: '诗词杂谈' },
])

const toggleTag = (item) => {
  if (state.selectedTagId !== item.id) {
    state.selectedTagId = item.id
    editForm.type = item.name // 更新表单中的分类名称
    // 手动触发表单项验证（如果需要实时反馈）
    editorFormRef.value?.validateField('type')
  } else {
    // 取消选择逻辑可以保留，但表单验证需要处理空值
    // state.selectedTagId = null;
    // editForm.type = '';
  }
  // 关闭 popover (如果需要点击后自动关闭)
  // 可以通过给 el-popover 添加 ref 并调用其 doClose 方法实现
}

// --- 古诗选择 ---

/**
 * 打开侧边栏选择古诗
 */
const choosePoem = async () => {
  state.isPoemDrawerVisible = true
  state.poemSearchValue = '' // 清空搜索框
  state.isLoadingPoems = true
  state.poemData = []
  const res = await getpoemRandomData()
  console.log(res)
  if (res.code === 1 && Array.isArray(res.data)) {
    state.poemData = res.data
  } else {
    ElMessage.error(res.message || '获取随机诗词失败')
  }

  state.isLoadingPoems = false
}

/**
 * 选择古诗
 */
const getPoemContent = (poem) => {
  state.isPoemDrawerVisible = false
  editForm.poemWord = poem.content // 默认填充完整内容，让用户修改
  editForm.poemId = poem.id
  state.choicePoemContent = poem.title
  state.isExcerptDisabled = false
}

/**
 * 通过关键字搜索古诗
 */
const searchPoemByKey = async () => {
  if (!state.poemSearchValue.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  state.isLoadingPoems = true
  state.poemData = []
  try {
    const res = await userLuntanSearchGetApi(state.poemSearchValue)
    if (res.code === 1 && Array.isArray(res.data)) {
      state.poemData = res.data
      if (res.data.length === 0) {
        ElMessage.info('未搜索到相关诗词')
      }
    } else {
      ElMessage.error(res.message || '搜索诗词失败')
    }
  } catch (error) {
    console.error('搜索诗词失败:', error)
    ElMessage.error('搜索诗词失败，请检查网络')
  } finally {
    state.isLoadingPoems = false
  }
}

// --- 无限滚动 (审视) ---
// 当前 load 函数逻辑不完整，且 API 似乎一次性返回数据，可能不需要无限滚动
// 如果确实需要分页加载，需要修改 API 和这里的 load 函数逻辑
const load = () => {
  // console.log('Infinite scroll triggered, current load logic is placeholder.');
  // 实际应用中，这里应该根据 state.poemData 的数量和总数判断是否需要加载下一页
  // 并调用相应的 API 获取下一页数据追加到 state.poemData
}
</script>

<template>
  <div class="modern-editor-container">
    <!-- Markdown 编辑器 -->
    <mavon-editor 
      v-model="editForm.content" 
      class="modern-mavon-editor" 
      placeholder="开始你的创作...✍️" 
    />
    
    <!-- 现代化底部工具栏 -->
    <div class="modern-toolbar">
      <div class="toolbar-left">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="toLayoutHome">
          <el-icon :size="18"><ArrowLeftBold /></el-icon>
          <span>返回首页</span>
        </button>
        
        <!-- 字数统计 -->
        <div class="word-count-badge">
          <el-icon :size="16"><Document /></el-icon>
          <span class="count-number">{{ state.contentLength }}</span>
          <span class="count-label">字</span>
        </div>
        
        <!-- 发文设置按钮 -->
        <button 
          class="settings-btn"
          @click="state.isSettingsDialogVisible = true"
          :class="{ 'shake': state.isShakeButton }"
        >
          <el-icon :size="18"><Setting /></el-icon>
          <span>发文设置</span>
        </button>
      </div>
      
      <div class="toolbar-right">
        <!-- 保存草稿按钮 -->
        <button class="action-btn secondary" @click="saveDraft">
          <el-icon :size="18"><FolderOpened /></el-icon>
          <span>保存草稿</span>
        </button>
        
        <!-- 发布按钮 -->
        <button 
          class="action-btn primary"
          @click="submitForm" 
          :disabled="state.isLoadingSubmit"
        >
          <el-icon v-if="!state.isLoadingSubmit" :size="18"><Promotion /></el-icon>
          <el-icon v-else class="is-loading" :size="18"><Loading /></el-icon>
          <span>{{ state.isLoadingSubmit ? '发布中...' : '发布博客' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 现代化发文设置对话框 -->
  <el-dialog 
    v-model="state.isSettingsDialogVisible" 
    width="680px" 
    :close-on-click-modal="false"
    class="modern-settings-dialog"
  >
    <template #header>
      <div class="dialog-gradient-header">
        <el-icon :size="28"><Setting /></el-icon>
        <span class="header-title">发文设置</span>
      </div>
    </template>
    
    <div class="dialog-body-content">
      <el-form ref="editorFormRef" :model="editForm" :rules="rules" label-width="90px" label-position="left">
        <!-- 文章标题 -->
      <el-form-item label="文章标题" prop="title">
          <el-input 
            v-model="editForm.title" 
            placeholder="输入一个吸引人的标题..."
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><EditPen /></el-icon>
            </template>
          </el-input>
      </el-form-item>
        
        <!-- 文章分类 -->
        <el-form-item label="文章分类" prop="type">
          <el-popover placement="bottom-start" :width="360" trigger="click">
            <template #reference>
              <button class="category-select-btn">
                <span class="selected-category">{{ selectedTagName }}</span>
                <el-icon class="arrow-icon"><ArrowDown /></el-icon>
              </button>
            </template>
            <div class="tag-selector-content">
              <div class="tag-selector-title">选择分类</div>
              <div class="tag-grid">
                <button
                  v-for="item in tagData"
                  :key="item.id"
                  class="tag-item"
                  :class="{ 'active': item.id === state.selectedTagId }"
                  @click="toggleTag(item)"
                >
                  <span class="tag-icon">📁</span>
                  <span class="tag-name">{{ item.name }}</span>
                  <el-icon v-if="item.id === state.selectedTagId" class="check-icon"><Check /></el-icon>
                </button>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        
        <!-- 添加封面 -->
      <el-form-item label="添加封面" prop="images">
          <div class="upload-wrapper">
        <el-upload
          ref="uploadRef"
          :action="UPLOAD_ADDRESS"
          list-type="picture-card"
          :headers="headers"
          :limit="1"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-remove="handleUploadRemove"
          :on-exceed="handleUploadExceed"
          :auto-upload="true"
              class="modern-upload"
            >
              <div class="upload-trigger">
                <el-icon :size="32"><Plus /></el-icon>
                <div class="upload-text">上传封面</div>
              </div>
        </el-upload>
            <div class="upload-tip">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <span>支持 jpg/png 格式，不超过 5MB</span>
          </div>
          </div>
      </el-form-item>
        
        <!-- 引用古诗 -->
      <el-form-item label="引用古诗">
          <button class="poem-select-btn" @click="choosePoem">
            <el-icon :size="18"><Reading /></el-icon>
            <span>{{ state.choicePoemContent }}</span>
          </button>
      </el-form-item>
        
        <!-- 古诗节选 -->
      <el-form-item label="古诗节选" prop="poemWord">
        <el-input
          v-model="editForm.poemWord"
          type="textarea"
            :rows="4"
          :disabled="state.isExcerptDisabled"
            placeholder="选择古诗后，可在此编辑引用的内容..."
            class="poem-excerpt-textarea"
        />
      </el-form-item>
    </el-form>
    </div>
    
    <template #footer>
      <div class="dialog-footer-actions">
        <button class="footer-btn cancel-btn" @click="state.isSettingsDialogVisible = false">
          <el-icon><Close /></el-icon>
          <span>取消</span>
        </button>
        <button class="footer-btn confirm-btn" @click="saveEditSettings">
          <el-icon><Check /></el-icon>
          <span>确认设置</span>
        </button>
      </div>
    </template>
  </el-dialog>

  <!-- 现代化古诗选择抽屉 -->
  <el-drawer 
    v-model="state.isPoemDrawerVisible" 
    direction="rtl" 
    size="500px"
    class="modern-poem-drawer"
  >
    <template #header>
      <div class="drawer-gradient-header">
        <el-icon :size="28"><Reading /></el-icon>
        <span class="header-title">选择引用古诗</span>
      </div>
    </template>
    
    <div class="drawer-body-content">
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
      <el-input
        ref="poemSearchInputRef"
        v-model="state.poemSearchValue"
          placeholder="输入诗词名、作者搜索..."
          size="large"
        clearable
        @keyup.enter="searchPoemByKey"
          class="poem-search-input"
      >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        <template #append>
            <button class="search-btn" @click="searchPoemByKey" :disabled="state.isLoadingPoems">
              <el-icon v-if="!state.isLoadingPoems"><Search /></el-icon>
              <el-icon v-else class="is-loading"><Loading /></el-icon>
            </button>
        </template>
      </el-input>
      </div>

      <!-- 诗词列表 -->
      <div
        v-loading="state.isLoadingPoems"
        v-infinite-scroll="load"
        class="poem-list-container"
        :infinite-scroll-disabled="state.isLoadingPoems"
        :infinite-scroll-delay="500"
      >
        <el-empty 
          v-if="!state.isLoadingPoems && state.poemData.length === 0" 
          description="暂无诗词或未搜索到结果"
          :image-size="120"
        >
          <template #image>
            <el-icon :size="80" color="#BDC3C7"><Document /></el-icon>
          </template>
        </el-empty>
        
        <div
          v-else
          v-for="item in state.poemData"
          :key="item.id"
          @click="getPoemContent(item)"
          class="poem-card-item"
        >
          <div class="poem-card-header">
            <h3 class="poem-title">{{ item.title }}</h3>
            <div class="poem-badge">
              <el-icon :size="14"><Reading /></el-icon>
            </div>
          </div>
          <pre class="poem-content">{{ item.content }}</pre>
          <div class="poem-card-footer">
            <span class="select-hint">点击选择</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
// 现代化编辑器容器
.modern-editor-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F9FA;
  
  // Mavon Editor 样式
  .modern-mavon-editor {
    flex: 1;
    height: auto !important;
    
    :deep(.v-note-wrapper) {
      border: none;
      border-radius: 0;
      box-shadow: none;
    }
  }
  
  // 现代化工具栏
  .modern-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    background: white;
    border-top: 1px solid #ECF0F1;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    height: 80px;
    flex-shrink: 0;
    
    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    // 返回按钮
    .back-btn {
      display: flex;
        align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #F8F9FA;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      color: #667eea;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
        transform: translateX(-4px);
      }
    }
    
    // 字数统计徽章
    .word-count-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
      border-radius: 20px;
      
      .el-icon {
        color: #667eea;
      }
      
      .count-number {
        font-size: 18px;
        font-weight: 600;
        color: #667eea;
      }
      
      .count-label {
        font-size: 13px;
        color: #7F8C8D;
      }
    }
    
    // 发文设置按钮
    .settings-btn {
  display: flex;
      align-items: center;
  gap: 8px;
      padding: 10px 24px;
      background: white;
      border: 2px solid #667eea;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      color: #667eea;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
        transform: translateY(-2px);
      }
      
      &.shake {
        animation: shake 0.5s ease;
      }
    }
    
    // 操作按钮
    .action-btn {
  display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.secondary {
        background: white;
        color: #7F8C8D;
        border: 2px solid #ECF0F1;
        
        &:hover {
          background: #F8F9FA;
          border-color: #BDC3C7;
          color: #34495E;
          transform: translateY(-2px);
        }
      }
      
      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
      
      .is-loading {
        animation: spin 1s linear infinite;
      }
    }
  }
}

// 抖动动画
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

// 旋转动画
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 现代化对话框样式
.modern-settings-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    
    .el-dialog__header {
    padding: 0;
    margin: 0;
      border: none;
    }
    
    .el-dialog__body {
      padding: 0;
    }
    
    .el-dialog__footer {
      padding: 0;
      border: none;
    }
  }
  
  .dialog-gradient-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .header-title {
      font-size: 20px;
      font-weight: 600;
    }
  }
  
  .dialog-body-content {
    padding: 32px;
    background: #F8F9FA;
    
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #2C3E50;
    }
    
    :deep(.el-input) {
      border-radius: 12px;
      
      .el-input__wrapper {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        &:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        &.is-focus {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
        }
      }
    }
  }
  
  // 分类选择按钮
  .category-select-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 20px;
    background: white;
    border: 2px solid #ECF0F1;
    border-radius: 12px;
    font-size: 14px;
    color: #2C3E50;
      cursor: pointer;
    transition: all 0.3s ease;

      &:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }
    
    .selected-category {
      font-weight: 500;
    }
    
    .arrow-icon {
      color: #7F8C8D;
    }
  }
  
  // 标签选择器
  .tag-selector-content {
    .tag-selector-title {
      font-size: 15px;
      font-weight: 600;
      color: #2C3E50;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #ECF0F1;
    }
    
    .tag-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      
      .tag-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #F8F9FA;
        border: 2px solid transparent;
        border-radius: 12px;
        font-size: 14px;
        color: #2C3E50;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .tag-icon {
          font-size: 18px;
        }
        
        .tag-name {
          flex: 1;
          font-weight: 500;
        }
        
        .check-icon {
          color: white;
        }
        
        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-color: #667eea;
          transform: translateY(-2px);
        }
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }
    }
  }
  
  // 上传包装器
  .upload-wrapper {
    .modern-upload {
      :deep(.el-upload--picture-card) {
        border-radius: 12px;
        border: 2px dashed #BDC3C7;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
        }
        
        .upload-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          
          .el-icon {
            color: #667eea;
          }
          
          .upload-text {
            font-size: 13px;
            color: #7F8C8D;
          }
        }
      }
    }
    
    .upload-tip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 13px;
      color: #7F8C8D;
      
      .el-icon {
        color: #BDC3C7;
      }
    }
  }
  
  // 古诗选择按钮
  .poem-select-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: white;
    border: 2px solid #ECF0F1;
    border-radius: 12px;
    font-size: 14px;
    color: #2C3E50;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
    }
    
    .el-icon {
      color: #667eea;
    }
  }
  
  // 诗词节选文本框
  .poem-excerpt-textarea {
    :deep(.el-textarea__inner) {
      border-radius: 12px;
      border: 2px solid #ECF0F1;
      font-family: 'STKaiti', '楷体', serif;
      line-height: 1.8;
      
      &:hover {
        border-color: #BDC3C7;
      }
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
      }
    }
  }
  
  // 底部操作按钮
  .dialog-footer-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 24px 32px;
    background: white;
    
    .footer-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 32px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.cancel-btn {
        background: #F8F9FA;
        color: #7F8C8D;
        
        &:hover {
          background: #ECF0F1;
          color: #34495E;
        }
      }
      
      &.confirm-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }
}

// 现代化抽屉样式
.modern-poem-drawer {
  :deep(.el-drawer__header) {
    padding: 0;
    margin: 0;
  }
  
  :deep(.el-drawer__body) {
    padding: 0;
  }
  
  .drawer-gradient-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .header-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .drawer-body-content {
    padding: 24px;
    height: calc(100% - 72px);
    display: flex;
    flex-direction: column;
    background: #F8F9FA;
    
    .search-box-wrapper {
      margin-bottom: 20px;
      
      .poem-search-input {
        :deep(.el-input__wrapper) {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          
          &:hover {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          }
          
          &.is-focus {
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          }
        }
        
        :deep(.el-input-group__append) {
          padding: 0;
          border: none;
          background: transparent;
          
          .search-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 0 10px 10px 0;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover:not(:disabled) {
              background: linear-gradient(135deg, #5568d3 0%, #6a4190 100%);
            }
            
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
            
            .is-loading {
              animation: spin 1s linear infinite;
            }
          }
        }
      }
    }
    
    .poem-list-container {
      flex: 1;
      overflow-y: auto;
      padding-right: 8px;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #BDC3C7;
        border-radius: 3px;
        
        &:hover {
          background: #7F8C8D;
        }
      }
      
      .poem-card-item {
        background: white;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        &:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
          
          .poem-card-footer {
            .select-hint {
              color: #667eea;
            }
            
            .arrow-icon {
              color: #667eea;
              transform: translateX(4px);
            }
          }
        }
        
        .poem-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ECF0F1;
          
          .poem-title {
            font-size: 18px;
            font-weight: 600;
            color: #2C3E50;
            margin: 0;
          }
          
          .poem-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
            border-radius: 8px;
            color: #667eea;
          }
        }
        
        .poem-content {
          font-size: 15px;
          line-height: 2;
          color: #34495E;
          font-family: 'STKaiti', '楷体', serif;
          white-space: pre-wrap;
          word-break: break-all;
          text-align: center;
          margin: 0 0 16px 0;
        }
        
        .poem-card-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          
          .select-hint {
            font-size: 13px;
            color: #7F8C8D;
            transition: color 0.3s ease;
          }
          
          .arrow-icon {
            color: #BDC3C7;
            transition: all 0.3s ease;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .modern-editor-container {
    .modern-toolbar {
      flex-direction: column;
      height: auto;
      padding: 12px 16px;
      gap: 12px;
      
      .toolbar-left,
      .toolbar-right {
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .word-count-badge {
        order: -1;
      }
      
      .action-btn {
        flex: 1;
        justify-content: center;
      }
    }
  }
  
  .modern-settings-dialog {
    :deep(.el-dialog) {
      width: 95% !important;
      margin: 20px auto;
    }
    
    .dialog-body-content {
      padding: 20px;
    }
    
    .tag-selector-content {
      .tag-grid {
        grid-template-columns: 1fr;
      }
    }
  }
  
  .modern-poem-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }
  }
}
</style>
