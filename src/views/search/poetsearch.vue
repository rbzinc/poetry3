<script setup>
import { userSearchStore } from '../../stores/modules/search'
import { getPoetSearch } from '../../api/modules/search.js'
import { defineExpose, ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import Poetryitem from "../../components/poetryitem/poetryitem.vue"

const userSearch = userSearchStore()
const usePoetName = ref('')
const router = useRouter()
let poetsearch = ref('')
const randomList = ref([])
const getList = ref([])
let pagenum = ref(1)
let pagetotal = ref(0)
const pagesize = ref(4)
let poemid = ref()

defineExpose({
  Poetryitem,
})

const getPoet = async (poetsearch, pagenum) => {
  usePoetName.value = poetsearch
  const res = await getPoetSearch(poetsearch, pagenum)
  console.log(res.data.records)
  randomList.value = res.data.records
  pagetotal.value = res.data.total
}

// 监听用户搜索输入的变化
watch(() => userSearch.userinput, (newVal) => {
  if (newVal) {
    pagenum.value = 1; // 重置页码为1
    getPoet(newVal, pagenum.value);
  }
}, { immediate: true }) // { immediate: true } 确保初始值也被处理

//点击跳转诗的详情页面
const poemDetail = (data) => {
  poemid.value = data
  router.push(`/poedetails?id=${poemid.value}`)
}

const currentChange = (newPageNum) => {
  getPoet(usePoetName.value, newPageNum)
}

onMounted(() => {
  getPoet(userSearch.userinput, pagenum)
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
      <div class="el-pagination">
        <el-pagination
            :page-size="pagesize"
            :pager-count="11"
            layout="prev, pager, next"
            :total="pagetotal"
            @current-change="currentChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 1200px;
  height: 1000px;
  margin: 0 auto;

  .content {
    width: 1200px;
    height: 800px;
    background: none;
    margin: 0 auto;

    .el-pagination {
      margin: 10px auto 0;
      height: 40px;

    }
  }
}
</style>