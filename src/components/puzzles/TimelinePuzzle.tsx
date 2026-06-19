import { useState, useCallback, useMemo } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TimelinePuzzle({ puzzle, onSolve }: Props) {
  const events = puzzle.events || [];
  const slots = puzzle.timeSlots || [];
  const correctOrder = (puzzle.answer as string[]) || events;

  const shuffledEvents = useMemo(() => shuffleArray(events), [events]);

  const [assignments, setAssignments] = useState<(string | null)[]>(() => Array(slots.length).fill(null));
  const [dragged, setDragged] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { playSuccess, playError, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const assignedSet = new Set(assignments.filter(Boolean) as string[]);
  const unassigned = shuffledEvents.filter((e) => !assignedSet.has(e));

  const handleDragStart = useCallback((e: React.DragEvent, event: string) => {
    e.dataTransfer.setData('text/plain', event);
    setDragged(event);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const placeEvent = useCallback((event: string, slotIndex: number) => {
    setAssignments((prev) => {
      const next = [...prev];
      // 如果该事件已在其他槽位，先清空
      const existingIdx = next.indexOf(event);
      if (existingIdx >= 0) next[existingIdx] = null;
      // 如果目标槽位已有事件，且来源是拖拽，则交换
      const existing = next[slotIndex];
      if (existing && dragged !== existing) {
        if (existingIdx >= 0) next[existingIdx] = existing;
      }
      next[slotIndex] = event;
      return next;
    });
    setDragged(null);
  }, [dragged]);

  const handleDrop = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      e.preventDefault();
      const event = e.dataTransfer.getData('text/plain');
      if (!event) return;
      placeEvent(event, slotIndex);
    },
    [placeEvent]
  );

  const removeFromSlot = useCallback((slotIndex: number) => {
    setAssignments((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setAssignments(Array(slots.length).fill(null));
    setError(false);
  }, [slots.length]);

  const submit = useCallback(() => {
    const correct = assignments.every((event, idx) => event === correctOrder[idx]);
    if (correct) {
      playSuccess();
      onSolve();
    } else {
      playError();
      playHeartbeat();
      recordWrongAttempt();
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  }, [assignments, correctOrder, playSuccess, playError, playHeartbeat, recordWrongAttempt, onSolve]);

  return (
    <div className={`space-y-4 ${error ? 'animate-shake' : ''}`}>
      {/* 待选事件 */}
      <div className="rounded border border-asylum-600 bg-asylum-800/40 p-3">
        <div className="mb-2 text-xs text-asylum-muted">待选事件（拖拽到时间槽）</div>
        <div className="flex flex-wrap gap-2">
          {unassigned.length > 0 ? (
            unassigned.map((event) => (
              <div
                key={event}
                draggable
                onDragStart={(e) => handleDragStart(e, event)}
                className="cursor-grab rounded border border-asylum-600 bg-asylum-700/60 px-3 py-2 text-xs text-asylum-paper shadow-sm transition hover:bg-asylum-700 active:cursor-grabbing"
              >
                {event}
              </div>
            ))
          ) : (
            <div className="text-xs text-asylum-muted">所有事件已放置</div>
          )}
        </div>
      </div>

      {/* 时间槽 */}
      <div className="space-y-2">
        {slots.map((slot, idx) => {
          const event = assignments[idx];
          return (
            <div
              key={slot}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex items-center gap-3 rounded border p-2 transition ${
                event ? 'border-asylum-600 bg-asylum-800/60' : 'border-dashed border-asylum-700 bg-asylum-800/30'
              }`}
            >
              <div className="flex h-10 w-12 flex-none items-center justify-center rounded bg-asylum-900 text-xs font-medium text-asylum-paper">
                {slot}
              </div>
              <div className="flex-1">
                {event ? (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                    onClick={() => removeFromSlot(idx)}
                    className="cursor-grab rounded border border-asylum-500 bg-asylum-700/80 px-3 py-2 text-xs text-asylum-paper hover:bg-asylum-600 active:cursor-grabbing"
                    title="点击移除，或拖拽到其他槽位"
                  >
                    {event}
                  </div>
                ) : (
                  <div className="py-2 text-xs text-asylum-muted">把事件拖到这里</div>
                )}
              </div>
              {event && (
                <button
                  onClick={() => removeFromSlot(idx)}
                  className="flex-none rounded p-1 text-asylum-muted hover:bg-asylum-700 hover:text-asylum-paper"
                  title="移除"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={unassigned.length > 0}
          className="flex items-center gap-2 rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={16} /> 确认顺序
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded border border-asylum-600 bg-asylum-800 px-4 py-2 text-sm text-asylum-paper hover:bg-asylum-700"
        >
          <RotateCcw size={16} /> 重置
        </button>
      </div>

      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
