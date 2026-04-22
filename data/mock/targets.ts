/**
 * MVP 核心 Mock 数据层
 * 12 个监控对象，覆盖 IP / 艺人 / 合作案例三类 × 6 个行业
 * 每个对象包含 30 天趋势数据、社媒指标、商业指标、风险事件
 */

import { MonitoringTarget } from "@/types";
import { generateTrend, calcStabilityFromTrend } from "@/lib/evaluation/generator";

const today = new Date().toISOString();

// ============================================================
// IP 类（4个）
// ============================================================

const t1Trend = generateTrend({
  baseVolume: 45000,
  baseHeat: 92,
  baseSentiment: 0.55,
  volatility: 0.15,
  direction: "flat",
  spikeDay: 15,
  spikeMultiplier: 2.2,
});

const t2Trend = generateTrend({
  baseVolume: 28000,
  baseHeat: 78,
  baseSentiment: 0.25,
  volatility: 0.35,
  direction: "flat",
  spikeDay: 8,
  spikeMultiplier: 1.8,
});

const t3Trend = generateTrend({
  baseVolume: 8500,
  baseHeat: 58,
  baseSentiment: -0.15,
  volatility: 0.4,
  direction: "down",
});

const t4Trend = generateTrend({
  baseVolume: 52000,
  baseHeat: 91,
  baseSentiment: 0.6,
  volatility: 0.18,
  direction: "up",
  spikeDay: 22,
  spikeMultiplier: 2.0,
});

// ============================================================
// 艺人类（4个）
// ============================================================

const t5Trend = generateTrend({
  baseVolume: 38000,
  baseHeat: 89,
  baseSentiment: 0.65,
  volatility: 0.12,
  direction: "flat",
  spikeDay: 10,
  spikeMultiplier: 1.6,
});

const t6Trend = generateTrend({
  baseVolume: 22000,
  baseHeat: 72,
  baseSentiment: 0.1,
  volatility: 0.3,
  direction: "flat",
});

const t7Trend = generateTrend({
  baseVolume: 31000,
  baseHeat: 81,
  baseSentiment: 0.45,
  volatility: 0.2,
  direction: "up",
  spikeDay: 18,
  spikeMultiplier: 1.7,
});

const t8Trend = generateTrend({
  baseVolume: 18000,
  baseHeat: 68,
  baseSentiment: -0.25,
  volatility: 0.38,
  direction: "down",
  spikeDay: 5,
  spikeMultiplier: 2.5,
});

// ============================================================
// 合作案例类（4个）
// ============================================================

const t9Trend = generateTrend({
  baseVolume: 85000,
  baseHeat: 95,
  baseSentiment: 0.7,
  volatility: 0.45,
  direction: "up",
  spikeDay: 3,
  spikeMultiplier: 3.0,
});

const t10Trend = generateTrend({
  baseVolume: 62000,
  baseHeat: 90,
  baseSentiment: 0.72,
  volatility: 0.2,
  direction: "flat",
  spikeDay: 12,
  spikeMultiplier: 1.9,
});

const t11Trend = generateTrend({
  baseVolume: 35000,
  baseHeat: 76,
  baseSentiment: 0.15,
  volatility: 0.32,
  direction: "down",
  spikeDay: 7,
  spikeMultiplier: 1.6,
});

const t12Trend = generateTrend({
  baseVolume: 42000,
  baseHeat: 74,
  baseSentiment: -0.35,
  volatility: 0.42,
  direction: "down",
  spikeDay: 14,
  spikeMultiplier: 2.8,
});

export const mockTargets: MonitoringTarget[] = [
  // ---------- IP: 熊猫阿宝（潮玩，高热稳定） ----------
  {
    id: "tgt-001",
    name: "熊猫阿宝",
    category: "ip",
    industry: "toy",
    description:
      "国民级潮玩IP，以萌系熊猫形象为核心，覆盖衍生品、品牌联名、主题快闪等多领域，粉丝画像横跨Z世代至亲子家庭。",
    social: {
      volume: 45000,
      exposure: 1200000,
      engagement: 180000,
      heatScore: 92,
      followers: 28000000,
      mediaCount: 3400,
    },
    sentiment: {
      positiveRatio: 0.75,
      neutralRatio: 0.2,
      negativeRatio: 0.05,
      stabilityScore: calcStabilityFromTrend(t1Trend),
      avgCommentRating: 4.5,
    },
    business: {
      salesLift: 35,
      gmv: 120000000,
      conversionRate: 0.085,
      avgOrderValue: 89,
      roi: 3.2,
    },
    riskEvents: [],
    cooperationHistory: [
      { brandName: "茶颜悦色", type: "联名", date: "2024-06-01", effectScore: 88 },
      { brandName: "肯德基", type: "跨界", date: "2024-09-01", effectScore: 85 },
      { brandName: "安踏儿童", type: "授权", date: "2023-11-11", effectScore: 82 },
    ],
    trend: t1Trend,
    updatedAt: today,
  },

  // ---------- IP: 星际游侠（3C游戏，中热波动，定价争议） ----------
  {
    id: "tgt-002",
    name: "星际游侠",
    category: "ip",
    industry: "3c",
    description:
      "硬核科幻射击游戏IP，核心用户为18-30岁男性玩家，电竞属性强，但近期联名外设定价引发玩家争议。",
    social: {
      volume: 28000,
      exposure: 720000,
      engagement: 95000,
      heatScore: 78,
      followers: 15000000,
      mediaCount: 2100,
    },
    sentiment: {
      positiveRatio: 0.6,
      neutralRatio: 0.25,
      negativeRatio: 0.15,
      stabilityScore: calcStabilityFromTrend(t2Trend),
      avgCommentRating: 3.8,
    },
    business: {
      salesLift: 18,
      gmv: 60000000,
      conversionRate: 0.052,
      avgOrderValue: 320,
      roi: 2.1,
    },
    riskEvents: [
      {
        id: "risk-002-1",
        title: "联名外设定价过高引发玩家不满",
        date: "2024-02-15",
        severity: "medium",
        category: "negative_opinion",
        description:
          "玩家认为联名键盘鼠标套装定价较普通款溢价80%，NGA/贴吧出现集中吐槽帖。",
        resolved: false,
      },
    ],
    cooperationHistory: [
      { brandName: "雷蛇", type: "联名外设", date: "2024-01-15", effectScore: 72 },
      { brandName: "ROG", type: "电竞赛事", date: "2023-08-20", effectScore: 80 },
    ],
    trend: t2Trend,
    updatedAt: today,
  },

  // ---------- IP: 青瓷物语（文旅非遗，低热，文化挪用争议） ----------
  {
    id: "tgt-003",
    name: "青瓷物语",
    category: "ip",
    industry: "travel",
    description:
      "以龙泉青瓷非遗文化为灵感的人文IP，主打东方美学与慢生活调性，受众偏文艺青年与中高消费人群。",
    social: {
      volume: 8500,
      exposure: 210000,
      engagement: 28000,
      heatScore: 58,
      followers: 3200000,
      mediaCount: 680,
    },
    sentiment: {
      positiveRatio: 0.45,
      neutralRatio: 0.3,
      negativeRatio: 0.25,
      stabilityScore: calcStabilityFromTrend(t3Trend),
      avgCommentRating: 3.2,
    },
    business: {
      salesLift: 8,
      gmv: 12000000,
      conversionRate: 0.032,
      avgOrderValue: 158,
      roi: 1.4,
    },
    riskEvents: [
      {
        id: "risk-003-1",
        title: "联名设计被质疑文化挪用",
        date: "2024-07-22",
        severity: "high",
        category: "controversy",
        description:
          "小红书出现多篇笔记质疑某茶饮联名未能准确传达非遗文化内涵，设计师背景引发争议。",
        resolved: false,
      },
    ],
    cooperationHistory: [
      { brandName: "喜茶", type: "联名", date: "2024-07-01", effectScore: 45 },
      { brandName: "故宫文创", type: "授权", date: "2023-05-10", effectScore: 78 },
    ],
    trend: t3Trend,
    updatedAt: today,
  },

  // ---------- IP: 魔法少女小圆（美妆动漫，高热上升） ----------
  {
    id: "tgt-004",
    name: "魔法少女小圆",
    category: "ip",
    industry: "beauty",
    description:
      "日系魔法少女动画IP，凭借精致画风与暗黑剧情在二次元圈层拥有极高黏性，近期因美妆联名破圈。",
    social: {
      volume: 52000,
      exposure: 1500000,
      engagement: 260000,
      heatScore: 91,
      followers: 21000000,
      mediaCount: 4200,
    },
    sentiment: {
      positiveRatio: 0.78,
      neutralRatio: 0.18,
      negativeRatio: 0.04,
      stabilityScore: calcStabilityFromTrend(t4Trend),
      avgCommentRating: 4.6,
    },
    business: {
      salesLift: 42,
      gmv: 180000000,
      conversionRate: 0.095,
      avgOrderValue: 128,
      roi: 3.8,
    },
    riskEvents: [],
    cooperationHistory: [
      { brandName: "花西子", type: "联名彩妆", date: "2024-03-08", effectScore: 91 },
      { brandName: "完美日记", type: "限定礼盒", date: "2023-12-12", effectScore: 86 },
    ],
    trend: t4Trend,
    updatedAt: today,
  },

  // ---------- 艺人: 林小夏（美妆时尚，高热稳定） ----------
  {
    id: "tgt-005",
    name: "林小夏",
    category: "celebrity",
    industry: "beauty",
    description:
      "95后女演员，以清冷气质与高级感穿搭出圈，社交媒体种草能力强，女性粉丝占比超75%。",
    social: {
      volume: 38000,
      exposure: 980000,
      engagement: 210000,
      heatScore: 89,
      followers: 12000000,
      mediaCount: 2900,
    },
    sentiment: {
      positiveRatio: 0.82,
      neutralRatio: 0.14,
      negativeRatio: 0.04,
      stabilityScore: calcStabilityFromTrend(t5Trend),
      avgCommentRating: 4.7,
    },
    business: {
      salesLift: 28,
      gmv: 250000000,
      conversionRate: 0.068,
      avgOrderValue: 420,
      roi: 4.5,
    },
    riskEvents: [],
    cooperationHistory: [
      { brandName: "兰蔻", type: "全球代言", date: "2024-03-01", effectScore: 92 },
      { brandName: "周大福", type: "品牌大使", date: "2023-09-15", effectScore: 85 },
      { brandName: "FILA", type: "联名款", date: "2023-06-01", effectScore: 80 },
    ],
    trend: t5Trend,
    updatedAt: today,
  },

  // ---------- 艺人: 张浩然（3C科技，中热，曾涉代言争议） ----------
  {
    id: "tgt-006",
    name: "张浩然",
    category: "celebrity",
    industry: "3c",
    description:
      "科技测评博主转型的艺人，直男审美与硬核风格吸引大量3C受众，但曾因某品牌代言措辞不当引发风波。",
    social: {
      volume: 22000,
      exposure: 580000,
      engagement: 78000,
      heatScore: 72,
      followers: 8500000,
      mediaCount: 1600,
    },
    sentiment: {
      positiveRatio: 0.58,
      neutralRatio: 0.28,
      negativeRatio: 0.14,
      stabilityScore: calcStabilityFromTrend(t6Trend),
      avgCommentRating: 3.6,
    },
    business: {
      salesLift: 15,
      gmv: 45000000,
      conversionRate: 0.045,
      avgOrderValue: 580,
      roi: 2.0,
    },
    riskEvents: [
      {
        id: "risk-006-1",
        title: "代言品牌夸大宣传用词被点名",
        date: "2024-01-10",
        severity: "medium",
        category: "legal",
        description:
          "代言的某智能音箱品牌广告中使用了极限词，张浩然作为代言人被市场监管部门提醒。",
        resolved: true,
      },
    ],
    cooperationHistory: [
      { brandName: "小米", type: "产品体验官", date: "2024-02-20", effectScore: 75 },
      { brandName: "一加", type: "发布会嘉宾", date: "2023-12-05", effectScore: 70 },
    ],
    trend: t6Trend,
    updatedAt: today,
  },

  // ---------- 艺人: 苏悦（食品饮料，中高热度稳步上升） ----------
  {
    id: "tgt-007",
    name: "苏悦",
    category: "celebrity",
    industry: "food",
    description:
      "元气系女歌手，综艺感强，路人缘极佳，代言的食品饮料品牌多出现「同款断货」现象。",
    social: {
      volume: 31000,
      exposure: 860000,
      engagement: 165000,
      heatScore: 81,
      followers: 9500000,
      mediaCount: 2400,
    },
    sentiment: {
      positiveRatio: 0.72,
      neutralRatio: 0.2,
      negativeRatio: 0.08,
      stabilityScore: calcStabilityFromTrend(t7Trend),
      avgCommentRating: 4.3,
    },
    business: {
      salesLift: 32,
      gmv: 80000000,
      conversionRate: 0.078,
      avgOrderValue: 68,
      roi: 3.5,
    },
    riskEvents: [],
    cooperationHistory: [
      { brandName: "伊利", type: "品牌代言", date: "2024-05-01", effectScore: 88 },
      { brandName: "三只松鼠", type: "联名礼盒", date: "2023-11-11", effectScore: 85 },
    ],
    trend: t7Trend,
    updatedAt: today,
  },

  // ---------- 艺人: 王凯（服饰运动，中热下滑，合同纠纷） ----------
  {
    id: "tgt-008",
    name: "王凯",
    category: "celebrity",
    industry: "fashion",
    description:
      "前职业运动员转型的时尚偶像，早期运动品牌代言效果显著，但近期陷入前经纪公司合同纠纷，舆情走低。",
    social: {
      volume: 18000,
      exposure: 420000,
      engagement: 52000,
      heatScore: 68,
      followers: 7600000,
      mediaCount: 1300,
    },
    sentiment: {
      positiveRatio: 0.48,
      neutralRatio: 0.3,
      negativeRatio: 0.22,
      stabilityScore: calcStabilityFromTrend(t8Trend),
      avgCommentRating: 3.1,
    },
    business: {
      salesLift: 10,
      gmv: 35000000,
      conversionRate: 0.038,
      avgOrderValue: 298,
      roi: 1.6,
    },
    riskEvents: [
      {
        id: "risk-008-1",
        title: "与前经纪公司合同纠纷曝光",
        date: "2024-06-20",
        severity: "high",
        category: "legal",
        description:
          "前经纪公司发长文指控王凯违约跳槽，涉及代言分成争议，话题登上微博热搜前三。",
        resolved: false,
      },
      {
        id: "risk-008-2",
        title: "粉丝后援会管理层内讧",
        date: "2024-07-05",
        severity: "medium",
        category: "controversy",
        description: "粉丝后援会账目问题引发内部撕扯，部分大粉脱粉回踩。",
        resolved: false,
      },
    ],
    cooperationHistory: [
      { brandName: "李宁", type: "代言", date: "2023-03-01", effectScore: 82 },
      { brandName: "特步", type: "联名", date: "2022-09-10", effectScore: 75 },
    ],
    trend: t8Trend,
    updatedAt: today,
  },

  // ---------- 合作: 茶颜悦色 × 熊猫阿宝（食品饮料，爆发型） ----------
  {
    id: "tgt-009",
    name: "茶颜悦色 × 熊猫阿宝",
    category: "cooperation",
    industry: "food",
    description:
      "2024年夏季限定联名，推出主题杯、盲袋周边与线下快闪店，首日多城售罄，社交媒体讨论量破亿。",
    social: {
      volume: 85000,
      exposure: 2800000,
      engagement: 420000,
      heatScore: 95,
      mediaCount: 5600,
    },
    sentiment: {
      positiveRatio: 0.8,
      neutralRatio: 0.15,
      negativeRatio: 0.05,
      stabilityScore: calcStabilityFromTrend(t9Trend),
      avgCommentRating: 4.4,
    },
    business: {
      salesLift: 35,
      gmv: 120000000,
      conversionRate: 0.12,
      avgOrderValue: 45,
      roi: 3.0,
    },
    riskEvents: [],
    cooperationHistory: [],
    trend: t9Trend,
    updatedAt: today,
  },

  // ---------- 合作: 兰蔻 × 林小夏（美妆，长期高效果） ----------
  {
    id: "tgt-010",
    name: "兰蔻 × 林小夏",
    category: "cooperation",
    industry: "beauty",
    description:
      "年度全球代言人合作，覆盖护肤线与彩妆线，广告片在短视频平台引发模仿潮，天猫旗舰店多次断货。",
    social: {
      volume: 62000,
      exposure: 2100000,
      engagement: 310000,
      heatScore: 90,
      mediaCount: 4100,
    },
    sentiment: {
      positiveRatio: 0.85,
      neutralRatio: 0.12,
      negativeRatio: 0.03,
      stabilityScore: calcStabilityFromTrend(t10Trend),
      avgCommentRating: 4.6,
    },
    business: {
      salesLift: 28,
      gmv: 250000000,
      conversionRate: 0.095,
      avgOrderValue: 520,
      roi: 4.2,
    },
    riskEvents: [],
    cooperationHistory: [],
    trend: t10Trend,
    updatedAt: today,
  },

  // ---------- 合作: 雷蛇 × 星际游侠（3C，中效果，定价争议拖累） ----------
  {
    id: "tgt-011",
    name: "雷蛇 × 星际游侠",
    category: "cooperation",
    industry: "3c",
    description:
      "电竞外设联名系列，产品性能获认可但定价策略引发核心玩家抵触，销量未达预期，库存周转偏慢。",
    social: {
      volume: 35000,
      exposure: 950000,
      engagement: 68000,
      heatScore: 76,
      mediaCount: 1900,
    },
    sentiment: {
      positiveRatio: 0.55,
      neutralRatio: 0.25,
      negativeRatio: 0.2,
      stabilityScore: calcStabilityFromTrend(t11Trend),
      avgCommentRating: 3.5,
    },
    business: {
      salesLift: 18,
      gmv: 60000000,
      conversionRate: 0.048,
      avgOrderValue: 780,
      roi: 1.9,
    },
    riskEvents: [
      {
        id: "risk-011-1",
        title: "联名款定价较普通款溢价80%",
        date: "2024-01-20",
        severity: "medium",
        category: "negative_opinion",
        description:
          "玩家对比发现联名鼠标比普通同配置款贵近一倍，认为在吃情怀红利。",
        resolved: false,
      },
    ],
    cooperationHistory: [],
    trend: t11Trend,
    updatedAt: today,
  },

  // ---------- 合作: 喜茶 × 青瓷物语（食品饮料，争议型） ----------
  {
    id: "tgt-012",
    name: "喜茶 × 青瓷物语",
    category: "cooperation",
    industry: "food",
    description:
      "原定2024年暑期上线的非遗联名，预热期即因设计图泄露引发文化挪用争议，品牌方已宣布延期并重新设计。",
    social: {
      volume: 42000,
      exposure: 1300000,
      engagement: 180000,
      heatScore: 74,
      mediaCount: 2800,
    },
    sentiment: {
      positiveRatio: 0.35,
      neutralRatio: 0.25,
      negativeRatio: 0.4,
      stabilityScore: calcStabilityFromTrend(t12Trend),
      avgCommentRating: 2.6,
    },
    business: {
      salesLift: 0,
      gmv: 0,
      conversionRate: 0,
      avgOrderValue: 0,
      roi: 0,
    },
    riskEvents: [
      {
        id: "risk-012-1",
        title: "预热海报被指文化挪用",
        date: "2024-07-10",
        severity: "high",
        category: "controversy",
        description:
          " leaked 的设计稿将青瓷纹样与现代涂鸦混搭，被非遗保护者批评缺乏敬畏，要求终止合作。",
        resolved: false,
      },
    ],
    cooperationHistory: [],
    trend: t12Trend,
    updatedAt: today,
  },
];
