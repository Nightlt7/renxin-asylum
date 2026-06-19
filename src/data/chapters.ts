import type { Chapter } from '../types/game';
import { imagePath } from '../utils/imagePath';

const img = (path: string) => imagePath(path);

const range = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => img(`${prefix}_p${start + i}.png`));

export const chapters: Chapter[] = [
  {
    id: 'intro',
    title: '序章',
    subtitle: '聘书',
    objective: '确认身份：你是谁，为什么来到仁馨精神病院。',
    narrative:
      '2018 年 9 月 15 日，你终于收到进入仁馨精神病院零号研究所的许可。你叫叶臻，也是崔诣。抽屉里的止痛药被你放了回去——疼痛，是你进入这里前最后的准备。',
    storyBeats: [
      {
        id: 'intro_beat_1',
        type: 'narrative',
        content:
          '香北市公安局的聘书躺在桌上，白纸黑字写着你的名字：叶臻。但你清楚，这份许可背后真正的名字是崔诣。',
      },
      {
        id: 'intro_beat_2',
        type: 'innerThought',
        content:
          '崔哲金。父亲。嫌疑人。天才。魔鬼。这些词缠在一起，像一根生锈的针扎进脊背。我花了这么多年才走到这里，不是为了给他翻案，是为了知道真相。',
      },
      {
        id: 'intro_beat_3',
        type: 'flashback',
        content:
          '“小诣，疼痛可以避免被催眠。”——那个无法回拨的电话里，他的声音疲惫却急切。',
      },
      {
        id: 'intro_beat_4',
        type: 'innerThought',
        content:
          '我把止痛药放回抽屉。纤维肌痛还在，像老朋友一样跟着我。这一次，疼痛不是敌人，是我的护身符。',
      },
    ],
    images: [img('1-记忆引入_p1.png'), img('1-记忆引入_p2.png')],
    hotspots: [
      {
        id: 'intro_painkiller',
        imageIndex: 1,
        x: 65,
        y: 65,
        w: 25,
        h: 20,
        title: '止痛药',
        content: '你把止痛药放回抽屉。疼痛可以避免被催眠——这是你进入仁馨前最后的准备。',
      },
    ],
    clueIds: ['clue_appointment', 'clue_identity', 'clue_fibromyalgia'],
    advanceQuestion: {
      question: '你的真实姓名是什么？你进入仁馨的核心任务是什么？',
      answer: '崔诣',
      hints: [
        '记忆引入中提到，对众人而言你叫叶臻，但真正的名字藏在“崔哲金的孩子”这一身份里。',
        '父亲给你取名时，用的是“崔”姓与“诣”字。',
        '你的真名是“崔诣”；任务是进入仁馨查清崔哲金死亡的真相。',
        '答案：崔诣。',
      ],
    },
    puzzleId: 'p_intro',
    nextChapterId: 'news',
  },
  {
    id: 'news',
    title: '第 1 章',
    subtitle: '香北都市报',
    objective: '查清 11·6 纵火案中 4 名死者的发现地点。',
    narrative:
      '一年前的 11 月 6 日，零号研究所发生纵火案。5 人死亡，7 名患者因早操指令来到室外幸存。4 名死者端坐会议室，没有逃跑，没有求救。',
    images: [img('2-香北都市案纵火案新闻报道.jpg')],
    clueIds: ['clue_news_report', 'clue_four_dead'],
    advanceQuestion: {
      question: '根据香北都市报报道，11·6 纵火案共造成多少人死亡？除端坐会议室的 4 人外，还有谁？',
      answer: '5/五人/5人/崔哲金',
      hints: [
        '报道标题与正文提到“5 人死亡”，其中 4 人端坐在会议室。',
        '第五名死者的死法与“坠楼”有关。',
        '这名死者姓崔，是本案最初被认定的嫌疑人。',
        '答案：5 人；崔哲金（可输入“5”“5人”“五人”或“崔哲金”）。',
      ],
    },
    puzzleId: 'p_news_compound',
    nextChapterId: 'phone',
  },
  {
    id: 'phone',
    title: '第 2 章',
    subtitle: '叶臻的手机',
    objective: '从手机信息中找出仁馨的异常与自己的身体状况。',
    narrative:
      '手机里留着两段音频、刘师姐的短信和王姐的短信。刘师姐在仁馨建档时遭遇催眠，王姐提醒你的纤维肌痛和止痛药。',
    storyBeats: [
      {
        id: 'phone_beat_1',
        type: 'narrative',
        content:
          '培训会结束后，你打开手机。屏幕上堆着未读短信、未接来电，还有两段来自陌生号码的音频。',
      },
      {
        id: 'phone_beat_2',
        type: 'dialogue',
        characterId: 'liushi',
        content:
          '“我在仁馨建档时，有三天记忆是空的。我只记得有人一直数到十。”——刘师姐的短信让你握紧手机。',
      },
      {
        id: 'phone_beat_3',
        type: 'dialogue',
        characterId: 'wangmin',
        content:
          '“纤维肌痛不会要命，但会陪你一辈子。别硬撑，疼就吃一颗。”王姐的关心像一根细线，牵着止痛药。',
      },
      {
        id: 'phone_beat_4',
        type: 'flashback',
        content:
          '耳机里传来崔哲金的声音，背景有医院的广播和远处的脚步声。他说：“不要相信除警察以外的任何陌生人。”然后电话断了。',
      },
    ],
    images: [
      img('3-叶臻手机信息_p2.png'),
      img('3-叶臻手机信息_p3.png'),
      img('3-叶臻手机信息_p4.png'),
      img('3-叶臻手机信息_p5.png'),
      img('3-叶臻手机信息_p6.png'),
      img('3-叶臻手机信息_p7.png'),
      img('3-叶臻手机信息_p8.png'),
      img('3-叶臻手机信息_p9.png'),
      img('3-叶臻手机信息_p10.png'),
      img('3-叶臻手机信息_p11.png'),
    ],
    clueIds: ['clue_senior_sms', 'clue_wang_sms', 'clue_cui_message'],
    advanceQuestion: {
      question: '刘师姐短信中提到，仁馨通过什么方式把药直接送到病房？',
      answer: '机器臂',
      hints: [
        '刘师姐短信里描述了仁馨药局到病房的送药方式，不是人工配送。',
        '这种装置可以自动从药局取药并送到病房。',
        '答案是一种机械装置，常用于自动化生产线。',
        '答案：机器臂。',
      ],
    },
    audioClues: [
      { title: '警察局对话记录', date: '201809120831', duration: 12 },
      { title: '崔哲金的留言', date: '201711060915', duration: 15 },
    ],
    interviewCharacterIds: ['liushi', 'wangmin'],
    puzzleId: 'p_phone',
    nextChapterId: 'dossier',
  },
  {
    id: 'dossier',
    title: '第 3 章',
    subtitle: '平面图与卷宗袋',
    objective: '在卷宗袋里找到大脑组织下落、IC 卡权限记录与纵火关键地点。',
    narrative:
      '警方提供的平面图和卷宗袋是调查的骨架。天台铁丝、会议室存储卡、曹怀敬的原始记录本、病房照片解密卡……它们共同指向一个被隐瞒的实验。',
    storyBeats: [
      {
        id: 'dossier_beat_1',
        type: 'narrative',
        content:
          '档案室的日光灯管嗡嗡作响。你摊开平面图，又翻开那只牛皮纸卷宗袋，曹怀敬的字迹像手术刀一样整齐。',
      },
      {
        id: 'dossier_beat_2',
        type: 'dialogue',
        characterId: 'caohuaijing',
        content:
          '“高功能脑区必须被利用，而不是被怜悯。”——曹怀敬在原始记录本扉页写下这句话，字迹锐利，没有涂改。',
      },
      {
        id: 'dossier_beat_3',
        type: 'dialogue',
        characterId: 'cuizhejin',
        content:
          '“如果这本记录落入你手中，说明我已经失败了。但失败者的笔记，有时比胜利者更接近真相。”——崔哲金的旁批压在页边。',
      },
      {
        id: 'dossier_beat_4',
        type: 'innerThought',
        content:
          '两个人，两条路。一个想造神，一个想救人。而袁枝被夹在中间，成了 neither 的怪物。',
      },
    ],
    images: [
      img('4-零号研究所平面图.jpg'),
      ...range('5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿', 1, 24),
      ...range('5-纵火案卷宗袋/5-纵火案卷子袋-曹怀敬的原始记录本', 1, 33),
      ...range('5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片', 1, 8),
      img('5-纵火案卷宗袋/5-纵火案卷子袋-病房照片解密卡.jpg'),
      img('5-纵火案卷宗袋/5-纵火案卷子袋-电梯ic卡记录碎片拼图纸_p1.png'),
      img('5-纵火案卷宗袋/5-纵火案卷子袋-电梯ic卡记录碎片拼图纸_p2.png'),
    ],
    hotspots: [
      {
        id: 'dossier_floorplan_rooftop',
        imageIndex: 0,
        x: 74,
        y: 82,
        w: 20,
        h: 12,
        title: '天台广告牌',
        content: '崔哲金坠楼的地方。天台平面图右下角的大型楼顶广告，广告牌边缘伸出的尖锐铁丝划破了他的左臂，证明他坠楼前曾挣扎。',
      },
      {
        id: 'dossier_floorplan_meeting',
        imageIndex: 0,
        x: 24,
        y: 84,
        w: 22,
        h: 12,
        title: '501 会议室',
        content: '五楼平面图右下角的 501 会议室。11 月 6 日晨会在这里播放催眠视频，4 名医护端坐原地，在火灾中无法逃跑。',
      },
      {
        id: 'dossier_photo_fridge',
        imageIndex: 64,
        x: 62,
        y: 42,
        w: 28,
        h: 36,
        title: '304 病房冰箱',
        content: '解密卡叠上去后，这里显示“大脑组织”。崔哲金把袁枝被摘除的大脑组织藏进了姚欢病房的冰箱。',
      },
      {
        id: 'dossier_iccard_cui',
        imageIndex: 68,
        x: 10,
        y: 72,
        w: 80,
        h: 18,
        title: '4F 取消',
        content: '2017 年 6 月 20 日，崔哲金被取消了 4 楼权限。这是曹怀敬排挤他的直接证据。',
      },
    ],
    clueIds: [
      'clue_floorplan',
      'clue_rooftop_wire',
      'clue_meeting_room_card',
      'clue_cao_notebook',
      'clue_anti_rejection',
      'clue_game_console_rank',
      'clue_photo_decrypt',
    ],
    interviewCharacterIds: ['cuizhejin', 'caohuaijing'],
    advanceQuestion: {
      question: '电梯 IC 卡权限记录显示，崔哲金被取消了哪一层楼的权限？',
      answer: '4楼',
      hints: [
        'IC 卡碎片拼图中有一条记录写着“2017.06.20 · 崔 / 4F 取消”。',
        '“4F”是楼层的英文缩写。',
        '把“4F”转换成中文楼层表述。',
        '答案：4楼（或 4F）。',
      ],
    },
    puzzleId: 'p_dossier',
    nextChapterId: 'letter',
  },
  {
    id: 'letter',
    title: '第 4 章',
    subtitle: '来信与明信片',
    objective: '破解崔哲金来信中的摩尔斯电码与密码盘，找到他藏起来的线索。',
    narrative:
      '崔哲金在案发前寄出的信里，夹着教材残页与一张明信片。明信片正面写着：记住，疼痛可以避免被催眠。背面藏着一串摩尔斯电码。',
    storyBeats: [
      {
        id: 'letter_beat_1',
        type: 'narrative',
        content:
          '信封上的邮戳是 2017 年 11 月 5 日，案发前一天。你拆开信，教材残页的边角已经发卷，像是从某人手里抢救出来的。',
      },
      {
        id: 'letter_beat_2',
        type: 'dialogue',
        characterId: 'cuizhejin',
        content:
          '“小诣，我没有时间解释全部。把这些残页背下来，把明信片翻过去，记住疼痛。”——信纸上的字迹越来越潦草，最后几个字几乎划破纸面。',
      },
      {
        id: 'letter_beat_3',
        type: 'flashback',
        content:
          '你仿佛看见崔哲金坐在仁馨某个角落里，借着走廊漏进来的光，一笔一画写下 304 fridge brain。他知道有人在看。',
      },
    ],
    images: [
      img('6-崔哲金的神秘来信_p1.png'),
      img('6-崔哲金的神秘来信_p2.png'),
      img('7-《希波克拉底誓言》谜底明信片_p1.png'),
      img('7-《希波克拉底誓言》谜底明信片_p2.png'),
      img('5-纵火案卷宗袋/5-纵火案卷子袋-警方调查记录簿_p24.png'),
    ],
    hotspots: [
      {
        id: 'letter_postcard_front',
        imageIndex: 2,
        x: 15,
        y: 70,
        w: 70,
        h: 20,
        title: '明信片正面的红字',
        content: '“记住，疼痛可以避免被催眠。”这是崔哲金留给你的关键规则。',
      },
      {
        id: 'letter_postcard_morse',
        imageIndex: 3,
        x: 8,
        y: 35,
        w: 84,
        h: 45,
        title: '明信片背面的摩尔斯电码',
        content: '按“2 字符短、4 字符长”解码，可得到 304 fridge brain。',
      },
    ],
    clueIds: ['clue_cui_letter', 'clue_postcard', 'clue_morse_table'],
    interviewCharacterIds: ['cuizhejin'],
    advanceQuestion: {
      question: '崔哲金来信中的密码盘解密后得到的单词是什么？它指向什么？',
      answer: 'brain/大脑组织',
      hints: [
        '明信片摩尔斯电码解出 304 fridge brain 后，信里还有一组用密码盘加密的字母。',
        '把密码盘内圈向左转动 3 格，可解出一个 5 字母英文单词。',
        '这个单词代表人体器官，也是袁枝被摘除、需要抗排异药维持的东西。',
        '答案：brain（大脑组织）。',
      ],
    },
    puzzleId: 'p_letter_compound',
    nextChapterId: 'patients',
  },
  {
    id: 'patients',
    title: '第 5 章',
    subtitle: '病患建档',
    objective: '通过病患档案与访谈，判断 7 名病人的真实病症与各自能力。',
    narrative:
      '你逐一访谈 7 名生还患者。他们术后失去或获得了什么？11 月 5 日晚，谁起夜、谁被催眠、谁替袁枝打开了锁？',
    storyBeats: [
      {
        id: 'patients_beat_1',
        type: 'narrative',
        content:
          '三楼病房区的空气里有消毒水和旧棉被混合的气味。你拿着建档本，依次敲响七间病房。',
      },
      {
        id: 'patients_beat_2',
        type: 'innerThought',
        content:
          '他们生还了，但每个人都像被拿走了一部分。思雅的平静、姚欢的食欲、罗昆山的确定、秀文的黑夜、先中的身份、柴靖的腿、袁枝的……智慧？',
      },
      {
        id: 'patients_beat_3',
        type: 'dialogue',
        characterId: 'fengsiya',
        content:
          '307 病房里，冯思雅把吉他砸向软包墙：“别以为我不知道你葫芦里卖的什么药！你们每个人都只会这一套！”',
      },
      {
        id: 'patients_beat_4',
        type: 'innerThought',
        content:
          '她说的“这一套”是什么？绑起来？还是手术？如果七个人都曾被切开过脑袋，那他们现在的“症状”里，藏着多少谎言？',
      },
    ],
    images: [...range('9-病患建档记录本', 1, 18)],
    hotspots: [
      {
        id: 'patients_records_overview',
        imageIndex: 0,
        x: 10,
        y: 15,
        w: 80,
        h: 70,
        title: '7 名病人的档案',
        content: '这些记录藏着每个人的症状、高功能区与术后变化。袁枝的“智力残疾”诊断背后另有玄机。',
      },
    ],
    clueIds: ['clue_patient_records', 'clue_hexiuwen_record', 'clue_yuanzhi_locked'],
    advanceQuestion: {
      question: '7 名病人中，谁因为刘美汐的“整合术”而保留了催眠能力？',
      answer: '袁枝',
      hints: [
        '病患建档记录显示，袁枝的诊断为“智力残疾”，但他的实际能力并非如此。',
        '刘美汐对 2016G 做的不是剥离，而是整合。',
        '2016G 对应的是袁枝，他保留了并强化了催眠能力。',
        '答案：袁枝。',
      ],
    },
    interviewCharacterIds: ['fengsiya', 'yaohuan', 'luokunshan', 'hexiuwen', 'daixianzhong', 'chaijing', 'yuanzhi'],
    puzzleId: 'p_illness',
    nextChapterId: 'timeline',
  },
  {
    id: 'timeline',
    title: '第 6 章',
    subtitle: '天台之前',
    objective: '把 11 月 5 日晚的证言拼成完整时间线，还原案发前夜。',
    narrative:
      '把所有证言拼成一条时间线：姚欢起夜、罗昆山开锁、柴靖上楼替换视频、晨会播放催眠、袁枝走出禁闭室、崔哲金坠楼。',
    images: [img('9-调查提示卡_p2.png')],
    clueIds: [],
    advanceQuestion: {
      question: '11 月 5 日晚事件链的最后一个事件是什么？',
      answer: '崔哲金坠楼',
      hints: [
        '时间线的起点是何秀文听到三个人起夜，第一个是姚欢。',
        '随后罗昆山开锁、柴靖替换视频、早操放出袁枝。',
        '袁枝把崔哲金带上天台，逼问大脑组织下落未果。',
        '答案：崔哲金坠楼（或袁枝推崔哲金下楼）。',
      ],
    },
    puzzleId: 'p_timeline',
    nextChapterId: 'deduction',
  },
  {
    id: 'deduction',
    title: '第 7 章',
    subtitle: '指认真凶',
    objective: '综合全部线索，指认 11·6 纵火案与崔哲金坠楼的真凶。',
    narrative:
      '夜深了。你整理完所有线索，疲惫和疼痛同时袭来。抽屉里的止痛药还在。你是否要服下一颗，让自己能睡个好觉？',
    storyBeats: [
      {
        id: 'deduction_beat_1',
        type: 'innerThought',
        content:
          '所有碎片都指向一个方向：袁枝。那个被称为“智障”的孩子，其实保留了催眠能力。',
      },
      {
        id: 'deduction_beat_2',
        type: 'innerThought',
        content:
          '姚欢起夜，罗昆山开锁，柴靖替换晨会视频，四名医护被催眠……每一步都不是他亲自动手，但每一步都在他的注视下。',
      },
      {
        id: 'deduction_beat_3',
        type: 'flashback',
        content:
          '父亲把大脑组织藏进 304 冰箱，是为了阻止曹怀敬。而袁枝把他推下天台，是为了把大脑组织拿回去。',
      },
      {
        id: 'deduction_beat_4',
        type: 'dialogue',
        characterId: 'yuanzhi',
        content:
          '“你找到我了。”袁枝坐在禁闭室的小床上，抬头看你。他的眼睛里没有恐惧，只有一种完成拼图后的平静。',
      },
      {
        id: 'deduction_beat_5',
        type: 'innerThought',
        content:
          '疼痛在太阳穴一跳一跳。抽屉里的止痛药只要一颗，就能让我暂时忘记这些。但崔哲金说过：疼痛可以避免被催眠。',
      },
    ],
    images: [],
    clueIds: [],
    interviewCharacterIds: ['yuanzhi'],
    puzzleId: 'p_accusation',
    nextChapterId: 'ending',
    painChoice: true,
  },
  {
    id: 'ending',
    title: '终章',
    subtitle: '两种结局',
    narrative: '',
    images: [],
    clueIds: [],
    isEnding: true,
  },
];

export const chapterById = (id: string): Chapter | undefined => chapters.find((c) => c.id === id);
