<script setup>
import { ref } from 'vue'
import * as ROUTES from '@/constants/router.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const bannerList = ref([
  {
    id: 1,
    title: '江南好，风景旧曾谙',
    subtitle: '探访江南水乡',
    image: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/tourism/jiangnan.jpg',
    poet: '白居易',
    poem: '江南好，风景旧曾谙。日出江花红胜火，春来江水绿如蓝。',
    location: '苏州园林',
  },
  {
    id: 2,
    title: '黄山归来不看岳',
    subtitle: '徜徉黄山云海',
    image: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/tourism/huangshan.jpg',
    poet: '徐霞客',
    poem: '黄山四千仞，三十二莲峰。丹崖夹石柱，削壁立芙蓉。',
    location: '黄山',
  },
  {
    id: 3,
    title: '万里长江横渡',
    subtitle: '探索三峡人文',
    image: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/tourism/sanxia.jpg',
    poet: '李白',
    poem: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
    location: '三峡',
  },
  {
    id: 4,
    title: '大漠孤烟直',
    subtitle: '丝绸之路探秘',
    image: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/tourism/silk.jpg',
    poet: '王维',
    poem: '大漠孤烟直，长河落日圆。欲穷千里目，更上一层楼。',
    location: '敦煌',
  },
  {
    id: 5,
    title: '庐山天下悠',
    subtitle: '庐山烟雨行',
    image: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/tourism/lushan.jpg',
    poet: '白居易',
    poem: '庐山东南五老峰，青天削出金芙蓉。九江秀色可揽结，吾将此地巢云松。',
    location: '庐山',
  },
])

const handleBannerClick = (item) => {
  // 点击轮播图跳转到对应的景点详情页
  router.push({
    path: ROUTES.TOURISM_SCENERY,
    query: { id: item.id },
  })
}
</script>

<template>
  <div class="banner-container">
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="item in bannerList" :key="item.id" @click="handleBannerClick(item)">
        <div class="banner-content" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-text">
            <h2>{{ item.title }}</h2>
            <p class="subtitle">{{ item.subtitle }}</p>
            <div class="poem-info">
              <span class="poet">{{ item.poet }}</span>
              <p class="poem">{{ item.poem }}</p>
            </div>
            <div class="location">
              <el-tag size="small" effect="dark">{{ item.location }}</el-tag>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped lang="scss">
.banner-container {
  width: 100%;
  padding: 20px 0;
  background: linear-gradient(to bottom, #f8f9fa, #fff);

  .banner-content {
    background-color: #215b87;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    }

    .banner-text {
      position: absolute;
      bottom: 40px;
      left: 40px;
      color: #fff;
      z-index: 1;

      h2 {
        font-size: 32px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .subtitle {
        font-size: 18px;
        margin-bottom: 20px;
        opacity: 0.9;
      }

      .poem-info {
        .poet {
          font-size: 16px;
          margin-bottom: 8px;
          opacity: 0.8;
        }

        .poem {
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.9;
          font-style: italic;
        }
      }
    }
  }
}

:deep(.el-carousel__item) {
  border-radius: 8px;
}

.banner-content {
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }

  .location {
    margin-top: 10px;
  }
}
</style>
