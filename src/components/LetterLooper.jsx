import { useState, useEffect } from 'react';

export default function LetterLooper({ text, delay = 500 }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev + 1) % (text.length + 1));
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: i < visibleCount ? 1 : 0,
            animation: i < visibleCount ? 'fadeIn 0.3s ease forwards' : 'none',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}
