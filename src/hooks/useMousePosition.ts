import { useState, useCallback, useRef } from 'react';

interface MousePos {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
}

export function useMousePosition() {
  const [pos, setPos] = useState<MousePos>({ x: 0, y: 0, percentX: 0.5, percentY: 0.5 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPos({
        x,
        y,
        percentX: x / rect.width,
        percentY: y / rect.height,
      });
    });
  }, []);

  return { pos, handleMouseMove };
}
