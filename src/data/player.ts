export interface PlayerProfile {
  name: string;
  realName: string;
  title: string;
  identity: string;
  mission: string;
  trait: string;
  note: string;
  avatarText: string;
}

export const playerProfile: PlayerProfile = {
  name: '叶臻',
  realName: '崔诣',
  title: '特聘医疗支援专家',
  identity:
    '你受聘为香北市公安局仁馨精神病院遗留问题医疗支援专家，名义任务是为 7 名生还患者建档。真实身份是 11·6 纵火案嫌疑人崔哲金的孩子——崔诣。你进入仁馨，是为了查清父亲到底想告诉你什么。',
  mission:
    '在 3 天内完成 7 名生还患者的建档工作，同时调查 2017 年 11 月 6 日零号研究所纵火案与崔哲金坠楼的真相。',
  trait:
    '你患有纤维肌痛，长期疼痛。但你故意把止痛药放回抽屉——“疼痛可以避免被催眠”。这份疼痛，是你在仁馨唯一的护身符。',
  note: '你的每一个选择，都可能改变结局。',
  avatarText: '叶臻 崔诣 特聘医疗支援专家',
};
