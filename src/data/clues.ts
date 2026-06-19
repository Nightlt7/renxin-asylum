import type { Clue } from '../types/game';

export const clues: Clue[] = [
  // 序章/记忆引入
  {
    id: 'clue_appointment',
    title: '市公安局聘书',
    source: '序章《聘书》',
    description:
      '叶臻受聘为香北市公安局仁馨精神病院遗留问题医疗支援专家，聘期 3 天（2018 年 9 月 15-17 日），进入零号研究所开展患者建档工作。',
    tags: ['物品', '身份'],
    image: '/assets/images/1-记忆引入_p1.png',
  },
  {
    id: 'clue_identity',
    title: '叶臻的另一重身份',
    source: '序章《聘书》',
    description:
      '叶臻真名崔诣，是 11·6 纵火案嫌疑人崔哲金的孩子。进入仁馨的真实目的是查清崔哲金到底想告诉她什么。',
    tags: ['人物', '身份'],
  },
  {
    id: 'clue_fibromyalgia',
    title: '纤维肌痛与止痛药',
    source: '序章《聘书》',
    description:
      '叶臻患有纤维肌痛，肌肉和骨骼长期持续疼痛，不危及生命。来仁馨前，她把止痛药放回抽屉——疼痛可以避免被催眠。',
    tags: ['机制', '玩家'],
  },
  // 新闻报道
  {
    id: 'clue_news_report',
    title: '香北都市报纵火案报道',
    source: '第 1 章《新闻》',
    description:
      '2017 年 11 月 6 日，零号研究所二楼、五楼起火；5 人死亡，崔哲金坠楼。4 名死者端坐原位，未逃跑未求救，会议室门开着。',
    tags: ['案件', '新闻'],
    image: '/assets/images/2-香北都市案纵火案新闻报道.jpg',
  },
  {
    id: 'clue_four_dead',
    title: '4 名死者的异常死状',
    source: '第 1 章《新闻》',
    description:
      '4 名死者因吸入一氧化碳死亡，但既未逃跑也未求救，端坐原位直至死亡。现场无束缚道具，会议室门敞开。',
    tags: ['案件', '异常'],
  },
  // 手机信息
  {
    id: 'clue_senior_sms',
    title: '刘师姐的短信',
    source: '第 2 章《手机》',
    description:
      '刘师姐在仁馨建档期间感觉自己被催眠，出现失忆；她发现仁馨用机器臂直接从药局送药到病房，药物存量约 5 年。',
    tags: ['人物', '异常', '催眠'],
  },
  {
    id: 'clue_wang_sms',
    title: '王姐的短信',
    source: '第 2 章《手机》',
    description:
      '检验科王姐确认叶臻体检正常，提醒纤维肌痛会长期疼痛，并问她止痛药是否够用。叶臻回复“暂时不用了”。',
    tags: ['玩家', '机制'],
  },
  {
    id: 'clue_cui_message',
    title: '崔哲金的留言 201711060915',
    source: '第 2 章《手机》',
    description: '崔哲金在案发当天早上 9:15 给叶臻留下未接来电和语音留言。',
    tags: ['人物', '案件'],
    image: '/assets/images/3-叶臻手机信息_p11.png',
  },
  // 平面图与卷宗袋
  {
    id: 'clue_floorplan',
    title: '零号研究所平面图',
    source: '第 3 章《平面图与卷宗袋》',
    description: '五层砖混结构独立建筑，1F 大厅、2F 手术室与档案室、3F 病房与活动室、4F 疗养病房、5F 会议室与院长办公室、天台广告牌与水塔。',
    tags: ['地点', '物品'],
    image: '/assets/images/4-零号研究所平面图.jpg',
  },
  {
    id: 'clue_rooftop_wire',
    title: '天台广告牌的弯折铁丝',
    source: '警方调查记录簿',
    description:
      '天台广告牌铁架边缘发现一根支出的尖锐铁丝，已弯折，锈迹斑斑。崔哲金坠楼时左臂被划伤，证明他坠楼前曾挣扎抓握，不是自杀。',
    tags: ['地点', '异常'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p3.png',
  },
  {
    id: 'clue_meeting_room_card',
    title: '会议室投影中的游戏机存储卡',
    source: '警方调查记录簿',
    description:
      '501 会议室投影仪播放器中剥离出一张游戏机视频存储卡，内容已无法复原。结合冯思雅证言，有人用游戏机录下催眠视频替换了晨会录像。',
    tags: ['物品', '催眠', '案件'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p5.png',
  },
  {
    id: 'clue_cao_notebook',
    title: '曹怀敬的原始记录本',
    source: '第 3 章《卷宗袋》',
    description:
      '记录曹怀敬“高功能脑区”理论、2013 年患儿实验、催眠机制发现、造神野心、崔哲金转变与被打压全过程。结局中袁枝将此本归还给玩家。',
    tags: ['人物', '动机', '机制'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-曹怀敬的原始记录本_p1.png',
  },
  {
    id: 'clue_anti_rejection',
    title: '抗排异药物调剂浓液',
    source: '警方调查记录簿',
    description:
      '48 小时一次口服，主要成分含苯二氮卓类镇静剂、利他林呼吸抑制浓液；适用于脑组织移植术患者，需与自身脑组织提取物（0.05%）调配，终身服用。',
    tags: ['机制', '物品'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p12.png',
  },
  {
    id: 'clue_game_console_rank',
    title: '活动室《逻辑大师》积分榜',
    source: '警方调查记录簿',
    description:
      '2017 年 7 月 11 日，排名第一“未命名”打出 1293210 分。当时只有袁枝仍住在 3 楼，证明他术后已不再是智障。',
    tags: ['人物', '异常'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p16.png',
  },
  {
    id: 'clue_photo_decrypt',
    title: '病房照片解密卡',
    source: '第 3 章《卷宗袋》',
    description: '箭头朝上的挖孔遮罩，叠在病房照片上可读取隐藏信息。',
    tags: ['物品', '谜题'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-病房照片解密卡.jpg',
  },
  // 来信与明信片
  {
    id: 'clue_cui_letter',
    title: '崔哲金的神秘来信',
    source: '第 4 章《来信与明信片》',
    description:
      '2017 年 11 月 5 日寄出，内含教材残页，涵盖精神损伤、催眠、刻板行为、躁狂症、妄想性障碍、癔症性漫游症、黑暗恐惧、神经性厌食、PTSD、智力迟滞等医学知识。',
    tags: ['人物', '物品', '机制'],
    image: '/assets/images/6-崔哲金的神秘来信_p2.png',
  },
  {
    id: 'clue_postcard',
    title: '《希波克拉底誓言》谜底明信片',
    source: '第 4 章《来信与明信片》',
    description:
      '正面红字“记住，疼痛可以避免被催眠”；背面是打乱的誓言文字与摩尔斯电码谜题，可解出“304 fridge brain”。',
    tags: ['物品', '谜题', '机制'],
    image: '/assets/images/7-《希波克拉底誓言》谜底明信片_p2.png',
  },
  {
    id: 'clue_morse_table',
    title: '崔哲金口袋中的摩尔斯电码表',
    source: '警方调查记录簿',
    description: '用来解开明信片背面电码。',
    tags: ['物品', '谜题'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p24.png',
  },
  // 病患建档
  {
    id: 'clue_patient_records',
    title: '病患建档记录本',
    source: '第 5 章《病患建档》',
    description:
      '叶臻对 7 名生还患者的访谈记录，包含各人症状、高功能区、案发当晚行动与证言。',
    tags: ['人物', '物品'],
    image: '/assets/images/9-病患建档记录本_p1.png',
  },
  {
    id: 'clue_hexiuwen_record',
    title: '何秀文的“正”字记录',
    source: '病患建档记录本',
    description:
      '何秀文曾能听声辨人，记录每个人夜间起夜次数。7 月 4 日手术后高功能区被剥离，记录开始混乱；但 11 月 5 日晚仍可以确定有三人起夜。',
    tags: ['人物', '时间线'],
    image: '/assets/images/9-病患建档记录本_p4.png',
  },
  {
    id: 'clue_yuanzhi_locked',
    title: '309 禁闭室护理床头卡',
    source: '警方调查记录簿',
    description:
      '袁枝 2017 年 11 月 5 日夜-11 月 7 晨被关 309 禁闭室，主管刘美汐，携带便携式掌上游戏机（活动室借出）。',
    tags: ['人物', '地点'],
    image: '/assets/images/5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p11.png',
  },
  // 访谈补充（通过角色对话解锁）
  {
    id: 'clue_fengsiya_dialogue',
    title: '冯思雅的访谈补充',
    source: '角色访谈',
    description:
      '“他们拿走我的吉他后，我反而能听见每个音符……只是再也弹不出完整的歌了。”冯思雅的躁狂症让她失去平静，但绝对音感仍在。',
    tags: ['人物'],
  },
  {
    id: 'clue_yaohuan_dialogue',
    title: '姚欢的访谈补充',
    source: '角色访谈',
    description:
      '“冰箱里的味道……不是我放的。我从不碰那里的东西。”姚欢对 304 病房冰箱的态度暗示其中藏着不属于她的物品。',
    tags: ['人物', '地点'],
  },
  {
    id: 'clue_luokunshan_dialogue',
    title: '罗昆山的访谈补充',
    source: '角色访谈',
    description:
      '“我记得每一件事，除了昨晚我为什么会站在 309 门前。”罗昆山在案发前夜被催眠，去禁闭室门前替袁枝开锁。',
    tags: ['人物', '时间线'],
  },
  {
    id: 'clue_hexiuwen_dialogue',
    title: '何秀文的访谈补充',
    source: '角色访谈',
    description:
      '“那天晚上我听见三个人起夜。第一个脚步很轻，是姚欢。”何秀文的证言确认时间线起点。',
    tags: ['人物', '时间线'],
  },
  {
    id: 'clue_daixianzhong_dialogue',
    title: '戴先中的访谈补充',
    source: '角色访谈',
    description:
      '“我模仿歌神模仿了十年，现在连自己的声音都快忘了。”癔症性漫游症让戴先中在失忆状态下行动。',
    tags: ['人物'],
  },
  {
    id: 'clue_chaijing_dialogue',
    title: '柴靖的访谈补充',
    source: '角色访谈',
    description:
      '“他们说我替换了会议室里的视频。我不记得，但我手上有烧伤。”柴靖在催眠状态下持电梯卡上 5 楼替换晨会录像。',
    tags: ['人物', '案件'],
  },
  {
    id: 'clue_yuanzhi_dialogue',
    title: '袁枝的访谈补充',
    source: '角色访谈',
    description:
      '“姐姐说，只要听话，就能变得‘圆满’。可圆满是什么？”袁枝口中的“姐姐”指刘美汐，他的整合术保留了催眠能力。',
    tags: ['人物', '催眠'],
  },
  {
    id: 'clue_cuizhejin_dialogue',
    title: '崔哲金的留言补充',
    source: '角色访谈',
    description:
      '“小诣，如果你看到这些，说明我已经没办法亲口告诉你了。”崔哲金预感到危险，提前将线索藏入来信与病房照片。',
    tags: ['人物', '案件'],
  },
  {
    id: 'clue_caohuaijing_dialogue',
    title: '曹怀敬的访谈补充',
    source: '角色访谈',
    description:
      '“医学总是要有人付出代价。我只是在加速结果。”曹怀敬对高功能剥离术的执念是整个非法实验的源头。',
    tags: ['人物', '动机'],
  },
  {
    id: 'clue_liumeixi_dialogue',
    title: '刘美汐的访谈补充',
    source: '角色访谈',
    description:
      '“我对 2016G 做的不是剥离，是整合。他将来会变成什么样，我也没想到。”刘美汐的整合术让袁枝保留并强化了催眠能力。',
    tags: ['人物', '医学'],
  },
  {
    id: 'clue_wangmin_dialogue',
    title: '王敏的访谈补充',
    source: '角色访谈',
    description:
      '“纤维肌痛不会要命，但会陪你一辈子。别硬撑，疼就吃一颗。”王敏关心叶臻，却也暗示止痛药的诱惑与风险。',
    tags: ['人物', '玩家'],
  },
  {
    id: 'clue_chenzhijie_dialogue',
    title: '陈志杰的访谈补充',
    source: '角色访谈',
    description:
      '“晨会视频被替换的时候，我们四个就坐在会议室里，看着它播放。”陈志杰等 4 名医护被催眠后无法逃跑。',
    tags: ['人物', '案件'],
  },
  {
    id: 'clue_liushi_dialogue',
    title: '刘师姐的访谈补充',
    source: '角色访谈',
    description:
      '“我在仁馨建档时，有三天记忆是空的。我只记得有人一直数到十。”刘师姐也曾被袁枝或仁馨人员催眠。',
    tags: ['人物', '催眠'],
  },
];

export const clueById = (id: string): Clue | undefined => clues.find((c) => c.id === id);
