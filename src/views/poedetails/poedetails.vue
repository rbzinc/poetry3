<script setup>
import { VideoPlay } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { aiAudioGetApi, userAIDraowGetApi } from "../../api/modules/aiChat";
import { getPoemDetatils } from "../../api/modules/poePavilion";
import router from "../../router";

const route = useRoute();
const dataList = ref([]);
const routerPathId = ref("");
let dialogFormVisible = ref(false);
let titleid = ref();
const poemtitle = ref("");
const imageUrl = ref("");
const writer = ref("");
const content = ref("");
const translation = ref("");
const remarks = ref("");
const shangxi = ref("");
const dynasty = ref("");
const isopen = ref(true);
const audioUrl = ref("");

const change = () => {
  isopen.value = !isopen.value;
};
//获取诗的详细信息
const getData = async () => {
  const res = await getPoemDetatils(titleid);
  dataList.value = res.data;
  routerPathId.value = dataList.value[0].id;
  poemtitle.value = dataList.value[0].title;
  writer.value = dataList.value[0].writer;
  remarks.value = dataList.value[0].remarks;
  translation.value = dataList.value[0].translation;
  shangxi.value = dataList.value[0].shangxi;
  dynasty.value = dataList.value[0].dynasty;
  content.value = dataList.value[0].content;
};


// 添加音频播放相关的响应式变量
const isPlaying = ref(false);
const audioPlayer = ref(null);

// 音频播放控制函数
const handlePlayClick = async () => {
  if (!audioPlayer.value) return;

  // 如果还没有音频URL，先获取
  if (!audioUrl.value) {
    try {
      const res = await aiAudioGetApi(routerPathId.value);
      audioUrl.value = res.data;
      // 确保返回的URL是有效的
      if (!audioUrl.value) {
        ElMessage.error("获取音频失败");
        return;
      }
    } catch (error) {
      console.error(error);
      ElMessage.error("获取音频失败");
      return;
    }
  }

  try {
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
    } else {
      // 确保audio元素已经加载了新的src
      await audioPlayer.value.load();
      await audioPlayer.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("音频播放失败");
    isPlaying.value = false;
  }
};

// 优化文生图对话框
const loading = ref(false);
const showImageDialog = async () => {
  // 如果已经获取了imageUrl，直接显示
  if (imageUrl.value) {
    dialogFormVisible.value = true;
    return;
  }
  // 如果没有imageUrl，先获取
  else {
    loading.value = true;
    dialogFormVisible.value = true;
    const res = await userAIDraowGetApi(routerPathId.value);
    imageUrl.value = res.data;
    loading.value = false;
  }
};

onMounted(() => {
  titleid = route.query.id;
  getData();
});
</script>

<template>
  <div class="bgc">
    <div class="container">
      <div class="poem-header">
        <h1 class="poem-title">{{ poemtitle }}</h1>
        <p class="poem-author">{{ writer }}（{{ dynasty }}）</p>
      </div>
      <div class="poem-content" v-html="content"></div>
      <div class="others">
        <audio ref="audioPlayer" :src="audioUrl" style="display: none"></audio>
        <el-button
          type="info"
          class="but"
          @click="handlePlayClick"
          :icon="isPlaying ? 'VideoPause' : 'VideoPlay'"
        >
          {{ isPlaying ? "暂停" : "播放" }}
        </el-button>

        <el-button
          type="info"
          plain
          @click="showImageDialog"
          class="but"
          :loading="loading"
        >
          诗生意境
        </el-button>
      </div>
    </div>
    <div class="container">
      <div class="poem-notes">
        <h3>翻译</h3>
        <br />
        {{ translation }}
      </div>
    </div>

    <div class="content">
      <div class="poem-notes">
        <div :class="[isopen ? 'before' : 'after']">
          <h3>赏析</h3>
          <br />
          <div v-html="shangxi"></div>
        </div>
        <div class="toggle" @click="change">
          {{ isopen ? "点击此处展开" : "点击此处收起" }}
        </div>
      </div>
    </div>

    <div class="container">
      <div class="poem-notes">
        <h3>评论</h3>
        <br />
        {{ remarks }}
      </div>
    </div>

    <el-dialog
      v-model="dialogFormVisible"
      title="AI生成图片"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="pic" v-loading="loading">
        <img :src="imageUrl" alt="AI生成图片" width="300px" height="300px" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="showImageDialog" :loading="loading">
            重新生成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.bgc {
  width: 100%;
  height: 1800px;
  background-image: url("./pic/微信图片_20241016230002.jpg");
  background-size: 100% 1800px;

  .return {
    margin-left: 10px;
    cursor: pointer;
  }

  .pic {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    opacity: 70%;
    border-radius: 10px;
    box-sizing: border-box;

    .p {
      background: none;
      margin: 0;
      margin-bottom: 10px;
    }
  }

  .others {
    display: flex;
    margin-top: 30px;

    .but {
      margin-right: 30px;
      margin-left: 0;
    }
  }

  .poem-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .poem-title {
    font-size: 2em;
    text-align: center;
    margin: 0;
    color: #333;
  }

  .poem-author {
    font-size: 1.2em;
    color: #555;
    margin: 10px 0;
  }

  .poem-content {
    text-align: center;
    font-size: 1.2em;
    color: #333;
    display: grid;
    place-items: center;
  }

  .poem-notes {
    font-size: 1em;
    color: #666;
  }

  .poem-notes h3 {
    font-size: 1.1em;
    margin: 0;
    margin-bottom: 5px;
    color: #444;
  }

  .poem-notes p {
    margin: 0;
    margin-bottom: 10px;
  }
}

.content {
  width: 1000px;
  margin: 0 auto;
  background: none;
  box-sizing: border-box;

  .before {
    border-radius: 10px 10px 0 0;
    transition: height 0.3s ease;
    height: 100px;
    overflow: hidden;
    width: 1000px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    opacity: 70%;

    p {
      margin: 0;
      margin-bottom: 10px;
      font-size: 10px;
      opacity: 70%;
    }
  }

  .after {
    border-radius: 10px 10px 0 0;
    transition: height 0.3s ease;
    width: 1000px;
    height: auto;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 70%;

    p {
      margin: 0;
      margin-bottom: 10px;
      font-size: 10px;
      opacity: 70%;
    }
  }

  .toggle {
    width: 1000px;
    height: 40px;
    margin: 0 auto 30px;
    cursor: pointer;
    text-align: center;
    padding: 10px;
    background-color: #d1cfcf;
    background: linear-gradient(to top, #d1cfcf, #fff);
    box-sizing: border-box;
    opacity: 60%;
    border-radius: 0 0 10px 10px;
  }
}
</style>
