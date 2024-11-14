<script setup>
import { userSearchStore } from '@/stores/index.js'
import { defineExpose } from "vue"
import Poetryitem from "../../components/poetryitem/poetryitem.vue"
const userSearch = userSearchStore()
const usePoetName = ref('')
let poetsearch = userSearch.userinput

defineExpose({
  Poetryitem,
})


const currentChange = (pagenum) =>{
  getPoet(usePoetName.value,pagenum);
}
</script>

<template>
 <div class="home">
   <div class="content">
    <div v-for="item in randomList" :key="item?.id">
      <Poetryitem :poetitle="item.title"
      :writer="item.writer"
      :content="item.content"
      :dynasty="item.dynasty"
     ></Poetryitem>
   </div>
   <el-pagination
    :page-size="pagesize"
    :pager-count="11"
    layout="prev, pager, next"
    :total="pagetotal"
	  @current-change="currentChange"
  />
  </div>
</div>
</template>

<style scoped lang="scss">
.home{
  width: 1200px;
  height: 1000px;
  .content{
    width: 1200px;
    height: 800px;
    background-color: #aeb6e8;
  }
}
</style>
