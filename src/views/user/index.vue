<script setup>
import {ref} from 'vue';
import {ElCard, ElMessage} from 'element-plus';

import {useUserInfoStore} from "@/stores/modules/user.js";
import router from "@/router/index.js";

const userStore = useUserInfoStore();
const activeIndex = ref('1')
const achievement = ref([
  {
    url: '#',
    text: '获得过100次点赞'
  },
  {
    url: '#',
    text: '获得过50次分享'
  },
  {
    url: '#',
    text: '被收藏20次'
  }
  ,
  {
    url: '#',
    text: '获得过200次评论'
  },
  {
    url: '#',
    text: '浏览量达到1000次'
  },
  {
    url: '#',
    text: '被标记为有用10次'
  }
])
const interest = ref(['诗词创作', '诗词赏析', '诗词学习', '诗词活动', '诗词资源', '诗词杂谈'])
const myInterest = ref(['诗词创作', '诗词赏析', '诗词学习', '诗词活动', '诗词资源', '诗词杂谈'])
const dialogTableVisible = ref(false)
// 判断用户是否登录
if (!userStore.userInfo) {
  ElMessage.error('请先登录！')
  router.push({name: 'login'})
}
const goToUserInfo = () => {
  router.push('/editUserInfo')
}


</script>
<template>
  <div class="container">
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card">
      <div style="display: flex">
        <div class="user-avatar">
          <img src='https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/tx.png' alt="用户头像"/>
        </div>
        <div>
          <div class="user-info">
            <p>用户名：{{ userStore.userInfo.username }}</p>
            <div class="manageBtn">
              <el-button @click="goToUserInfo">
                <el-icon>
                  <Edit/>
                </el-icon>
                编辑资料
              </el-button>
              <el-button>
                <el-icon>
                  <MessageBox/>
                </el-icon>
                管理文章
              </el-button>
              <el-button>
                <el-icon>
                  <Setting/>
                </el-icon>
                设置
              </el-button>
            </div>
          </div>
          <div class="user-info-number">
            <p>39299 总访问量</p>
            <p>45 原创</p>
            <p>503 粉丝</p>
            <p>0 铁粉</p>
          </div>
          <p style="margin-left: 24px; margin-top: 10px">IP属地：江西省</p>
        </div>
      </div>
    </el-card>

    <div class="article-container">
      <div class="article-left">
        <el-card class="interest-card">
          <div class="interest-title">
            <p>兴趣领域</p>
            <p style="cursor: pointer" @click="dialogTableVisible = true">管理></p>
          </div>
          <el-divider style="margin: 16px 0;"/>
          <div v-for="(item, index) in myInterest" :key="index">
            <p style="line-height: 25px;margin-bottom: 4px;">{{ item }}</p>
          </div>
        </el-card>
        <el-card class="achievement-card">
          <p>个人成就</p>
          <el-divider style="margin: 16px 0;"/>
          <div class="achievement-card-list" v-for="(item, index) in achievement" :key="index">
            <img :src=item.url alt="" width="25px" height="25px"/>
            <p style="line-height: 25px; margin-left: 10px;">{{ item.text }}</p>
          </div>
        </el-card>
      </div>
      <div class="article-right">
        <el-card class="article-card">
          <template #header>
            <el-menu
                :default-active="activeIndex"
                mode="horizontal"
            >
              <el-menu-item index="1">我的文章</el-menu-item>
              <el-menu-item index="2">关注列表</el-menu-item>
              <el-menu-item index="3">粉丝列表</el-menu-item>
              <el-menu-item index="4">收藏列表</el-menu-item>
            </el-menu>
          </template>
          <div class="article" v-for="(item, index) in 6" :key="index">
            <div class="article-list">
              <div class="list-left">
                <h3 class="list-title">这是标题</h3>
                <p class="list-content" style="margin: 5px 0; text-indent: 2em;">这是内容</p>
                <div class="list-footer" style="margin-top: 25px;">
                  <p style="margin-right: 12px;">张三</p>
                  <p style="margin-right: 12px;">赞 120</p>
                  <p style="margin-right: 12px;">评 120</p>
                  <p>春风十里不如你, 吹尽狂沙始到金</p>
                </div>
              </div>
              <div class="list-right" style="background-color: skyblue; height: 100px; width: 150px;">
                <img alt="" src="#">
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="dialogTableVisible" title="选择喜欢的兴趣领域" width="600">
      <ul style="display: flex;flex-wrap: wrap;">
        <li v-for="(item, index) in interest" :key="index"
            style="margin-bottom: 18px;margin-right: 20px; cursor: pointer;font-size: 16px; border: 1px solid #ccc;padding: 6px">
          {{ item }}<i style="margin-left: 10px;" @click="myInterest.push(item)">x</i></li>
      </ul>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;

  .user-info-card {

    height: 140px;

    .user-avatar {
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }

    .user-info {
      display: flex;
      width: 1050px;
      height: 35px;
      line-height: 35px;
      justify-content: space-between;

      p {
        margin-left: 24px;
        font-weight: 500;
        font-size: 20px;
      }

      button, [type=button], [type=reset], [type=submit] {
        -webkit-appearance: button;
        border-radius: 50px;
      }
    }

    .user-info-number {
      display: flex;
      font-size: 18px;
      width: 600px;
      height: 30px;
      line-height: 30px;

      p {
        margin-left: 24px;
      }
    }
  }

  .article-container {
    display: flex;

    .article-left {
      width: 300px;

      .interest-card {
        margin: 20px 20px 20px 0;

        .interest-title {
          display: flex;
          justify-content: space-between;
        }


      }

      .achievement-card {
        margin: 20px 20px 20px 0;

        .achievement-card-list {
          display: flex;
          margin-bottom: 10px;
        }
      }
    }

    .article-right {
      width: 900px;

      .article-card {
        margin-top: 20px;
        height: 1200px;
        overflow-y: auto;

        .article {
          display: flex;
          align-items: center;
          height: 120px;
          margin-bottom: 10px;

          .article-list {
            width: 100%;
            padding: 0 15px;
            display: flex;
            justify-content: space-between;

            .list-left {
              .list-footer {
                display: flex;
              }
            }
          }

        }
      }
    }
  }
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 35px;
}


</style>
