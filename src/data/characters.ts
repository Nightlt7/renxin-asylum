// 角色数据：7 名病人 + 关键 NPC + 玩家
// 用于生成头像/剪影、文本匹配、交互式访谈与人物档案。
// 新增对话基于原作剧本杀资料与 truth.ts，未改动核心剧情。

export type CharacterRole = 'patient' | 'npc' | 'player';

export type DialogueSpeaker = 'player' | 'npc';

export interface DialogueLine {
  speaker: DialogueSpeaker;
  text: string;
  mood?: string; // 情绪标签，如 '平静'、'激动'、'痛苦'
  unlockClueId?: string; // 该句说完后解锁的线索
  nextTopicId?: string; // 说完后跳转的话题
}

export interface InterviewTopic {
  id: string;
  title: string;
  condition?: {
    // 满足以下任一条件即可解锁该话题
    chapterIds?: string[]; // 进入过指定章节
    clueIds?: string[]; // 收集过指定线索
    puzzleIds?: string[]; // 解过指定谜题
  };
  lines: DialogueLine[];
}

export interface CharacterRelation {
  targetId: string; // 对方角色 id
  label: string; // 关系描述，如 "父女"、"整合术者"
  description?: string; // 简短说明
}

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  color: string; // 头像背景主色
  accent: string; // 描边/高亮色
  silhouette: 'default' | 'hooded' | 'sharp' | 'round';
  aliases?: string[];
  // 人物小传与性格（用于增强代入感）
  backstory?: string;
  personality?: string[];
  relations?: CharacterRelation[];
  // 交互式访谈话题（替代旧 dialogues）
  interviewTopics?: InterviewTopic[];
  // 旧字段保留兼容性，新代码优先使用 interviewTopics
  dialogues?: { text: string; unlockClueId?: string }[];
}

export const characters: Character[] = [
  // 玩家
  {
    id: 'yezhen',
    name: '叶臻',
    role: 'player',
    color: '#4a6fa5',
    accent: '#8ab4f8',
    silhouette: 'round',
    aliases: ['崔诣'],
    backstory:
      '精神科医生，真名崔诣。崔哲金的孩子。因追查父亲死亡真相，以医疗支援专家身份进入仁馨。患有纤维肌痛，把止痛药放回抽屉——疼痛是她避免被催眠的护身符。',
    personality: ['敏锐克制', '执着', '背负父亲阴影'],
    relations: [
      { targetId: 'cuizhejin', label: '父子/父女', description: '崔哲金是叶臻的父亲，也是她心中最大的谜团。' },
      { targetId: 'yuanzhi', label: '追查对象', description: '叶臻最终要指认的，可能就是这个“智障少年”。' },
    ],
  },

  // 7 名病人
  {
    id: 'fengsiya',
    name: '冯思雅',
    role: 'patient',
    color: '#8b4d6b',
    accent: '#e8a4c8',
    silhouette: 'sharp',
    backstory:
      '躁狂症患者，曾拥有绝对音感，能听一遍就记下整段旋律。术后她失去了平静，却仍能听见每一个音符，只是再也弹不出完整的歌。',
    personality: ['暴躁敏感', '用愤怒保护脆弱', '音乐天赋残留'],
    relations: [
      { targetId: 'hexiuwen', label: '病友', description: '何秀文生日时，冯思雅曾为她唱歌。' },
      { targetId: 'yuanzhi', label: '怀疑对象', description: '5 号晚上，她听到了游戏机开机的音乐。' },
    ],
    interviewTopics: [
      {
        id: 'fengsiya_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '冯女士，你的吉他上写着一个“冯”字。' },
          { speaker: 'npc', text: '别碰它。怎么砸都砸不坏的，我这屋特殊。' },
          { speaker: 'npc', text: '他们拿走我的吉他后，我反而能听见每个音符……只是再也弹不出完整的歌了。', unlockClueId: 'clue_fengsiya_dialogue' },
          { speaker: 'player', text: '躁狂不是兴奋，是永不停歇的噪音。' },
        ],
      },
      {
        id: 'fengsiya_night',
        title: '5 号晚上你听到了什么？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上，你在房间里听到过什么？' },
          { speaker: 'npc', text: '听？我特别擅长听，我以前听音乐特别准，只要听一遍，什么都能记住。' },
          { speaker: 'npc', text: '我听到了！我听到了游戏机开机的音乐！就那天！5 号！天还没黑的时候！' },
          { speaker: 'npc', text: '我听到音乐就能把谱子写下来！可是有人打断我了！他说：“你们都不会感觉到热，也不能移动”！' },
        ],
      },
      {
        id: 'fengsiya_others',
        title: '其他病人在做什么？',
        condition: { clueIds: ['clue_patient_records'] },
        lines: [
          { speaker: 'player', text: '着火时大家都在楼下吗？' },
          { speaker: 'npc', text: '你凭什么让我看着他们了？' },
          { speaker: 'npc', text: '不是戴先中还能是谁？一大早上就在我们面前晃来晃去的！' },
        ],
      },
    ],
  },
  {
    id: 'yaohuan',
    name: '姚欢',
    role: 'patient',
    color: '#5d7a5d',
    accent: '#a8d5a2',
    silhouette: 'round',
    backstory:
      '神经性厌食症患者，曾是调香师，嗅觉异常灵敏。住在 304 病房，房间里有一台废弃冰箱。她厌恶食物，却把果冻分给袁枝。',
    personality: ['淡漠虚弱', '嗅觉敏锐', '对食物厌恶'],
    relations: [
      { targetId: 'yuanzhi', label: '给他带果冻', description: '姚欢总会把果冻分给 303 的袁枝。' },
      { targetId: 'luokunshan', label: '夜间叫他起夜', description: '姚欢夜里常起来，会去喊罗昆山。' },
    ],
    interviewTopics: [
      {
        id: 'yaohuan_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '你好，姚欢。我可以查看你病房里的冰箱吗？' },
          { speaker: 'npc', text: '那冰箱我没怎么用了，估计只有果冻还能吃，你要吗？' },
          { speaker: 'npc', text: '对了，你要是等下去 303 的话，把这个果冻带给袁枝吧，他很久没吃了。' },
          { speaker: 'npc', text: '冰箱里的味道……不是我放的。我从不碰那里的东西。', unlockClueId: 'clue_yaohuan_dialogue' },
        ],
      },
      {
        id: 'yaohuan_yuanzhi',
        title: '你和袁枝关系很好吗？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '你俩关系很好吗？' },
          { speaker: 'npc', text: '说不上好不好。一年前做完手术后我们几个转到四楼住院，等回来的时候，我冰箱里的果冻都让袁枝给吃完了。' },
          { speaker: 'npc', text: '那之后我就总分给他。反正你们肯定没法交流，还不如让他高兴点呢。' },
          { speaker: 'player', text: '你说的“没法交流”是指他和 307 一样吗？' },
          { speaker: 'npc', text: '你说冯思雅？不，袁枝是个智障。' },
        ],
      },
      {
        id: 'yaohuan_night',
        title: '5 号晚上你做了什么？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上，你在做什么？' },
          { speaker: 'npc', text: '睡觉。夜里去洗手间的时候我路过禁闭室，看见袁枝趴在门上那个小栅栏窗上，挺可怜的，我还隔着栅栏和他玩了一会儿。' },
          { speaker: 'player', text: '之后呢？' },
          { speaker: 'npc', text: '我……我想不起来了。' },
        ],
      },
    ],
  },
  {
    id: 'luokunshan',
    name: '罗昆山',
    role: 'patient',
    color: '#6b5b8b',
    accent: '#c4b5f0',
    silhouette: 'default',
    backstory:
      '妄想性障碍患者，曾是高级锁匠。拥有超强记忆与数学天赋，能背圆周率、过目不忘。术后这种能力被保留，但也伴随着妄想与焦虑。',
    personality: ['自负防御', '渴望被认可', '记忆超群'],
    relations: [
      { targetId: 'yaohuan', label: '被叫醒', description: '姚欢夜里会喊罗昆山起来。' },
      { targetId: 'chaijing', label: '一起上厕所', description: '5 号晚上，罗昆山喊柴靖一起去厕所。' },
    ],
    interviewTopics: [
      {
        id: 'luokunshan_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '你好，我叫叶臻，是新来的主治医师。' },
          { speaker: 'npc', text: '我认识你，你是新来的大夫。' },
          { speaker: 'player', text: '这些书都是你的吗？' },
          { speaker: 'npc', text: '你傻吗，这些都是图书馆的。你随便拿一本考我，我能一字不差地给你背下来。' },
          { speaker: 'npc', text: '3.1415926……数字不会说谎。但人会被骗，被催眠，被当成工具。', unlockClueId: 'clue_luokunshan_dialogue' },
        ],
      },
      {
        id: 'luokunshan_night',
        title: '5 号晚上你记得什么？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上你起床了吗？' },
          { speaker: 'npc', text: '晚上零点，姚欢没敲门喊我起来上厕所。' },
          { speaker: 'player', text: '后来她喊你了吗？' },
          { speaker: 'npc', text: '她没领我去禁闭室门口，我没看到袁枝。' },
          { speaker: 'npc', text: '后来的事儿我全记得，但我不告诉你。' },
        ],
      },
    ],
  },
  {
    id: 'hexiuwen',
    name: '何秀文',
    role: 'patient',
    color: '#7a5a3d',
    accent: '#e0c097',
    silhouette: 'hooded',
    backstory:
      '黑暗恐惧症患者。小时候被锁在教室里过夜，从此对黑暗极度恐惧。但她拥有极强的声音判断能力，能听脚步声辨人。术后这种能力受到影响。',
    personality: ['谨慎细致', '怕黑', '观察力强'],
    relations: [
      { targetId: 'fengsiya', label: '病友', description: '冯思雅曾在何秀文生日时为她唱歌。' },
    ],
    interviewTopics: [
      {
        id: 'hexiuwen_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '何女士，我听思雅说你唱歌很好听。' },
          { speaker: 'npc', text: '我过生日的时候她还给我唱了歌呢。她好的时候可好了。' },
          { speaker: 'player', text: '你能听声辨人，对吗？' },
          { speaker: 'npc', text: '我以前能听声辨人，听脚步声就知道是谁，出来了几次，特别准，问他们都说对。' },
          { speaker: 'npc', text: '那天晚上我听见三个人起夜。第一个脚步很轻，是姚欢。', unlockClueId: 'clue_hexiuwen_dialogue' },
        ],
      },
      {
        id: 'hexiuwen_night',
        title: '5 号晚上你听到了什么？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上，你还听到什么？' },
          { speaker: 'npc', text: '最开始听到有声音，我还以为是罗昆山，因为白天他就张罗着找游戏机，找了一天没找到，晚上接着找呗。' },
          { speaker: 'npc', text: '但过了 12 点，外面人好像特别多。' },
          { speaker: 'npc', text: '还有……我听到了电梯的声音和轮椅的声音。不过这个肯定是我弄错了，除了大夫们没人能进出电梯，也没有大夫坐轮椅。' },
        ],
      },
    ],
  },
  {
    id: 'daixianzhong',
    name: '戴先中',
    role: 'patient',
    color: '#4d6e7a',
    accent: '#9fd2e6',
    silhouette: 'default',
    backstory:
      '癔症性漫游症患者，身份认知混乱。曾是语文老师、食堂打饭师傅、模仿秀艺人。术后常常在不同身份间切换，不记得自己做过什么。',
    personality: ['浮夸表演型', '记忆断裂', '自我认知混乱'],
    relations: [
      { targetId: 'chaijing', label: '曾打架', description: '柴靖曾被噩梦惊醒，给了戴先中几拳。' },
    ],
    interviewTopics: [
      {
        id: 'daixianzhong_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '你好，请问你叫什么名字？' },
          { speaker: 'npc', text: '我叫李红伟，红色的红，伟大的伟。我年轻的时候是语文老师，现在还会写毛笔字呢。' },
          { speaker: 'player', text: '李师傅，您现在住在哪个病房？' },
          { speaker: 'npc', text: '怎么是李师傅呢？我姓戴，我是这儿的大夫。' },
          { speaker: 'npc', text: '我模仿歌神模仿了十年，现在连自己的声音都快忘了。', unlockClueId: 'clue_daixianzhong_dialogue' },
        ],
      },
      {
        id: 'daixianzhong_projector',
        title: '你提到投影仪？',
        condition: { clueIds: ['clue_meeting_room_card'] },
        lines: [
          { speaker: 'player', text: '你为什么让大家小心 306？' },
          { speaker: 'npc', text: '因为就他会弄会议室的那个投影仪，大夫们有时候发现投影仪有问题了就会找他，利益交换呗，咱也管不了。' },
          { speaker: 'player', text: '你说的“他”是谁？' },
          { speaker: 'npc', text: '柴靖啊。他打人不受罚，没处说理去。' },
        ],
      },
      {
        id: 'daixianzhong_night',
        title: '5 号晚上你出来了吗？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上你离开过病房吗？' },
          { speaker: 'npc', text: '没有，过去大夫不让我夜里出去，天天锁我的房门。不过有时候他们也会忘记。' },
          { speaker: 'npc', text: '不光我出来呀，那智障也天天出来，比我还勤！换个屋来来回回地翻东西，也不知道在找什么，你去问他呗！' },
        ],
      },
    ],
  },
  {
    id: 'chaijing',
    name: '柴靖',
    role: 'patient',
    color: '#8b6b3a',
    accent: '#f0d68c',
    silhouette: 'sharp',
    backstory:
      'PTSD 患者，曾是职业田径运动员。术后运动能力被保留，但噩梦频发，有时会梦游。5 号晚上在催眠状态下持电梯卡上 5 楼替换了晨会录像。',
    personality: ['压抑焦虑', '被噩梦困扰', '强壮却无力'],
    relations: [
      { targetId: 'daixianzhong', label: '曾打架', description: '柴靖曾在噩梦中惊醒后殴打戴先中。' },
      { targetId: 'luokunshan', label: '被叫上厕所', description: '罗昆山 5 号晚上叫柴靖一起去厕所。' },
    ],
    interviewTopics: [
      {
        id: 'chaijing_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '柴靖，你以前是运动员？' },
          { speaker: 'npc', text: '我以前是职业搞田径的，后来不搞了。' },
          { speaker: 'player', text: '是因为腿部受伤？' },
          { speaker: 'npc', text: '我腿没伤，不知道怎么了就不好使了，抬都抬不起来，就没劲儿。坐轮椅才几个月。' },
          { speaker: 'npc', text: '我曾经能跑完四百米不喘气。现在一闭眼，就看见火。', unlockClueId: 'clue_chaijing_dialogue' },
        ],
      },
      {
        id: 'chaijing_night',
        title: '5 号晚上你做了什么？',
        condition: { chapterIds: ['patients'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上你离开过病房吗？' },
          { speaker: 'npc', text: '我好像上了个厕所。' },
          { speaker: 'player', text: '你平时有过梦游的症状吗？' },
          { speaker: 'npc', text: '没有吧，没有人和我说过我梦游，崔大夫说我只是那个什么病，那个会做噩梦的病。' },
          { speaker: 'npc', text: '和罗昆山，就 305 那个，他喊我去的。好像往禁闭室那边走了，后面没印象了。' },
        ],
      },
      {
        id: 'chaijing_evidence',
        title: '这张电梯卡和内存卡是你的吗？',
        condition: { clueIds: ['clue_meeting_room_card'] },
        lines: [
          { speaker: 'player', text: '这张电梯卡是你的吗？' },
          { speaker: 'npc', text: '什么？不是，这个怎么在这儿？' },
          { speaker: 'player', text: '那这张内存卡呢？' },
          { speaker: 'npc', text: '这卡我认识，这是他们医生开会时投影用的内存卡，这个怎么也在我这儿？' },
          { speaker: 'npc', text: '他们说我替换了会议室里的视频。我不记得，但我手上有烧伤。' },
        ],
      },
    ],
  },
  {
    id: 'yuanzhi',
    name: '袁枝',
    role: 'patient',
    color: '#7a2e2e',
    accent: '#ff8a8a',
    silhouette: 'hooded',
    backstory:
      '编号 2016G，表面诊断为智力残疾。实际上刘美汐对他做的是“高功能整合术”而非剥离术，使他保留了并强化了催眠能力。他是 11·6 纵火案与崔哲金坠楼的真凶。',
    personality: ['天真外表', '操控者', '执着于“圆满”'],
    relations: [
      { targetId: 'liumeixi', label: '“姐姐”/整合术者', description: '刘美汐对袁枝做了整合术，袁枝称她为“姐姐”。' },
      { targetId: 'cuizhejin', label: '实验对象/加害对象', description: '崔哲金曾观察袁枝，最终被袁枝推下天台。' },
    ],
    interviewTopics: [
      {
        id: 'yuanzhi_default',
        title: '聊聊你自己',
        lines: [
          { speaker: 'player', text: '袁枝，你在 303 住得还习惯吗？' },
          { speaker: 'npc', text: '……' },
          { speaker: 'npc', text: '姐姐说，只要听话，就能变得“圆满”。可圆满是什么？', unlockClueId: 'clue_yuanzhi_dialogue' },
          { speaker: 'npc', text: '他们把我关起来，却还是忍不住看我。' },
        ],
      },
      {
        id: 'yuanzhi_sister',
        title: '你姐姐是谁？',
        condition: { clueIds: ['clue_yuanzhi_dialogue'] },
        lines: [
          { speaker: 'player', text: '你口中的“姐姐”是谁？' },
          { speaker: 'npc', text: '美汐姐姐。她给我做了手术，我就不再疼了。' },
          { speaker: 'npc', text: '她说我变得圆满了。圆满就是……大家都要听我的。' },
        ],
      },
      {
        id: 'yuanzhi_night',
        title: '5 号晚上你在禁闭室做什么？',
        condition: { clueIds: ['clue_yuanzhi_locked'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上，你被关在 309 禁闭室。' },
          { speaker: 'npc', text: '……' },
          { speaker: 'npc', text: '有人来看我。姚欢姐姐，昆山哥哥，靖哥哥……他们都很好。' },
          { speaker: 'npc', text: '我请他们帮了一点小忙。' },
        ],
      },
      {
        id: 'yuanzhi_motive',
        title: '你为什么要杀崔哲金？',
        condition: { chapterIds: ['deduction'] },
        lines: [
          { speaker: 'player', text: '袁枝，你杀了崔哲金。为什么？' },
          { speaker: 'npc', text: '他把我的东西藏起来了。' },
          { speaker: 'npc', text: '他说那是为了救我。可没有它，我就不再圆满。' },
          { speaker: 'npc', text: '我只是想把它拿回来。' },
        ],
      },
      {
        id: 'yuanzhi_control',
        title: '你催眠了所有人？',
        condition: { clueIds: ['clue_meeting_room_card'] },
        lines: [
          { speaker: 'player', text: '姚欢、罗昆山、柴靖……他们都是被你催眠的，对吗？' },
          { speaker: 'npc', text: '他们很高兴帮我。' },
          { speaker: 'npc', text: '姚欢姐姐给我带果冻，昆山哥哥帮我开门，靖哥哥替我把视频放好。' },
          { speaker: 'npc', text: '我只是对他们说：你们都不会感觉到热，也不能移动。' },
        ],
      },
      {
        id: 'yuanzhi_cui',
        title: '崔哲金最后说了什么？',
        condition: { clueIds: ['clue_cui_message'] },
        lines: [
          { speaker: 'player', text: '你把他推下天台前，他有没有说什么？' },
          { speaker: 'npc', text: '他说：“小诣，不要看。”' },
          { speaker: 'npc', text: '可我已经看了。我看到了所有。' },
          { speaker: 'npc', text: '所以我也让他看了。' },
        ],
      },
    ],
  },

  // 关键 NPC
  {
    id: 'cuizhejin',
    name: '崔哲金',
    role: 'npc',
    color: '#3d5a73',
    accent: '#8bb8d8',
    silhouette: 'default',
    backstory:
      '神经外科天才医师，叶臻的父亲。因与患者结婚被开除后进入仁馨，发现曹怀敬的非法实验。他偷走袁枝大脑组织藏进 304 冰箱，并在案发前给女儿留下线索。最终被袁枝推下天台。',
    personality: ['理想主义', '悔恨', '深爱孩子'],
    relations: [
      { targetId: 'yezhen', label: '孩子', description: '崔哲金给叶臻取名崔诣，希望她能继承自己的造诣。' },
      { targetId: 'caohuaijing', label: '对手', description: '崔哲金反对曹怀敬的非法实验，被排挤打压。' },
      { targetId: 'yuanzhi', label: '实验对象', description: '崔哲金最早观察到袁枝的异常。' },
    ],
    interviewTopics: [
      {
        id: 'cuizhejin_default',
        title: '留给叶臻的话',
        lines: [
          { speaker: 'npc', text: '小诣，如果你看到这些，说明我已经没办法亲口告诉你了。', unlockClueId: 'clue_cuizhejin_dialogue' },
          { speaker: 'npc', text: '记住，疼痛可以避免被催眠。别让任何人替你关掉它。' },
          { speaker: 'npc', text: '父亲在我的名字里，你倾注的究竟是天使神圣的祝福，还是魔鬼嗜血的诅咒？' },
        ],
      },
      {
        id: 'cuizhejin_experiment',
        title: '关于仁馨的实验',
        condition: { chapterIds: ['dossier'] },
        lines: [
          { speaker: 'player', text: '你发现了什么？' },
          { speaker: 'npc', text: '曹怀敬在做一件不该做的事。他不是在治病，他在制造“神”。' },
          { speaker: 'npc', text: '袁枝……2016G……他不该被这样对待。我把那东西藏起来了，只有你能找到。' },
        ],
      },
      {
        id: 'cuizhejin_hidden',
        title: '你把大脑组织藏在哪？',
        condition: { clueIds: ['clue_postcard'] },
        lines: [
          { speaker: 'player', text: '明信片背面写着 304 fridge brain。你把袁枝的大脑组织藏进了姚欢的冰箱？' },
          { speaker: 'npc', text: '只有最不起眼的地方，才能逃过最贪婪的眼睛。' },
          { speaker: 'npc', text: '姚欢从不开那台冰箱，曹怀敬也不会去碰一个厌食症病人的食物储藏。' },
          { speaker: 'npc', text: '但我没想到，袁枝比我想象的更接近“圆满”。' },
        ],
      },
      {
        id: 'cuizhejin_cao',
        title: '曹怀敬为什么排挤你？',
        condition: { clueIds: ['clue_cao_notebook'] },
        lines: [
          { speaker: 'player', text: '你的记录里写满了他的实验。他取消你 4 楼权限，是因为你发现了真相？' },
          { speaker: 'npc', text: '他想造神，而我只想把病人当成人。' },
          { speaker: 'npc', text: '当我把袁枝的组织藏进冰箱那天，我就知道，他不会让我活着离开仁馨。' },
        ],
      },
    ],
  },
  {
    id: 'caohuaijing',
    name: '曹怀敬',
    role: 'npc',
    color: '#4a4a4a',
    accent: '#b0b0b0',
    silhouette: 'sharp',
    aliases: ['曹院长'],
    backstory:
      '仁馨精神病院院长，神经外科专家。痴迷于“高功能脑区”理论，为追求医学突破不惜进行非法人体实验。是崔哲金的反对者，也是整个悲剧的始作俑者之一。',
    personality: ['冷酷功利', '科学狂热', '漠视伦理'],
    relations: [
      { targetId: 'cuizhejin', label: '对手', description: '曹怀敬排挤崔哲金，取消他的四楼权限。' },
      { targetId: 'liumeixi', label: '共谋', description: '刘美汐执行了曹怀敬默许的整合术。' },
    ],
    interviewTopics: [
      {
        id: 'caohuaijing_default',
        title: '关于你的研究',
        lines: [
          { speaker: 'player', text: '你为什么要做这些？' },
          { speaker: 'npc', text: '医学总是要有人付出代价。我只是在加速结果。', unlockClueId: 'clue_caohuaijing_dialogue' },
          { speaker: 'npc', text: '那些病人原本什么都不是。是我给了他们价值。' },
        ],
      },
      {
        id: 'caohuaijing_cui',
        title: '崔哲金发现了什么？',
        condition: { clueIds: ['clue_cao_notebook'] },
        lines: [
          { speaker: 'player', text: '你的原始记录本里，崔哲金一直在反对你。' },
          { speaker: 'npc', text: '他太软弱。明明可以触摸到神的边界，却非要回头看凡人的眼泪。' },
          { speaker: 'npc', text: '我取消了他的四楼权限，让他离袁枝远一点。结果呢？他反而把组织偷走了。' },
        ],
      },
      {
        id: 'caohuaijing_liumeixi',
        title: '刘美汐对袁枝做了什么？',
        condition: { clueIds: ['clue_liumeixi_dialogue'] },
        lines: [
          { speaker: 'player', text: '刘美汐说对 2016G 做的是整合术。这是你的授意？' },
          { speaker: 'npc', text: '美汐比我更敢下注。整合术是全新的方向——不是剥离能力，而是放大它。' },
          { speaker: 'npc', text: '袁枝只是第一个成功的样本。可惜，样本有了自己的意志。' },
        ],
      },
      {
        id: 'caohuaijing_fire',
        title: '11·6 那天你知情吗？',
        condition: { clueIds: ['clue_meeting_room_card'] },
        lines: [
          { speaker: 'player', text: '会议室的晨会视频被替换，四名医护被催眠烧死。你事先知道吗？' },
          { speaker: 'npc', text: '我知道袁枝在看他们。我知道他在学习“控制”。' },
          { speaker: 'npc', text: '但我没想到，他会把整栋楼都变成自己的实验场。' },
        ],
      },
    ],
  },
  {
    id: 'liumeixi',
    name: '刘美汐',
    role: 'npc',
    color: '#6b4d6b',
    accent: '#d8a8d8',
    silhouette: 'round',
    backstory:
      '神经外科医生，曹怀敬的追随者。对袁枝执行了“高功能整合术”，使其保留并强化了催眠能力。她称这只是医学实验，对后果保持冷漠的好奇。',
    personality: ['冷漠理性', '好奇心强', '缺乏同理心'],
    relations: [
      { targetId: 'yuanzhi', label: '整合术者', description: '刘美汐对袁枝做了整合术，袁枝称她为“姐姐”。' },
      { targetId: 'caohuaijing', label: '共谋', description: '在曹怀敬的默许下执行整合术。' },
    ],
    interviewTopics: [
      {
        id: 'liumeixi_default',
        title: '关于整合术',
        lines: [
          { speaker: 'player', text: '你对袁枝做了什么？' },
          { speaker: 'npc', text: '我对 2016G 做的不是剥离，是整合。', unlockClueId: 'clue_liumeixi_dialogue' },
          { speaker: 'npc', text: '他将来会变成什么样，我也没想到。' },
        ],
      },
      {
        id: 'liumeixi_yuanzhi',
        title: '袁枝口中的“姐姐”是你吗？',
        condition: { clueIds: ['clue_yuanzhi_dialogue'] },
        lines: [
          { speaker: 'player', text: '袁枝叫你“美汐姐姐”。他把你当成什么人？' },
          { speaker: 'npc', text: '他把我当成让他“圆满”的人。' },
          { speaker: 'npc', text: '整合术之后，他的高功能区没有被削弱，反而被打通了。他能做到普通催眠师做不到的事。' },
          { speaker: 'npc', text: '比如，隔着屏幕让人服从。' },
        ],
      },
      {
        id: 'liumeixi_night',
        title: '5 号晚上为什么把他关禁闭室？',
        condition: { clueIds: ['clue_yuanzhi_locked'] },
        lines: [
          { speaker: 'player', text: '11 月 5 日晚上袁枝被关进 309 禁闭室。是你安排的吗？' },
          { speaker: 'npc', text: '他白天太兴奋，一直玩游戏机，还对着空气说话。' },
          { speaker: 'npc', text: '我以为关一夜能让他安静下来。没想到，他把那间禁闭室变成了控制中心。' },
        ],
      },
    ],
  },
  {
    id: 'wangmin',
    name: '王敏',
    role: 'npc',
    color: '#5a6b4a',
    accent: '#b8d0a0',
    silhouette: 'round',
    aliases: ['王姐'],
    backstory:
      '检验科医生，叶臻的朋友。关心叶臻的纤维肌痛，提醒她止痛药的使用。在仁馨的非法实验中不是核心人物，但知情并选择了沉默。',
    personality: ['温和关怀', '谨慎', '内心矛盾'],
    relations: [
      { targetId: 'yezhen', label: '关心', description: '王敏多次提醒叶臻注意疼痛和药物。' },
    ],
    interviewTopics: [
      {
        id: 'wangmin_default',
        title: '关于你的身体',
        lines: [
          { speaker: 'player', text: '王姐，我的体检结果怎么样？' },
          { speaker: 'npc', text: '纤维肌痛不会要命，但会陪你一辈子。别硬撑，疼就吃一颗。', unlockClueId: 'clue_wangmin_dialogue' },
          { speaker: 'npc', text: '不过你这次……止痛药是不是没带够？' },
        ],
      },
      {
        id: 'wangmin_painkiller',
        title: '仁馨的止痛药有问题吗？',
        condition: { chapterIds: ['dossier'] },
        lines: [
          { speaker: 'player', text: '王姐，仁馨药局给病人送的止痛药，成分你查过吗？' },
          { speaker: 'npc', text: '我查过。苯二氮卓类镇静剂，含量比常规高。' },
          { speaker: 'npc', text: '对普通病人只是睡得沉一点，但对你……你本来就把止痛药放回了抽屉。' },
          { speaker: 'npc', text: '叶臻，听我的，疼就吃自己的药。别让这里的药替你睡着。' },
        ],
      },
      {
        id: 'wangmin_silence',
        title: '你早就知道这些实验？',
        condition: { clueIds: ['clue_cao_notebook'] },
        lines: [
          { speaker: 'player', text: '曹怀敬的原始记录本里，有些事只有检验科能配合。你也参与了？' },
          { speaker: 'npc', text: '我只是帮他查过几份血样。我以为……只是研究。' },
          { speaker: 'npc', text: '等我发现那些样本来自术后病人时，已经来不及了。' },
        ],
      },
    ],
  },
  {
    id: 'chenzhijie',
    name: '陈志杰',
    role: 'npc',
    color: '#4a5a6b',
    accent: '#a0bcd8',
    silhouette: 'default',
    backstory:
      '仁馨医生，4 名被催眠致死的医护之一。性格正直专业，但在袁枝的催眠视频面前毫无抵抗之力。他的证言揭示了晨会视频被替换的关键细节。',
    personality: ['正直专业', '无力', '尽职尽责'],
    relations: [
      { targetId: 'caohuaijing', label: '同事', description: '在曹怀敬手下工作。' },
      { targetId: 'liumeixi', label: '同事', description: '与刘美汐共事。' },
    ],
    interviewTopics: [
      {
        id: 'chenzhijie_default',
        title: '关于晨会',
        lines: [
          { speaker: 'player', text: '11 月 6 日晨会发生了什么？' },
          { speaker: 'npc', text: '晨会视频被替换的时候，我们四个就坐在会议室里，看着它播放。', unlockClueId: 'clue_chenzhijie_dialogue' },
          { speaker: 'npc', text: '画面里有人说：你们都不会感觉到热，也不能移动。' },
          { speaker: 'npc', text: '然后我们就真的……动不了了。' },
        ],
      },
    ],
  },
  {
    id: 'liushi',
    name: '刘师姐',
    role: 'npc',
    color: '#7a5a6b',
    accent: '#e0b8c8',
    silhouette: 'hooded',
    backstory:
      '叶臻的师姐，曾在仁馨建档。期间被催眠，有三天记忆完全空白。她的经历是叶臻警惕仁馨的重要提醒。',
    personality: ['谨慎惊恐', '敏感', '信任叶臻'],
    relations: [
      { targetId: 'yezhen', label: '师妹', description: '刘师姐通过短信提醒叶臻仁馨的异常。' },
    ],
    interviewTopics: [
      {
        id: 'liushi_default',
        title: '关于你在仁馨的经历',
        lines: [
          { speaker: 'player', text: '师姐，你在仁馨到底发生了什么？' },
          { speaker: 'npc', text: '我在仁馨建档时，有三天记忆是空的。', unlockClueId: 'clue_liushi_dialogue' },
          { speaker: 'npc', text: '我只记得有人一直数到十。' },
          { speaker: 'npc', text: '叶臻，你千万小心。别信任何人。' },
        ],
      },
      {
        id: 'liushi_details',
        title: '你还记得什么细节？',
        condition: { clueIds: ['clue_liushi_dialogue'] },
        lines: [
          { speaker: 'player', text: '那三天里，你真的什么都不记得了吗？' },
          { speaker: 'npc', text: '我记得机器臂送药的声音，记得走廊里有人在数数。' },
          { speaker: 'npc', text: '我记得自己站在活动室，看着墙上的电视，然后天就亮了。' },
          { speaker: 'npc', text: '最可怕的是……我记得自己很高兴。' },
        ],
      },
      {
        id: 'liushi_escape',
        title: '你是怎么离开仁馨的？',
        condition: { chapterIds: ['dossier'] },
        lines: [
          { speaker: 'player', text: '你被催眠了三天，后来是怎么逃出来的？' },
          { speaker: 'npc', text: '我没有逃。是他们放我走的。' },
          { speaker: 'npc', text: '离开那天，曹怀敬对我说：你什么都不记得，对你来说是最好的结果。' },
          { speaker: 'npc', text: '可我记得数数。我记得“十”。' },
        ],
      },
    ],
  },
];

export const characterById = (id: string): Character | undefined =>
  characters.find((c) => c.id === id);

export const characterByName = (name: string): Character | undefined =>
  characters.find((c) => c.name === name || c.aliases?.includes(name));

// 从任意文本中匹配最相关的角色（按匹配词长度优先，减少误匹配）
export function findCharacterInText(text: string): Character | undefined {
  if (!text) return undefined;

  const candidates = characters.flatMap((c) => [
    { term: c.name, char: c },
    ...(c.aliases || []).map((a) => ({ term: a, char: c })),
  ]);

  // 先匹配长词，避免“王”误匹配到“王敏”等
  candidates.sort((a, b) => b.term.length - a.term.length);

  for (const { term, char } of candidates) {
    if (text.includes(term)) return char;
  }
  return undefined;
}
