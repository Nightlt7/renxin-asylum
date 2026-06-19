import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, BookOpen, ChevronRight, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import TruthRecap from './TruthRecap';
import CharacterAvatar from './CharacterAvatar';
import EpilogueCard from './EpilogueCard';

export default function EndingView() {
  const { ending, hasPainProtection, resetGame, hintLevels, viewTruthRecap } = useGameStore();
  const { playClick, playAdvance } = useAudio();
  const [stage, setStage] = useState(0);

  const isGood = ending === 'good';

  // 推理评级：根据提示使用次数
  const usedPuzzles = Object.values(hintLevels).filter((l) => l > 0).length;
  const totalHintLevels = Object.values(hintLevels).reduce((a, b) => a + b, 0);
  let rating = 'B';
  if (isGood) {
    if (usedPuzzles === 0) rating = 'S';
    else if (totalHintLevels <= 4) rating = 'A';
    else if (totalHintLevels <= 10) rating = 'B';
    else rating = 'C';
  }

  const handleNextStage = () => {
    playAdvance();
    const next = stage + 1;
    setStage(next);
    if (next >= 4) {
      viewTruthRecap();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-10 text-center transition ${
        !isGood && stage >= 2 ? 'blur-[1px] brightness-75' : ''
      }`}
    >
      <div
        className={`mb-6 text-5xl ${
          isGood ? 'text-green-400' : 'text-asylum-accent'
        }`}
      >
        {isGood ? '真结局 · 存活' : '坏结局 · 死亡'}
      </div>

      <div className="w-full space-y-4 rounded border border-asylum-600 bg-asylum-800/50 p-6 text-left text-base leading-relaxed">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="stage0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isGood ? (
                <>
                  <p>
                    你在恍惚中进入长梦，梦里出现“天台温热的风带着花香”。
                    但<strong>梦不可能有气味</strong>——一阵疼痛袭来，你清醒了。
                  </p>
                  <p>
                    你正确锁定了真凶袁枝。警方将他羁押，庭审认定袁枝杀害曹怀敬、崔哲金、刘美汐、陈志杰、王敏事实成立；
                    但因违法违规医疗实验造成脑损伤、作案时为无民事行为能力人，他被强制医疗。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    你判断错了方向，{!hasPainProtection && '又或者你刚刚服下了止痛药、失去了疼痛的庇护。'}
                    疲惫中你做了一个混乱的长梦，梦里出现“天台温热的风带着花香”。
                  </p>
                  <p>
                    你惊醒时，面前的人正是逍遥法外的袁枝。他说：
                    “本来想再问问那东西的下落，不过你应该也不知道。”
                  </p>
                  <p>“去死吧。”轻轻一推。</p>
                </>
              )}
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {isGood ? (
                <>
                  <div className="flex items-center gap-3">
                    <CharacterAvatar id="yuanzhi" size="md" />
                    <div className="rounded-lg bg-asylum-700/50 px-3 py-2 text-sm text-asylum-paper">
                      “你父亲是个好人，好人总是输。你这局赢得不错，原始记录本还给你吧。”
                    </div>
                  </div>
                  <p className="italic text-asylum-muted">
                    袁枝戴防催眠面罩，被押出法庭。经过你身边时，他停下脚步，准确叫出你的真名：“崔诣。”
                  </p>
                  <p>
                    你接过那本原始记录本。封面有崔哲金的笔迹，最后一页写着：
                    “小诣，对不起，也谢谢你愿意来。”
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <CharacterAvatar id="yuanzhi" size="md" />
                    <div className="rounded-lg bg-asylum-700/50 px-3 py-2 text-sm text-asylum-paper">
                      “你和你父亲一样，都喜欢问问题。”
                    </div>
                  </div>
                  <p className="italic text-asylum-muted">
                    坠落的过程比想象中漫长。风灌进耳朵，盖住了所有声音。
                  </p>
                  <p>
                    你最后的念头是“弄错了”和“来不及”——和崔哲金一样的死法。
                  </p>
                </>
              )}
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="text-center text-sm text-asylum-muted">
                {isGood
                  ? '故事到这里还没有结束。那些活下来的人，后来怎么样了？'
                  : '故事在这里中断了。但在另一个选择里，结局或许不同。'}
              </div>
            </motion.div>
          )}

          {stage === 3 && (
            <EpilogueCard
              onClose={handleNextStage}
              onContinue={handleNextStage}
            />
          )}

          {stage >= 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TruthRecap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isGood && stage === 0 && (
        <div className="mt-6 rounded border border-asylum-600 bg-asylum-800/50 p-4 text-center">
          <div className="text-sm text-asylum-muted">本次推理评级</div>
          <div className="font-serif text-4xl text-yellow-400">{rating}</div>
          <div className="mt-1 text-xs text-asylum-muted">
            使用提示的谜题数：{usedPuzzles} / 总提示层数：{totalHintLevels}
          </div>
          {rating === 'S' && (
            <div className="mt-1 text-sm text-green-400">
              零提示通关，你的观察与推理无懈可击。
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {stage < 2 && (
          <button
            onClick={handleNextStage}
            className="flex items-center gap-2 rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            继续
            <ChevronRight size={16} />
          </button>
        )}

        {stage === 2 && (
          <button
            onClick={handleNextStage}
            className="flex items-center gap-2 rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            <Users size={16} /> 查看角色尾声
          </button>
        )}

        {stage === 3 && (
          <button
            onClick={handleNextStage}
            className="flex items-center gap-2 rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            <BookOpen size={16} /> 查看真相解析
          </button>
        )}

        {stage >= 4 && (
          <button
            onClick={() => { playClick(); resetGame(); }}
            className="flex items-center gap-2 rounded bg-asylum-700 px-5 py-2 text-sm text-asylum-paper hover:bg-asylum-600"
          >
            <RotateCcw size={18} /> 重新开始
          </button>
        )}
      </div>
    </motion.div>
  );
}
