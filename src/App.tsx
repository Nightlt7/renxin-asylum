import { useEffect, useState } from 'react';
import { BookOpen, RotateCcw, Volume2, VolumeX, Menu, X, User, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useAudio } from './hooks/useAudio';
import { chapters } from './data/chapters';
import ChapterView from './components/ChapterView';
import ClueNotebook from './components/ClueNotebook';
import EndingView from './components/EndingView';
import Scanlines from './components/Scanlines';
import AmbientBackground from './components/AmbientBackground';
import PlayerIdentityCard from './components/PlayerIdentityCard';

function App() {
  const {
    currentChapterId,
    unlockedChapterIds,
    collectedClueIds,
    seenClueIds,
    hasViewedIdentityCard,
    ending,
    audioEnabled,
    setAudioEnabled,
    goToChapter,
    resetGame,
    viewIdentityCard,
  } = useGameStore();
  const hasNewClues = collectedClueIds.some((id) => !seenClueIds.includes(id));
  const { start, playClick, setMood } = useAudio();
  const [showNotebook, setShowNotebook] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);

  const currentChapter = chapters.find((c) => c.id === currentChapterId);

  useEffect(() => {
    // 首次用户交互后启动音频
    const handler = () => {
      start();
      window.removeEventListener('click', handler);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [start]);

  useEffect(() => {
    setMood(ending || currentChapterId);
  }, [ending, currentChapterId, setMood]);

  useEffect(() => {
    if (currentChapterId === 'intro' && !hasViewedIdentityCard) {
      const timer = setTimeout(() => setShowIdentity(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentChapterId, hasViewedIdentityCard]);

  const handleNav = (id: string) => {
    playClick();
    goToChapter(id);
    setShowMenu(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-asylum-900 text-asylum-paper">
      <AmbientBackground chapterId={ending ? 'ending' : currentChapterId} />
      <Scanlines />
      {/* 顶部导航 */}
      <header className="flex-none border-b border-asylum-700 bg-asylum-800/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { playClick(); setShowMenu(true); }}
              className="rounded p-2 hover:bg-asylum-700"
              aria-label="章节菜单"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-serif text-lg tracking-wide text-asylum-paper">
              仁馨精神病院
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playClick(); setShowIdentity(true); }}
              className="flex items-center gap-2 rounded bg-asylum-700 px-3 py-1.5 text-sm hover:bg-asylum-600"
            >
              <User size={16} />
              档案
            </button>
            <button
              onClick={() => { playClick(); setShowNotebook(true); }}
              className="relative flex items-center gap-2 rounded bg-asylum-700 px-3 py-1.5 text-sm hover:bg-asylum-600"
            >
              <BookOpen size={16} />
              线索本
              {hasNewClues && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
              )}
            </button>
            <button
              onClick={() => { playClick(); setAudioEnabled(!audioEnabled); }}
              className="rounded p-2 hover:bg-asylum-700"
              aria-label={audioEnabled ? '静音' : '开启声音'}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={() => { playClick(); if (confirm('确定要重置游戏进度吗？')) resetGame(); }}
              className="rounded p-2 hover:bg-asylum-700"
              aria-label="重置游戏"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* 当前目标提示 */}
      {currentChapter?.objective && !ending && (
        <div className="flex-none border-b border-asylum-700/50 bg-asylum-800/40 px-4 py-1.5 text-xs text-asylum-muted backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <Target size={12} className="text-asylum-accent" />
            <span className="font-medium text-asylum-paper/80">当前目标：</span>
            <span>{currentChapter.objective}</span>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {ending ? (
            <EndingView key="ending" />
          ) : currentChapter ? (
            <ChapterView key={currentChapterId} chapter={currentChapter} />
          ) : (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center p-6 text-center"
            >
              <div className="mb-4 text-6xl text-asylum-muted">?</div>
              <h2 className="mb-2 font-serif text-2xl text-asylum-paper">章节未找到</h2>
              <p className="mb-6 text-sm text-asylum-muted">当前章节 ID「{currentChapterId}」不存在，进度可能损坏。</p>
              <button
                onClick={() => { playClick(); goToChapter('intro'); }}
                className="rounded bg-asylum-accent px-6 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                返回序章
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 章节菜单 */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40 bg-black/60"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-asylum-800 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-asylum-700 p-4">
                <span className="font-serif text-lg">章节菜单</span>
                <button onClick={() => setShowMenu(false)} className="rounded p-1 hover:bg-asylum-700">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-1 p-3">
                {chapters.map((ch) => {
                  const unlocked = unlockedChapterIds.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && handleNav(ch.id)}
                      className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                        unlocked
                          ? 'hover:bg-asylum-700'
                          : 'cursor-not-allowed text-asylum-muted opacity-50'
                      } ${currentChapterId === ch.id ? 'bg-asylum-700' : ''}`}
                    >
                      <div className="font-medium">{ch.title} · {ch.subtitle}</div>
                      {!unlocked && <div className="text-xs text-asylum-muted">未解锁</div>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 线索本抽屉 */}
      <ClueNotebook open={showNotebook} onClose={() => setShowNotebook(false)} />

      {/* 角色档案弹窗 */}
      <PlayerIdentityCard
        open={showIdentity}
        onClose={() => {
          setShowIdentity(false);
          viewIdentityCard();
        }}
      />

      {/* 作者水印 */}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 select-none text-sm tracking-wider text-asylum-muted/40 transition hover:text-asylum-muted/70"
        aria-hidden="true"
      >
        岚天 作品
      </div>
    </div>
  );
}

export default App;
