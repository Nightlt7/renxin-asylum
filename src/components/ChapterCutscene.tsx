import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ChapterCutsceneProps {
  chapterId: string;
  onDone: () => void;
}

/** 每章通关演出配置 */
const scenes: Record<string, {
  title: string;
  subtitle: string;
  bgGradient: string;
  particles: { color: string; count: number };
  render: () => React.ReactNode;
}> = {
  intro: {
    title: '踏入深渊',
    subtitle: '仁馨精神病院的大门正在打开',
    bgGradient: 'radial-gradient(ellipse at center, #1a2a3a 0%, #0f1115 70%)',
    particles: { color: '#8b1e1e', count: 20 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 大门 */}
        <motion.div
          className="relative w-48 h-64 border-2 rounded-t-lg overflow-hidden"
          style={{ borderColor: '#2e343d', background: '#0f1115' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 1, 0.3, 1] }}
          transition={{ duration: 3, times: [0, 0.3, 0.6, 1] }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-6xl"
              animate={{ opacity: [0, 1, 1], scale: [0.5, 1.2, 1] }}
              transition={{ duration: 2 }}
            >
              🏥
            </motion.div>
          </div>
        </motion.div>
        {/* 光线射出 */}
        <motion.div
          className="absolute bottom-0 w-32 h-2"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a54b, transparent)' }}
          animate={{ opacity: [0, 0.8, 0], width: ['0%', '60%', '0%'] }}
          transition={{ duration: 2.5, delay: 0.3 }}
        />
      </div>
    ),
  },
  news: {
    title: '真相浮现',
    subtitle: '纵火案的报道揭开序幕',
    bgGradient: 'radial-gradient(ellipse at center, #2a1a1a 0%, #0f1115 70%)',
    particles: { color: '#c9a54b', count: 15 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 报纸展开 */}
        <motion.div
          className="w-64 h-40 rounded-sm relative overflow-hidden"
          style={{ background: '#e8e4dc' }}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-48 h-3 mb-2" style={{ background: '#1a1a1a' }} />
            <div className="w-56 h-1.5 mb-1.5" style={{ background: '#3e4651' }} />
            <div className="w-52 h-1.5 mb-1.5" style={{ background: '#3e4651' }} />
            <div className="w-54 h-1.5" style={{ background: '#3e4651' }} />
          </motion.div>
        </motion.div>
        {/* 火焰效果 */}
        <motion.div
          className="absolute -bottom-4 text-4xl"
          animate={{ opacity: [0, 1, 0.5, 0], y: [0, -10, -20, -30], scale: [0.5, 1.2, 0.8, 0] }}
          transition={{ duration: 2.5, delay: 0.5 }}
        >
          🔥
        </motion.div>
      </div>
    ),
  },
  phone: {
    title: '最后的讯息',
    subtitle: '手机里藏着父亲最后的话语',
    bgGradient: 'radial-gradient(ellipse at center, #0a1a2a 0%, #0f1115 70%)',
    particles: { color: '#4a6741', count: 12 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 手机 */}
        <motion.div
          className="w-32 h-56 rounded-2xl border-2 relative overflow-hidden"
          style={{ borderColor: '#3e4651', background: '#0d1117' }}
          animate={{ y: [0, -8, 0, -4, 0] }}
          transition={{ duration: 2, repeat: 1 }}
        >
          {/* 屏幕内容 */}
          <motion.div
            className="absolute inset-2 rounded-xl flex flex-col items-center justify-center gap-2"
            style={{ background: '#1a2332' }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: '#8b1e1e20' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-2xl">📞</span>
            </motion.div>
            <motion.div
              className="text-xs"
              style={{ color: '#8b1e1e' }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
            >
              未接来电 · 崔哲金
            </motion.div>
          </motion.div>
        </motion.div>
        {/* 信号波纹 */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: '#4a674140', width: 40 + i * 30, height: 40 + i * 30 }}
            animate={{ opacity: [0.5, 0], scale: [1, 2] }}
            transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </div>
    ),
  },
  dossier: {
    title: '档案解密',
    subtitle: '卷宗里的秘密正在浮出水面',
    bgGradient: 'radial-gradient(ellipse at center, #1a1a0f 0%, #0f1115 70%)',
    particles: { color: '#8b5e1e', count: 18 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 档案柜 */}
        <motion.div
          className="w-48 h-36 rounded border-2 relative overflow-hidden"
          style={{ borderColor: '#2e343d', background: '#181b21' }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-8 border-b"
              style={{
                top: i * 44 + 8, left: 8, right: 8,
                borderColor: '#3e4651', background: '#22262e',
              }}
              animate={{ x: [0, i % 2 === 0 ? 30 : -30, 0] }}
              transition={{ duration: 1.5, delay: i * 0.3 }}
            >
              {/* 抽屉把手 */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded" style={{ background: '#5a6370' }} />
            </motion.div>
          ))}
        </motion.div>
        {/* 机密印章 */}
        <motion.div
          className="absolute -bottom-2 text-4xl font-bold rotate-12 select-none"
          style={{ color: '#8b1e1e', opacity: 0.6 }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 0.8, 0.6] }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          解密
        </motion.div>
      </div>
    ),
  },
  letter: {
    title: '密码破解',
    subtitle: '蛇杖之下的隐藏信息被解开',
    bgGradient: 'radial-gradient(ellipse at center, #1a1a2a 0%, #0f1115 70%)',
    particles: { color: '#5a3a6a', count: 15 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 蛇杖 */}
        <motion.div className="relative w-8 h-40" animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full rounded" style={{ background: '#5a6370' }} />
          <motion.div
            className="absolute top-10 left-0 w-8 h-0.5 rounded"
            style={{ background: '#8b1e1e' }}
            animate={{ width: [8, 32, 8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 left-0 w-8 h-0.5 rounded"
            style={{ background: '#8b1e1e' }}
            animate={{ width: [8, 32, 8] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
          />
        </motion.div>
        {/* 摩尔斯点划飘出 */}
        {['·', '·', '·', '—', '—', '—', '·', '·', '·'].map((c, i) => (
          <motion.span
            key={i}
            className="absolute text-lg font-mono"
            style={{ color: '#c9a54b', left: `${40 + i * 10}%`, top: '50%' }}
            animate={{ y: [-20, -60], opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    ),
  },
  patients: {
    title: '病患真相',
    subtitle: '七位病人的命运在此交汇',
    bgGradient: 'radial-gradient(ellipse at center, #0f1a15 0%, #0f1115 70%)',
    particles: { color: '#3a6a5a', count: 20 },
    render: () => (
      <div className="relative flex flex-wrap gap-2 justify-center max-w-xs">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="w-10 h-14 rounded-sm border"
            style={{ borderColor: '#3e4651', background: i === 6 ? '#8b1e1e20' : '#181b21' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center justify-center h-full text-xs" style={{ color: i === 6 ? '#8b1e1e' : '#8a9199' }}>
              {String.fromCharCode(65 + i)}
            </div>
          </motion.div>
        ))}
        {/* G号病人高亮 */}
        <motion.div
          className="absolute text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: '#8b1e1e30', color: '#8b1e1e', bottom: -24, left: '50%', transform: 'translateX(-50%)' }}
          animate={{ opacity: [0, 1, 0.7] }}
          transition={{ duration: 2, delay: 1.5 }}
        >
          2016G 袁枝
        </motion.div>
      </div>
    ),
  },
  timeline: {
    title: '时间倒流',
    subtitle: '11月5日的夜晚正在重组',
    bgGradient: 'radial-gradient(ellipse at center, #150f0f 0%, #0f1115 70%)',
    particles: { color: '#8b1e1e', count: 25 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 时钟 */}
        <motion.div
          className="w-32 h-32 rounded-full border-2 flex items-center justify-center relative"
          style={{ borderColor: '#3e4651', background: '#181b21' }}
        >
          <motion.div
            className="absolute w-0.5 h-10 rounded origin-bottom"
            style={{ background: '#8b1e1e', bottom: '50%' }}
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-0.5 h-7 rounded origin-bottom"
            style={{ background: '#5a6370', bottom: '50%' }}
            animate={{ rotate: [0, -30] }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <div className="w-2 h-2 rounded-full z-10" style={{ background: '#c9a54b' }} />
        </motion.div>
        {/* 时间数字飘过 */}
        {['23:30', '00:00', '00:30', '01:00'].map((time, i) => (
          <motion.span
            key={time}
            className="absolute text-xs font-mono"
            style={{ color: '#8b1e1e', opacity: 0.6 }}
            animate={{ x: [-30, 30], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
          >
            {time}
          </motion.span>
        ))}
      </div>
    ),
  },
  deduction: {
    title: '真理天平',
    subtitle: '真凶即将揭晓',
    bgGradient: 'radial-gradient(ellipse at center, #0a0a0a 0%, #0f1115 70%)',
    particles: { color: '#c9a54b', count: 30 },
    render: () => (
      <div className="relative flex flex-col items-center">
        {/* 天平 */}
        <motion.div
          className="relative w-48 h-32"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-24 rounded" style={{ background: '#5a6370' }} />
          <div className="absolute top-8 left-0 right-0 h-1 rounded" style={{ background: '#5a6370' }} />
          {/* 左侧托盘 — 轻 */}
          <motion.div
            className="absolute top-4 left-4 w-12 h-0.5 rounded"
            style={{ background: '#3e4651' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* 右侧托盘 — 重 */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-0.5 rounded"
            style={{ background: '#8b1e1e' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        {/* 文字 */}
        <motion.div
          className="text-sm font-serif mt-2"
          style={{ color: '#c9a54b' }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 0.8 }}
        >
          真相只有一个
        </motion.div>
      </div>
    ),
  },
};

export default function ChapterCutscene({ chapterId, onDone }: ChapterCutsceneProps) {
  const [visible, setVisible] = useState(true);
  const scene = scenes[chapterId];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [chapterId, onDone]);

  if (!scene) { onDone(); return null; }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[35] flex flex-col items-center justify-center pointer-events-none"
      style={{ background: scene.bgGradient }}
    >
      {/* 浮动粒子 */}
      {Array.from({ length: scene.particles.count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            background: scene.particles.color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
          }}
        />
      ))}

      {/* 演出内容 */}
      <motion.div
        className="z-10 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {scene.render()}
      </motion.div>

      {/* 标题 */}
      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="text-2xl font-serif text-asylum-paper mb-2">{scene.title}</div>
        <div className="text-sm text-asylum-muted">{scene.subtitle}</div>
      </motion.div>
    </motion.div>
  );
}
