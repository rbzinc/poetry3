<script setup>

</script>

<template>
 <div class="newcard">
  <div class="colors">
    <div class="line" :style="{ backgroundColor: '#ed9191' }"></div>
    <div class="line" :style="{ backgroundColor: '#93d1f5' }"></div>
    <div class="line" :style="{ backgroundColor: '#93f5aa' }"></div>
    <div class="line" :style="{ backgroundColor: '#f4f298' }"></div>
    <div class="line" :style="{ backgroundColor: '#e3b2fa' }"></div>
  </div>
  <div class="main">
    <textarea placeholder="留言..." class="message"></textarea>
    <input type="text" placeholder="签名" class="name"/>
  </div>
  <div class="labels">
    <div class="title">选择标签</div>
    <div class="button">
      <div class="line"></div>
    </div>
  </div>
  <div class="footnav">
    <div class="footbut">删除</div>
    <div class="footbut">确定</div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.newcard{
  padding: 0 20px;
  .colors{
    display: flex;
    height: 36px;
    .line{
      width: 28px;
      height: 28px;
      box-sizing: border-box;
      margin-right: 18px;
    }
  }
  .main{
    height: 240px;
    width: 100%;
    padding: 12px;
    background-color: #fdd7d7;
    box-sizing: border-box;
    .message{
      background:none;
      resize: none;
      height: 172px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
      border: none;
      font-size: 15px;
    }
    .name{
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      background:none;
      line-height: 20px;
      border: 1px solid #fff;
      font-size: 15px;
    }
  }
  .labels{
    margin-top: 20px;
    .title{
      font-size: 16px;
      font-weight: 600;
      color: #616161;
    }
  }
  .footnav{
    display: flex;
    .footbut{
      margin-top: 20px;
      height: 40px;
      width: 80px;
      margin-right: 20px;
      color: #616161;
      background-color: #fff;
      line-height: 40px;
      text-align: center;
      border: #616161 2px solid;
      border-radius: 25px;
      cursor:pointer;
    }
    
  }
}
</style>