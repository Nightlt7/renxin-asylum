import { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  /** 启用打字机音效（每字符触发） */
  soundEnabled?: boolean;
  /** 打字机音效回调 */
  onTick?: () => void;
  /** 点击跳过 */
  skippable?: boolean;
}

export default function TypewriterText({
  text,
  speed = 22,
  className = '',
  onDone,
  soundEnabled = false,
  onTick,
  skippable = false,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const skipToEnd = useCallback(() => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
      onDoneRef.current?.();
    }
  }, [text, done]);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        const char = text[index];
        setDisplayed(text.slice(0, index + 1));
        if (soundEnabled && onTick && char.trim() !== '') {
          onTick();
        }
        index += 1;
      } else {
        clearInterval(timer);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, soundEnabled, onTick]);

  return (
    <span
      className={`${className} ${skippable ? 'cursor-pointer' : ''}`}
      onClick={skippable ? skipToEnd : undefined}
      role={skippable ? 'button' : undefined}
      tabIndex={skippable ? 0 : undefined}
      onKeyDown={skippable ? (e) => { if (e.key === 'Enter' || e.key === ' ') skipToEnd(); } : undefined}
      title={skippable ? '点击跳过打字动画' : undefined}
    >
      {displayed}
      {!done && (
        <span className="inline-block animate-pulse text-asylum-accent" style={{ animationDuration: '0.6s' }}>
          ▍
        </span>
      )}
    </span>
  );
}
