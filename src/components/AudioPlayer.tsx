import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface AudioPlayerProps {
  title: string;
  date: string;
  duration?: number;
}

export default function AudioPlayer({ title, date, duration = 15 }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playClick, playTension } = useAudio();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= duration) {
            setPlaying(false);
            return 0;
          }
          return p + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, duration]);

  const toggle = () => {
    playClick();
    if (progress >= duration) setProgress(0);
    setPlaying(!playing);
    if (!playing && title.includes('崔哲金')) {
      // 播放崔哲金留言时加一点紧张底噪
      playTension();
    }
  };

  const stop = () => {
    playClick();
    setPlaying(false);
    setProgress(0);
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded border border-asylum-600 bg-asylum-800/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">🎧 {title}</div>
        <div className="text-xs text-asylum-muted">{date}</div>
      </div>

      {/* 波形 */}
      <div className="mb-3 flex h-10 items-center gap-0.5 overflow-hidden rounded bg-asylum-900/50 px-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-asylum-500"
            animate={
              playing
                ? {
                    height: [8, 16 + Math.random() * 20, 8],
                  }
                : { height: 8 }
            }
            transition={{
              duration: 0.4,
              repeat: playing ? Infinity : 0,
              delay: i * 0.02,
            }}
          />
        ))}
      </div>

      {/* 进度条 */}
      <div className="mb-3 h-1.5 overflow-hidden rounded bg-asylum-700">
        <div
          className="h-full bg-asylum-accent transition-all"
          style={{ width: `${(progress / duration) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded bg-asylum-700 hover:bg-asylum-600"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={stop}
            className="flex h-8 w-8 items-center justify-center rounded bg-asylum-700 hover:bg-asylum-600"
          >
            <Square size={12} />
          </button>
        </div>
        <div className="text-xs text-asylum-muted">
          {format(progress)} / {format(duration)}
        </div>
      </div>

      <div className="mt-2 text-xs text-asylum-muted">
        注：原音频文件已损坏，当前为模拟播放界面，仅保留文件名与录制时间。
      </div>
    </div>
  );
}
