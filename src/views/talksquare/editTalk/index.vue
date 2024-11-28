<script setup>
// 引入 Vue 相关的响应式 API
import {ref, watch} from "vue";
import {ElForm, ElFormItem, ElInput, ElButton, ElMessage} from 'element-plus';
import {Delete, Download, Plus, Search, ZoomIn} from '@element-plus/icons-vue';
import router from "@/router/index.js";
import {useUserInfoStore} from "@/stores/index.js";
import {userLuntanFabutieziPostApi} from "@/api/modules/talkSquare.js";
import {getpoemRandomData} from "@/api/modules/index.js";

// 初始化变量
const length = ref(0);
const dialogTableVisible = ref(false);
const drawer = ref(false);
const inputValue = ref('');
const shakeButton = ref(false);
const poemData = ref([]);
// 表单数据
const EditForm = ref({
  title: '',
  content: '',
  type: '',
  poemid: '1',
  images: '',
  poemword: ''
});

// 提交表单
const submitForm = async () => {
  if (!EditForm.value.title || !EditForm.value.content || !EditForm.value.type || !EditForm.value.poemid || !EditForm.value.images || !EditForm.value.poemword) {
    showMessage('请认真填写发文设置！');
    return
  }
  // 发送请求
  console.log(EditForm.value)
  const res = await userLuntanFabutieziPostApi(EditForm.value)
  console.log(res)
};

// 保存草稿
const saveDraft = () => {
  if (!EditForm.value.content) {
    showMessage('没有内容可以保存草稿！', 'warning');
    return;
  }
  showMessage('草稿保存成功！', 'success');
};

// 保存发文设置
const saveEdit = () => {
  dialogTableVisible.value = false;
  showMessage('发文设置保存成功！', 'success');
}

// 监控内容变化以更新字数
watch(() => EditForm.value.content, () => {
  length.value = EditForm.value.content.length
});

// 显示消息
const showMessage = (message, type = 'error') => {
  shakeButton.value = type === 'error'; // 根据类型决定是否震动
  ElMessage({message, type});
  if (type === 'error') {
    setTimeout(() => {
      shakeButton.value = false;
    }, 500);
  }
};

// 跳转到首页
const toLayoutHome = () => {
  router.push('/');
};

// 增加计算效率的函数
const count = ref(0);
const load = () => {
  count.value += 2;
};

// 为图片上传设置请求头
const userStore = useUserInfoStore()
const headers = ref({
  'token': userStore.userInfo.token
})
// 图片上传成功回调
const handleSuccess = (res) => {
  EditForm.value.images = res.data
}

const tagData = ref([
  {
    id: 1,
    name: '诗词创作',
    checked: false
  },
  {
    id: 2,
    name: '诗词赏析',
    checked: false
  },
  {
    id: 3,
    name: '诗词学习',
    checked: false
  },
  {
    id: 4,
    name: '诗词活动',
    checked: false
  },
  {
    id: 5,
    name: '诗词资源',
    checked: false
  },
  {
    id: 6,
    name: '诗词杂谈',
    checked: false
  }
]);

const selectedTagId = ref(null);

const selectedTagName = computed(() => {
  if (selectedTagId.value === null) {
    return '分类选择';
  } else {
    const selectedTag = tagData.value.find(tag => tag.id === selectedTagId.value);
    return selectedTag ? selectedTag.name : '分类选择';
  }
});
const toggleTag = (item) => {
  EditForm.value.type = item.name;
  if (selectedTagId.value !== item.id) {
    selectedTagId.value = item.id;
  } else {
    selectedTagId.value = null; // 如果再次点击同一个标签，则取消选中
  }
};

const choosePoem = async () => {
  drawer.value = true;
  const res = await getpoemRandomData()
  console.log(res)
  poemData.value = res.data
  console.log(poemData.value)
}

const getPoemContent = (e) => {
  EditForm.value.poemword = e.content;
  drawer.value = false;
}
</script>

<template>
  <div id="editor">
    <mavon-editor v-model="EditForm.content" style="height: 90vh;"/>
    <div class="blog-post">
      <div class="foot-left">
        <p style="margin-right: 40px; cursor: pointer" @click="toLayoutHome"> < 返回首页</p>
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
        <el-input v-model="EditForm.title"/>
      </el-form-item>
      <el-form-item label="添加封面">
        <el-upload action="http://fuze1.nat300.top/user/luntan/updateImage" list-type="picture-card" :headers="headers"
                   :on-success="handleSuccess">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="分类选择">
        <el-popover placement="right" :width="400" trigger="click">
          <template #reference>
            <el-button :style="{ backgroundColor: selectedTagName === '分类选择' ? '' : 'skyblue' }"
                       style="margin-right: 16px">
              {{ selectedTagName }}
            </el-button>
          </template>

          <el-check-tag
              v-for="item in tagData"
              :key="item.id"
              style="margin: 5px"
              :checked="item.id === selectedTagId"
              @click="toggleTag(item)">
            {{ item.name }}
          </el-check-tag>
        </el-popover>

      </el-form-item>
      <el-form-item label="选择古诗">
        <el-button @click="choosePoem">点此选择</el-button>
      </el-form-item>
      <el-form-item label="古诗节选">
        <el-input v-model="EditForm.poemword" type="textarea"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveEdit">保存</el-button>
  </el-dialog>

  <el-drawer
      v-model="drawer"
      title="文章大全"
  >
    <el-input
        v-model="inputValue"
        style="max-width: 600px"
        placeholder="请输入古诗名字"
        class="input-with-select"
    >
      <template #append>
        <el-button :icon="Search"/>
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
