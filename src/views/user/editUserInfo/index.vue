<script setup>
// 导入 Vue 相关的响应式 API
import {reactive, ref} from 'vue';
// 导入 Vue 路由
import router from "@/router/index.js";
// 导入 Element Plus 消息组件
import {ElMessage} from 'element-plus';
// 导入用户信息状态管理
import {useUserInfoStore} from "@/stores/modules/user.js";
// 导入 Element Plus 图标组件
import {Plus} from '@element-plus/icons-vue';
import {userUpdatemessagebyidPutApi} from "@/api/modules/myUser.js";

// 当前激活的菜单索引
const activeIndex = ref('1');
// 获取用户信息状态
const userInfo = useUserInfoStore();
// 修改密码弹窗的状态
const dialogTableVisibleReset = ref(false);
// 修改密码表单数据模型定义
const ResetForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const userStore = useUserInfoStore()
const headers = ref({
  'token': userStore.userInfo.token
})
// 修改密码表单验证规则定义
const ResetRules = ref({
  oldPassword: [
    {min: 4, max: 10, message: '密码长度在 4 到 10 个字符', trigger: 'blur'}],
  newPassword: [
    {min: 4, max: 10, message: '密码长度在 4 到 10 个字符', trigger: 'blur'}],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === ResetForm.value.newPassword) {
          callback();
        } else {
          callback('两次输入的密码不一致!');
        }
      }
    }]
})
// 表单数据模型定义
const ruleForm = ref({
  name: userInfo.userInfo.username || '',
  age: userInfo.userInfo.age || '',
  degree: userInfo.userInfo.degree || '',
  touxiang: userInfo.userInfo.touxiang || '',
  sex: userInfo.userInfo.sex || '',
  phone: userInfo.userInfo.phone || '',
});

// 表单验证规则定义
const rules = reactive({
  name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
  region: [{required: true, message: '请选择活动区域', trigger: 'change'}],
  count: [{required: true, message: '请选择活动人数', trigger: 'change'}],
  date1: [{type: 'date', required: true, message: '请选择一个日期', trigger: 'change'}],
  date2: [{type: 'date', required: true, message: '请选择一个时间', trigger: 'change'}],
  location: [{required: true, message: '请选择一个地点', trigger: 'change'}],
  type: [{type: 'array', required: true, message: '请至少选择一种活动类型', trigger: 'change'}],
  resource: [{required: true, message: '请选择活动资源', trigger: 'change'}],
  desc: [{required: true, message: '请输入活动描述', trigger: 'blur'}],
});

// 提交表单信息的处理函数
const handleSubmit = () => {
  userUpdatemessagebyid()
  ElMessage.success('保存成功');
};

// 账号设置内容数据
const accountSetting = [
  {title: '手机', info: '13812345678', operate: '换绑'},
  {title: '微信', info: '未绑定', operate: '绑定'},
  {title: '邮箱', info: '未绑定', operate: '绑定'},
  {title: '密码', info: '******', operate: '重置'}
];

// 重置密码的处理函数
const resetPassword = (e) => {
  if (e === '重置') {
    dialogTableVisibleReset.value = true;
  }
}
// 确认重置密码的处理函数
const confirmResetPassword = async () => {

}

const handleSuccess = (res) => {
  console.log(res.data)
  ruleForm.value.touxiang = res.data
  console.log(ruleForm.value.touxiang)
}

const userUpdatemessagebyid = async () => {
  console.log(ruleForm.value)
  // const res = await userUpdatemessagebyidPutApi(ruleForm.value)
  // console.log(res)
}
</script>

<template>
  <div class="info-list-container">
    <el-card class="last-page"
             @click="router.push('/user')">
      < 返回个人主页
    </el-card>
    <div class="info-container">
      <div class="info-left">
        <el-menu mode="vertical" :default-active="activeIndex" class="image-navigation">
          <el-menu-item index="1" @click="activeIndex = '1'">
            <el-icon class="el-icon">
              <Avatar/>
            </el-icon>
            个人资料
          </el-menu-item>
          <el-menu-item index="2" @click="activeIndex = '2'">
            <el-icon class="el-icon">
              <Tools/>
            </el-icon>
            账号设置
          </el-menu-item>
        </el-menu>
      </div>
      <el-card class="info-right">
        <div v-if="activeIndex === '1'" class="info-right-one">
          <p class="info-title">个人资料</p>
          <el-divider style="margin: 16px 0;"/>
          <div class="info-form">
            <el-form label-width="auto" :model="ruleForm" class="demo-ruleForm" status-icon>
              <el-form-item label="用户名" prop="name" required style="width: 500px">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
              <el-form-item label="职业" prop="degree">
                <el-input v-model="ruleForm.degree" placeholder="请输入职业方向"/>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="ruleForm.age" placeholder="请输入你的年龄"/>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-input v-model="ruleForm.sex" placeholder="请输入性别"/>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="11" show-word-limit/>
              </el-form-item>
            </el-form>
            <div class="avatar-uploader">
              <el-upload action="http://fuze1.nat300.top/user/luntan/updateImage"
                         list-type="picture-card"
                         :headers="headers"
                         :on-success="handleSuccess">
                <el-icon>
                  <Plus/>
                </el-icon>
              </el-upload>
            </div>
          </div>
          <el-button type="primary" style="margin-left: 40px; margin-top: 20px;" @click="handleSubmit">保存</el-button>
        </div>
        <div v-if="activeIndex === '2'" class="info-right-two">
          <h2 style="margin-left: 20px; font-size: 20px; margin-top: 20px; font-weight: 500;">账号设置</h2>
          <el-divider style="margin: 16px 0;"/>
          <div v-for="item in accountSetting" :key="item.title">
            <div class="info-binding">
              <div style="display: flex;">
                <p style="font-size: 17px; font-weight: 500;">{{ item.title }}</p>
                <p style="font-size: 17px; font-weight: 500; margin-left: 240px;">{{ item.info }}</p>
              </div>
              <p class="info-binding-btn" @click="resetPassword(item.operate)">{{ item.operate }}</p>
            </div>
            <el-divider style="margin: 16px 0;"/>
          </div>
        </div>

        <el-dialog v-model="dialogTableVisibleReset" title="Shipping address" width="800">
          <el-form
              ref="ruleFormRef"
              style="max-width: 600px"
              :model="ResetForm"
              :rules="ResetRules"
              label-width="auto"
              class="demo-ruleForm"
              status-icon
          >
            <el-form-item label="请输入旧密码" prop="oldPassword">
              <el-input type="password" show-password v-model="ResetForm.oldPassword"/>
            </el-form-item>
            <el-form-item label="请输入新密码" prop="newPassword">
              <el-input type="password" show-password v-model="ResetForm.newPassword"/>
            </el-form-item>
            <el-form-item label="再次确认新密码" prop="confirmPassword">
              <el-input type="password" show-password v-model="ResetForm.confirmPassword"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogTableVisibleReset = false">取消</el-button>
              <el-button type="primary" @click="confirmResetPassword">确认</el-button>
            </div>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-list-container {
  .last-page {
    margin: 0 auto;
    width: 1200px;
    color: #3f7ef7;
    cursor: pointer;
  }

  .info-container {
    max-width: 1200px;
    display: flex;
    margin: auto;
    padding: 10px;

    .info-left {
      margin: 20px 0;
      width: 20%;

      .image-navigation .el-menu-item {
        transition: background-color 0.3s, color 0.3s; /* 平滑过渡效果 */
      }

      .image-navigation .el-menu-item:hover {
        background-color: #ebf2fe; /* 悬停时的背景颜色 */
        color: #3f7ef7; /* 悬停时的文字颜色 */
      }

      .image-navigation .el-menu-item.is-active {
        background-color: #ebf2fe; /* 激活项的背景颜色 */
      }

      /* 如果你想要悬停效果也改变图标的颜色，可以添加以下样式 */
      .image-navigation .el-menu-item:hover i {
        color: #ebf2fe; /* 悬停时的图标颜色 */
      }
    }

    .info-right {
      --el-card-padding: 0px;
      margin-left: 24px;
      margin-top: 20px;
      width: 78%;

      .info-right-one {
        height: 500px;

        .info-title {
          font-size: 20px;
          margin-left: 20px;
          margin-top: 16px;
        }

        .info-form {
          display: flex;
          margin-left: 30px;

          :deep(el-form-item__label) {
            line-height: 35px;
          }

          :deep(.el-input__wrapper) {
            background-color: #f2f3f5;
            height: 35px;
          }
        }

        .avatar-uploader {
          margin-left: 40px;

          .avatar {
            width: 178px;
            height: 178px;
            display: block;
          }

          :deep(.el-upload) {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
          }

          :deep(.el-upload:hover) {
            border-color: var(--el-color-primary);
          }

          .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
          }
        }
      }

      .info-right-two {
        height: 500px;

        .info-binding {
          display: flex;
          justify-content: space-between;
          padding: 10px 0 10px 20px;

          .info-binding-btn {
            font-size: 17px;
            font-weight: 500;
            margin-right: 24px;
            color: #3f7ef7;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
