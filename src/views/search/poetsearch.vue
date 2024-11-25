<script setup>
import { userSearchStore } from '../../stores/modules/search'
import { getPoetSearch } from '../../api/modules/search.js'
import { defineExpose, onMounted,watch } from "vue"
import { useRouter} from "vue-router"
import Poetryitem from "../../components/poetryitem/poetryitem.vue"
const userSearch = userSearchStore()
const usePoetName = ref('')
const router = useRouter()
let poetsearch = ref()
const randomList =ref([])
const getList  =ref([])
let pagenum = ref(1)
let pagetotal = ref(0)
const pagesize = ref(4)
let poemid = ref()
defineExpose({
  Poetryitem,
})

watch(userSearch, async (newVal) => {
  if (newVal) {
    const res = await getPoetSearch(newVal, 1);
    randomList.value = res.data.records;
    pagetotal.value = res.data.total;
  }
})
const getPoet = async (poetsearch,pagenum) =>{
  usePoetName.value = poetsearch
  const res = await getPoetSearch(poetsearch,pagenum)
  console.log(res.data.records)
  randomList.value=res.data.records
  pagetotal.value = res.data.total
}
//点击跳转诗的详情页面
const poemDetail =(data) =>{
  poemid = data
  router.push(`/poedetails?id=${poemid}`)}

const currentChange = (pagenum) =>{
  getPoet(usePoetName.value,pagenum)
}

onMounted(() => {
  pagenum = 1
  getPoet(userSearch.userinput,pagenum)
  console.log(randomList.value)
  
})
</script>

<template>
 <div class="home">
   <div class="content">
    <div v-for="item in randomList" :key="item?.id">
      <Poetryitem :poetitle="item?.title"
      :writer="item?.writer"
      :content="item?.content"
      :dynasty="item?.dynasty"
      @click="poemDetail(item.id)"
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
    background: none;
  }
}
</style>