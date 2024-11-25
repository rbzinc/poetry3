<script setup>
import { userSearchStore } from '../../stores/modules/search'
import { getPoetSearch } from '../../api/modules/search.js'
import { defineExpose } from "vue"
import Writeritem from "../../components/writeritem/writeitem.vue"
const userSearch = userSearchStore()
const useWriterName = ref('')
let writersearch = userSearch.userinput
const randomList =ref([])
let pagenum = ref(1)
let pagetotal = ref(0)
const pagesize = ref(5)
defineExpose({
  Writeritem
})
const getWriter = async (writersearch,pagenum) =>{
  usePoetName.value = poetsearch
  const res = await getPoetSearch(writersearch,pagenum)
  randomList.value=res.data.records
  pagetotal = res.data.total
}

const currentChange = (pagenum) =>{
  getPoet(usePoetName.value,pagenum)
}

</script>

<template>
 <div class="home">
   <div class="content">
    <div v-for="item in randomList" :key="item?.id">
      <Writeritem :poetitle="item.title"
      :writer="item.writer"
      :content="item.content"
      :dynasty="item.dynasty"
     ></Writeritem>
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
    background: none;
  }
}
</style>