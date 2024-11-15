<script setup>
// 引入 Vue 相关的响应式 API
import { ref, watch  } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import router from "@/router/index.js";


// 初始化变量
const length = ref(0);
const dialogTableVisible = ref(false);
const disabled = ref(false);
const drawer = ref(false)
const direction = ref('rtl')

// 表单数据
const EditForm = ref({
  title:'',
  content:'',
  type:'',
  poemid:'',
  images:''
});

const shakeButton = ref(false);
// 提交表单
const submitForm = async () => {
  if (!EditForm.value.title) {
    shakeButton.value = true; // 添加 shake 类
    ElMessage.error('请认真填写发文设置！');
    setTimeout(() => { shakeButton.value = false; }, 500); // 500ms 后移除 shake 类
    return;
  }
};

// 保存草稿
const saveDraft = () => {
  if (!EditForm.value.content) {
    ElMessage.warning('没有内容可以保存草稿！');
    return;
  }
  console.log('保存草稿', EditForm.value);
  ElMessage.info('草稿保存成功！');
};

const SaveEdit = () =>{
  dialogTableVisible.value = false;
  ElMessage.success('发文设置保存成功！');
}

// 监控内容变化
watch(()=>EditForm.value.content, () => {
    length.value =EditForm.value.content.length
});

// 图片处理
const dialogImageUrl = ref('');
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
};

const handleRemove = (file) => {
  console.log(file);
};

const handleDownload = (file) => {
  console.log(file);
};

// 跳转到上一页
const toLastPage = () => {
  router.push('/');
};







</script>

<template>
  <div id="editor">
    <mavon-editor v-model="EditForm.content" style="height: 90vh;"/>
    <div class="blog-post">
      <div class="foot-left">
        <p style="margin-right: 40px; cursor: pointer" @click="toLastPage"> < 返回首页</p>
        <p style="margin-right: 40px">共 {{ length }} 个字</p>
        <el-button size="large" type="primary" round @click="dialogTableVisible = true" :class="{ shake: shakeButton }">发文设置</el-button>
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
        <el-upload action="#" list-type="picture-card" :auto-upload="false">
          <el-icon>
            <Plus/>
          </el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><ZoomIn/></el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <el-icon><Download/></el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon><Delete/></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="选择故事">
        <el-button  @click="drawer = true">点此选择</el-button>
      </el-form-item>
      <el-form-item label="古诗节选">
        <el-input v-model="EditForm.type" type="textarea"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="SaveEdit">保存</el-button>
  </el-dialog>


  <el-drawer
      v-model="drawer"
      title="文章大全"
      :direction="direction"
      :before-close="handleClose"
  >
    <span>Hi, there!</span>
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
// 按钮抖动效果
@keyframes shake {
  0% { transform: translate(0); }
  25% { transform: translate(-4px, 0); }
  50% { transform: translate(4px, 0); }
  75% { transform: translate(0, -4px); }
  100% { transform: translate(0, 4px); }
}
.shake {
  animation: shake 0.5s ease;
  background-color: #c52727; /* 设置按钮为红色 */
  color: white; /* 设置按钮文字颜色为白色以便于阅读 */
}
</style>
