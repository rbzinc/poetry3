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
  <div class="dictbox">
    <div v-for="item in dictionaty" :key="item.id" :index="item.id" >
      <Textcard
          :title="item.name"
          :content="item.content"
          @click = textlist
      ></Textcard>
    </div>
    <div class="add">
      <el-icon size ='60' class="icon"><Plus /></el-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dictbox{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  .add{
    margin: 10px;
    width: 190px;
    height: 200px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px #797878 solid;

    .icon{
      width: 190px;
      height: 190px;
      color: #999797;
    }
  }
}
</style>