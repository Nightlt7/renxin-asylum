import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameState {
  currentChapterId: string;
  unlockedChapterIds: string[];
  collectedClueIds: string[];
  solvedPuzzleIds: string[];
  hintLevels: Record<string, number>; // puzzleId -> max hint level revealed (1-4)
  hasPainProtection: boolean;
  painkillerTakenInChapter: string | null;
  ending: 'good' | 'bad' | null;
  audioEnabled: boolean;
  audioVolume: number;
  wrongAttempts: number;
  seenClueIds: string[]; // 已读线索（打开过线索本）
  hasViewedIdentityCard: boolean;
  hasViewedTruthRecap: boolean;
  viewedDialogueTopicIds: string[]; // 已查看的访谈话题
  unlockedCharacterProfileIds: string[]; // 已解锁人物档案
  viewedStoryBeatIds: string[]; // 已播放的叙事节拍
  answeredAdvanceQuestionIds: string[]; // 已答对的章节门槛问题
}

interface GameActions {
  unlockChapter: (id: string) => void;
  goToChapter: (id: string) => void;
  collectClue: (id: string) => void;
  solvePuzzle: (id: string) => void;
  useHint: (puzzleId: string, level: number) => void;
  takePainkiller: (chapterId: string) => void;
  setEnding: (ending: 'good' | 'bad') => void;
  setAudioEnabled: (enabled: boolean) => void;
  setAudioVolume: (volume: number) => void;
  recordWrongAttempt: () => void;
  markCluesSeen: () => void;
  viewIdentityCard: () => void;
  viewTruthRecap: () => void;
  viewDialogueTopic: (topicId: string) => void;
  unlockCharacterProfile: (charId: string) => void;
  viewStoryBeat: (beatId: string) => void;
  answerAdvanceQuestion: (chapterId: string) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  currentChapterId: 'intro',
  unlockedChapterIds: ['intro'],
  collectedClueIds: [],
  solvedPuzzleIds: [],
  hintLevels: {},
  hasPainProtection: true,
  painkillerTakenInChapter: null,
  ending: null,
  audioEnabled: true,
  audioVolume: 0.5,
  wrongAttempts: 0,
  seenClueIds: [],
  hasViewedIdentityCard: false,
  hasViewedTruthRecap: false,
  viewedDialogueTopicIds: [],
  unlockedCharacterProfileIds: [],
  viewedStoryBeatIds: [],
  answeredAdvanceQuestionIds: [],
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,
      unlockChapter: (id) =>
        set((state) => ({
          unlockedChapterIds: state.unlockedChapterIds.includes(id)
            ? state.unlockedChapterIds
            : [...state.unlockedChapterIds, id],
        })),
      goToChapter: (id) => set({ currentChapterId: id }),
      collectClue: (id) =>
        set((state) => ({
          collectedClueIds: state.collectedClueIds.includes(id)
            ? state.collectedClueIds
            : [...state.collectedClueIds, id],
        })),
      solvePuzzle: (id) =>
        set((state) => ({
          solvedPuzzleIds: state.solvedPuzzleIds.includes(id)
            ? state.solvedPuzzleIds
            : [...state.solvedPuzzleIds, id],
        })),
      useHint: (puzzleId, level) =>
        set((state) => ({
          hintLevels: {
            ...state.hintLevels,
            [puzzleId]: Math.max(state.hintLevels[puzzleId] || 0, level),
          },
        })),
      takePainkiller: (chapterId) =>
        set({ hasPainProtection: false, painkillerTakenInChapter: chapterId }),
      setEnding: (ending) => set({ ending }),
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      setAudioVolume: (volume) => set({ audioVolume: volume }),
      recordWrongAttempt: () =>
        set((state) => ({ wrongAttempts: state.wrongAttempts + 1 })),
      markCluesSeen: () =>
        set((state) => ({ seenClueIds: [...state.collectedClueIds] })),
      viewIdentityCard: () => set({ hasViewedIdentityCard: true }),
      viewTruthRecap: () => set({ hasViewedTruthRecap: true }),
      viewDialogueTopic: (topicId) =>
        set((state) => ({
          viewedDialogueTopicIds: state.viewedDialogueTopicIds.includes(topicId)
            ? state.viewedDialogueTopicIds
            : [...state.viewedDialogueTopicIds, topicId],
        })),
      unlockCharacterProfile: (charId) =>
        set((state) => ({
          unlockedCharacterProfileIds: state.unlockedCharacterProfileIds.includes(charId)
            ? state.unlockedCharacterProfileIds
            : [...state.unlockedCharacterProfileIds, charId],
        })),
      viewStoryBeat: (beatId) =>
        set((state) => ({
          viewedStoryBeatIds: state.viewedStoryBeatIds.includes(beatId)
            ? state.viewedStoryBeatIds
            : [...state.viewedStoryBeatIds, beatId],
        })),
      answerAdvanceQuestion: (chapterId) =>
        set((state) => ({
          answeredAdvanceQuestionIds: state.answeredAdvanceQuestionIds.includes(chapterId)
            ? state.answeredAdvanceQuestionIds
            : [...state.answeredAdvanceQuestionIds, chapterId],
        })),
      resetGame: () => set({ ...initialState }),
    }),
    {
      name: 'renxin-game-storage',
      partialize: (state) => ({
        currentChapterId: state.currentChapterId,
        unlockedChapterIds: state.unlockedChapterIds,
        collectedClueIds: state.collectedClueIds,
        solvedPuzzleIds: state.solvedPuzzleIds,
        hintLevels: state.hintLevels,
        hasPainProtection: state.hasPainProtection,
        painkillerTakenInChapter: state.painkillerTakenInChapter,
        ending: state.ending,
        audioEnabled: state.audioEnabled,
        audioVolume: state.audioVolume,
        wrongAttempts: state.wrongAttempts,
        seenClueIds: state.seenClueIds,
        hasViewedIdentityCard: state.hasViewedIdentityCard,
        hasViewedTruthRecap: state.hasViewedTruthRecap,
        viewedDialogueTopicIds: state.viewedDialogueTopicIds,
        unlockedCharacterProfileIds: state.unlockedCharacterProfileIds,
        viewedStoryBeatIds: state.viewedStoryBeatIds,
        answeredAdvanceQuestionIds: state.answeredAdvanceQuestionIds,
      }),
    }
  )
);
