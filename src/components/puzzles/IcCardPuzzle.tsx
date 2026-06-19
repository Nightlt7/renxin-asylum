import { useState } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function IcCardPuzzle({ puzzle, onSolve }: Props) {
  const fragments = puzzle.fragments || [];
  const slots = puzzle.slots || [];
  const [placement, setPlacement] = useState<Record<string, number | null>>(
    () => Object.fromEntries(slots.map((s) => [s, null]))
  );
  const [selectedFragment, setSelectedFragment] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const { playClick, playSuccess, playError } = useAudio();

  const remaining = fragments
    .map((_, i) => i)
    .filter((i) => !Object.values(placement).includes(i));

  const place = (slot: string) => {
    if (selectedFragment === null) return;
    playClick();
    setPlacement({ ...placement, [slot]: selectedFragment });
    setSelectedFragment(null);
  };

  const remove = (slot: string) => {
    playClick();
    setPlacement({ ...placement, [slot]: null });
  };

  const submit = () => {
    if (answer.trim() === puzzle.answer) {
      playSuccess();
      onSolve();
    } else {
      playError();
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="space-y-4">
      {/* 拼贴板参考图 */}
      <div className="rounded border border-asylum-600 bg-asylum-900 p-2">
        <img
          src={puzzle.image}
          alt="IC 卡权限碎片拼贴板"
          className="mx-auto max-h-64 object-contain"
        />
      </div>

      {/* 编号槽位 */}
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => {
          const placed = placement[slot];
          return (
            <button
              key={slot}
              onClick={() => {
                if (placed !== null) {
                  remove(slot);
                } else if (selectedFragment !== null) {
                  place(slot);
                }
              }}
              className={`relative min-h-[80px] rounded border p-2 text-xs transition ${
                placed !== null
                  ? 'border-asylum-500 bg-asylum-700/50'
                  : selectedFragment !== null
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-asylum-600 bg-asylum-900/30'
              }`}
            >
              <span className="absolute left-1 top-1 text-asylum-muted">{slot}</span>
              <span className="mt-3 block">
                {placed !== null ? fragments[placed] : '点击放置碎片'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 碎片池 */}
      <div className="rounded border border-asylum-600 bg-asylum-800/30 p-3">
        <div className="mb-2 text-xs text-asylum-muted">碎片池（先点击碎片，再点击编号槽位）</div>
        <div className="flex flex-wrap gap-2">
          {remaining.map((i) => (
            <button
              key={i}
              onClick={() => { playClick(); setSelectedFragment(i); }}
              className={`rounded border px-2 py-1 text-xs transition ${
                selectedFragment === i
                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-200'
                  : 'border-asylum-600 bg-asylum-900 hover:bg-asylum-700'
              }`}
            >
              {fragments[i]}
            </button>
          ))}
        </div>
      </div>

      {/* 观察题 */}
      {Object.values(placement).some((v) => v !== null) && !showQuestion && (
        <button
          onClick={() => { playClick(); setShowQuestion(true); }}
          className="rounded bg-asylum-700 px-4 py-2 text-sm hover:bg-asylum-600"
        >
          读取记录并回答问题
        </button>
      )}

      {showQuestion && (
        <div className="space-y-2">
          <div className="text-sm text-asylum-paper">
            从拼合后的权限记录可以看出，谁的 4 楼权限最先被取消？
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="输入人名"
            className={`w-full rounded border bg-asylum-900 px-3 py-2 text-sm outline-none ${
              error ? 'animate-shake border-red-500' : 'border-asylum-600'
            }`}
          />
          <button
            onClick={submit}
            className="rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            提交
          </button>
          {error && <div className="text-sm text-red-400">答案不正确。</div>}
        </div>
      )}
    </div>
  );
}
