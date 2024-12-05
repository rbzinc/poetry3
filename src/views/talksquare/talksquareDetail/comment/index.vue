<script setup>
import {ref, onMounted, reactive} from "vue";

import SecondComment from "./SecondComment/index.vue";
import {useUserInfoStore} from "@/stores/index.js";
import {userLuntanFabacommentPostApi, userLuntanSelectConmmetsGetApi} from "@/api/modules/talkSquare.js";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute();
const name = ref('') // 获取当前用户的姓名
const userInfo = useUserInfoStore()
name.value = userInfo.userInfo.name
const parentCommentId = ref(-1) // 默认父评论id为-1
const comment = ref(""); // 收集 “编辑区” 的输入内容
const replyComment = reactive({}); // 收集每个回复框的输入内容
// 存储请求回来的数据总数
const total = ref(0);
// 存储请求回来的留言列表
const commentsList = ref();
// 控制回复框的索引
const showReplyIndex = reactive({});
const parentName = ref('')
const blogid = ref('')
const postAddCommentForm = ref([])
const router = useRoute()
const showChildComments = reactive({});

blogid.value = router.params.id
const props = defineProps({
  comments: {
    required: true
  }
})
const comments = props.comments


/**
 * 子组件返回回来的数据
 * @param parentId
 * @param tagerrName
 */
const handleReply = (parentId, tagerrName) => {
  parentCommentId.value = parentId;
  parentName.value = tagerrName;
  showReplyIndex.value = !showReplyIndex.value;
};

/**
 * 发布评论接口
 * @returns {Promise<void>}
 */
const userLuntanFabacomment = async () => {
  if (comment.value === '' && replyComment.value === '') {
    ElMessage.error('评论内容不能为空')
    return
  }
  const res = await userLuntanFabacommentPostApi(parentCommentId.value, parentName.value, comment.value, route.params.id)
  if (res.data === '发布成功') {
    ElMessage.success('发布成功')
    comment.value = ''
    await userLuntanSelectConmmets()
  }
}

/**
 * 回复评论接口
 * @returns {Promise<void>}
 */
const replayParent = async (parentId) => {
  // 获取当前评论对应的回复内容
  const replyContent = replyComment[parentId] || '';

  if (replyContent === '') {
    ElMessage.error('评论内容不能为空');
    return;
  }

  const res = await userLuntanFabacommentPostApi(parentId, parentName.value, replyContent, route.params.id);
  if (res.data === '发布成功') {
    ElMessage.success('发布成功');
    replyComment[parentId] = ''; // 清空对应评论的回复内容
    showReplyIndex[parentId] = false; // 隐藏相应回复框
    await userLuntanSelectConmmets();
  }
}


/**
 * 获取留言列表
 * @type {string | RouteParamValue[]}
 */
const userLuntanSelectConmmets = async () => {
  const res = await userLuntanSelectConmmetsGetApi(blogid.value)
  postAddCommentForm.value = res.data
  // 初始化每个评论的子评论状态为 false
  postAddCommentForm.value.forEach(item => {
    showChildComments[item.id] = false;
  });

  // 初始化每个评论的回复框状态为 false
  postAddCommentForm.value.forEach(item => {
    showReplyIndex[item.id] = false;
  });
};

/**
 * 控制回复输入框的显示与隐藏
 */
const showReplyInput = () => {
  showReplyIndex.value = !showReplyIndex.value;
  parentCommentId.value = -1;
}

const handleParentReply =(item)=>{
  console.log(item)
  showReplyIndex[item.id] = !showReplyIndex[item.id]
  parentName.value = item.name

}

onMounted(() => {
  userLuntanSelectConmmets()
})


</script>

<template>
  <div class="comments">
    <el-card>
      <!-- 头部区域 -->
      <template #header>
        <div class="comments-header">
          <h3>评论 {{ comments }}</h3>
        </div>
      </template>
      <!-- 个人发布评论-->
      <div class="editbox">
        <div class="editbox-left">
          <el-avatar :size="45" :src="userInfo.userInfo.touxiang"/>
        </div>
        <div class="editbox-middle">
          <el-input
              placeholder="与其赞同别人的话语，不如自己畅所欲言..."
              v-model="comment"
          ></el-input>
        </div>
        <div class="editbox-right">
          <el-button @click="userLuntanFabacomment()">发布</el-button>
        </div>
      </div>
      <!--渲染根评论-->
      <div class="listbox" v-for="(item, index) in postAddCommentForm" :key="index">
        <div class="top-level">
          <div class="listbox-top-user">
            <el-avatar :size="38" :src="item.touxiang"/>
            <p>
              <span>{{ item.name }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.context }}</div>
          <div class="listbox-bottom">
            <span>发布时间：{{ item.createTiem }}</span>
            <!--如果不是自己，则可以进行回复-->
            <span v-show="item.name !== name" @click="handleParentReply(item)">回复</span>
          </div>
        </div>

        <!--渲染子评论查看更多列表-->
        <div v-if="item.children && item.children.length"
             style="text-align: center; margin: 10px 0; cursor: pointer"
             @click="showChildComments[item.id] = !showChildComments[item.id]">
          {{ showChildComments[item.id] ? '收起评论' : '查看更多评论' }}
          <span v-show="!showChildComments[item.id]"><el-icon><ArrowDown/></el-icon></span>
          <span v-show="showChildComments[item.id]"><el-icon><ArrowUp/></el-icon></span>
        </div>
        <!--子评论组件-->
        <div v-if="item.children && item.children.length && showChildComments[item.id]">
          <SecondComment
              :secondComments="item.children"
              :parentName="item.name"
              @to-reply="handleReply"
              style="margin-left: 60px"
          />
        </div>

        <!--回复评论组件-->
        <div
            class="reply-box-container"
            v-show="showReplyIndex[item.id]"
        >
          <div class="replybox" id="reply-box">
            <div class="replybox-left">
              <el-avatar :size="30" :src="userInfo.userInfo.touxiang"/>
            </div>
            <div class="replybox-middle">
              <el-input :placeholder="`回复 ${parentName}`" v-model="replyComment[item.id]"></el-input>
            </div>
            <div class="replybox-right">
              <el-button @click="() => replayParent(item.id)">提交</el-button>
            </div>
          </div>
        </div>


      </div>
      <!-- TODO 滑动分页-->
      <!--      <div style="text-align: center; margin: 10px 0; cursor: pointer">-->
      <!--        显示更多<el-icon><ArrowDown /></el-icon>-->
      <!--      </div>-->
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
$title-color: #333;
$second-text: #666;

.comments {
  margin-top: 30px;
  margin-bottom: 100px;

  .el-card {
    width: 100%;
    margin: 20px auto;
  }

  .editbox,
  .listbox {
    margin: 0 20px 20px 20px;
    display: flex;
  }

  // 编辑区
  .editbox {
    justify-content: space-between;
    align-items: center;

    .editbox-middle {
      width: 85%;
    }
  }

  // 列表展示区
  .listbox {
    flex-direction: column;
    border-bottom: 1px solid rgb(189, 187, 187);

    // 时间 + 回复
    .listbox-bottom {
      font-size: 12px;
      color: #9499a0;
      margin: 10px 0 10px 65px;
      display: flex;

      span {
        display: block;
        margin-right: 20px;
      }

      // 这里 color 换成普通颜色表示即可
      span:last-child:hover {
        cursor: pointer;
        color: $title-color;
      }
    }

    // 信息条
    .listbox-top-user {
      display: flex;

      // 个人信息
      p {
        margin-left: 20px;
        width: 100%;
        position: relative;

        span:first-child {
          color: $second-text;
        }
      }
    }

    // 顶级评论
    .top-level {
      // 根评论内容
      .listbox-middle-root {
        margin-left: 65px;
      }
    }

    // 回复评论输入框
    .replybox {
      margin: 10px 0 20px 65px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 60%;

      .replybox-middle {
        width: 75%;
      }
    }

    // 展示更多
    .view-more {
      margin-left: 65px;
      font-size: 12px;
      color: #9499a0;
    }

    .view-more span:hover,
    .view-less span:hover {
      cursor: pointer;
      color: $title-color;
    }

    // 展示更少
    .view-less {
      font-size: 12px;
      color: #9499a0;
      margin-left: 37px;
    }
  }
}
</style>

