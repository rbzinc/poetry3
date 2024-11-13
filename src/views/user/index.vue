<script setup>
import { Edit } from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue';
import { useRouter } from "vue-router"
const router = useRouter()
import { useUserInfoStore } from '../../stores/modules/user.js'
const useUser = useUserInfoStore()
const name = ref('')
const editSeverce = () =>{
  router.push('/user/upset')
}

const touchname = () =>{
  name.value = useUser.userInfo.username
}
const cleantoken = () =>{
  useUser.clearUserInfo()
}
onMounted(() => {
  touchname()
})
</script>

<template>
  <div class="box">
    <div class="head">
      <div class="headpic"></div>
      <div class="name">{{ name }}
        <div class="right">
          <el-button type="info" :icon="Edit" color="#fff" @click="editSeverce">编辑资料</el-button>
          <el-button type="info" :icon="Edit" color="#fff" @click="cleantoken">退出登录</el-button>
        </div>
      </div>
    </div>
    <div class="tabs" >
      <el-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs">
        <el-tab-pane label="我的收藏">
          <div class="tabs">
            <div class="select">收藏的古诗</div>
            <div class="select">收藏的诗人</div>
            <div class="select">收藏的名句</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的发布"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box{
  width: 1260px;
  height: 1000px;
  background-color: #facfcf;
  margin: 120px auto 0;
  .head{
    width: 1200px;
    height: 100px;
    background-color: #8fa58f;
    margin: 0 auto;
    display: flex;
    .headpic{
      width: 90px;
      height: 90px;
      background-color: #cdf7f5;
      border-radius: 100%;
      border-width: 5px;
      border-color: #fff;
      border-style: solid;
      position: relative;
      top:-15px;
    }
    .name{
      width: 1100px;
      height: 80px;
      background-color: #eaefbc;
      align-items: center;
      box-sizing: border-box;
      padding: 0px 30px 0px 30px; /* 上、右、下、左内边距分别为30px、20px、10px、40px */
      line-height: 80px;
      font-size: 22px;
      .right{
        width: 200px;
        height: 80px;
        background-color: #fdc6ec;
        float: right;
        ::v-deep .el-button {
          color: rgb(146, 144, 144);
          height: 35px;
          width: 90px;
        }
      }

    }
  }
  .tabs{
    width: 1180px;
    height: 60px;
    background-color: #efc792;
    margin-left: 30px;
    padding-left: 20px;
    font-size: 30px;
    display: flex;
    .select{
      width: 100px;
      height: 40px;
      background-color: #d7a6a6;
      font-size: 15px;
      line-height: 40px;
      cursor: pointer;
    }
  }
  ::v-deep .el-tabs__item {
      font-size: 16px !important;
      color: #333 !important;
      
  }
  ::v-deep .el-tabs__item.is-active {
      color: #b3b5b7 !important;
      background:none;
      border-color: #7e868e !important;
  }
  ::v-deep .el-tabs__pane {
    padding-left: 0 !important;
  }
}

</style>