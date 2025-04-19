import { defineStore } from 'pinia'
import { ref } from 'vue'

// 省份拼音到中文的映射
const provincePinyinToChinese = {
  anhui: '安徽',
  beijing: '北京',
  jiangsu: '江苏',
  shanxi: '陕西', 
  sichuan: '四川',
  zhejiang: '浙江',
  chongqing: '重庆', 
  gansu: '甘肃',
  jiangxi: '江西',
  // 如果 scenery.js 中有其他省份，请在此处添加映射
}

// 从 scenery.js 提取的数据（这里仅作示例，实际应从 scenery.js 动态获取或复制）
// 注意：实际应用中，更好的做法可能是动态合并数据，而不是完全覆盖
const sceneryDataFromSceneryJs = [
  // 安徽
  { id: 1, name: '池州', provincePinyin: 'anhui', description: '池州以九华山著称，是佛教名山之一。', relatedPoems: null, location: [117.48, 30.65] }, // 示例坐标：池州市，请核实
  { id: 2, name: '合肥', provincePinyin: 'anhui', description: '合肥是安徽省会，历史悠久。', relatedPoems: null, location: [117.28, 31.86] }, // 示例坐标：合肥市，请核实
  { id: 3, name: '黄山', provincePinyin: 'anhui', description: '黄山以奇松、怪石、云海、温泉"四绝"闻名于世。', relatedPoems: ['望黄山诸峰'], location: [118.17, 30.13] }, // 示例坐标：黄山风景区，请核实
  { id: 4, name: '芜湖', provincePinyin: 'anhui', description: '芜湖为长江重要港口城市。', relatedPoems: null, location: [118.38, 31.33] }, // 示例坐标：芜湖市，请核实
  { id: 5, name: '黟县', provincePinyin: 'anhui', description: '黟县以宏村、西递等古村落著称。', relatedPoems: null, location: [117.93, 29.93] }, // 示例坐标：黟县，请核实 (宏村/西递坐标更精确)
  { id: 6, name: '歙县', provincePinyin: 'anhui', description: '歙县是徽州文化的发源地。', relatedPoems: null, location: [118.45, 29.87] }, // 示例坐标：歙县，请核实
  // 北京
  { id: 7, name: '长城', provincePinyin: 'beijing', description: '长城是世界七大奇迹之一。', relatedPoems: null, location: [116.00, 40.43] }, // 示例坐标：八达岭长城附近，请核实
  { id: 8, name: '故宫', provincePinyin: 'beijing', description: '故宫是中国明清两代的皇家宫殿。', relatedPoems: null, location: [116.397, 39.915] }, // 示例坐标：故宫博物院，请核实
  { id: 9, name: '南锣鼓巷', provincePinyin: 'beijing', description: '南锣鼓巷是北京最古老的街区之一。', relatedPoems: null, location: [116.402, 39.935] }, // 示例坐标：南锣鼓巷，请核实
  { id: 10, name: '鸟巢', provincePinyin: 'beijing', description: '鸟巢是2008年北京奥运会的主体育场。', relatedPoems: null, location: [116.391, 39.992] }, // 示例坐标：国家体育场(鸟巢)，请核实
  { id: 11, name: '天安门', provincePinyin: 'beijing', description: '天安门是中华人民共和国的象征。', relatedPoems: null, location: [116.391, 39.908] }, // 示例坐标：天安门广场，请核实
  { id: 12, name: '天坛', provincePinyin: 'beijing', description: '天坛是明清两代皇帝祭祀皇天的场所。', relatedPoems: null, location: [116.411, 39.882] }, // 示例坐标：天坛公园，请核实
  { id: 13, name: '颐和园', provincePinyin: 'beijing', description: '颐和园是中国清朝时期的皇家园林。', relatedPoems: null, location: [116.275, 39.999] }, // 示例坐标：颐和园，请核实
  { id: 14, name: '圆明园', provincePinyin: 'beijing', description: '圆明园曾是清代著名的皇家园林。', relatedPoems: null, location: [116.307, 40.008] }, // 示例坐标：圆明园遗址公园，请核实
  // 江苏
  { id: 15, name: '南京', provincePinyin: 'jiangsu', description: '南京是六朝古都，历史文化名城。', relatedPoems: ['泊秦淮'], location: [118.79, 32.06] }, // 示例坐标：南京市，请核实
  { id: 16, name: '苏州', provincePinyin: 'jiangsu', description: '苏州以园林和水乡著称。', relatedPoems: ['枫桥夜泊'], location: [120.62, 31.30] }, // 示例坐标：苏州市，请核实
  { id: 17, name: '无锡', provincePinyin: 'jiangsu', description: '无锡有太湖美景和灵山大佛。', relatedPoems: null, location: [120.31, 31.57] }, // 示例坐标：无锡市，请核实
  { id: 18, name: '扬州', provincePinyin: 'jiangsu', description: '扬州以瘦西湖和淮扬菜闻名。', relatedPoems: ['送孟浩然之广陵'], location: [119.42, 32.39] }, // 示例坐标：扬州市，请核实
  { id: 19, name: '镇江', provincePinyin: 'jiangsu', description: '镇江以金山寺等著名景点和镇江香醋闻名。', relatedPoems: ['泊船瓜洲'], location: [119.45, 32.20] }, // 示例坐标：镇江市，请核实
  { id: 20, name: '周庄', provincePinyin: 'jiangsu', description: '周庄是中国第一水乡。', relatedPoems: null, location: [120.84, 31.11] }, // 示例坐标：周庄古镇，请核实
  // 陕西
  { id: 21, name: '宝鸡', provincePinyin: 'shanxi', description: '宝鸡是炎帝故里，青铜器之乡。', relatedPoems: null, location: [107.15, 34.36] }, // 示例坐标：宝鸡市，请核实
  { id: 22, name: '汉中', provincePinyin: 'shanxi', description: '汉中是汉文化的重要发源地。', relatedPoems: null, location: [107.03, 33.07] }, // 示例坐标：汉中市，请核实
  { id: 23, name: '华山', provincePinyin: 'shanxi', description: '华山以险峻著称，是五岳中的西岳。', relatedPoems: ['望岳（西岳华山）'], location: [110.09, 34.48] }, // 示例坐标：华山风景区，请核实
  { id: 24, name: '渭南', provincePinyin: 'shanxi', description: '渭南地处关中平原东部。', relatedPoems: null, location: [109.50, 34.50] }, // 示例坐标：渭南市，请核实
  { id: 25, name: '西安', provincePinyin: 'shanxi', description: '西安是世界四大古都之一。', relatedPoems: ['登观音台望城', '长安晚秋 / 秋望', '长恨歌', '和乐天登慈恩寺塔'], location: [108.95, 34.26] }, // 示例坐标：西安市，请核实
  { id: 26, name: '延安', provincePinyin: 'shanxi', description: '延安是中国革命圣地。', relatedPoems: null, location: [109.49, 36.58] }, // 示例坐标：延安市，请核实
  // 四川
  { id: 27, name: '阿坝', provincePinyin: 'sichuan', description: '欢迎来到阿坝藏族羌族自治州。这里有壮丽的自然风光和独特的民族文化。', relatedPoems: null, location: [102.22, 31.90] }, // 示例坐标：阿坝州，请核实
  { id: 28, name: '川西', provincePinyin: 'sichuan', description: '川西高原风光旖旎，是摄影和自驾爱好者的天堂。', relatedPoems: ['蜀道难'], location: [101.5, 30.5] }, // 示例坐标：川西高原大致区域，请核实
  { id: 29, name: '稻城', provincePinyin: 'sichuan', description: '稻城亚丁被誉为“蓝色星球上的最后一片净土”。', relatedPoems: null, location: [100.30, 29.03] }, // 示例坐标：稻城亚丁风景区，请核实
  { id: 30, name: '峨眉山', provincePinyin: 'sichuan', description: '峨眉山是中国四大佛教名山之一。', relatedPoems: ['登峨眉山'], location: [103.33, 29.52] }, // 示例坐标：峨眉山风景区，请核实
  { id: 31, name: '九寨沟', provincePinyin: 'sichuan', description: '九寨沟以其碧蓝的湖水、叠瀑、彩林和雪山闻名于世。', relatedPoems: null, location: [103.91, 33.25] }, // 示例坐标：九寨沟风景区，请核实
  // 浙江
  { id: 32, name: '东栅', provincePinyin: 'zhejiang', description: '乌镇东栅保留了原汁原味的江南水乡风貌和民俗文化。', relatedPoems: null, location: [120.50, 30.74] }, // 示例坐标：乌镇东栅，请核实
  { id: 33, name: '杭州', provincePinyin: 'zhejiang', description: '杭州以西湖闻名，是历史文化名城。', relatedPoems: ['饮湖上初晴后雨二首·其二', '钱塘湖春行'], location: [120.15, 30.27] }, // 示例坐标：杭州市，请核实 (西湖坐标略有不同)
  { id: 34, name: '宁波', provincePinyin: 'zhejiang', description: '宁波是历史悠久的港口城市，文化底蕴深厚。', relatedPoems: null, location: [121.54, 29.86] }, // 示例坐标：宁波市，请核实
  { id: 35, name: '绍兴', provincePinyin: 'zhejiang', description: '绍兴是著名的水乡、桥乡、酒乡、书法之乡、名士之乡。', relatedPoems: null, location: [120.58, 29.99] }, // 示例坐标：绍兴市，请核实
  { id: 36, name: '乌镇', provincePinyin: 'zhejiang', description: '乌镇是典型的江南水乡古镇。', relatedPoems: null, location: [120.49, 30.74] }, // 示例坐标：乌镇，请核实
  { id: 37, name: '西塘', provincePinyin: 'zhejiang', description: '西塘古镇以桥多、弄多、廊棚多而闻名。', relatedPoems: null, location: [120.90, 30.94] }, // 示例坐标：西塘古镇，请核实
  { id: 38, name: '舟山', provincePinyin: 'zhejiang', description: '舟山是中国唯一的群岛地级市，以渔业和佛教圣地普陀山闻名。', relatedPoems: null, location: [122.10, 30.00] }, // 示例坐标：舟山市，请核实 (普陀山坐标更精确)
  // 其他来自 scenery.js 的景点
  { id: 39, name: '苏州园林', provincePinyin: 'jiangsu', description: '苏州园林是中国古典园林的代表...', relatedPoems: ['咏苏州园林', '题拙政园'], location: [120.62, 31.32] }, // 示例坐标：苏州园林大致区域，请核实
  { id: 40, name: '黄山详览', provincePinyin: 'anhui', description: '黄山位于安徽省南部...', relatedPoems: ['登黄山', '题黄山'], location: [118.17, 30.13] }, // 示例坐标：黄山风景区，请核实
  { id: 41, name: '三峡', provincePinyin: 'chongqing', description: '长江三峡是长江上游段的瞿塘峡...', relatedPoems: ['早发白帝城', '巫山高'], location: [109.56, 31.04] }, // 示例坐标：三峡大致区域（瞿塘峡口），请核实
  { id: 42, name: '敦煌', provincePinyin: 'gansu', description: '敦煌位于甘肃省西部...', relatedPoems: ['使至塞上', '敦煌怀古'], location: [94.66, 40.14] }, // 示例坐标：敦煌市，请核实 (莫高窟坐标更精确)
  { id: 43, name: '庐山', provincePinyin: 'jiangxi', description: '庐山位于江西省九江市...', relatedPoems: ['题西林壁', '望庐山瀑布'], location: [115.97, 29.57] }, // 示例坐标：庐山风景区，请核实

]

export const useMapDataSceneryStore = defineStore('mapDataScenery', () => {
  // 使用 ref 定义 state，并基于 sceneryDataFromSceneryJs 生成
  const mapSceneryList = ref(
    sceneryDataFromSceneryJs.map(item => ({
      id: item.id,
      name: item.name,
      province: item.province || provincePinyinToChinese[item.provincePinyin] || '未知省份', // 优先使用已有的中文省份，否则进行转换
      // {{ 使用提供的坐标，无论是示例还是占位符 }}
      location: item.location || [108.0, 34.0], // 如果没有提供坐标，则使用默认占位符
      description: item.description || `关于 ${item.name} 的诗意描述...`, // 使用已有描述或生成占位符
      relatedPoems: item.relatedPoems || [], // 使用已有诗词或空数组
    }))
  )

  // Getter: 获取所有地图景点数据
  const getAllMapScenery = () => {
    return mapSceneryList.value
  }

  // 可以添加根据省份或其他条件筛选的 Getter
  const getMapSceneryByProvince = (province) => {
    if (!province || province === 'all') {
      // 返回所有数据，但确保每个省份最多只有 N 个（如果需要此逻辑）
      // 如果不需要限制数量，直接返回 mapSceneryList.value
      const limitedList = []
      const provinceCounts = {}
      const MARKERS_PER_PROVINCE = 3 // 可以从外部传入或在此定义
      mapSceneryList.value.forEach(item => {
        const provinceKey = item.province
        if (!provinceCounts[provinceKey]) {
          provinceCounts[provinceKey] = 0
        }
        if (provinceCounts[provinceKey] < MARKERS_PER_PROVINCE) {
          limitedList.push(item)
          provinceCounts[provinceKey]++
        }
      })
      return limitedList
      // return mapSceneryList.value; // 如果不需要限制数量
    }
    // {{ 确保比较时使用中文省份名 }}
    return mapSceneryList.value.filter(item => item.province === province)
  }


  // 返回 state 和 getters/actions
  return {
    mapSceneryList,
    getAllMapScenery,
    getMapSceneryByProvince,
  }
})