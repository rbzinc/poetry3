<script setup>
import AiPoemAside from "@/components/AiPoetAside/index.vue";
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);

const input = ref('')
const isCustomStyleVisible = ref(false)
import { ref } from 'vue'
import { genFileId } from 'element-plus'

const upload = ref()

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
const submitUpload = () => {
  upload.value.submit()
}

const choiceCustomize = () => {
  isCustomStyleVisible.value = true
}
</script>

<template>
  <div>
    <AiPoemAside />
  </div>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(message, index) in messages" :key="index"
           class="message"
           :class="{ 'my-message': message.self, 'ai-message': !message.self }">

        {{ message.text }}
      </div>
    </div>
    <div class="dialog-input">
      <div style="display: flex;align-items: center;justify-content: space-evenly;">
        <el-dropdown v-show="isCustomStyleVisible" split-button type="primary" >
          <span>体裁</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item @click="choiceCustomize">自定义</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-input v-show="!isCustomStyleVisible" v-model="input" style="width: 140px" placeholder="输入文章标题" />

        <el-dropdown split-button type="primary">
          情感
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item>自定义</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown split-button type="primary">
          主题
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item>自定义</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>


        <el-input v-model="input" style="width: 140px" placeholder="输入文章标题" />

        <el-upload
            ref="upload"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary" style="margin-top: 10px">选择图片</el-button>
          </template>

        </el-upload>
      </div>

      <el-button style="margin-left: 540px">发送</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container{
  width: 80%;
  height: 600px;
  background-color: skyblue;
  margin: 30px auto;
  .messages-container {
    display: flex;
    flex-direction: column;
    height: 534px;
    margin-bottom: 10px;
    margin-left: 10px;
    .message {
      padding: 12px;
      border-radius: 4px;
      max-width: 80%;
      word-wrap: break-word;
      margin-top: 10px;
    }
    .my-message {
      align-self: flex-end;
      background-color: #e6f7ff;
    }

    .ai-message {
      align-self: flex-start;
      background-color: #f0f9ff;

    }
  }

  .dialog-input {
    display: flex;
    align-items: center;
  }
}
</style>
