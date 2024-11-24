<script setup>
// 导入AiPoemAside组件和vue相关的库
import AiPoemAside from "@/components/AiPoetAside/index.vue";
import { ref, computed } from 'vue';
import { ElMessage } from "element-plus";

// 定义messages变量，用于存储聊天记录
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);

// 定义inputMessage变量，用于存储用户输入的消息
const inputMessage = ref('');
// 定义typeIndex变量，用于存储当前选择的类型索引
const typeIndex = ref(1);

// 定义发送消息的函数
const sendMessage = () => {
  const trimmedInput = inputMessage.value.trim();
  if (!trimmedInput) {
    ElMessage.error('请输入内容');
    return; // 直接返回，避免后续不必要的计算
  }

  messages.value.push({ text: trimmedInput, self: true });
  inputMessage.value = '';
};

// 定义改变消息类型的函数
const changeType = (event) => {
  typeIndex.value = event; // 直接赋值，console.log已去除
};

// 计算占位符文本，根据选择的类型返回不同的提示信息
const placeholderText = computed(() => {
  const placeholders = [
    '请选择类型',
    '请输入您的古诗，我会帮你修改',
    '请输入您的古诗，我会帮你批改',
    '请输入您的古诗，我会帮你剖析',
  ];
  return placeholders[typeIndex.value] || placeholders[0];
});
</script>

<template>
  <div>
    <AiPoemAside />
  </div>
  <div class="chat-container">
    <el-scrollbar>
      <div class="messages-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{ 'my-message': message.self, 'ai-message': !message.self }"
        >
          <img
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
            alt=""
            class="avatar avatarAi"
            v-if="!message.self"
          />
          <p>{{ message.text }}</p>
          <img
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
            alt=""
            class="avatar avatarMy"
            v-if="message.self"
          />
        </div>
      </div>
    </el-scrollbar>
    <div class="dialog-input">
      <el-input
        v-model="inputMessage"
        :placeholder="placeholderText"
        @keyup.enter="sendMessage"
        size="large"
        style="width:85%; margin-left:10px"
      />
      <el-dropdown split-button type="primary" size="large" style="margin-right:10px" @click.native="sendMessage">
        发送
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="changeType(1)">修改</el-dropdown-item>
            <el-dropdown-item @click.native="changeType(2)">批改</el-dropdown-item>
            <el-dropdown-item @click.native="changeType(3)">剖析</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
    justify-content: space-around;
  }
}
</style>
