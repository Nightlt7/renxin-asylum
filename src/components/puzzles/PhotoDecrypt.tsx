import { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCw, CheckCircle } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function PhotoDecrypt({ puzzle, onSolve }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [aligned, setAligned] = useState(false);
  const [found, setFound] = useState(false);
  const { playSuccess, playClick } = useAudio();

  const target = puzzle.targetRect || { x: 0.5, y: 0.5, w: 0.2, h: 0.2 };
  const overlaySize = 160;

  // 计算解密卡中心是否落在目标区域内
  const checkAlignment = useCallback(
    (x: number, y: number) => {
      const container = containerRef.current;
      if (!container) return false;
      const rect = container.getBoundingClientRect();
      const cx = (x + overlaySize / 2) / rect.width;
      const cy = (y + overlaySize / 2) / rect.height;
      return (
        cx >= target.x &&
        cx <= target.x + target.w &&
        cy >= target.y &&
        cy <= target.y + target.h
      );
    },
    [target]
  );

  const startDrag = (clientX: number, clientY: number) => {
    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!overlay || !container) return;
    const oRect = overlay.getBoundingClientRect();
    setDragging(true);
    setDragOffset({
      x: clientX - oRect.left,
      y: clientY - oRect.top,
    });
  };

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      let nx = clientX - cRect.left - dragOffset.x;
      let ny = clientY - cRect.top - dragOffset.y;
      // 限制在容器内
      nx = Math.max(0, Math.min(nx, cRect.width - overlaySize));
      ny = Math.max(0, Math.min(ny, cRect.height - overlaySize));
      setPos({ x: nx, y: ny });
      setAligned(checkAlignment(nx, ny));
    },
    [dragging, dragOffset, checkAlignment]
  );

  const endDrag = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [moveDrag, endDrag]);

  const rotate = () => {
    playClick();
    setRotation((r) => (r + 90) % 360);
  };

  const confirmFind = () => {
    playSuccess();
    setFound(true);
    setTimeout(onSolve, 600);
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[4/3] w-full max-w-2xl cursor-crosshair select-none overflow-hidden rounded border border-asylum-600 bg-asylum-900"
      >
        {/* 病房照片 */}
        <img
          src={puzzle.image}
          alt="病房照片"
          className="pointer-events-none h-full w-full object-contain"
          draggable={false}
        />

        {/* 目标区域高亮（仅当对齐时显示） */}
        {aligned && (
          <div
            className="pointer-events-none absolute animate-pulse rounded border-2 border-yellow-400 bg-yellow-400/20"
            style={{
              left: `${target.x * 100}%`,
              top: `${target.y * 100}%`,
              width: `${target.w * 100}%`,
              height: `${target.h * 100}%`,
            }}
          />
        )}

        {/* 解密卡遮罩 */}
        <img
          ref={overlayRef}
          src={puzzle.overlayImage}
          alt="照片解密卡"
          draggable={false}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
          onTouchStart={(e) => {
            e.preventDefault();
            if (e.touches[0]) startDrag(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className={`absolute touch-none object-contain ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            width: overlaySize,
            height: overlaySize,
            left: pos.x,
            top: pos.y,
            transform: `rotate(${rotation}deg)`,
            opacity: 0.92,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={rotate}
          className="flex items-center gap-1 rounded bg-asylum-700 px-3 py-1.5 text-sm hover:bg-asylum-600"
        >
          <RotateCw size={14} /> 旋转解密卡
        </button>
        {aligned && !found && (
          <button
            onClick={confirmFind}
            className="flex items-center gap-1 rounded bg-yellow-600 px-3 py-1.5 text-sm font-medium text-black hover:bg-yellow-500"
          >
            <CheckCircle size={14} /> 发现隐藏线索：{puzzle.hiddenClue}
          </button>
        )}
      </div>

      {found && (
        <div className="text-center text-sm text-green-400">已确认：{puzzle.hiddenClue}</div>
      )}
    </div>
  );
}
