<script setup>
import { ref, watch, computed, reactive } from 'vue' // 引入 reactive
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus' // 引入 ElMessageBox
import { useUserInfoStore } from '@/stores/index.js'
import { userLuntanFabutieziPostApi, userLuntanSearchGetApi } from '@/api/modules/talkSquare.js'
import { getpoemRandomData } from '@/api/index.js'
import { goForum, goHome } from '@/router/helpers.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'
import { Search } from '@element-plus/icons-vue'

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
  <div id="editor">
    <mavon-editor v-model="editForm.content" style="height: calc(100vh - 80px)" placeholder="开始写作..." />
    <div class="blog-post">
      <div class="foot-left">
        <p style="margin-right: 20px; cursor: pointer; color: #409eff" @click="toLayoutHome">
          <el-icon><ArrowLeftBold /></el-icon> 返回首页
        </p>
        <p style="margin-right: 20px; color: #909399">共 {{ state.contentLength }} 字</p>
        <el-button
          size="large"
          type="primary"
          round
          @click="state.isSettingsDialogVisible = true"
          :class="{ shake: state.isShakeButton }"
        >
          发文设置
        </el-button>
      </div>
      <div class="foot-right">
        <el-button size="large" round @click="saveDraft">保存草稿</el-button>
        <el-button size="large" type="primary" round @click="submitForm" :loading="state.isLoadingSubmit">
          {{ state.isLoadingSubmit ? '发布中...' : '发布博客' }}
        </el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="state.isSettingsDialogVisible" title="发文设置" width="600px" :close-on-click-modal="false">
    <el-form ref="editorFormRef" :model="editForm" :rules="rules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="editForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="添加封面" prop="images">
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
        >
          <el-icon><Plus /></el-icon>
          <template #tip>
            <div class="el-upload__tip">只能上传一张 jpg/png 文件，且不超过 5MB</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章分类" prop="type">
        <el-popover placement="bottom-start" :width="300" trigger="click">
          <template #reference>
            <el-button>
              {{ selectedTagName }} <el-icon style="margin-left: 5px"><ArrowDown /></el-icon>
            </el-button>
          </template>
          <div class="tag-popover-content">
            <el-check-tag
              v-for="item in tagData"
              :key="item.id"
              style="margin: 5px"
              :checked="item.id === state.selectedTagId"
              @change="toggleTag(item)"
            >
              {{ item.name }}
            </el-check-tag>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item label="引用古诗">
        <el-button @click="choosePoem">{{ state.choicePoemContent }}</el-button>
      </el-form-item>
      <el-form-item label="古诗节选" prop="poemWord">
        <el-input
          v-model="editForm.poemWord"
          type="textarea"
          :rows="3"
          :disabled="state.isExcerptDisabled"
          placeholder="选择古诗后，可在此编辑引用的内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.isSettingsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditSettings"> 确认设置 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-drawer v-model="state.isPoemDrawerVisible" title="选择引用古诗" direction="rtl" size="450px">
    <div class="poem-drawer-content">
      <el-input
        ref="poemSearchInputRef"
        v-model="state.poemSearchValue"
        placeholder="输入诗词名、作者搜索"
        class="input-with-select"
        clearable
        @keyup.enter="searchPoemByKey"
      >
        <template #append>
          <el-button :icon="Search" @click="searchPoemByKey" :loading="state.isLoadingPoems" />
        </template>
      </el-input>

      <div
        v-loading="state.isLoadingPoems"
        v-infinite-scroll="load"
        class="infinite-list"
        style="overflow: auto; margin-top: 15px"
        :infinite-scroll-disabled="state.isLoadingPoems"
        :infinite-scroll-delay="500"
      >
        <el-empty v-if="!state.isLoadingPoems && state.poemData.length === 0" description="暂无诗词或未搜索到结果" />
        <div
          v-else
          v-for="item in state.poemData"
          :key="item.id"
          @click="getPoemContent(item)"
          class="infinite-list-item"
        >
          <h3 class="title">{{ item.title }}</h3>

          <pre class="content">{{ item.content }}</pre>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
#editor {
  width: 100%;
  height: 100vh; // 让编辑器容器占满视口高度
  display: flex;
  flex-direction: column; // 垂直布局

  .v-md-editor {
    // 假设 mavon-editor 渲染后的类名，或直接作用于组件
    flex-grow: 1; // 编辑器占据剩余空间
    height: auto !important; // 覆盖可能存在的内联高度
  }

  .blog-post {
    display: flex;
    align-items: center; // 垂直居中对齐
    padding: 10px 20px; // 调整内边距
    height: 60px; // 固定底部栏高度
    border-top: 1px solid #eee; // 添加上边框
    background-color: #fff; // 添加背景色
    flex-shrink: 0; // 防止底部栏被压缩

    .foot-left {
      display: flex;
      align-items: center;
      gap: 15px; // 使用 gap 控制间距
      p {
        margin: 0; // 移除默认 margin
        display: flex; // 让 icon 和文字对齐
        align-items: center;
        gap: 5px;
      }
    }
    .foot-right {
      margin-left: auto; // 将右侧按钮推到最右边
      display: flex;
      gap: 10px;
    }
  }
}

// 弹窗和抽屉样式优化
.tag-popover-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.poem-drawer-content {
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .infinite-list {
    flex-grow: 1; // 列表占据剩余空间
    height: auto; // 高度自适应
    padding: 0;
    margin: 0;
    list-style: none;

    .infinite-list-item {
      padding: 10px 10px;
      background: #f8f9fa;
      margin-bottom: 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #e9ecef; // 添加 hover 效果
      }

      .title {
        font-size: 16px; // 调整字体大小
        margin-bottom: 8px; // 调整间距
        color: #343a40;
        text-align: center; // 居中
      }

      .content {
        font-size: 14px;
        line-height: 1;
        color: #495057;
        white-space: pre-wrap; // 保留换行和空格
        word-break: break-all; // 长单词换行
        text-align: center; // 居中
      }
    }
  }
}
</style>
