export type Tag = '人物' | '地点' | '时间' | '机制' | '物品' | '案件' | '异常' | '新闻' | '身份' | '玩家' | '谜题' | '催眠' | '动机' | '时间线' | '医学';

export interface Clue {
  id: string;
  title: string;
  source: string;
  description: string;
  tags: Tag[];
  image?: string;
}

export type HintLevel = 1 | 2 | 3 | 4;

export interface Puzzle {
  id: string;
  type: 'quiz' | 'morse' | 'connect' | 'timeline' | 'accusation' | 'photo' | 'iccard' | 'compound' | 'manual' | 'cipher' | 'jigsaw' | 'hidden';
  title: string;
  description: string;
  answer: string | string[] | Record<string, string>;
  hints: [string, string, string, string]; // 4 级提示
  // 用于连线题等
  options?: { from: string[]; to: string[] };
  // 用于时间线题
  events?: string[];
  image?: string;
  overlayImage?: string;
  targetRect?: { x: number; y: number; w: number; h: number };
  hiddenClue?: string;
  fragments?: string[];
  slots?: string[];
  subPuzzleIds?: string[];
  // 密码盘
  cipherText?: string;
  shift?: number;
  // 拼图
  grid?: { rows: number; cols: number };
  // 隐藏对象
  targets?: { id: string; x: number; y: number; w: number; h: number; label: string }[];
  // 推理逻辑链：解谜后显示的思考过程
  solutionNotes?: string[];
  // 时间线谜题的时间槽
  timeSlots?: string[];
}

export type Hotspot = {
  id: string;
  imageIndex: number; // 对应 chapter.images 的下标
  x: number; // 百分比 0-100
  y: number;
  w: number;
  h: number;
  title: string;
  content: string;
  unlockClueId?: string;
};

export type StoryBeatType = 'narrative' | 'innerThought' | 'flashback' | 'dialogue';

export interface StoryBeat {
  id: string;
  type: StoryBeatType;
  content: string;
  characterId?: string; // dialogue 类型时必填
  image?: string; // flashback 可配图
  audio?: string;
}

export interface AdvanceQuestion {
  question: string;
  answer: string;
  hints: [string, string, string, string];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  narrative?: string;
  objective?: string; // 当前章节目标提示
  images?: string[];
  hotspots?: Hotspot[];
  clueIds?: string[];
  audioClues?: { title: string; date: string; duration?: number }[];
  // 本章可访谈的角色列表（用于增强叙事）
  interviewCharacterIds?: string[];
  // 章节叙事节拍（进入章节时先播放）
  storyBeats?: StoryBeat[];
  // 进入下一章前的推理门槛问题
  advanceQuestion?: AdvanceQuestion;
  puzzleId?: string;
  nextChapterId?: string;
  isEnding?: boolean;
  painChoice?: boolean;
}
