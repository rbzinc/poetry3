<script setup>
import  Textcard from  '@/components/game/textcard/index.vue'
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter()
const dictionaty = ref([
  {
    id: '0',
    name: '初中古诗词',
    content: '有65首诗，23首词'
  },
  {
    id: '1',
    name: '高中古诗词',
    content: '有156首诗，32首词'
  },
  {
    id: '2',
    name: '唐诗三百首',
    content: '有300首诗'
  }])
const textlist = () => {
  router.push('/textlist')
}
</script>

<template>
  <el-card style="max-width: 100%;max-height: 560px;" class="el-card">
  <div class="dictbox">
    <div v-for="item in dictionaty" :key="item.id" :index="item.id" >
      <Textcard
          :title="item.name"
          :content="item.content"
          @click = "textlist"
      ></Textcard>
    </div>
    <div class="add">
      <el-icon size ='60' class="icon"><Plus /></el-icon>
    </div>
  </div>
    </el-card>
</template>

<style scoped lang="scss">
.el-card {
  height: 560px;
  display: flex;
  overflow-y: auto;
  background-image: url('./pic/2e9520938fcd4da8d130e9bdd3b18bf.jpg');
  background-size: cover; /* 覆盖整个元素 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat; /* 不重复 */
  .dictbox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    .add {
      margin: 10px;
      width: 170px;
      height: 220px;
      background:none;
      border-radius: 5px;
      border: 1px #797878 solid;

      .icon {
        width: 170px;
        height: 220px;
        color: #999797;
      }
    }
  }
}
</style>