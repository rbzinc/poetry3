<script setup>
// 引入 Vue 相关的响应式 API
import { ref, watch, computed } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/index.js'
import { userLuntanFabutieziPostApi, userLuntanSearchGetApi } from '@/api/modules/talkSquare.js'
import { getpoemRandomData } from '@/api/index.js'
import { goForum, goHome } from '@/router/helpers.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'

// 初始化变量
const length = ref(0)
const dialogTableVisible = ref(false)
const drawer = ref(false)
const inputValue = ref('')
const shakeButton = ref(false)
const poemData = ref([])
const choicePoemContent = ref('点此选择')
const ExcerptDisabled = ref(true)
/**
 * 发文设置表单
 * @type {Ref<UnwrapRef<{images: string, poemId: string, poemWord: string, title: string, type: string, content: string}>, UnwrapRef<{images: string, poemId: string, poemWord: string, title: string, type: string, content: string}> | {images: string, poemId: string, poemWord: string, title: string, type: string, content: string}>}
 */
const EditForm = ref({
  title: '',
  content: '',
  type: '',
  poemId: '',
  images: '',
  poemWord: '',
})

/**
 * 发布博客
 * @returns {Promise<void>}
 */
const submitForm = async () => {
  if (!EditForm.value.title || !EditForm.value.content || !EditForm.value.type || !EditForm.value.images) {
    showMessage('请认真填写发文设置！')
    return
  }
  // 发送请求
  const res = await userLuntanFabutieziPostApi(EditForm.value)
  if (res.data === '发布成功') {
    ElMessage.success('发布成功！')
    EditForm.value
    goForum()
  }
}

/**
 * 保存草稿
 */
const saveDraft = () => {
  if (!EditForm.value.content) {
    showMessage('没有内容可以保存草稿！', 'warning')
    return
  }
  showMessage('草稿保存成功！', 'success')
}

/**
 * 保存发文设置
 */
const saveEdit = () => {
  dialogTableVisible.value = false
  showMessage('发文设置保存成功！', 'success')
}

/**
 * 监听发文设置内容变化
 */
watch(
  () => EditForm.value.content,
  () => {
    length.value = EditForm.value.content.length
  },
)

// 显示消息
const showMessage = (message, type = 'error') => {
  shakeButton.value = type === 'error' // 根据类型决定是否震动
  ElMessage({ message, type })
  if (type === 'error') {
    setTimeout(() => {
      shakeButton.value = false
    }, 500)
  }
}

// 跳转到首页
const toLayoutHome = () => {
  goHome()
}

// 增加计算效率的函数
const count = ref(0)
const load = () => {
  count.value += 2
}

// 为图片上传设置请求头
const userStore = useUserInfoStore()
const headers = ref({
  token: userStore.userInfo.token,
})
// 图片上传成功回调
const handleSuccess = (res) => {
  EditForm.value.images = res.data
}

const tagData = ref([
  {
    id: 1,
    name: '诗词创作',
    checked: false,
  },
  {
    id: 2,
    name: '诗词赏析',
    checked: false,
  },
  {
    id: 3,
    name: '诗词学习',
    checked: false,
  },
  {
    id: 4,
    name: '诗词活动',
    checked: false,
  },
  {
    id: 5,
    name: '诗词资源',
    checked: false,
  },
  {
    id: 6,
    name: '诗词杂谈',
    checked: false,
  },
])

const selectedTagId = ref(null)

const selectedTagName = computed(() => {
  if (selectedTagId.value === null) {
    return '分类选择'
  } else {
    const selectedTag = tagData.value.find((tag) => tag.id === selectedTagId.value)
    return selectedTag ? selectedTag.name : '分类选择'
  }
})

/**
 * 切换标签
 * @param item
 */
const toggleTag = (item) => {
  EditForm.value.type = item.name
  if (selectedTagId.value !== item.id) {
    selectedTagId.value = item.id
  } else {
    selectedTagId.value = null // 如果再次点击同一个标签，则取消选中
  }
}

/**
 * 打开侧边栏选择古诗
 * @returns {Promise<void>}
 */
const choosePoem = async () => {
  drawer.value = true
  const res = await getpoemRandomData()
  poemData.value = res.data
  inputValue.value = ''
}

/**
 * 选择古诗
 * @param e
 */
const getPoemContent = (e) => {
  drawer.value = false
  EditForm.value.poemWord = e.content
  EditForm.value.poemId = e.id
  choicePoemContent.value = e.title
  ExcerptDisabled.value = false
}

/**
 * 通过关键字搜索古诗
 * @returns {Promise<void>}
 */
const searchPoemByKey = async () => {
  const res = await userLuntanSearchGetApi(inputValue.value)
  poemData.value = res.data
}
</script>

<template>
  <div id="editor">
    <mavon-editor v-model="EditForm.content" style="height: 90vh" />
    <div class="blog-post">
      <div class="foot-left">
        <p style="margin-right: 40px; cursor: pointer" @click="toLayoutHome">< 返回首页</p>
        <p style="margin-right: 40px">共 {{ length }} 个字</p>
        <el-button size="large" type="primary" round @click="dialogTableVisible = true" :class="{ shake: shakeButton }">
          发文设置
        </el-button>
      </div>
      <div class="foot-right">
        <el-button size="large" round @click="saveDraft">保存草稿</el-button>
        <el-button size="large" type="primary" round @click="submitForm">发布博客</el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogTableVisible" width="800">
    <el-form :model="EditForm" label-width="auto" style="max-width: 600px">
      <el-form-item label="文章标题">
        <el-input v-model="EditForm.title" />
      </el-form-item>
      <el-form-item label="添加封面">
        <el-upload :action="UPLOAD_ADDRESS" list-type="picture-card" :headers="headers" :on-success="handleSuccess">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="分类选择">
        <el-popover placement="right" :width="400" trigger="click">
          <template #reference>
            <el-button
              :style="{
                backgroundColor: selectedTagName === '分类选择' ? '' : 'skyblue',
              }"
              style="margin-right: 16px"
            >
              {{ selectedTagName }}
            </el-button>
          </template>

          <el-check-tag
            v-for="item in tagData"
            :key="item.id"
            style="margin: 5px"
            :checked="item.id === selectedTagId"
            @click="toggleTag(item)"
          >
            {{ item.name }}
          </el-check-tag>
        </el-popover>
      </el-form-item>
      <el-form-item label="选择古诗">
        <el-button @click="choosePoem">{{ choicePoemContent }}</el-button>
      </el-form-item>
      <el-form-item label="古诗节选">
        <el-input v-model="EditForm.poemWord" type="textarea" :disabled="ExcerptDisabled" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveEdit">保存</el-button>
  </el-dialog>

  <el-drawer v-model="drawer" title="文章大全">
    <el-input v-model="inputValue" style="max-width: 600px" placeholder="请输入古诗名字" class="input-with-select">
      <template #append>
        <el-button :icon="Search" @click="searchPoemByKey" />
      </template>
    </el-input>

    <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
      <div v-for="item in poemData" :key="item.id" @click="getPoemContent(item)" class="infinite-list-item">
        <h3 class="title">{{ item.title }}</h3>
        <p class="content" v-html="item.content"></p>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
#editor {
  margin: auto;
  width: 100%;

  .blog-post {
    display: flex;
    margin-top: 20px;
    height: 40px;
    justify-content: space-around;
    margin-bottom: 20px;

    .foot-left {
      display: flex;
      line-height: 40px;
    }
  }
}

:deep(.markdown-body img) {
  max-width: 400px;
  max-height: 200px;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.infinite-list {
  height: 590px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  padding: 16px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(1y);
  cursor: pointer;

  .title {
    display: flex;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 10px;
  }

  .content {
    display: flex;
    justify-content: center;
    font-size: 14px;
    line-height: 1.6;
  }
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

// 按钮抖动效果
@keyframes shake {
  0% {
    transform: translate(0);
  }
  25% {
    transform: translate(-4px, 0);
  }
  50% {
    transform: translate(4px, 0);
  }
  75% {
    transform: translate(0, -4px);
  }
  100% {
    transform: translate(0, 4px);
  }
}

.shake {
  animation: shake 0.5s ease;
  background-color: #c52727; /* 设置按钮为红色 */
  color: white; /* 设置按钮文字颜色为白色以便于阅读 */
}
</style>
