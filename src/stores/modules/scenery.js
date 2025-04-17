import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSceneryStore = defineStore('scenery', () => {
  // 所有景点数据
  const allScenery = ref([
    {
      id: 1,
      name: '苏州园林',
      image: 'https://example.com/suzhou.jpg',
      location: '江苏·苏州',
      poem: '吴地能种树，园林半是家。',
      poet: '杜甫',
      description: '苏州园林以其精致典雅的园林艺术闻名于世，是中国古典园林的代表作品。',
      tags: ['园林', '江南风光', '世界遗产'],
      province: 'jiangsu',
    },
    {
      id: 2,
      name: '西湖',
      image: 'https://example.com/xihu.jpg',
      location: '浙江·杭州',
      poem: '欲把西湖比西子，淡妆浓抹总相宜。',
      poet: '苏轼',
      description: '杭州西湖景区融自然与人文景观于一体，是中国最著名的观光胜地之一。',
      tags: ['湖泊', '自然景观', '世界遗产'],
      province: 'zhejiang',
    },
    {
      id: 3,
      name: '黄山',
      image: 'https://example.com/huangshan.jpg',
      location: '安徽·黄山',
      poem: '黄山四千仞，三十二莲峰。',
      poet: '李白',
      description: '黄山以奇松、怪石、云海、温泉"四绝"闻名于世，被誉为"天下第一奇山"。',
      tags: ['山岳', '自然景观', '世界遗产'],
      province: 'anhui',
    },
    {
      id: 4,
      name: '故宫',
      image: 'https://example.com/gugong.jpg',
      location: '北京',
      poem: '紫禁城中秋月明，菊花香露湿流萤。',
      poet: '李商隐',
      description: '故宫是中国明清两代的皇家宫殿，是中国古代宫廷建筑的精华。',
      tags: ['古建筑', '历史遗迹', '世界遗产'],
      province: 'beijing',
    },
    {
      id: 5,
      name: '九寨沟',
      image: 'https://example.com/jiuzhaigou.jpg',
      location: '四川·阿坝',
      poem: '翠湖碧波映山色，彩林红叶舞秋风。',
      poet: '现代',
      description: '九寨沟以其碧蓝的湖水、叠瀑、彩林和雪山闻名于世，被誉为"人间仙境"。',
      tags: ['自然景观', '湖泊', '世界遗产'],
      province: 'sichuan',
    },
    {
      id: 6,
      name: '武陵源',
      image: 'https://example.com/wulingyuan.jpg',
      location: '湖南·张家界',
      poem: '峰林倒影入潭中，山色空蒙雨亦空。',
      poet: '现代',
      description: '张家界以其独特的石英砂岩峰林地貌闻名，是《阿凡达》外景地的灵感来源。',
      tags: ['自然景观', '山岳', '世界遗产'],
      province: 'hunan',
    },
    {
      id: 7,
      name: '泰山',
      image: 'https://example.com/taishan.jpg',
      location: '山东·泰安',
      poem: '会当凌绝顶，一览众山小。',
      poet: '杜甫',
      description: '泰山是中国五岳之首，以其雄伟的气势和深厚的文化底蕴著称。',
      tags: ['山岳', '文化遗产', '世界遗产'],
      province: 'shandong',
    },
    {
      id: 8,
      name: '龙门石窟',
      image: 'https://example.com/longmen.jpg',
      location: '河南·洛阳',
      poem: '石窟千龛佛，雕刻万象新。',
      poet: '现代',
      description: '龙门石窟是中国石窟艺术的巅峰之作，展现了盛唐时期的雕刻艺术。',
      tags: ['石窟', '佛教文化', '世界遗产'],
      province: 'henan',
    },
    {
      id: 9,
      name: '丽江古城',
      image: 'https://example.com/lijiang.jpg',
      location: '云南·丽江',
      poem: '玉龙雪山云缭绕，纳西古城水潺潺。',
      poet: '现代',
      description: '丽江古城是纳西族的传统聚居地，以其独特的民族特色和古城风貌闻名。',
      tags: ['古城', '民族文化', '世界遗产'],
      province: 'yunnan',
    },
    {
      id: 10,
      name: '莫高窟',
      image: 'https://example.com/mogao.jpg',
      location: '甘肃·敦煌',
      poem: '大漠孤烟直，长河落日圆。',
      poet: '王维',
      description: '莫高窟是世界上现存规模最大、内容最丰富的佛教艺术圣地。',
      tags: ['石窟', '丝绸之路', '世界遗产'],
      province: 'gansu',
    },
  ])

  // 按省份分类的景点
  const sceneryByProvince = computed(() => {
    const map = {}
    allScenery.value.forEach(item => {
      if (!map[item.province]) map[item.province] = []
      map[item.province].push(item)
    })
    return map
  })

  // 获取全部景点
  const getAllScenery = computed(() => allScenery.value)

  // 获取指定省份的景点
  const getSceneryByProvince = (province) => {
    if (province === 'all') return allScenery.value
    return sceneryByProvince.value[province] || []
  }

  return {
    allScenery,
    sceneryByProvince,
    getAllScenery,
    getSceneryByProvince,
  }
})