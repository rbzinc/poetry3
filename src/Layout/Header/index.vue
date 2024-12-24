<script setup>
import {ArrowDown, User} from '@element-plus/icons-vue'
import {useUserInfoStore} from '@/stores/index.js'
import router from "@/router/index.js";

const useUser = useUserInfoStore()

const loyout = () => {
  useUser.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="tleader">
    <div class="leader">
      <div class="left">
        <img src="@/assets/pic/home/logo.jpg" alt="" width="250px" height="80px">
      </div>
      <div class="right">
        <router-link to="/home">首页</router-link>
        <router-link to="/poet">书阁</router-link>
        <el-dropdown placement="bottom">
          <p>
            <router-link to="/poetryAi">
              学习
              <el-icon style="margin-top: 10px;">
                <arrow-down/>
              </el-icon>
            </router-link>
          </p>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/poetryAi">AI助学</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/dictionary">游戏助学</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/vrExhibition">vr助学</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <router-link to="/talksquare">论坛</router-link>

        <span v-if="useUser.userInfo">
          <el-dropdown placement="bottom">
          <p>
            <router-link to="/user">
              我的
              <el-icon class="user"><User/></el-icon>

            </router-link>
          </p>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <p @click="loyout">退出登录</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        </span>
        <span v-else>
          <router-link to="/login">登录<el-icon class="user"><User/></el-icon></router-link>
        </span>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.tleader {
  width: 100%;
  height: 80px;
  background-color: #f6f6f6;
  color: black;
  box-shadow: 0 4px 8px rgba(218, 217, 217, 0.568);
  margin: 0 auto 5px;
}

.user {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #fff;
  margin-left: 5px;
}

.leader {
  display: flex;
  width: 1200px;
  height: 80px;
  justify-content: space-between;
  margin: 0 auto;

  .left {
    width: 250px;
    height: 80px;
    color: #aca9a9;
    text-align: center;
    line-height: 90px;
    font-size: 35px;
  }

  .right {
    width: 860px;
    height: 80px;
    display: flex;

    a {
      text-align: center;
      line-height: 80px;
      text-decoration: none;
      color: #8d8c8c;
      display: block;
      width: 200px;
      height: 80px;
      border-bottom: 2px solid transparent;
      font-size: 18px;

      &:hover {
        text-decoration: none;
        border-bottom: 4px solid rgb(137, 137, 137);
        color: rgb(137, 137, 137)
      }
    }
  }
}

// 针对学习下拉菜单样式
a {
  text-align: center;
  color: #8d8c8c;
  width: 120px;
  font-size: 14px;
}
</style>
