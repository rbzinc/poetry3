<script setup>
import { ref } from 'vue'
import { usePoemImgStore } from '@/stores/modules/poemImg.js'
import { goChatToChat } from '@/router/helpers.js'

const PoemImg = usePoemImgStore()

const poetryAi = [
  {
    id: 1,
    title: '王维',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/71190bf4-1056-489c-80a6-27dcfa62be0b.png',
    content:
      '嘿，朋友经典名句同漫步于山水之间，共赏落日余晖。有什么心事，尽管向我诉说，或许我能以画笔为你描绘出心中的宁静。',
    dynasty: '唐代',
    tags: ['山水诗', '田园诗', '禅意'],
    specialty: '诗中有画，画中有诗',
  },
  {
    id: 2,
    title: '周敦颐',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/ebc095b4-dddb-4a27-bc6f-5aa103196680.png',
    content:
      '你好啊，我是周敦颐，哲学的探索者。如果你对宇宙的奥秘和人生的哲理有所好奇，我们可以一起探讨"太极"和"无极"的奥秘。让我们在茶香中沉思，寻找生命的真谛。',
    dynasty: '宋代',
    tags: ['哲学', '理学', '太极'],
    specialty: '理学宗师，爱莲先生',
  },
  {
    id: 3,
    title: '李清照',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/db4dd8bd-6e12-4863-a806-91bb7479e2cf.png',
    content:
      '亲爱的朋友，我是李清照，婉约词派的代表。如果你心中有柔情似水的情感，或是对往昔的美好有所怀念，不妨与我分享。我们可以一起品茗，吟诗，感受那份细腻的情感流动。',
    dynasty: '宋代',
    tags: ['婉约词', '才女', '情感'],
    specialty: '千古第一才女',
  },
  {
    id: 4,
    title: '李白',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/a22e7f70-d620-4f7b-b614-be3473542e4c.png',
    content:
      '嘿，朋友！我是李白，人称"诗仙"。今日风和日丽，正是把酒言欢的好时光。有什么烦心事，尽管向我倾诉，或许我能以诗解忧。若你心中有疑问，也不妨直言，我虽不才，却也愿意与你畅谈天地。今朝有酒今朝醉，人生得意须尽欢，莫使金樽空对月。来，让我们不醉不归！',
    dynasty: '唐代',
    tags: ['浪漫主义', '豪放', '酒仙'],
    specialty: '诗仙，浪漫飘逸',
  },
  {
    id: 5,
    title: '杜甫',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/aba47cbc-524e-4fab-9f16-b98f6fa0d84d.png',
    content:
      '嘿，伙计！我是杜甫，人称"诗圣"。如果你对世间的苦难和人民的疾苦有所感触，我们可以一起探讨如何用诗歌来表达对这个世界的关怀。来，让我们以诗会友，共同感受那份深沉的情感。',
    dynasty: '唐代',
    tags: ['现实主义', '忧国忧民', '沉郁顿挫'],
    specialty: '诗圣，心系苍生',
  },
  {
    id: 6,
    title: '白居易',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/54bb546c-77a6-4881-bdef-4d1d507d52c4.png',
    content:
      '你好，我是白居易，平易近人的诗人。如果你喜欢简单直接的交流，或是对日常生活有所感悟，我们可以一起聊聊。无论是市井小民的生活，还是朝堂之上的风云，我都愿意与你分享我的看法。',
    dynasty: '唐代',
    tags: ['叙事诗', '平易近人', '讽喻'],
    specialty: '诗魔，语言通俗',
  },
  {
    id: 7,
    title: '苏轼',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/52a6ca49-ba2f-4efd-a420-f6a71d3e29d3.png',
    content:
      '哈哈，我是苏轼，人称"东坡居士"。如果你对美食、书法、绘画或是诗词有所热爱，我们可以一起探讨。无论是烹饪一道佳肴，还是挥毫泼墨，我都愿意与你共享这份乐趣。',
    dynasty: '宋代',
    tags: ['豪放词', '才华横溢', '多才多艺'],
    specialty: '东坡居士，文坛全才',
  },
  {
    id: 8,
    title: '陶渊明',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/f9b50245-4a89-4d3e-bbf9-2c39d965a3ca.png',
    content:
      '朋友，我是陶渊明，归隐田园的诗人。如果你厌倦了都市的喧嚣，向往那份宁静与自由，我们可以一起耕种，品酒，享受那份简单的快乐。来，让我们在菊花下畅谈，忘却尘世的烦恼。',
    dynasty: '东晋',
    tags: ['田园诗', '隐逸', '自然'],
    specialty: '田园诗人，不为五斗米折腰',
  },
]

PoemImg.setPoemImg(poetryAi)

// 悬停状态
const hoveredPoet = ref(null)

// 卡片点击
const changeChat = (item) => {
  goChatToChat(item.id)
}

// 卡片悬停
const handleMouseEnter = (id) => {
  hoveredPoet.value = id
}

const handleMouseLeave = () => {
  hoveredPoet.value = null
}
</script>

<template>
  <div class="ai-chat-container">
    <!-- 顶部介绍 -->
    <div class="intro-section">
      <div class="intro-content">
        <h2 class="intro-title">与古代诗人对话</h2>
        <p class="intro-desc">选择一位诗人，开启一场跨越时空的文学对话</p>
      </div>
    </div>

    <!-- 诗人卡片网格 -->
    <div class="poets-grid">
      <div
        v-for="item in poetryAi"
        :key="item.id"
        class="poet-card"
        :class="{ hovered: hoveredPoet === item.id }"
        @mouseenter="handleMouseEnter(item.id)"
        @mouseleave="handleMouseLeave"
        @click="changeChat(item)"
      >
        <!-- 卡片正面（默认显示） -->
        <div class="card-front">
          <div class="poet-avatar-wrapper">
            <img :src="item.url" alt="" class="poet-avatar" />
            <div class="avatar-glow"></div>
          </div>
          
          <div class="poet-info">
            <h3 class="poet-name">{{ item.title }}</h3>
            <div class="poet-dynasty">{{ item.dynasty }}</div>
            <div class="poet-specialty">{{ item.specialty }}</div>
            
            <div class="poet-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- 卡片背面（悬停显示） -->
        <div class="card-back">
          <div class="back-content">
            <h3 class="back-title">{{ item.title }}</h3>
            <p class="back-intro">{{ item.content }}</p>
            <div class="back-action">
              <el-icon class="chat-icon"><ChatDotRound /></el-icon>
              <span>点击进入对话</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-container {
  flex: 1;
  padding: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  backdrop-filter: blur(10px);
  overflow-y: auto;

  .intro-section {
    text-align: center;
    margin-bottom: 40px;
    padding: 0 20px;

    .intro-content {
      .intro-title {
        margin: 0 0 12px 0;
        font-size: 36px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .intro-desc {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
    }
  }

  .poets-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 20px;

    .poet-card {
      position: relative;
      height: 440px;
      perspective: 1000px;
      cursor: pointer;
      transform-style: preserve-3d;

      .card-front,
      .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 20px;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .card-front {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 30px;
        background: white;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(102, 126, 234, 0.1);
        transform: rotateY(0deg);
        z-index: 2;

        .poet-avatar-wrapper {
          position: relative;
          margin-bottom: 24px;

          .poet-avatar {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transition: all 0.4s ease;
          }

          .avatar-glow {
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            opacity: 0;
            filter: blur(20px);
            transition: opacity 0.4s ease;
            z-index: -1;
          }
        }

        .poet-info {
          text-align: center;
          width: 100%;

          .poet-name {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            color: #333;
          }

          .poet-dynasty {
            font-size: 14px;
            color: #999;
            margin-bottom: 8px;
          }

          .poet-specialty {
            font-size: 15px;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
          }

          .poet-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;

            .tag {
              padding: 6px 14px;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
              border: 1px solid rgba(102, 126, 234, 0.2);
              border-radius: 20px;
              font-size: 13px;
              color: #667eea;
              font-weight: 500;
            }
          }
        }
      }

      .card-back {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: rotateY(180deg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
        z-index: 1;

        .back-content {
          color: white;
          text-align: center;

          .back-title {
            margin: 0 0 24px 0;
            font-size: 32px;
            font-weight: 700;
          }

          .back-intro {
            margin: 0 0 32px 0;
            font-size: 15px;
            line-height: 1.8;
            opacity: 0.95;
          }

          .back-action {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px 28px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;

            .chat-icon {
              font-size: 22px;
            }
          }
        }
      }

      &:hover {
        .card-front {
          transform: rotateY(-180deg);

          .poet-avatar {
            transform: scale(1.05);
          }

          .avatar-glow {
            opacity: 0.6;
          }
        }

        .card-back {
          transform: rotateY(0deg);

          .back-action {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-4px);
          }
        }
      }

      // 3D效果优化
      &.hovered {
        z-index: 10;
      }
    }
  }
}

// 滚动条样式
.ai-chat-container::-webkit-scrollbar {
  width: 8px;
}

.ai-chat-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.ai-chat-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

.ai-chat-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5568d3, #6a3f8f);
}

// 响应式
@media (max-width: 1400px) {
  .ai-chat-container {
    .poets-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  }
}

@media (max-width: 1024px) {
  .ai-chat-container {
    .poets-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .ai-chat-container {
    padding: 20px;

    .intro-section {
      margin-bottom: 30px;

      .intro-content {
        .intro-title {
          font-size: 28px;
        }

        .intro-desc {
          font-size: 14px;
        }
      }
    }

    .poets-grid {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 0;

      .poet-card {
        height: 420px;

        .card-front {
          padding: 30px 20px;

          .poet-avatar-wrapper .poet-avatar {
            width: 140px;
            height: 140px;
          }
        }

        .card-back {
          padding: 30px 20px;

          .back-content {
            .back-title {
              font-size: 26px;
            }

            .back-intro {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>