import { useEffect, useState } from 'react';

export default function Scanlines() {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    // 随机 CRT 闪烁：0.5-3 秒随机间隔
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleFlicker = () => {
      const delay = 500 + Math.random() * 2500;
      timeout = setTimeout(() => {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 60 + Math.random() * 100);
        scheduleFlicker();
      }, delay);
    };
    scheduleFlicker();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* 主扫描线 */}
      <div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          opacity: flicker ? 0.04 : 0.10,
          transition: 'opacity 0.05s',
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* RGB 色散边缘 — 只在屏幕顶部和底部产生非常微弱的色散效果 */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: `
            linear-gradient(to bottom, rgba(139,30,30,0.03) 0%, transparent 15%, transparent 85%, rgba(30,60,139,0.03) 100%)
          `,
        }}
      />
    </>
  );
}
