import { useState, useRef, useCallback } from 'react';
import { ZoomIn, X, Search, ZoomOut, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Hotspot } from '../types/game';

interface DocumentImageProps {
  src: string;
  alt: string;
  caption?: string;
  hotspots?: Hotspot[];
}

const ZOOM_LEVEL = 2.5;

export default function DocumentImage({ src, alt, caption, hotspots = [] }: DocumentImageProps) {
  const [open, setOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [scale, setScale] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const [dragKey, setDragKey] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setDragKey((k) => k + 1);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setScale(1);
    setDragKey((k) => k + 1);
    setActiveHotspot(null);
    setShowHint(true);
    // 3 秒后自动隐藏操作提示
    setTimeout(() => setShowHint(false), 3000);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setActiveHotspot(null);
    resetZoom();
  }, [resetZoom]);

  const toggleZoom = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setScale((s) => {
      const next = s > 1 ? 1 : ZOOM_LEVEL;
      // 缩放级别切换时重置拖拽位置
      if (next !== s) setDragKey((k) => k + 1);
      return next;
    });
  }, []);

  // 阻止图片点击冒泡关闭，但允许双击缩放
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <div
        onClick={handleOpen}
        className="group relative cursor-zoom-in overflow-hidden rounded border border-asylum-600 bg-asylum-800 shadow"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-64 w-full object-contain transition group-hover:brightness-110"
          loading="lazy"
        />
        {hotspots.length > 0 && (
          <>
            {hotspots.map((h) => (
              <div
                key={h.id}
                className="absolute animate-pulse rounded border border-yellow-400/60 bg-yellow-400/10"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${h.w}%`,
                  height: `${h.h}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(h);
                  setOpen(true);
                }}
                title={h.title}
              />
            ))}
            <div className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-yellow-300">
              <Search size={10} className="inline" /> 可点击
            </div>
          </>
        )}
        <div className="absolute right-2 top-2 rounded bg-black/60 p-1.5 text-asylum-paper opacity-70 transition group-hover:opacity-100">
          <ZoomIn size={18} />
        </div>
        {caption && (
          <div className="bg-asylum-800 px-2 py-1 text-xs text-asylum-muted">{caption}</div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/92 backdrop-blur-sm"
          >
            {/* 顶部工具栏：始终悬浮在安全区域 */}
            <div className="fixed left-0 right-0 top-0 z-[70] flex items-center justify-between gap-2 bg-gradient-to-b from-black/80 to-transparent px-4 pb-8 pt-4">
              <div className="flex items-center gap-2 text-xs text-asylum-paper/80">
                <span className="rounded bg-asylum-800/80 px-2 py-1">
                  {scale > 1 ? `${Math.round(scale * 100)}%` : '适应屏幕'}
                </span>
                <span className="hidden rounded bg-asylum-800/80 px-2 py-1 sm:inline">
                  {scale > 1 ? <Move size={10} className="inline" /> : <ZoomIn size={10} className="inline" />}
                  {' '}
                  {scale > 1 ? '可拖拽移动' : '双击图片放大'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
                  className="rounded bg-asylum-800/90 p-2 text-asylum-paper shadow-lg ring-1 ring-asylum-600 hover:bg-asylum-700"
                  title={scale > 1 ? '缩小' : '放大'}
                >
                  {scale > 1 ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClose(); }}
                  className="rounded bg-asylum-800/90 p-2 text-asylum-paper shadow-lg ring-1 ring-asylum-600 hover:bg-red-900/80"
                  title="关闭"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* 点击背景关闭 */}
            <div
              className="absolute inset-0 z-[61]"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* 图片查看器：限制最大尺寸，支持双击缩放与拖拽 */}
            <div
              ref={viewerRef}
              className="pointer-events-none absolute inset-0 z-[65] flex items-center justify-center overflow-hidden p-4 pt-16"
            >
              <motion.div
                key={dragKey}
                className="pointer-events-auto relative cursor-zoom-in touch-manipulation"
                style={{
                  maxWidth: 'min(92vw, 1200px)',
                  maxHeight: 'min(82vh, 900px)',
                }}
                initial={{ scale: 1 }}
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag={scale > 1}
                dragConstraints={{
                  left: -800,
                  right: 800,
                  top: -600,
                  bottom: 600,
                }}
                dragElastic={0.1}
                onDoubleClick={toggleZoom}
                onClick={handleImageClick}
              >
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[82vh] max-w-[92vw] select-none rounded object-contain shadow-2xl"
                  draggable={false}
                />
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    className="absolute cursor-pointer rounded border-2 border-yellow-400/70 bg-yellow-400/20 hover:bg-yellow-400/30"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      width: `${h.w}%`,
                      height: `${h.h}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(h);
                    }}
                    title={h.title}
                  />
                ))}
              </motion.div>
            </div>

            {/* 底部操作提示 */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-asylum-800/90 px-4 py-2 text-xs text-asylum-paper shadow-lg ring-1 ring-asylum-600"
                >
                  {scale > 1 ? '拖拽移动图片，双击或点击 🔍 缩小' : '双击图片放大查看细节，点击 🔍 也可放大'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeHotspot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveHotspot(null)}
              className="fixed inset-0 z-[80] bg-black/60"
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-sm rounded-lg border border-asylum-600 bg-asylum-800 p-5 shadow-2xl"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-lg font-medium text-asylum-paper">{activeHotspot.title}</div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="rounded p-1 text-asylum-muted hover:bg-asylum-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-asylum-paper/90">{activeHotspot.content}</p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
