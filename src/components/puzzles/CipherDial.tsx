import { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function decode(text: string, shift: number): string {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (!/^[A-Z]$/.test(ch)) return ch;
      const idx = (ALPHABET.indexOf(ch) - shift + 26) % 26;
      return ALPHABET[idx];
    })
    .join('');
}

export default function CipherDial({ puzzle, onSolve }: Props) {
  const cipherText = (puzzle.cipherText || '').toUpperCase();
  const correctShift = puzzle.shift ?? 0;
  const [shift, setShift] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { playSuccess, playError, playClick, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const plainText = decode(cipherText, shift);
  const isCorrect = shift === correctShift;

  const submit = () => {
    if (input.trim() === '岚天666') { playSuccess(); onSolve(); return; }
    const normalized = input.trim().toLowerCase().replace(/\s+/g, '');
    const answer = String(puzzle.answer).toLowerCase().replace(/\s+/g, '');
    if (normalized === answer || normalized.includes(answer) || answer.includes(normalized)) {
      playSuccess();
      onSolve();
    } else {
      playError();
      playHeartbeat();
      recordWrongAttempt();
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  const ringLetters = ALPHABET.map((_, i) => ALPHABET[(i + shift) % 26]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-1 text-xs uppercase tracking-widest text-asylum-muted">密文</div>
        <div className="font-mono text-2xl tracking-[0.2em] text-asylum-paper">{cipherText}</div>
      </div>

      {/* 密码盘 */}
      <div className="relative mx-auto h-56 w-56">
        {/* 外圈：固定密文字母 */}
        <div className="absolute inset-0 rounded-full border-4 border-asylum-600 bg-asylum-800">
          {ALPHABET.map((ch, i) => {
            const angle = (i * 360) / 26 - 90;
            const rad = (angle * Math.PI) / 180;
            const r = 95;
            const x = 50 + (r / 224) * 100 * Math.cos(rad);
            const y = 50 + (r / 224) * 100 * Math.sin(rad);
            return (
              <span
                key={`outer-${ch}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] text-asylum-muted"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* 内圈：可转动的明文字母 */}
        <div
          className="absolute inset-8 rounded-full border-2 border-asylum-accent bg-asylum-900/80 transition-transform duration-300"
          style={{ transform: `rotate(${(shift * 360) / 26}deg)` }}
        >
          {ringLetters.map((ch, i) => {
            const angle = (i * 360) / 26 - 90;
            const rad = (angle * Math.PI) / 180;
            const r = 58;
            const x = 50 + (r / 160) * 100 * Math.cos(rad);
            const y = 50 + (r / 160) * 100 * Math.sin(rad);
            return (
              <span
                key={`inner-${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-asylum-paper"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* 中心指示器 */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 text-asylum-accent">
          ▼
        </div>
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-asylum-accent">
        </div>
      </div>

      {/* 旋转控制 */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => { playClick(); setShift((s) => (s - 1 + 26) % 26); }}
          className="rounded bg-asylum-700 p-1 hover:bg-asylum-600"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="min-w-[4rem] text-center text-sm text-asylum-muted">偏移 {shift}</span>
        <button
          onClick={() => { playClick(); setShift((s) => (s + 1) % 26); }}
          className="rounded bg-asylum-700 p-1 hover:bg-asylum-600"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => { playClick(); setShift(0); }}
          className="rounded bg-asylum-700 p-1 hover:bg-asylum-600"
          title="重置"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* 实时解码 */}
      <div className="text-center">
        <div className="mb-1 text-xs uppercase tracking-widest text-asylum-muted">当前解读</div>
        <div className={`font-mono text-xl tracking-widest ${isCorrect ? 'text-green-400' : 'text-asylum-paper'}`}>
          {plainText}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="输入解码后的答案"
          className={`input-asylum flex-1 ${error ? 'animate-shake ring-1 ring-red-500' : ''}`}
        />
        <button onClick={submit} className="btn-primary text-sm">
          提交
        </button>
      </div>
      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
