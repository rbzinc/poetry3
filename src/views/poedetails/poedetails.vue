<script setup>
import { VideoPlay} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import {useRoute,useRouter} from 'vue-router'
import { getPoemDetatils } from "../../api/modules/poePavilion"
import router from '../../router';
const route = useRoute()
const dataList = ref([])
let dialogFormVisible = ref(false)
let titleid = ref()
const poemtitle = ref('')
const writer = ref('')
const content = ref('')
const translation =ref('')
const remarks = ref('')
const shangxi = ref('')
const dynasty = ref('')
//获取诗的详细信息
const getData = async()=>{
  const res = await getPoemDetatils(titleid)
  dataList.value=res.data
  console.log(dataList.value)
  poemtitle.value =  dataList.value[0].title
  writer.value =  dataList.value[0].writer
  remarks.value = dataList.value[0].remarks
  translation.value = dataList.value[0].translation
  shangxi.value = dataList.value[0].shangxi
  dynasty.value = dataList.value[0].dynasty
  content.value = dataList.value[0].content
}
//返回主页面
const returnView = () =>{
  router.push('/poet/class')
}

onMounted(() => {
  titleid = route.query.id;
  getData()
})
</script>

<template>
<div class="bgc">
  <div class="return" @click="returnView">返回</div>
  <div class="container">
  <div class="poem-header">
    <h1 class="poem-title">{{ poemtitle }}</h1>
    <p class="poem-author">{{ writer }}（{{ dynasty }}）</p>
  </div>
  <div class="poem-content" >
    {{ content }}
  </div>
    <div class="others">
        <el-button type="info" class="but">播放</el-button>
        <el-button type="info" plain @click="dialogFormVisible = true" class="but"
        >文生图</el-button>
    </div>
  </div>
  <div class="container">
    <div class="poem-notes">
      <h3>翻译</h3><br>   
      {{ translation }}
    </div>
  </div>
  <div class="container">
    <div class="poem-notes">
      <h3>赏析</h3><br>   
      {{ shangxi }}
    </div>
  </div>
  <div class="container">
    <div class="poem-notes">
      <h3>评论</h3><br>   
      {{ remarks }}
    </div>
  </div>
  
<el-dialog v-model="dialogFormVisible" title="以下是AI生成的图片" width="800px">
  <div class="pic">
    <img src="./pic/下载.bmp" alt="" width="300px" height="300px">
  </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<style scoped lang="scss">
.bgc{
  width: 100%;
  height: 1800px;
  background-image: url('./pic/微信图片_20241016230002.jpg');
  background-size: 100% 1800px;
  .return{
    margin-left: 10px;
    cursor: pointer;
  }
  .pic{
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    opacity: 70%;
    border-radius: 10px;
    .p {
      background: none;
    margin: 0;
    margin-bottom: 10px;
  }
  }
  .others{
     display: flex;
     margin-top: 30px;
      .but{
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
    display: flex;
    
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
  // body {
  //   font-family: 'Arial', sans-serif;
  //   margin: 0;
  //   padding: 0;
  //   background-color: #f4f4f4;
  //   margin: 0 auto;
  // }
  
</style>