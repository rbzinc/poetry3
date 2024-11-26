<script setup>
// 引入 AiPoemAside 组件
import AiPoemAside from "@/components/AiPoetAside/index.vue";
// 从 vue 引入 ref 方法
import { ref } from 'vue';
// 从 element-plus 引入 ElMessage 和 genFileId
import { ElMessage, genFileId } from 'element-plus';

// 定义消息的响应式数据
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);

const input = ref('');
const upload = ref();

// 处理文件超出的回调函数
const handleExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  // 给上传的文件添加唯一 ID
  if (file) {
    file.uid = genFileId();
    upload.value.handleStart(file);
  } else {
    ElMessage.error('未选择文件');
  }
};

// 创建选项的函数
const createOption = (optionName, options) => {
  if (optionName.value) {
    options.value.push({
      label: optionName.value,
      value: optionName.value,
    });
    optionName.value = '';
  } else {
    ElMessage.warning('请输入有效的内容');
  }
};


// 体裁相关的响应式数据
const genre = ref([
  { value: '人物情感', label: '人物情感' },
  { value: '自然风光', label: '自然风光' },
  { value: '政治讽喻', label: '政治讽喻' },
]);
const genreValue = ref('');
const genreOptionName = ref('');
const genreAdding = ref(false);
const onGenreConfirm = ()=> {
  if (genreOptionName.value) {
    genre.value.push({
      label: genreOptionName.value,
      value: genreOptionName.value,
    })
  }
  onGenreConfirm.value = ''
  genreAdding.value = false
}

// 情感相关的响应式数据
const emotion = ref([
  { value: '春意', label: '春意' },
  { value: '秋思', label: '秋思' },
  { value: '江雪', label: '江雪' },
]);
const emotionValue = ref('');
const emotionOptionName = ref('');
const emotionAdding = ref(false);
const onEmotionConfirm = ()=> {
  if (emotionOptionName.value) {
    genre.value.push({
      label: emotionOptionName.value,
      value: emotionOptionName.value,
    })
  }
  onGenreConfirm.value = ''
  genreAdding.value = false
}
// 主题相关的响应式数据
const theme = ref([
  { value: '春意', label: '春意' },
  { value: '秋思', label: '秋思' },
  { value: '江雪', label: '江雪' },
]);
const themeValue = ref('');
const themeOptionName = ref('');
const themeAdding = ref(false);
const onThemeConfirm = ()=> {
  if (themeOptionName.value) {
    genre.value.push({
      label: themeOptionName.value,
      value: themeOptionName.value,
    })
  }
  onGenreConfirm.value = ''
  genreAdding.value = false
}
// 确认和清除函数
const confirmAndClear = (optionName, options, adding) => {
  console.log(optionName.value, options.value, adding.value);
  createOption(optionName, options);
  adding.value = false;
};

// 输出输入框内容的函数
const offerPic = () => {
  console.log(input.value);
};
</script>

<template>
  <div>
    <!-- 渲染 AiPoemAside 组件 -->
    <AiPoemAside />
  </div>
  <div class="chat-container">
    <el-scrollbar>
      <div class="messages-container">
        <div
          v-for="(message, index) in messages" :key="index"
          class="message"
          :class="{ 'my-message': message.self, 'ai-message': !message.self }">
          <img
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
            alt=""
            class="avatar avatarAi"
            v-if="!message.self" />
          <p>{{ message.text }}</p>
          <img
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
            alt=""
            class="avatar avatarMy"
            v-if="message.self" />
        </div>
      </div>
    </el-scrollbar>

    <div class="dialog-input">
      <div style="display: flex;align-items: center;justify-content: space-evenly; width: 1100px">
        <!-- 体裁选择 -->
        <el-select v-model="genreValue" placeholder="体裁" style="width: 180px">
          <el-option
            v-for="item in genre"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
          <template #footer>
            <el-button v-if="!genreAdding" text bg size="small" @click="genreAdding = true">
              自定义体裁
            </el-button>
            <template v-else>
              <el-input
                v-model="genreOptionName"
                class="option-input"
                placeholder="请输入体裁内容"
                size="default"
                style="width: 180px" />
              <br />
              <el-button type="primary" size="small" @click="onGenreConfirm">
                确定
              </el-button>
              <el-button size="small" @click="genreOptionName = ''; genreAdding = false">取消</el-button>
            </template>
          </template>
        </el-select>

        <!-- 情感选择 -->
        <el-select v-model="emotionValue" placeholder="情感" style="width: 180px">
          <el-option
            v-for="item in emotion"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
          <template #footer>
            <el-button v-if="!emotionAdding" text bg size="small" @click="emotionAdding">
              自定义体裁
            </el-button>
            <template v-else>
              <el-input
                v-model="emotionOptionName"
                class="option-input"
                placeholder="请输入情感内容"
                size="default"
                style="width: 180px" />
              <br />
              <el-button type="primary" size="small" @click="onEmotionConfirm">
                确定
              </el-button>
              <el-button size="small" @click="emotionOptionName = ''; emotionAdding = false">取消</el-button>
            </template>
          </template>
        </el-select>

        <!-- 主题选择 -->
        <el-select v-model="themeValue" placeholder="主题" style="width: 180px">
          <el-option
            v-for="item in theme"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
          <template #footer>
            <el-button v-if="!themeAdding" text bg size="small" @click="themeAdding = true">
              自定义体裁
            </el-button>
            <template v-else>
              <el-input
                v-model="themeOptionName"
                class="option-input"
                placeholder="请输入体裁内容"
                size="default"
                style="width: 180px" />
              <br />
              <el-button type="primary" size="small" @click="onThemeConfirm">
                确定
              </el-button>
              <el-button size="small" @click="themeOptionName = ''; themeAdding = false">取消</el-button>
            </template>
          </template>
        </el-select>

        <!-- 自定义标题输入框 -->
        <el-input v-model="input" placeholder="自定义标题" style="width: 180px;"></el-input>

        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false">
          <template #trigger>
            <el-button type="primary" style="margin-top: 10px">选择图片</el-button>
          </template>
        </el-upload>
      </div>

      <!-- 发送按钮 -->
      <el-button style="margin-left: 60px; margin-right: 20px;" @click="offerPic">发送</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  width: 80%;
  height: 560px;
  margin: 30px auto;

  .messages-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    margin-left: 10px;
    align-items: flex-start;

    .message {
      padding: 10px;
      border-radius: 4px;
      max-width: 75%;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      margin-top: 10px;
      margin-right: 10px;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .avatarAi {
      margin-right: 15px;
    }

    .avatarMy {
      margin-left: 15px;
    }

    .my-message {
      align-self: flex-end;
      background: linear-gradient(to left, transparent 0%, transparent 50px, #e6f7ff 50px, #e6f7ff 100%);
    }

    .ai-message {
      align-self: flex-start;
      background: linear-gradient(to right, transparent 0%, transparent 50px, #e6f7ff 50px, #e6f7ff 100%);
    }
  }

  .dialog-input {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 4vh;
    left: 7vw;
    width: 90vw;
  }
}

// 自定义选项输入框样式
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
