<script setup>
import {ref, onMounted, reactive} from "vue";
// import { getCommentListApi, postAddCommentApi } from "@/api/common";
// import PageQuery from "@/components/common/PageQuery.vue";
import ChildComment from "./ChildComment/index.vue";
// import { useUserStore } from "@/stores/useUserStore";
import SecondComment from "./SecondComment/index.vue";
import {useUserInfoStore} from "@/stores/index.js";
import {userLuntanFabacommentPostApi, userLuntanSelectConmmetsGetApi} from "@/api/modules/talkSquare.js";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const username = ref('')
const route = useRoute();
const userInfo = useUserInfoStore()
username.value = userInfo.userInfo.username


// const { userInfo } = useUserStore();
// 收集 “编辑区” 的输入内容
const comment = ref("");
// 收集 “回复框” 的输入内容
const replyComment = ref("");
// 存储请求回来的数据总数
const total = ref(0);
// 存储请求回来的留言列表
const commentsList = ref();
// 控制回复框的索引
const showReplyIndex = ref(false);
// 控制回复框的显示隐藏
const showReply = ref(false);

/**
 * 显示 回复编辑框
 */
// 根评论的id, 评论者的id
const handleReply = (item) => {
  console.log(item)
  parentId.value = item.id
  showReplyIndex.value = true;
};

/**
 * 发布/回复 评论
 */
const handlePublish = async (comment) => {
  // 封装请求体：数据从父组件来
  const params = {
    comment: comment,
    // momentId: props.postAddCommentForm.momentId,
    // commentType: props.postAddCommentForm.commentType,
    rootCommentId: null,
    parentId: null,
    replyComment: "",
  };

  // 子评论 添加属性
  const replyBox = document.querySelector(".reply-box-container");
  if (replyBox) {
    // 获取根评论ID
    const rootCommentId = replyBox.getAttribute("data-root-comment-id");
    // 获取直接父评论ID
    const parentId = replyBox.getAttribute("data-parent-comment-id");

    params.rootCommentId = rootCommentId;
    params.parentId = parentId;
  }
}

// 发布评论接口
const userLuntanFabacomment = async () => {
  const res = await userLuntanFabacommentPostApi(-1, parentName.value, comment.value, route.params.id)
  if (res.data === '发布成功') {
    ElMessage.success('发布成功')
    comment.value = ''
    await userLuntanSelectConmmets()
  }
}
/**
 * 回复父评论接口
 * @type {Ref<UnwrapRef<string>, UnwrapRef<string> | string>}
 */
const parentId = ref('')
const parentName = ref('')
const replayParent = async () => {
  const res = await userLuntanFabacommentPostApi(parentId.value, parentName.value, replyComment.value, route.params.id)
  if (res.data === '发布成功') {
    ElMessage.success('发布成功')
    replyComment.value = ''
    showReplyIndex.value = false;
    await userLuntanSelectConmmets()
  }
}

/**
 * 获取评论区数据
 * @returns {Promise<void>}
 */
const blogid = ref('')
const postAddCommentForm = ref([])
const router = useRoute()
console.log(router.params.id)
blogid.value = router.params.id
const userLuntanSelectConmmets = async () => {
  const res = await userLuntanSelectConmmetsGetApi(blogid.value)

  postAddCommentForm.value = res.data
  console.log(postAddCommentForm.value)
}
onMounted(() => {
  userLuntanSelectConmmets()
})

</script>


<template>
  <div class="comments">
    <el-card>
      <template #header>
        <div class="comments-header">
          <h3>评论 number</h3>
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
            <el-avatar :size="45" :src="item.touxiang"/>
            <p>
              <span>{{ item.name }}</span>
              <span>{{ item.context }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.context }}</div>
          <div class="listbox-bottom">
            <span>发布时间：{{ item.create_time }}</span>
            <span v-show="item.name !== username" @click="handleReply(item)">回复</span>
          </div>
        </div>

        <div v-if="item.children && item.children.length">
          <SecondComment
              :secondComments="item.children"
              :parentName="item.name"
              @handle-reply="handleReply"
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

        // 身份标签
        span:last-child {
          margin-left: 5px;
          font-size: 8px;
          padding: 2px;
          background-color: $title-color;
          color: white;
          border-radius: 5px;
          position: absolute;
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
