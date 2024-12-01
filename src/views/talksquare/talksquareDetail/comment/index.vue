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
const replyComment = ref(""); // 收集 “回复框” 的输入内容
// 存储请求回来的数据总数
const total = ref(0);
// 存储请求回来的留言列表
const commentsList = ref();
// 控制回复框的索引
const showReplyIndex = ref(false);
const parentName = ref('')
const blogid = ref('')
const postAddCommentForm = ref([])
const router = useRoute()
const showChildComments = ref(false)

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
 * @param showInput
 */
const handleReply = (parentId, tagerrName, showInput) => {
  showReplyIndex.value = showInput;
  parentCommentId.value = parentId;
  parentName.value = tagerrName;
  showReplyIndex.value = true;
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
  console.log('parentCommentId', parentCommentId.value, 'parentName', parentName.value, 'comment', comment.value)
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
const replayParent = async () => {
  if (comment.value === '' && replyComment.value === '') {
    ElMessage.error('评论内容不能为空')
    return
  }
  const res = await userLuntanFabacommentPostApi(parentCommentId.value, parentName.value, replyComment.value, route.params.id)
  if (res.data === '发布成功') {
    ElMessage.success('发布成功')
    replyComment.value = ''
    showReplyIndex.value = false;
    await userLuntanSelectConmmets()
  }
}


/**
 * 获取留言列表
 * @type {string | RouteParamValue[]}
 */
const userLuntanSelectConmmets = async () => {
  const res = await userLuntanSelectConmmetsGetApi(blogid.value)
  postAddCommentForm.value = res.data
};

/**
 * 控制回复输入框的显示与隐藏
 */
const showReplyInput = () => {
  showReplyIndex.value = true;
  parentCommentId.value = -1;
}


onMounted(() => {
  userLuntanSelectConmmets()
})

/**
 * Show the reply input for a new comment
 * This function initializes the state for showing the reply input box.
 */

</script>

<template>
  <div class="comments">
    <el-card>
      <template #header>
        <div class="comments-header">
          <h3>评论 {{ comments }}</h3>
        </div>
      </template>
      <div class="editbox">
        <div class="editbox-left">
          <el-avatar :size="45" src="#"/>
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

              <span v-show="item.name !== name" @click="showReplyInput">回复</span>
          </div>
        </div>


        <div v-if="item.children && item.children.length"
             style="text-align: center; margin: 10px 0; cursor: pointer"
             @click="showChildComments = !showChildComments">
          {{ showChildComments ? '收起评论' : '查看更多评论' }}
          <span v-show="!showChildComments"><el-icon><ArrowDown/></el-icon></span>
          <span v-show="showChildComments"><el-icon><ArrowUp/></el-icon></span>
        </div>
        <div v-if="item.children && item.children.length && showChildComments"
        >
          <SecondComment
              :secondComments="item.children"
              :parentName="item.name"
              @to-reply="handleReply"
              style="margin-left: 60px"
          />
        </div>

        <div
            class="reply-box-container"
            v-show="showReplyIndex === true"
        >
          <div class="replybox" id="reply-box">
            <div class="replybox-left">
              <el-avatar :size="30" src="#"/>
            </div>
            <div class="replybox-middle">
              <el-input placeholder="回复" v-model="replyComment"></el-input>
            </div>
            <div class="replybox-right">
              <el-button @click="replayParent()">提交</el-button>
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


// 留言区
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

