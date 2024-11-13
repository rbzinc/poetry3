<script setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElButton } from 'element-plus'

const user = ref({
  username: '',
  email: '',
  age: null,
  sex: null,
  phone:''
})

const submitForm = () => {
  console.log('提交表单', user.value)
}

const resetForm = () => {
  user.value = {
    username: '',
    email: '',
    age: null
  };
  // 重置表单
};
</script>

<template>
<div class="box">
  <div class="head">
    <div class="headpic"></div>
    <div class="name">
      <div class="right"></div>
    </div>
  </div>
  <el-form ref="userForm" :model="user" class="form">
    <el-form-item label="用户名">
      <el-input v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item label="邮箱&nbsp&nbsp&nbsp">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="电话&nbsp&nbsp&nbsp">
      <el-input v-model="user.phone"></el-input>
    </el-form-item>
    <el-form-item label="年龄&nbsp&nbsp&nbsp">
      <el-input-number v-model="user.age"></el-input-number>
    </el-form-item>
    <el-form-item label="性别&nbsp&nbsp&nbsp">
      <el-radio-group v-model="user.sex">
        <el-radio value="Sponsor">男</el-radio>
        <el-radio value="Venue">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style scoped lang="scss">
.box{
  width: 1260px;
  height: 1000px;
  background-color: #facfcf;
  margin: 30px auto 0;
  .head{
    width: 1200px;
    height: 100px;
    background-color: #8fa58f;
    margin: 0 auto;
    display: flex;
    .headpic{
      width: 90px;
      height: 90px;
      background-color: #cdf7f5;
      border-radius: 100%;
      border-width: 5px;
      border-color: #fff;
      border-style: solid;
      position: relative;
      top:-15px;
    }
    .name{
      width: 1100px;
      height: 80px;
      background-color: #eaefbc;
      align-items: center;
      box-sizing: border-box;
      padding: 0px 30px 0px 30px; /* 上、右、下、左内边距分别为30px、20px、10px、40px */
      line-height: 80px;
      font-size: 22px;
      .right{
        width: 200px;
        height: 80px;
        background-color: #fdc6ec;
        float: right;
        ::v-deep .el-button {
          color: rgb(146, 144, 144);
          height: 35px;
          width: 90px;
        }
      }
    }
  }
  .form{
    width: 800px;
    margin: 10px auto 0 ;
  }
}
</style>