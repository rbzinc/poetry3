<script setup>
import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import { userGameStore } from "@/stores/modules/game.js";
const gameStore = userGameStore()
const router = useRouter()
const title = ref([
  {
    id: '1',
    name: '木兰辞',
  },
  {
    id: '2',
    name: '醉翁题记',
  },
  {
    id: '3',
    name: '岳阳楼记',
  },
  {
    id: '4',
    name: '观沧海',
  },
  {
    id: '5',
    name: '游山西村',
  },
  {
    id: '6',
    name: '过故人庄',
  },
  {
    id: '7',
    name: '使至赛上',
  },
  {
    id: '8',
    name: '夜雨寄北',
  },
  {
    id: '9',
    name: '次北固山下',
  },
  {
    id: '10',
    name: '渔家傲.秋思',
  }])
const status = ref()
const returnclick = () =>{
  router.push('/dictronary')
}
const entergame = () =>{
  const checked1 = ref(false)
  router.push('/poetgame')
}
const recitestatus = ()  =>{
  if(status.value === 2){
    const checked = ref( true )
  }
}
onMounted(()=> {
  status.value = gameStore.poetstatus;
  console.log(status.value)
  recitestatus(status.value)
})
</script>

<template>
  <div class="title">
    <div class="return" @click="returnclick">
      <el-icon><ArrowLeftBold /></el-icon>
      返回
    </div>
    <div class="poet">
      桃花源记
      <div class="game" @click="entergame">
        <el-checkbox v-model="checked" class="game" size="30" />
      </div>
    </div>
    <div v-for="item in title" :key="item.id" :index="item.id" class="poet">
      {{item.name}}
      <div class="game" @click="entergame">
        <el-checkbox v-model="checked1" class="game" size="30" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title{
  font-size: 20px;
  font-family: 'Georgia', serif;
  .return{
    height: 40px;
    width: 100%;
    border-bottom: 2px black solid;
    display: flex;
    margin: 0 auto 10px;
    cursor: pointer
  }
  .poet{
    display: flex;
    margin-bottom: 10px;
    .game{
      margin-left: 60px;
      width: 20px;
      height: 20px;
    }
  }
}
</style>