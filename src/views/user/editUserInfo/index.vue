<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/user.js'
import { Plus, Avatar, Tools } from '@element-plus/icons-vue'
import * as ROUTERS from '@/constants/router.js'
import { userUpdatemessagebyidPutApi } from '@/api/modules/myUser.js'
import { UPLOAD_ADDRESS } from '@/constants/upload.js'

// 状态管理
const state = ref({
  activeIndex: '1',
  dialogVisible: false,
  loading: false,
})

const userStore = useUserInfoStore()

// 表单引用
const ruleFormRef = ref(null)
const resetFormRef = ref(null)

// 上传头像的请求头
const headers = ref({
  token: userStore.userInfo.token,
})

// 修改密码表单
const resetForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 个人信息表单
const userForm = ref({
  name: userStore.userInfo.username || '',
  age: userStore.userInfo.age || '',
  degree: userStore.userInfo.degree || '',
  touxiang: userStore.userInfo.touxiang || '',
  sex: userStore.userInfo.sex || '',
  phone: userStore.userInfo.phone || '',
})

// 个人信息验证规则
const userRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  age: [{ pattern: /^\d{1,3}$/, message: '请输入有效年龄', trigger: 'blur' }],
  sex: [{ pattern: /^[男女]$/, message: '性别只能填写"男"或"女"', trigger: 'blur' }],
}

// 密码验证规则
const resetRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 账号设置选项
const accountSettings = [
  { title: '手机', info: userForm.value.phone || '未绑定', operate: '换绑' },
  { title: '微信', info: '未绑定', operate: '绑定' },
  { title: '邮箱', info: '未绑定', operate: '绑定' },
  { title: '密码', info: '******', operate: '重置' },
]

// 头像上传成功回调
const handleAvatarSuccess = (response) => {
  console.log('response', response)
  if (response.code === 1) {
    userForm.value.touxiang = response.data
    console.log('userForm.value.touxiang', userForm.value.touxiang)
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

// 头像上传之前的处理
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 提交个人信息
const handleSubmit = async () => {
  if (!ruleFormRef.value) return

  try {
    await ruleFormRef.value.validate()
    state.value.loading = true

    console.log(userForm.value)

    const res = await userUpdatemessagebyidPutApi(userForm.value)
    console.log('res', res)

    ElMessage.success('保存成功')
    userStore.setUserInfo({
      ...userStore.userInfo,
      ...userForm.value,
    })
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('表单验证失败，请检查输入')
  } finally {
    state.value.loading = false
  }
}

// 重置密码
const handleResetPassword = async () => {
  if (!resetFormRef.value) return

  try {
    await resetFormRef.value.validate()
    ElMessage.success('密码重置成功，请重新登录')
    state.value.dialogVisible = false
    await router.push('/login')
  } catch (error) {
    console.error('重置密码失败:', error)
  }
}

// 处理账号设置操作
const handleAccountOperation = (operation) => {
  if (operation === '重置') {
    state.value.dialogVisible = true
  } else {
    ElMessage.info('功能开发中...')
  }
}
</script>

<template>
  <div class="edit-user-info">
    <!-- 返回按钮 -->
    <el-card class="back-btn" @click="router.push(ROUTERS.USER)">
      <el-icon><ArrowLeft /></el-icon> 返回个人主页
    </el-card>

    <div class="main-content">
      <!-- 左侧导航 -->
      <aside class="sidebar">
        <el-menu mode="vertical" :default-active="state.activeIndex" class="nav-menu">
          <el-menu-item index="1" @click="state.activeIndex = '1'">
            <el-icon><Avatar /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="2" @click="state.activeIndex = '2'">
            <el-icon><Tools /></el-icon>
            <span>账号设置</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 右侧内容 -->
      <el-card class="content-card">
        <!-- 个人资料表单 -->
        <div v-if="state.activeIndex === '1'" class="user-profile">
          <h2 class="section-title">个人资料</h2>
          <el-divider />

          <div class="form-container">
            <el-form ref="ruleFormRef" :model="userForm" :rules="userRules" label-width="100px" class="user-form">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="userForm.name" />
              </el-form-item>
              <el-form-item label="职业" prop="degree">
                <el-input v-model="userForm.degree" placeholder="请输入职业方向" />
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="userForm.age" placeholder="请输入年龄" />
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="userForm.sex">
                  <el-radio value="男">男</el-radio>
                  <el-radio value="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入手机号" maxlength="11" show-word-limit />
              </el-form-item>
            </el-form>

            <div class="avatar-uploader">
              <h3>头像</h3>
              <el-upload
                class="avatar-upload"
                :action="UPLOAD_ADDRESS"
                :headers="headers"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="userForm.touxiang" :src="userForm.touxiang" class="avatar" alt="" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>

          <div class="form-actions">
            <el-button type="primary" :loading="state.loading" @click="handleSubmit"> 保存修改 </el-button>
          </div>
        </div>

        <!-- 账号设置 -->
        <div v-else class="account-settings">
          <h2 class="section-title">账号设置</h2>
          <el-divider />

          <div class="settings-list">
            <div v-for="item in accountSettings" :key="item.title" class="setting-item">
              <div class="setting-info">
                <span class="setting-title">{{ item.title }}</span>
                <span class="setting-value">{{ item.info }}</span>
              </div>
              <el-button link type="primary" @click="handleAccountOperation(item.operate)">
                {{ item.operate }}
              </el-button>
              <el-divider />
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="state.dialogVisible" title="重置密码" width="500px" destroy-on-close>
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="120px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="resetForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="resetForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="resetForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPassword"> 确认修改 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.edit-user-info {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;

  .back-btn {
    max-width: 1200px;
    margin: 0 auto 20px;
    cursor: pointer;
    color: #409eff;
    transition: all 0.3s;

    &:hover {
      color: #79bbff;
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;

    .sidebar {
      .nav-menu {
        border-radius: 4px;

        .el-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 50px;

          &:hover,
          &.is-active {
            background-color: #ecf5ff;
          }
        }
      }
    }

    .content-card {
      padding: 20px;

      .section-title {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
        color: #303133;
      }

      .form-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 40px;
        margin-top: 20px;

        .user-form {
          .el-form-item {
            margin-bottom: 22px;
          }
        }

        .avatar-uploader {
          h3 {
            margin: 0 0 15px;
            font-size: 16px;
            color: #606266;
          }

          .avatar-upload {
            border: 1px dashed #d9d9d9;
            height: 200px;
            width: 200px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s;

            &:hover {
              border-color: #409eff;
            }

            .avatar {
              display: block;
              object-fit: cover;
              width: 100%;
              height: 100%;
            }

            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 200px;
              height: 200px;
              text-align: center;
              line-height: 200px;
            }
          }
        }
      }

      .form-actions {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;
      }

      .settings-list {
        .setting-item {
          padding: 20px 0;

          .setting-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            .setting-title {
              font-size: 16px;
              color: #303133;
            }

            .setting-value {
              color: #606266;
            }
          }
        }
      }
    }
  }
}
</style>
