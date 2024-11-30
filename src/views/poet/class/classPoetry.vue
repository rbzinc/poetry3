<script setup>
import{ ref,onMounted,onActivated} from "vue"
import { defineExpose } from "vue"
import Poetryitem from "../../../components/poetryitem/poetryitem.vue"
import Search from "../../../components/search/search.vue"
import { userSearchStore } from "../../../stores/modules/poepavilion"
import { getpoemRandomData,getDynastyData,getClassData,getWriterPoemData } from "../../../api/modules/poePavilion"
import { useRouter } from "vue-router"
defineExpose({
  Poetryitem,
  Search
})
const charactersearch = userSearchStore()
const router = useRouter()
//控制展开和收缩的变量
const isopen =ref(false)
const isopen2 =ref(false)
const isopen3 =ref(false)
const indicate = ref(false)
const randomList =ref([])
const dynastyname = ref('')
const classname =ref('')
const poetname = ref('')
let pagenum = ref(1)
let pagetotal = ref()
const pagesize = ref(5)
//分页器重新获取一次朝代信息
const useDynastyName = ref('')
const useClassName = ref('')
const usePoetName = ref('')
let poemid = ref('')
let num =ref()

//随机得到十条古诗
const getRandom = async () =>{
  const res = await getpoemRandomData()
  randomList.value=res.data
}

//根据朝代来渲染数据
const getDynasty = async (dynastyname,pagenum) =>{
  useDynastyName.value = dynastyname
  charactersearch.searchname = dynastyname
  const res = await getDynastyData(dynastyname,pagenum)
  randomList.value=res.data.records
  pagetotal = res.data.total
  console.log(randomList.value)
}

//根据分类来渲染数据
const getClass = async (classname,pagenum) =>{
  charactersearch.searchname = classname
  useClassName.value = classname
  const res = await getClassData(classname,pagenum)
  randomList.value=res.data.records
  pagetotal = res.data.total
  console.log(randomList.value)
}

//根据诗人来渲染数据
const getPoet = async (poetname,pagenum) =>{
  charactersearch.searchname = poetname
  usePoetName.value = poetname
  const res = await getWriterPoemData(poetname,pagenum)
  randomList.value=res.data.records
  pagetotal = res.data.total                  
  console.log(randomList.value)               
}
//朝代页码发生改变
const currentChange = (pagenum) =>{
  switch(num){
    case 1: 
      getDynasty(useDynastyName.value,pagenum);
      break;
    case 2: 
      getClass(useClassName.value,pagenum);
    break;
    case 3: 
      getPoet(usePoetName.value,pagenum);
    break;
  }
}

//分页器判断调用哪个接口1
const changeNum1 = () => {
  num = 1;
  console.log(num)
}

//分页器判断调用哪个接口2
const changeNum2 = () => {
  num = 2;
  console.log(num)
}

//使分页器判断调用哪个接口3
const changeNum3 = () => {
  num = 3;
  console.log(num)
}
//点击跳转诗的详情页面
const poemDetail =(data) =>{
  poemid = data
  router.push(`/poedetails?id=${poemid}`)}

  onMounted(() => {
  getDynasty(charactersearch.searchname,pagenum);
  getRandom();
});
//分类栏的展开和收缩
  const toggleopened = () =>{
    isopen.value = !isopen.value
  }
  const toggleopened2 = () =>{
    isopen2.value = !isopen2.value
  }
  const toggleopened3 = () =>{
    isopen3.value = !isopen3.value
  }


</script>

<template>
  <Search></Search>
 <div class="book">
  <div class="box">
    <div class="son" @click="changeNum1">
      <div class="left">朝代 :</div>
      <div :class="[isopen ? 'change' : 'right']">
       <div class="buon" @click="getDynasty('唐代')">唐代</div>
      <div class="buon"@click="getDynasty('宋代')">宋代</div>
      <div class="buon"@click="getDynasty('明代')">明代</div>
      <div class="buon"@click="getDynasty('清代')">清代</div>
      <div class="buon"@click="getDynasty('元代')">元代</div>
      <div class="buon"@click="getDynasty('当代')">当代</div>
      <div class="buon"@click="getDynasty('两汉')">两汉</div>
      <div class="buon"@click="getDynasty('南北朝')">南北朝</div>
      <div class="buon"@click="getDynasty('金朝')">金朝</div>
      <div class="buon"@click="getDynasty('现代')">现代</div>
      <div class="buon"@click="getDynasty('先秦')">先秦</div>
      <div class="buon"@click="getDynasty('隋代')">隋代</div>
      <div class="buon"@click="getDynasty('五代')">五代</div>
      <div class="buon"@click="getDynasty('未知')">未知</div> 
      </div>
      <div :class="[isopen ? 'open' : 'chopen']" @click="toggleopened">
        <img src="https://ziyuan.guwendao.net/siteimg/jianBtn.png" alt="" width="13px" height="13px">
      </div>
    </div>
    <div class="son" @click="changeNum2">
      <div class="left">分类 :</div>
      <div :class="[isopen2 ? 'change' : 'right']">
        <div class="buon"@click="getClass('古诗三百首')">古诗三百首</div>
      <div class="buon"@click="getClass('小学古诗')">小学古诗</div>
      <div class="buon"@click="getClass('早教古诗100首')">早教古诗100首</div>
      <div class="buon"@click="getClass('初中古诗')">初中古诗</div>
      <div class="buon"@click="getClass('初中文言文')">初中文言文</div>
      <div class="buon"@click="getClass('乐府')">乐府</div>
      <div class="buon"@click="getClass('民歌')">民歌</div>
      <div class="buon"@click="getClass('咏物')">咏物</div>
      <div class="buon"@click="getClass('叙事')">叙事</div>
      <div class="buon"@click="getClass('抱负')">抱负</div>
      <div class="buon"@click="getClass('赞美')">赞美</div>
      <div class="buon"@click="getClass('写景')">写景</div>
      <div class="buon"@click="getClass('写人')">写人</div>
      <div class="buon"@click="getClass('品格')">品格</div>
      <div class="buon"@click="getClass('孤独')">孤独</div>
      <div class="buon"@click="getClass('爱情')">爱情</div> 
      </div>
      <div :class="[isopen2 ? 'open' : 'chopen']" @click="toggleopened2">
        <img src="https://ziyuan.guwendao.net/siteimg/jianBtn.png" alt="" width="13px" height="13px">
      </div>
    </div>
    <div class="son no-son" @click="changeNum3">
      <div class="left"> 诗人：</div>
      <div :class="[isopen3 ? 'change' : 'right']">
        <div class="buon" @click="getPoet('李白')">李白</div>
        <div class="buon" @click="getPoet('杜甫')">杜甫</div>
        <div class="buon" @click="getPoet('李清照')">李清照</div>
        <div class="buon" @click="getPoet('白居易')">白居易</div>
        <div class="buon" @click="getPoet('苏轼')">苏轼</div>
        <div class="buon" @click="getPoet('李商隐')">李商隐</div>
        <div class="buon" @click="getPoet('刘禹锡')">刘禹锡</div>
        <div class="buon" @click="getPoet('高适')">高适</div>
        <div class="buon" @click="getPoet('孟浩然')">孟浩然</div>
        <div class="buon" @click="getPoet('王安石')">王安石</div>
        <div class="buon" @click="getPoet('欧阳修')">欧阳修</div>
        <div class="buon" @click="getPoet('王勃')">王勃</div>
        <div class="buon" @click="getPoet('曹植')">曹植</div>
        <div class="buon" @click="getPoet('晏殊')">晏殊</div>
        <div class="buon" @click="getPoet('杨万里')">杨万里</div>
        <div class="buon" @click="getPoet('黄庭坚')">黄庭坚</div> 
        <div class="buon" @click="getPoet('杜牧')">杜牧</div> 
        <div class="buon" @click="getPoet('岑参')">岑参</div> 
        <div class="buon" @click="getPoet('李贺')">李贺</div>
        <div class="buon" @click="getPoet('元稹')">元稹</div> 
        <div class="buon" @click="getPoet('纳兰性德')">纳兰性德</div> 
      </div>
      <div :class="[isopen3 ? 'open' : 'chopen']" @click="toggleopened3">
        <img src="https://ziyuan.guwendao.net/siteimg/jianBtn.png" alt="" width="13px" height="13px">
      </div>
    </div>
  </div>
  <div v-for="item in randomList" :key="item?.id">
      <Poetryitem :poetitle="item.title"
      :writer="item.writer"
      :content="item.content"
                  :id="item.id"
      :dynasty="item.dynasty"
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
      border-bottom: 1px solid rgb(181, 181, 181);
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