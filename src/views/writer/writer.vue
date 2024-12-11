<script setup>
import Writercontent from '../../components/wriercontent/writercontent.vue'
import {useRoute, useRouter} from 'vue-router'
import {userWriterService} from "../../api/modules/writer"

const route = useRoute()
const router = useRouter()
let writerid = ref(0)
const dataList = ref('')
const writerList = ref('')
const writertitle = ref('')
const writercontent = ref('')
//获取诗人详细信息
const getData = async () => {
  const res = await userWriterService(writerid)
  dataList.value = res.data
  writertitle.value = dataList.value.name
  writercontent.value = dataList.value.simpleIntro
  writerList.value = res.data.detailIntro
}

const returnView = () => {
  router.push('/poet/class')
}

onMounted(() => {
  writerid = route.query.id;
  getData()
})

</script>

<template>
  <div class="bgc">
    <div class="return" @click="returnView">返回</div>
    <div class="container">
      <div class="poem-header">
        <h1 class="poem-title"> {{ writertitle }} </h1>
      </div>
      <div class="poem-content">
        <p>{{ writercontent }}</p>
      </div>

    </div>
    <div v-for="item in writerList" :key="item?.id">
      <Writercontent
          :content=item.content
          :title=item.title
      >
      </Writercontent>
    </div>


  </div>

</template>

<style>
.bgc {
  width: 100%;
  height: 2000px;
  background-image: url('./pic/微信图片_20241016230009.jpg');
  background-size: 100% 100%;

  .return {
    margin-left: 10px;
    cursor: pointer;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto 30px;
    padding: 20px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 70%;
    border-radius: 10px;
  }

  .poem-header {
    margin-bottom: 20px;
    display: flex;

    .poem-title {
      font-size: 25px;
      margin: 0;
      color: #333;
      text-align: left;
      line-height: 60px;
    }
  }

  .poem-header::after {
    content: "";
    display: table;
    clear: both;
  }

  .poem-content {
    font-size: 15px;
    margin: 20px 0;
    padding-left: 15px;
    color: #333;
    white-space: pre-wrap;
  }

  .poem-content p {
    margin: 0;
    margin-bottom: 10px;
  }

  .poem-notes {
    font-size: 1em;
    color: #666;
    margin-top: 20px;
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
</style>