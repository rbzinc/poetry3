<script setup>
import { ref } from 'vue'
import Cartoon from '@/components/home/cartoon/index.vue'
import { HOME_BG_URL, HOME_CAROUSEL } from '@/constants/bgUrl.js'

// 柱状图配置
const barChartOption = ref({
  title: {
    text: '朝代收录总览',
    textStyle: {
      fontSize: 24,
      fontFamily: '"Heiti", "黑体", sans-serif',
    },
    left: 'center', // 将标题居中
    top: 0, // 将标题放在顶部
  },
  tooltip: {},
  xAxis: {
    data: ['唐', '宋', '元', '明', '清', '其他'],
    axisLabel: {
      textStyle: {
        fontSize: 18,
      },
    },
  },
  yAxis: {},
  series: [
    {
      name: '作品数',
      type: 'bar',
      data: [3212, 3250, 2460, 2632, 6943, 423],
      axisLabel: {
        textStyle: {
          fontSize: 18,
        },
      },
      itemStyle: {
        color: function (params) {
          const colorList = [
            'rgba(179, 176, 167, 0.8)',
            'rgba(163, 148, 117, 0.8)',
            'rgba(188, 104, 42, 0.8)',
            'rgba(123, 116, 106, 0.8)',
            'rgba(180, 178, 139, 0.8)',
            'rgba(132, 99, 45, 0.8)',
          ]
          return colorList[params.dataIndex % colorList.length]
        },
      },
    },
  ],
})

// 饼图配置
const pieChartOption = ref({
  title: {
    text: '他们的作品',
    textStyle: {
      fontSize: 24,
      fontFamily: '"Heiti", "黑体", sans-serif',
    },
    left: 'center', // 将标题居中
    top: 0, // 将标题放在顶部
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 10,
    top: 'middle',
    data: ['李白', '杜甫', '白居易', '王维', '苏轼', '李清照'],
  },
  series: [
    {
      name: '作品',
      type: 'pie',
      radius: '70%',
      data: [
        { value: 127, name: '李白' },
        { value: 101, name: '杜甫' },
        { value: 94, name: '白居易' },
        { value: 46, name: '王维' },
        { value: 127, name: '苏轼' },
        { value: 43, name: '李清照' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      itemStyle: {
        color: function (params) {
          const colorList = [
            'rgba(78, 94, 68, 0.8)',
            'rgba(207, 109, 70, 0.8)',
            'rgba(177, 193, 183, 0.8)',
            'rgba(146, 124, 100, 0.8)',
            'rgba(204, 185, 108, 0.8)',
            'rgba(150, 128, 130, 0.8)',
          ]
          return colorList[params.dataIndex % colorList.length]
        },
      },
    },
  ],
})
</script>

<template>
  <div class="background" :style="{ backgroundImage: `url(${HOME_BG_URL})` }">
    <Cartoon />
    <div class="content-container">
      <div class="section-title">今日推荐</div>
      <div class="carousel-container">
        <el-carousel trigger="click" height="400px" class="custom-carousel">
          <el-carousel-item v-for="(img, index) in HOME_CAROUSEL" :key="index" class="carousel-item">
            <img :src="img.url" class="carousel-image" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="charts-container">
        <v-chart class="bar-chart" :option="barChartOption" />
        <v-chart class="pie-chart" :option="pieChartOption" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.background {
  width: 100%;

  .content-container {
    width: 1000px;
    margin: 0 auto;

    .section-title {
      font-size: 24px;
      margin-bottom: 15px;
      font-family: 'Heiti', '黑体', sans-serif;
      opacity: 0.6;
      font-weight: bold;
    }

    .carousel-container {
      margin-bottom: 20px;
      background-color: #f5f5f5;

      .custom-carousel {
        width: 100%;

        .carousel-item {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;

          .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;

            // 备选方案
            &.contain-mode {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }

    .charts-container {
      .bar-chart {
        height: 400px;
        margin-top: 20px;
      }

      .pie-chart {
        height: 500px;
      }
    }
  }
}
</style>
