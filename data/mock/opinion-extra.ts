/**
 * 舆情监控扩展数据
 * 热门关键词、平台占比、热门内容摘要
 */

export interface HotKeyword {
  word: string;
  count: number;
  trend: "up" | "down" | "flat";
  sentiment: "positive" | "neutral" | "negative";
}

export interface HotContent {
  id: string;
  title: string;
  platform: string;
  author: string;
  publishTime: string;
  heat: number;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  relatedTarget: string;
}

export interface PlatformShare {
  platform: string;
  value: number;
  color: string;
}

export const hotKeywords: HotKeyword[] = [
  { word: "联名", count: 12850, trend: "up", sentiment: "positive" },
  { word: "售罄", count: 9640, trend: "up", sentiment: "positive" },
  { word: "熊猫阿宝", count: 8420, trend: "up", sentiment: "positive" },
  { word: "定价", count: 7230, trend: "up", sentiment: "negative" },
  { word: "林小夏", count: 6810, trend: "flat", sentiment: "positive" },
  { word: "文化挪用", count: 5920, trend: "up", sentiment: "negative" },
  { word: "代言", count: 5480, trend: "flat", sentiment: "neutral" },
  { word: "兰蔻", count: 4650, trend: "down", sentiment: "positive" },
  { word: "合同纠纷", count: 4320, trend: "up", sentiment: "negative" },
  { word: "茶颜悦色", count: 3890, trend: "down", sentiment: "positive" },
  { word: "花西子", count: 3240, trend: "flat", sentiment: "positive" },
  { word: "非遗", count: 2980, trend: "up", sentiment: "neutral" },
];

export const hotContents: HotContent[] = [
  {
    id: "hc-001",
    title: "熊猫阿宝 × 茶颜悦色联名款首日售罄，二手平台溢价3倍",
    platform: "微博",
    author: "时尚资讯站",
    publishTime: "2024-06-01",
    heat: 98,
    summary: "联名活动上线首日即引发抢购热潮，主题杯与盲袋周边在多城门店迅速售罄，二手交易平台出现3倍以上溢价。",
    sentiment: "positive",
    relatedTarget: "tgt-001",
  },
  {
    id: "hc-002",
    title: "星际游侠联名外设定价引争议，玩家质疑「吃情怀红利」",
    platform: "NGA",
    author: "硬核玩家论坛",
    publishTime: "2024-02-15",
    heat: 85,
    summary: "玩家对比发现联名鼠标比普通同配置款贵近一倍，NGA与贴吧出现集中吐槽帖，认为品牌在吃情怀红利。",
    sentiment: "negative",
    relatedTarget: "tgt-002",
  },
  {
    id: "hc-003",
    title: "林小夏代言广告片在抖音引发模仿潮，播放量破亿",
    platform: "抖音",
    author: "娱乐风向标",
    publishTime: "2024-04-10",
    heat: 96,
    summary: "代言广告片凭借独特视觉风格在短视频平台引发大规模模仿，相关话题播放量破亿，品牌曝光显著提升。",
    sentiment: "positive",
    relatedTarget: "tgt-005",
  },
  {
    id: "hc-004",
    title: "青瓷物语联名设计被质疑文化挪用，非遗保护者发声",
    platform: "小红书",
    author: "文化观察员",
    publishTime: "2024-07-22",
    heat: 88,
    summary: " leaked 的设计稿将青瓷纹样与现代涂鸦混搭，被非遗保护者批评缺乏敬畏，要求品牌终止合作并道歉。",
    sentiment: "negative",
    relatedTarget: "tgt-003",
  },
  {
    id: "hc-005",
    title: "魔法少女小圆 × 花西子联名彩妆开箱测评",
    platform: "B站",
    author: "美妆测评姬",
    publishTime: "2024-03-08",
    heat: 82,
    summary: "UP主发布联名彩妆系列开箱视频，包装设计与色号还原度获好评，评论区「种草」比例极高。",
    sentiment: "positive",
    relatedTarget: "tgt-004",
  },
  {
    id: "hc-006",
    title: "王凯合同纠纷登上热搜前三，前经纪公司发长文控诉",
    platform: "微博",
    author: "娱乐圈爆料",
    publishTime: "2024-06-20",
    heat: 91,
    summary: "前经纪公司发布长文指控王凯违约跳槽，涉及代言分成争议，话题迅速登上微博热搜前三，舆情持续发酵。",
    sentiment: "negative",
    relatedTarget: "tgt-008",
  },
];

export const platformShares: PlatformShare[] = [
  { platform: "微博", value: 35, color: "#ef4444" },
  { platform: "抖音", value: 28, color: "#111827" },
  { platform: "小红书", value: 18, color: "#f43f5e" },
  { platform: "B站", value: 12, color: "#3b82f6" },
  { platform: "NGA/贴吧", value: 7, color: "#22c55e" },
];
