<script setup>
import { ref, onMounted, reactive } from "vue";
// import { getCommentListApi, postAddCommentApi } from "@/api/common";
// import PageQuery from "@/components/common/PageQuery.vue";
import ChildComment from "./ChildComment/index.vue";
// import { useUserStore } from "@/stores/useUserStore";
import SecondComment from "./SecondComment/index.vue";

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
const showReplyIndex = ref(0);
// 控制回复框的显示隐藏
const showReply = ref(false);

onMounted(() => {
  getCommentList();
});

// 接收父组件传过来的值——在别的文件中使用留言组件，则改文件为留言组件的父组件
const props = defineProps({
// 关联主体ID  用户id
  momentId: {
    type: Number,
    required: true,
  },
  postAddCommentForm: {
    type: Object,
    required: true,
  },
});

// 请求当前主体的评论列表
const getCommentForm = reactive({
  pageNum: 1,
  pageSize: 10,
  // ChildPageNum: 1,
  // ChildPageSize: 2,
  momentId: props.momentId,
});

/**
 * 获取留言列表
 */
const getCommentList = async () => {
  // try {
  //   // 封装参数
  //   const res = await getCommentListApi(getCommentForm);
  //   total.value = res.data.total;
  //   commentsList.value = res.data.items;
  // } catch (error) {}
};

/**
 * 显示 回复编辑框
 */
// 根评论的id, 评论者的id
const handleReply = (rootCommentId, parentId) => {
  // 解决只在 当前点击项下 显示回复框
  showReplyIndex.value = rootCommentId;
  // 控制显示隐藏
  showReply.value = !showReply.value;

  const replyBox = document.querySelector(".reply-box-container");
  // 更新回复编辑框的属性，作为参数传给父组件
  // 这里使用到一个知识点：自定义属性
  // 因为需要实现绑定某回复框并使其含有rootCommentId和parentId，发送新增子留言请求时需要这两个参数
  replyBox.setAttribute("data-parent-comment-id", parentId);
  replyBox.setAttribute("data-root-comment-id", rootCommentId);
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

//   // 发送请求
//   try {
//     const res = await postAddCommentApi(params);
//     ElMessage.success(res.msg);
//     getCommentList();
//     // 【问题】发布评论后，输入框中的值没有消失
//   } catch (error) {
//     console.log("🚀 ~ handlePublish ~ error:", error);
//   }
// };
//
// const handlePageSize = (pageSizeVal) => {
//   getCommentForm.pageSize = pageSizeVal.pageSize;
//   getCommentList();
// };
//
// const handlePageNum = (pageNumVal) => {
//   getCommentForm.pageNum = pageNumVal.pageNum;
//   getCommentList();
// };
</script>


<template>
  <div class="comments">
    <el-card>
      <template #header>
        <div class="comments-header">
          <h3>评论 number</h3>
        </div>
      </template>
      <!-- 编辑区
      		1. 左侧：显示当前登录用户头像
      		2. 中间：输入框，使用 v-model 收集用户输入的内容 comment
      		3. 右侧：在 handlePublish 方法中请求新增留言接口
       -->
      <div class="editbox">
        <div class="editbox-left">
<!--          <el-avatar :size="45" :src="userInfo.avatar" />-->
          <el-avatar :size="45" src="#" />
        </div>
        <div class="editbox-middle">
          <el-input
              placeholder="与其赞同别人的话语，不如自己畅所欲言..."
              v-model="comment"
          ></el-input>
        </div>
        <div class="editbox-right">
          <el-button @click="handlePublish(comment)">发布</el-button>
        </div>
      </div>

      <!-- 列表区
      		1. 遍历分页获取的留言列表，并设置唯一的 key 值
      		2. 顶级留言包括：头像、昵称、角色名标签、留言内容、发布时间
      		3. 点击 “回复” 会触发事件 handleReply，同时传入两个参数：当前被回复留言的根ID、当前被回复留言的直接父级ID
      			a. 这两个参数用于给【即将发布的留言】设置根ID与直接父级ID，做到 “回复框的定位”
      			b. 对于二级留言，这两个值传入顶级留言本身的ID就行
       -->
      <div class="listbox" v-for="(item, index) in commentsList" :key="index">
        <!-- 顶级留言：这没什么好说的，就直接展示遍历的结果 -->
        <div class="top-level">
          <div class="listbox-top-user">
<!--            <el-avatar :size="45" :src="item.userImg" />-->
            <el-avatar :size="45" src="#" />
            <p>
              <span>{{ item.createdBy }}</span>
              <span>{{ item.roleName }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.comment }}</div>
          <div class="listbox-bottom">
<!--            <span>发布时间：{{ item.createdAt }}</span>-->
                <span>发布时间：12345</span>
            <span @click="handleReply(item.id, item.id)">回复</span>
          </div>
        </div>

        <!-- 子留言区
           1. 这里没有使用在二级组件中引入三级以上组件的方式，因为当时开发的时候感觉传值有点麻烦
           2. 使用两个子组件同级的形式

          子留言：二级
               1. 判断顶层留言是否存在二级子留言，是则引入 SecondComment 子组件
               2. 父组件传递参数：二级评论 item.children
               3. 处理 “回复” 功能，使用同一个方法实现（handleReply），这里的根ID和直接父ID是子组件传过来的
               4. handle-reply 是子组件中声明需要抛出的事件，@handle-reply 代表监听子组件的自定义事件
        -->
        <div v-if="item.children && item.children.length">
          <SecondComment
              :secondComments="item.children"
              @handle-reply="handleReply"
              style="margin-left: 0"
              parent-name="123"/>

          <!-- 子留言：三级
          		1. 因为使用的同级结构，所以需要先遍历每一个二级留言，判断其下是否存在子留言，是则引入 ChildComment 子组件。
          		2. 必须要遍历二级留言并设置唯一的 key ！！无法直接获取 item.children.children ！！！（原因有点忘了...）
          		3. 同样要给子组件传递参数：三级评论 child.children
          		4. 同时将二级留言的发表人昵称传递给子组件，用于非二级留言的子留言显示 “ @nickname ”
          		5. 同样拥有 “回复” 功能，使用同一个方法实现（handleReply），这里的根ID和直接父ID是子组件传过来的
          		6. 子组件中声明的抛出事件（to-reply）不能与其他组件重复
           -->
          <template
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
          >
            <template v-if="child.children && child.children.length">
              <!-- :parentName="child.createdBy"-->
              <ChildComment
                  :childComments="child.children"
                  :parentName="1234"
                  @to-reply="handleReply"
                  style="margin-left: 65px"
              />
            </template>
          </template>
        </div>

        <!-- 回复框
        		1. 使用一个变量 showReply 来控制显示隐藏
        		2. 同时使用变量 showReplyIndex 用来确定是在哪条留言下显示回复框，否则点击 “回复” 会在所有留言下都出现回复框
        		3. 当 handleReply 方法被触发时，改变 showReply 和 showReplyIndex 的值
        		4. 使用 replyComment 收集回复框输入的内容，当触发 handlePublish 方法时作为参数传进去
         -->
        <div
            class="reply-box-container"
            v-show="showReplyIndex === item.id && showReply"
        >
          <div class="replybox" id="reply-box">
            <div class="replybox-left">
<!--              <el-avatar :size="30" :src="userInfo.avatar" />-->
              <el-avatar :size="30" src="#" />
            </div>
            <div class="replybox-middle">
              <el-input placeholder="回复" v-model="replyComment"></el-input>
            </div>
            <div class="replybox-right">
              <el-button @click="handlePublish(replyComment)">提交</el-button>
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
