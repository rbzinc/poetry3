<script setup>
import {ref} from 'vue';
import {ElCard, ElMessage} from 'element-plus';

import {useUserInfoStore} from "@/stores/modules/user.js";
import router from "@/router/index.js";

const userLuntanSelecttiezTypesData = ref([
  {
    "comments": 5,
    "content": "春天来了，万物复苏，公园里的樱花开得正盛，和家人一起散步，感受着温暖的阳光和花香，真是一个美好的周末。",
    "images": "https://example.com/spring_cherry_blossoms.jpg",
    "liked": 23,
    "poemWord": null,
    "title": "春日漫步",
    "username": "springlover"
  },
  {
    "comments": 5,
    "content": "春天来了，万物复苏，公园里的樱花开得正盛，和家人一起散步，感受着温暖的阳光和花香，真是一个美好的周末。",
    "images": "https://example.com/spring_cherry_blossoms.jpg",
    "liked": 23,
    "poemWord": null,
    "title": "春日漫步",
    "username": "springlover"
  },
  {
    "comments": 12,
    "content": "今天尝试了一家新开的意大利餐厅，他们的海鲜意面做得非常地道，服务也很周到，强烈推荐给喜欢意大利美食的朋友们。",
    "images": "https://example.com/italian_seafood_pasta.jpg",
    "liked": 47,
    "poemWord": null,
    "title": "美食探店",
    "username": "foodie"
  },
  {
    "comments": 8,
    "content": "周末去爬山，虽然累但是非常值得。站在山顶上，看着脚下的城市和远处的山脉，感觉所有的烦恼都烟消云散了。",
    "images": "https://example.com/mountain_view.jpg",
    "liked": 35,
    "poemWord": null,
    "title": "山顶风光",
    "username": "hiker"
  }, {
    "comments": 15,
    "content": "新书发布会非常成功，作者的演讲非常鼓舞人心，书的内容也很吸引人，我已经迫不及待想要读完整本书了。",
    "images": "https://example.com/book_launch.jpg",
    "liked": 52,
    "poemWord": null,
    "title": "新书分享",
    "username": "bookworm"
  }

])
const userStore = useUserInfoStore();
const activeIndex = ref('1')
const achievement = ref([
  {
    icon: 'iconfont icon-zan',
    text: '获得过100次点赞'
  },
  {
    icon: 'iconfont icon-iconfontzhizuobiaozhun023130',
    text: '获得过50次分享'
  },
  {
    icon: 'iconfont icon-shoucang',
    text: '被收藏20次'
  }
  ,
  {
    icon: 'iconfont icon-pinglun',
    text: '获得过200次评论'
  },
  {
    icon: 'iconfont icon-icon-',
    text: '浏览量达到1000次'
  },
  {
    icon: 'iconfont icon-biaoqian',
    text: '被标记为有用10次'
  }
])
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

const interest = ref([
  {name: '诗词创作', active: true},
  {name: '诗词赏析', active: true},
  {name: '诗词学习', active: true},
  {name: '诗词活动', active: true},
  {name: '诗词资源', active: true},
  {name: '诗词杂谈', active: true}
]);

const removeInterest = (item) => {
  // 更新 interest 数组状态
  const indexInInterest = interest.value.findIndex(interestItem => interestItem.name === item.name);
  if (indexInInterest > -1) {
    interest.value[indexInInterest].active = false; // 标记为不活跃
  }

  // 同时从 myInterest 中删除对应的兴趣项
  const indexInMyInterest = myInterest.value.indexOf(item.name);
  if (indexInMyInterest > -1) {
    myInterest.value.splice(indexInMyInterest, 1); // 移除当前兴趣项
  }
}

</script>
<template>
  <div class="container">
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card">
      <div style="display: flex">
        <div class="user-avatar">
          <img :src='userStore.userInfo.touxiang' alt="用户头像"/>
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
            <i :class="item.icon" style="margin-right: 10px;"/>
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
          <el-scrollbar style="height: 500px;">
            <div class="article" v-for="(item, index) in userLuntanSelecttiezTypesData" :key="index">
              <div class="article-list">
                <div class="list-left">
                  <h3 class="list-title">{{ item.title }}</h3>
                  <p class="list-content" style="margin: 5px 0; text-indent: 2em;">{{ item.content }}</p>
                  <div class="list-footer" style="margin-top: 25px;">
                    <p style="margin-right: 12px;">作者: {{ item.username }}</p>
                    <p style="margin-right: 12px;">赞 {{ item.liked }}</p>
                    <p style="margin-right: 12px;">评 {{ item.conmments }}</p>
                    <p v-if="item.poemWord">引用 “{{ item.poemWord }}” </p>
                  </div>
                </div>
                <div class="list-right" style="background-color: skyblue; height: 100px; width: 150px;">
                  <img alt="" :src=item.images style="width: 100%; height: 100%;">
                </div>
              </div>
            </div>
          </el-scrollbar>

        </el-card>
      </div>
    </div>

    <el-dialog v-model="dialogTableVisible" title="选择喜欢的兴趣领域" width="600">
      <ul style="display: flex;flex-wrap: wrap;">
        <li v-for="(item, index) in interest" :key="index"
            :style="{ marginBottom: '18px',
             marginRight: '20px', cursor: 'pointer',
              fontSize: '16px', border: '1px solid #ccc',
              opacity: 0.7,
               padding: '6px', backgroundColor: item.active ? 'skyblue' : 'white' }">
          {{ item.name }}
          <i style="margin-left: 10px;" @click="removeInterest(item)">x</i>
        </li>
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
          align-items: center;

        }
      }
    }

    .article-right {
      width: 900px;

      .article-card {
        margin-top: 20px;
        height: 600px;


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
