<script setup>
// 导入组件和库
import AiPoemAside from "@/components/AiPoetAside/index.vue";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {useUserInfoStore} from "@/stores/index.js";
import {usePoemImgStore} from "@/stores/index.js";
import {aiChatGetApi} from "@/api/modules/aiChat.js";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {getSentenceData} from "@/api/modules/index.js";

const route = useRoute();
const userInfo = useUserInfoStore();
const PoemImgStore = usePoemImgStore();
const PoemImg = PoemImgStore.poemImg
const imgUrl = PoemImg[Number(route.params.id) - 1].url
const poetPoem = ref([])
// 定义消息存储
const messages = ref([
  {text: PoemImg[Number(route.params.id) - 1].content, self: false},
]);

// 定义输入内容
const inputMessage = ref('');

// 发送消息的函数
const sendMessage = () => {
  const trimmedInput = inputMessage.value.trim();
  if (trimmedInput) {
    messages.value.push({text: trimmedInput, self: true});
    aiChatGetApi(route.params.id, trimmedInput).catch(err => {
      console.error('API请求失败:', err);
    });

    inputMessage.value = '';
  } else {
    ElMessage.error('请输入内容');
  }
};

const controller = new AbortController();

// 获取服务器发送事件的函数
const GetSSE = () => {
  const sseService = fetchEventSource('http://fuze1.nat300.top/ai/submita', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': useUserInfoStore().userInfo.token,
    },
    signal: controller.signal,
    openWhenHidden: true,
    onmessage(event) {
      const data = JSON.parse(event.data);
      console.log(event)
      console.log(event.data)
      if(!event.data.includes('\\ndata')){
        if (data) {
          const lastMessage = messages.value[messages.value.length - 1];
          if (lastMessage && !lastMessage.self) {
            lastMessage.text += data;
          } else {
            messages.value.push({text: data, self: false});
          }
        }
      }else{
        console.log('我没有\\ndata数据')
      }
    },
    onerror(event) {
      console.log('错误:', event);
      messages.value.push({text: '连接出现问题，请稍后再试。', self: false});
    },
  });
}

const getSentence = async () => {
  const res = await getSentenceData(PoemImg[Number(route.params.id) - 1].title, 1)
  poetPoem.value = res.data.records
}

onBeforeUnmount(() => {
  controller.abort();
});


onMounted(() => {
  GetSSE()
  getSentence()
})
</script>

<template>
  <div style="display: flex;">
    <div>
      <AiPoemAside/>
    </div>
    <div class="ai-chat-title">
      <div class="chat-container">
        <el-scrollbar>
          <div class="messages-container">
            <div
                v-for="(message, index) in messages" :key="index"
                class="message"
                :class="{ 'my-message': message.self, 'ai-message': !message.self }">
              <img
                  :src="imgUrl"
                  alt=""
                  class="avatar avatarAi"
                  v-if="!message.self"/>
              <p>{{ message.text }}</p>
              <img
                  :src="userInfo.userInfo.touxiang"
                  alt=""
                  class="avatar avatarMy"
                  v-if="message.self"/>
            </div>
          </div>
        </el-scrollbar>

        <div class="dialog-input">
          <el-input
              v-model="inputMessage"
              placeholder="有什么想问的你都可以畅所欲言！"
              @keyup.enter="sendMessage"
              size="large"
              style="width:70%; margin-left:10px"
          />
          <el-button size="large" style="margin-left:20px" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-card class="introduce-card">
        <template #header>
          <div class="card-header">
            <span>{{ PoemImg[Number(route.params.id) - 1].title }} -- 经典名句</span>
          </div>
        </template>
        <div v-for="item in poetPoem" :key="item.id" style="margin-bottom: 10px;">
          <p style="font-size: 16px; font-weight: 550; margin-bottom: 15px;">
            {{ item.fromm }}
          </p>
          <p>
            {{ item.name }}
          </p>
        </div>

      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-title {
  margin-top: 30px;
  margin-left: 100px;
  width: 70%;

  .title-card {
    text-indent: 2em;
    font-size: 14px;

  }

  .chat-container {
    width: 100%;
    height: 480px;
    margin-top: 20px;
    margin-bottom: 40px;

    .messages-container {
      display: flex;
      flex-direction: column;
      height: 440px;
      margin-bottom: 10px;
      margin-left: 10px;

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
}

.introduce-card {
  margin-top: 30px;
  margin-left: 30px;
  width: 300px;

}
</style>
