<script setup>
// 引入 watch 用于监听 props 变化
import { ref, reactive, computed, watch } from 'vue'
import SecondComment from './SecondComment/index.vue'
import { useUserInfoStore } from '@/stores/index.js'
import { userLuntanFabacommentPostApi } from '@/api/modules/talkSquare.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  blogId: {
    type: [String, Number],
    required: true,
  },

  commentData: {
    type: Array,
    default: () => [],
  },
  isLoadingComments: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: Number,
    default: 0,
  },
})
// --- Emits ---
const emit = defineEmits(['refresh-comments'])

// --- State ---
const userInfo = useUserInfoStore()
const currentUserName = computed(() => userInfo.userInfo.name) // 当前用户名
const currentUserAvatar = computed(() => userInfo.userInfo.touxiang) // 当前用户头像

const rootCommentInput = ref('') // 根评论输入框内容
const replyInputs = reactive({}) // 回复输入框内容 { commentId: '...' }
const showReplyInputs = reactive({}) // 控制回复输入框显隐 { commentId: boolean }
const showChildComments = reactive({}) // 控制子评论显隐 { commentId: boolean }

const isSubmittingRoot = ref(false) // 根评论提交状态
const isSubmittingReply = reactive({}) // 回复评论提交状态 { commentId: boolean }

// --- Watcher ---
// 监听传入的 commentData 变化，初始化状态
watch(
  () => props.commentData,
  (newComments) => {
    if (Array.isArray(newComments)) {
      newComments.forEach((item) => {
        // 初始化或保留现有状态，避免覆盖用户已展开的项
        if (!(item.id in showChildComments)) {
          showChildComments[item.id] = false
        }
        if (!(item.id in showReplyInputs)) {
          showReplyInputs[item.id] = false
        }
        if (!(item.id in replyInputs)) {
          replyInputs[item.id] = ''
        }
        if (!(item.id in isSubmittingReply)) {
          isSubmittingReply[item.id] = false
        }
        // 如果有子评论，也初始化它们的状态
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach((child) => {
            if (!(child.id in showReplyInputs)) {
              showReplyInputs[child.id] = false
            }
            if (!(child.id in replyInputs)) {
              replyInputs[child.id] = ''
            }
            if (!(child.id in isSubmittingReply)) {
              isSubmittingReply[child.id] = false
            }
          })
        }
      })
    }
  },
  { immediate: true, deep: true },
) // 立即执行并深度监听

// --- Methods ---

/**
 * 提交根评论
 */
const submitRootComment = async () => {
  const content = rootCommentInput.value.trim()
  if (!content) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  isSubmittingRoot.value = true
  try {
    // parentId 为 -1, parentName 为空字符串表示根评论
    const res = await userLuntanFabacommentPostApi(-1, '', content, props.blogId)
    if (res.data === '发布成功') {
      ElMessage.success('发布成功')
      rootCommentInput.value = '' // 清空输入框
      emit('refresh-comments') // 通知父组件刷新
    } else {
      ElMessage.error(res.message || '发布失败')
    }
  } catch (error) {
    console.error('发布根评论失败:', error)
    ElMessage.error('发布评论失败，请检查网络')
  } finally {
    isSubmittingRoot.value = false
  }
}

/**
 * 提交回复评论
 * @param {number} parentId - 被回复的评论 ID (父评论或子评论的 ID)
 * @param {string} parentName - 被回复用户的名字
 */
const submitReply = async (parentId, parentName) => {
  const content = replyInputs[parentId]?.trim() || ''
  if (!content) {
    ElMessage.warning('回复内容不能为空')
    return
  }
  isSubmittingReply[parentId] = true
  try {
    const res = await userLuntanFabacommentPostApi(parentId, parentName, content, props.blogId)
    if (res.data === '发布成功') {
      ElMessage.success('回复成功')
      replyInputs[parentId] = '' // 清空对应输入框
      showReplyInputs[parentId] = false // 关闭回复框
      emit('refresh-comments') // 通知父组件刷新
    } else {
      ElMessage.error(res.message || '回复失败')
    }
  } catch (error) {
    console.error('回复评论失败:', error)
    ElMessage.error('回复评论失败，请检查网络')
  } finally {
    // 延迟一点重置加载状态，避免界面闪烁太快
    //   setTimeout(() => {
    //      if (isSubmittingReply.hasOwnProperty(parentId)) {
    //          isSubmittingReply[parentId] = false;
    //      }
    //   }, 300);
  }
}

/**
 * 切换回复输入框的显示与隐藏 (用于根评论和子评论)
 * @param {object} commentItem - 被点击回复的评论对象 (包含 id, name 等)
 */
const toggleReplyInput = (commentItem) => {
  const commentId = commentItem.id
  // 先关闭所有其他打开的回复框 (可选，根据 UI 需求决定)
  // Object.keys(showReplyInputs).forEach(key => {
  //   if (key !== commentId.toString()) {
  //     showReplyInputs[key] = false;
  //   }
  // });

  // 切换当前点击的回复框
  showReplyInputs[commentId] = !showReplyInputs[commentId]
  // 如果是打开状态，清空可能残留的输入内容
  if (showReplyInputs[commentId]) {
    replyInputs[commentId] = ''
  }
}

// 移除 handleReply 和 handleParentReply，统一使用 toggleReplyInput

// 移除 userLuntanSelectConmmets 和 onMounted 数据获取
</script>

<template>
  <div class="comments">
    <!-- 使用 v-loading 绑定父组件传入的加载状态 -->
    <el-card v-loading="props.isLoadingComments">
      <!-- 头部区域 -->
      <template #header>
        <div class="comments-header">
          <!-- 使用计算属性 commentsCount -->
          <h3>评论 {{ comments }}</h3>
        </div>
      </template>
      <!-- 个人发布评论-->
      <div class="editbox">
        <div class="editbox-left">
          <!-- 使用计算属性 currentUserAvatar -->
          <el-avatar :size="45" :src="currentUserAvatar" />
        </div>
        <div class="editbox-middle">
          <el-input
            placeholder="与其赞同别人的话语，不如自己畅所欲言..."
            v-model.trim="rootCommentInput"
            :disabled="isSubmittingRoot"
          ></el-input>
        </div>
        <div class="editbox-right">
          <!-- 绑定点击事件和加载状态 -->
          <el-button @click="submitRootComment" :loading="isSubmittingRoot" type="primary">
            {{ isSubmittingRoot ? '发布中...' : '发布' }}
          </el-button>
        </div>
      </div>
      <!--渲染根评论-->
      <div class="listbox" v-for="item in props.commentData" :key="item.id">
        <div class="top-level">
          <div class="listbox-top-user">
            <el-avatar :size="38" :src="item.touxiang" />
            <p>
              <span>{{ item.name }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.context }}</div>
          <div class="listbox-bottom">
            <span>发布时间：{{ item.createTiem }}</span>
            <!-- 使用 currentUserName 比较 -->
            <span v-show="item.name !== currentUserName" @click="toggleReplyInput(item)">回复</span>
          </div>
        </div>

        <!--渲染子评论查看更多列表-->
        <div
          v-if="item.children && item.children.length"
          class="view-more-toggle"
          @click="showChildComments[item.id] = !showChildComments[item.id]"
        >
          {{ showChildComments[item.id] ? '收起评论' : `查看 ${item.children.length} 条回复` }}
          <el-icon v-if="!showChildComments[item.id]"><ArrowDown /></el-icon>
          <el-icon v-else><ArrowUp /></el-icon>
        </div>
        <!--子评论组件-->
        <div v-if="item.children && item.children.length && showChildComments[item.id]">
          <SecondComment
            :secondComments="item.children"
            :parentName="item.name"
            :currentUserName="currentUserName"
            @to-reply="toggleReplyInput"
            style="margin-left: 60px"
          />
        </div>

        <!--回复评论输入框 (根评论的) -->
        <div class="reply-box-container" v-show="showReplyInputs[item.id]">
          <div class="replybox" :id="'reply-box-' + item.id">
            <div class="replybox-left">
              <el-avatar :size="30" :src="currentUserAvatar" />
            </div>
            <div class="replybox-middle">
              <!-- placeholder 显示回复对象名字 -->
              <el-input
                :placeholder="`回复 ${item.name}`"
                v-model.trim="replyInputs[item.id]"
                :disabled="isSubmittingReply[item.id]"
              ></el-input>
            </div>
            <div class="replybox-right">
              <!-- 绑定点击事件和加载状态 -->
              <el-button
                @click="submitReply(item.id, item.name)"
                :loading="isSubmittingReply[item.id]"
                type="primary"
                size="small"
              >
                {{ isSubmittingReply[item.id] ? '提交中...' : '提交' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 滑动分页 TODO -->
      <el-empty v-if="!props.isLoadingComments && comments === 0" description="还没有评论，快来抢沙发吧！" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
// ... (样式基本保持不变，可以根据需要微调)
$title-color: #333;
$second-text: #666;
$primary-color: #409eff; // 定义主题色

.comments {
  margin-top: 20px; // 调整上边距
  margin-bottom: 50px; // 调整下边距

  .el-card {
    width: 100%;
    // margin: 20px auto; // 移除多余的 margin
  }

  .editbox,
  .listbox {
    margin: 0 20px 20px 20px; // 统一边距
    padding-bottom: 20px; // 增加底部内边距
    border-bottom: 1px solid #eee; // 统一边框颜色
  }
  .listbox:last-child {
    border-bottom: none; // 最后一个评论项移除底部边框
    padding-bottom: 0;
    margin-bottom: 0;
  }

  // 编辑区
  .editbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px; // 增加底部内边距
    border-bottom: 1px solid #eee; // 添加边框

    .editbox-left {
      flex-shrink: 0; // 防止头像被压缩
    }
    .editbox-middle {
      flex-grow: 1; // 输入框占据剩余空间
      margin: 0 15px; // 调整左右边距
    }
    .editbox-right {
      flex-shrink: 0;
    }
  }

  // 列表展示区
  .listbox {
    display: flex; // 改回 flex，便于内部元素布局
    flex-direction: column;

    // 时间 + 回复
    .listbox-bottom {
      font-size: 12px;
      color: #9499a0;
      margin: 8px 0 8px 53px; // 调整边距以对齐头像下方
      display: flex;
      align-items: center; // 垂直居中

      span {
        display: block;
        margin-right: 15px; // 调整间距
      }

      // 回复按钮样式
      span:last-child {
        cursor: pointer;
        &:hover {
          color: $primary-color; // 使用主题色
        }
      }
    }

    // 信息条
    .listbox-top-user {
      display: flex;
      align-items: center; // 垂直居中

      .el-avatar {
        flex-shrink: 0; // 防止头像压缩
      }

      // 个人信息
      p {
        margin-left: 15px; // 调整间距
        width: 100%;
        position: relative;
        line-height: 1.4; // 调整行高

        span:first-child {
          color: $second-text;
          font-weight: 500; // 名字稍加粗
          font-size: 14px; // 调整字号
        }
      }
    }

    // 顶级评论
    .top-level {
      // 根评论内容
      .listbox-middle-root {
        margin: 5px 0 5px 53px; // 调整边距以对齐头像下方
        font-size: 14px; // 调整字号
        line-height: 1.6; // 调整行高
        color: #303133; // 调整颜色
        word-wrap: break-word; // 自动换行
      }
    }

    // 查看更多/收起评论
    .view-more-toggle {
      margin: 10px 0 10px 53px; // 对齐
      font-size: 13px;
      color: $primary-color; // 使用主题色
      cursor: pointer;
      display: inline-flex; // 使用 inline-flex 对齐图标
      align-items: center;
      gap: 4px; // 图标和文字间距
      &:hover {
        opacity: 0.8;
      }
    }

    // 回复评论输入框容器
    .reply-box-container {
      margin-left: 53px; // 对齐
      margin-top: 10px;
    }

    // 回复评论输入框
    .replybox {
      // margin: 10px 0 20px 65px; // 移除旧边距
      display: flex;
      // justify-content: space-between; // 移除，让输入框自适应
      align-items: center;
      // width: 60%; // 移除固定宽度
      gap: 10px; // 使用 gap 控制间距

      .replybox-left {
        flex-shrink: 0;
      }
      .replybox-middle {
        flex-grow: 1; // 输入框占据剩余空间
      }
      .replybox-right {
        flex-shrink: 0;
      }
    }
  }
}
</style>
