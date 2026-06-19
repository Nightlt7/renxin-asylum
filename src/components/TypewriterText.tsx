import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

export default function TypewriterText({ text, speed = 28, className = '', onDone }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setDisplayed('');
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index += 1;
      } else {
        clearInterval(timer);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-asylum-accent">▍</span>
    </span>
  );
}
