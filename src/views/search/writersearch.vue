<script setup>
import { userSearchStore } from '@/stores/modules/search'
import { getWriterSearch } from '@/api/modules/search.js'
import {defineExpose, onMounted} from "vue"
import { useRouter } from "vue-router";
import Writeritem from "@/components/writeritem/writeitem.vue"
const router = useRouter()
const userSearch = userSearchStore()
const useWriterName = ref('')
let writersearch = ref('')
const randomList =ref([])
let pagenum = ref(1)
let pagetotal = ref(0)
const pagesize = ref(5)
let writerid =ref()
defineExpose({
  Writeritem
})

const getWriter = async (writersearch) =>{
  const res = await getWriterSearch(writersearch)
  randomList.value=res.data
  console.log(res.data)
}

const writerDetail =(data) =>{
  writerid = data
  router.push(`/writer?id=${writerid}`)
}

onMounted(() => {
  getWriter(userSearch.userinput )
})

</script>

<template>
 <div class="home">
   <div class="content">
    <div v-for="item in randomList" :key="item.id">
      <Writeritem
      :name="item.name"
      :content="item.simpleIntro"
      :dynasty="item.dynasty"
      @click="writerDetail(item.id)"
     ></Writeritem>
   </div>
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