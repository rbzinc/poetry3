<script setup>
import{ ref,onMounted} from "vue"
import { defineExpose } from "vue"
// import { usePoetStore } from "../../../stores/modules/poepavilion/"
import Writeritem from "../../../components/writeritem/writeitem.vue"
import Search from "../../../components/search/search.vue"
import {getPoetRandomData,getWriterData} from "../../../api/modules/poePavilion"
import { useRouter } from "vue-router";
defineExpose({
  Writeritem,
  Search
})
const router =useRouter()
const isopen =ref(false)
const indicate = ref(false)
const randomList =ref([])
const dynastyname = ref('')
const useDynastyName =ref('')
let pagenum = ref(1)
let pagesize = ref(5)
let pagetotal = ref()
let writerid = ref()

//随机得到十条诗人信息
const getRandom = async () =>{
  const res = await getPoetRandomData()
  randomList.value=res.data
}

//点击朝代来得到诗人信息
const getData = async (dynastyname,pagenum) =>{
  useDynastyName.value = dynastyname
  console.log(useDynastyName.value)
  const res = await getWriterData(dynastyname,pagenum)
  randomList.value=res.data.records
  pagetotal = res.data.total
  console.log(randomList.value)
}
//分类栏的展开和收缩
  const toggleopened = () =>{
    isopen.value = !isopen.value
  }

//页码发生改变
const currentChange = (pagenum) =>{
  getData(useDynastyName.value,pagenum)
}
//点击跳转诗人详情页面
const writerDetail =(data) =>{
  writerid = data
  router.push(`/writer?id=${writerid}`)
}


onMounted(() => {
getRandom()
})
</script>

<template>
  <Search></Search>
 <div class="book">
  <div class="box">
    <div class="son">
      <div class="left">朝代 :</div>
      <div :class="[isopen ? 'change' : 'right']">
       <div class="buon" @click="getData('唐代')">唐代</div>
      <div class="buon"@click="getData('宋代')">宋代</div>
      <div class="buon"@click="getData('明代')">明代</div>
      <div class="buon"@click="getData('清代')">清代</div>
      <div class="buon"@click="getData('元代')">元代</div>
      <div class="buon"@click="getData('当代')">当代</div>
      <div class="buon"@click="getData('两汉')">两汉</div>
      <div class="buon"@click="getData('南北朝')">南北朝</div>
      <div class="buon"@click="getData('金朝')">金朝</div>
      <div class="buon"@click="getData('现代')">现代</div>
      <div class="buon"@click="getData('先秦')">先秦</div>
      <div class="buon"@click="getData('隋代')">隋代</div>
      <div class="buon"@click="getData('五代')">五代</div>
      <div class="buon"@click="getData('未知')">未知</div> 
      </div>
      <div :class="[isopen ? 'open' : 'chopen']" @click="toggleopened">
        <img src="https://ziyuan.guwendao.net/siteimg/jianBtn.png" alt="" width="13px" height="13px">
      </div>
    </div>
  </div>
  <div v-for="item in randomList" :key="item?.id">
      <Writeritem 
      :name="item.name"
      :content="item.simpleIntro"
      :dynasty="item.dynasty"
      @click="writerDetail(item.id)"></Writeritem>
      </div>
  <el-pagination
    :page-size="pagesize"
    :pager-count="11"
    layout="prev, pager, next"
    :total="pagetotal"
	  @current-change="currentChange"
  />
</div>
</template>

<style lang="scss" scoped>
.book {
    width: 1100px;
    background:none;
    box-sizing: border-box;
    padding: 30px 40px;
    .box{
      width: 1000px;
      box-sizing: border-box;
      background-color: #f3f2f2;
      opacity: 70%;
      margin: 0 auto;
      padding: 15px;
      border-radius: 5px;
     .son{
      width: 970px;
      background: none;
      display: flex;
      .left{
        width: 60px;
        height: 50px;
        background: none;
        text-align: center;
        line-height: 50px;
        font-size: 17px;
        display: flex; /* 使用 Flexbox 布局 */
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
      }
      .right{
        width: 850px;
        background: none;
        height: 50px; 
        transition: height 0.3s; 
        display: flex;
        overflow: hidden; 
        cursor: pointer;
        .buon{
          height: 50px;
          padding: 0 10px;
          background:none;
          box-sizing: border-box;
          white-space: nowrap;
          text-align: center;
          line-height: 50px;
        }
      }
      .change{
        width: 850px;
        background: none;
        height: auto; 
        transition: height 0.3s;
        display: flex;
        flex-wrap: wrap;
        cursor: pointer
       
      }
        .buon{
          height: 50px;
          padding: 0 10px;
          background:none;
          box-sizing: border-box;
          white-space: nowrap;
          text-align: center;
          line-height: 50px;
        }
      }
      .no-son{
      width: 970px;
      background: none;
      display: flex;
      border-bottom: none;
    }
      }
      .open{
        width: 60px;
        height: 50px;
        background: none;
        display: grid;
        place-items: center;
      }
      .chopen{
        width: 60px;
        height: 50px;
        background: none;
        display: grid;
        place-items: center;
        transition: transform 0.5s ease;
        transform: scaleY(-1);
      }
      .el-pagination {
        margin-top: 15px;
        :deep(.el-pager li) {
        background-color: #f6f6f6;
        }
      }
     }


</style>