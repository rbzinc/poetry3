<script setup>
import { userSearchStore } from '../../stores/modules/search'
import { getSenSearch } from '../../api/modules/search.js'
import { defineExpose,ref,onMounted } from "vue"
import Poetryitem from "../../components/poetryitem/poetryitem.vue"
const userSearch = userSearchStore()
const usePoetName = ref('')
let poetsearch = userSearch.userinput
let pagenum = ref(1)
let pagetotal = ref(0)
const pagesize = ref(4)
const randomList = ref([])
defineExpose({
  Poetryitem,
})
const getSentence = async (poetsearch,pagenum) =>{
  usePoetName.value = poetsearch
  const res = await getSenSearch(poetsearch,pagenum)
  randomList.value=res.data.records
  console.log(randomList.value)
  pagetotal = res.data.total
  console.log(pagetotal)
}

const currentChange = (pagenum) =>{
  getSentence(usePoetName.value,pagenum)
}

onMounted(() => {
  pagenum = 1;
  getSentence(userSearch.userinput,pagenum)
})
</script>

<template>
 <div class="home">
   <div class="sentence">
    <div class="dy" v-for="item in randomList" :key="item.id">
      {{ item.name }}——{{ item.fromm }}</div>
   </div>
   <div class="el-pagination">
     <el-pagination
         :page-size="pagesize"
         :pager-count="10"
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
  margin: 0 auto;
  .el-pagination {
    margin:  10px auto 0;
    height: 40px;
  }
  .sentence{
    width: 1200px;
    background: none;
    margin: 0 auto;

    .dy {
      margin: 10px auto 0;
      border: 1px solid #000;
      padding: 20px;
      width: 1000px;
      box-sizing: border-box;
      background-color: #e5e6e4;
      border-radius: 10px;
      opacity: 50%;
      .content {
        line-height: 20px;
        font-size: 5px;
        color: #333;
      }
    }
  }
}
</style>