<script setup>
import gsap from 'gsap'
import { ref,onMounted} from 'vue'
const showNumber = ref(0)
const poetNumber =ref(0)
const fontNumber =ref(0)
const counterCartoon = () =>{
  gsap.to(showNumber,{
    duration: 1,
    value: 478462,
    onUpdate: () => {
      showNumber.value = Math.round(showNumber.value);
    }

  })
  gsap.to(fontNumber,{
    duration: 1,
    value: 765742565,
    onUpdate: () => {
      fontNumber.value = Math.round(fontNumber.value);
    }

  })
  gsap.to(poetNumber,{
    duration: 1,
    value: 5646,
    onUpdate: () => {
      poetNumber.value = Math.round(poetNumber.value);
    }

  })
}
onMounted(()=>counterCartoon())
</script>

<template>
 <div class="box">
  约{{ showNumber }}个作品、{{ poetNumber }}位作者、{{ fontNumber }}个汉字
 </div>

</template>

<style scoped lang="scss">
.box{
  // background-image: url('./pic/41016004917.jpg');
  // background-size: 100% 200px;
  width: 100%;
  height: 180px;
  margin: 0 auto;
  // background-color: #76a7e7;
  background: none;
  box-sizing: border-box;
  text-align: center;
  line-height: 180px;
  font-size: 38px;
  font-weight: 530;
  font-family: "Heiti", "黑体", sans-serif;
  opacity: 0.4
}
</style>
