<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userGameStore } from '@/stores/modules/game.js'
import { goDictionary, goDictionaryPoemGame } from '@/router/helpers.js'
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
  },
])
const status = ref()
let checked = ref(false)
const returnclick = () => {
  goDictionary()
}

const entergame = () => {
  const checked1 = ref(false)
  goDictionaryPoemGame()
}

const recitestatus = () => {
  if (status.value === 2) {
    checked.value = true
  } else {
    checked.value = false
  }
}

onMounted(() => {
  status.value = gameStore.poetstatus
  console.log(status.value)
  recitestatus()
})
</script>

<template>
  <el-card style="max-width: 100%; max-height: 560px" class="el-card">
    <template #header>
      <div class="return" @click="returnclick">
        <el-icon><ArrowLeftBold /></el-icon>
        返回
      </div>
    </template>

    <div class="poet">
      桃花源记
      <div class="game" @click="entergame">
        <el-checkbox v-model="checked" class="game" size="30" />
      </div>
    </div>
    <div v-for="item in title" :key="item.id" :index="item.id" class="poet">
      {{ item.name }}
      <div class="game" @click="entergame">
        <el-checkbox v-model="checked1" class="game" size="large" />
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.el-card {
  background-image: url('@/assets/pic/study/7754bcfc0e4b6ca416b0c0435aac38f.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.return {
  display: flex;
  cursor: pointer;
  font-size: 20px;
  font-family: 'Georgia', serif;
}
.poet {
  display: flex;
  margin-top: 10px;
  height: 30px;
  width: 100%;
  border-bottom: #4a4949 1px dashed;
  font-size: 20px;
  font-family: 'Georgia', serif;
  .game {
    width: 20px;
    height: 20px;
    margin-left: auto;
  }
}
</style>
