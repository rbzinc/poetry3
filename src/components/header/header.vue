<script setup>
import { User} from '@element-plus/icons-vue'
import { useUserInfoStore } from '../../stores/modules/user'
const useUser = useUserInfoStore()
</script>

<template>
    <div class="tleader">
        <div class="leader">
            <div class="left">
              <img src="./pic/微信图片_20241014231849.jpg" alt="" width="250px" height="80px">
            </div>
            <div class="right" v-if="useUser.userInfo">
                <router-link to="/">首页</router-link>
                <router-link to="/poet">书阁</router-link>
                <router-link to="/study">学习</router-link>
                <router-link to="/talksquare">论坛</router-link>
                <router-link to="/user">我的<el-icon class="user"><User /></el-icon></router-link>
            </div>
            <div class="right" v-else>
                <router-link to="/">首页</router-link>
                <router-link to="/poet">书阁</router-link>
                <router-link to="/study">学习</router-link>
                <router-link to="/talksquare">论坛</router-link>
                <router-link to="/login">登录<el-icon class="user"><User /></el-icon></router-link>
            </div>
        </div>
    </div>
 
</template>

<style scoped lang="scss">
.tleader
{
  width: 100%;
  height: 80px;
  background-color: #f6f6f6;
  color: black;
  box-shadow: 0 4px 8px rgba(218, 217, 217, 0.568);
  margin-top: 0;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 5px;
}

.user{
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #fff;
  margin-left: 5px;
}

.leader{
  display: flex;
  width: 1200px;
  height: 80px;
  justify-content: space-between;
  margin: 0 auto;
  .left{
    width: 250px;
    height: 80px;
    color: #aca9a9;
    text-align: center;
    line-height: 90px ;
    font-size: 35px;
  }
  .right{
    width: 860px;
    height: 80px;
    display: flex;
    a{
      text-align: center;
      line-height: 80px ;
      text-decoration: none;
      color: #8d8c8c;
      display: block;
      width: 200px;
      height: 80px;
      border-bottom: 2px solid transparent; 
      font-size: 18px;
      &:hover{
        text-decoration: none;
        border-bottom: 4px solid rgb(137, 137, 137);
        color: rgb(137, 137, 137)
      }
    }
  }
}
</style>