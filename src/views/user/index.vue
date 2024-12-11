<script setup>
import {computed, ref} from 'vue';
import {ElCard, ElMessage} from 'element-plus';

import {useUserInfoStore} from "@/stores/modules/user.js";
import router from "@/router/index.js";
import {userLuntanSelectBlogGetApi} from "@/api/modules/talkSquare.js";

const userLuntanSelecttiezTypesData = ref([ ])
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
const pageNum = ref(1)
const pageSize = ref(6)
const scrollbarRef = ref(null);
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

const dialogVisibleFalse = () => {
  dialogTableVisible.value = false;
  ElMessage.success('自定义兴趣领域成功');
}

const userLuntanSelectBlog = async() => {
  const res = await userLuntanSelectBlogGetApi(pageNum.value, pageSize.value, Number(userStore.userInfo.id));
  userLuntanSelecttiezTypesData.value = [...userLuntanSelecttiezTypesData.value, ...res.data.records];
}
const handleScroll = (event) => {
    console.log(event)
    if(event.scrollTop === 280){
         pageNum.value += 1;
      userLuntanSelectBlog()
    }
};
const truncatedContent = computed(() => {
  return userLuntanSelecttiezTypesData.value.map(item => {
    return {
      ...item,
      content: item.content.length > 100 ? item.content.slice(0, 100) + '...' : item.content
    };
  });
});
onMounted(() => {
  userLuntanSelectBlog()
  scrollbarRef.value = document.querySelector('.el-scrollbar__wrap');
})
console.log(scrollbarRef.value)
</script>
<template>
  <div class="bgc">
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
              <p>{{userLuntanSelecttiezTypesData.length}} 原创</p>
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
            <el-scrollbar style="height: 500px;" @scroll="handleScroll"  ref="scrollbarRef" >
              <div class="article" v-for="(item, index) in truncatedContent" :key="index">
                <div class="article-list">
                  <div class="list-left">
                    <h3 class="list-title">{{ item.title }}</h3>
                    <p class="list-content" style="margin: 5px 0; text-indent: 2em;">{{ item.content }}</p>
                    <div class="list-footer" style="margin-top: 25px;">
                      <p style="margin-right: 12px;">赞 {{ item.liked }}</p>
                      <p style="margin-right: 12px;">评 {{ item.conmments }}</p>
                      <p v-if="item.poemWord">引用 “{{ item.poemWord }}” </p>
                    </div>
                  </div>
                  <div class="list-right" style="background-color: skyblue; height: 100px; width: 100px;">
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
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleFalse">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bgc {
  width: 100%;
  height: 1000px;
  background-image: url('./pic/bee34c20e167d7862d96afdf465b4d8.jpg');
  background-size: 100% 100%;

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
                width: 90%;

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
}

</style>
