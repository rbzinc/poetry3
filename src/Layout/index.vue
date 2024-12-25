<script setup>
import {defineExpose, ref} from 'vue'
import Cartoon from '@/components/home/cartoon/index.vue'

defineExpose(Cartoon)
import bg1 from '../assets/pic/home/1.jpg'
import bg2 from '../assets/pic/home/2.jpg'
import bg3 from '../assets/pic/home/3.jpg'
import bg4 from '../assets/pic/home/4.jpg'
import bg5 from '../assets/pic/home/5.jpg'

const imgs = ref([bg1, bg2, bg3, bg4, bg5])
const chartOption = ref({
  title: {
    text: '朝代收录总览',
    textStyle: {
      fontSize: 24,
      fontFamily: '"Heiti", "黑体", sans-serif'
    }
  },
  tooltip: {},
  xAxis: {
    data: ["唐", "宋", "元", "明", "清", "其他"],
    axisLabel: {
      textStyle: {
        fontSize: 18
      }
    }
  },
  yAxis: {},
  series: [{
    name: '作品数',
    type: 'bar',
    data: [3212, 3250, 2460, 2632, 6943, 423],
    axisLabel: {
      textStyle: {
        fontSize: 18
      }
    },
    itemStyle: {
      color: function (params) {
        var colorList = ["rgba(179, 176, 167, 0.8)",
          "rgba(163, 148, 117, 0.8)",
          "rgba(188, 104, 42, 0.8)",
          "rgba(123, 116, 106, 0.8)",
          "rgba(180, 178, 139, 0.8)",
          "rgba(132, 99, 45, 0.8)"];
        return colorList[params.dataIndex % colorList.length];
      }
    }
  }]
});

const pieChartion = ref({
  title: {
    text: '他们的作品',
    textStyle: {
      fontSize: 24,
      fontFamily: '"Heiti", "黑体", sans-serif'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['分类1', '分类2', '分类3']
  },
  series: [
    {
      name: '作品',
      type: 'pie',
      radius: '70%',
      data: [
        {value: 127, name: '李白'},
        {value: 101, name: '杜甫'},
        {value: 94, name: '白居易'},
        {value: 46, name: '王维'},
        {value: 127, name: '苏轼'},
        {value: 43, name: '李清照'}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: function (params) {
          var colorList = ["rgba(78, 94, 68, 0.8)",
            "rgba(207, 109, 70, 0.8)",
            "rgba(177, 193, 183, 0.8)",
            "rgba(146, 124, 100, 0.8)",
            "rgba(204, 185, 108, 0.8)",
            "rgba(150, 128, 130, 0.8)"];
          return colorList[params.dataIndex % colorList.length];
        }
      }
    }
  ]
})

</script>

<template>

  <div class="bgc">
    <Cartoon></Cartoon>
    <div class="diagram">
      <div class="headtitle">今日推荐</div>
      <div class="block text-center" m="t-4">
        <el-carousel trigger="click" height="400px">
          <el-carousel-item v-for="(img,index) in imgs">
            <img :src="img" style="width: 100%; height: 100%;">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div>
        <v-chart class="chart" :option="chartOption"/>
        <v-chart class="piechart" :option="pieChartion"/>

      </div>
    </div>
  </div>

</template>

<style scoped>
.bgc {
  width: 100%;
  background-image: url('@/assets/pic/home/6.jpg');
}

.diagram {
  width: 1200px;
  height: 1400px;
  background: none;
  margin: 0 auto;

  .headtitle {
    font-size: 24px;
    margin-bottom: 15px;
    font-family: "Heiti", "黑体", sans-serif;
    opacity: 0.6;
    font-weight: bold;
  }
}

.chart {
  height: 400px;
  margin-top: 20px;
}

.piechart {
  height: 500px;
}
</style>
