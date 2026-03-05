import { ReactNode, useCallback, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  tiltIntensity?: number;
}

export default function LiquidGlassCard({ children, className = '', tiltIntensity = 4 }: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 150, damping: 26, mass: 1 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 200, damping: 28, mass: 0.8 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const percentX = (e.clientX - rect.left) / rect.width;
        const percentY = (e.clientY - rect.top) / rect.height;

        rotateY.set((percentX - 0.5) * tiltIntensity * 2);
        rotateX.set(-(percentY - 0.5) * tiltIntensity * 2);
        scale.set(1.02);
        setSpecularPos({ x: percentX * 100, y: percentY * 100 });
      });
    },
    [tiltIntensity, rotateX, rotateY, scale],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setIsHovered(false);
  }, [rotateX, rotateY, scale]);

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        className={`relative overflow-hidden ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          background: 'hsla(var(--glass-bg))',
          backdropFilter: 'blur(10px) saturate(200%)',
          WebkitBackdropFilter: 'blur(10px) saturate(200%)',
          boxShadow: 'var(--shadow-rest)',
          willChange: 'transform, backdrop-filter',
          backfaceVisibility: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* 135° diagonal specular edge highlight + cursor-follow border shine */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            borderRadius: 'inherit',
            padding: '1px',
            background: `${isHovered ? `radial-gradient(130px 130px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.38), hsla(0 0% 100% / 0) 72%), ` : ''}linear-gradient(135deg, hsla(0 0% 100% / 0.24) 0%, hsla(0 0% 100% / 0.1) 25%, hsla(0 0% 100% / 0.03) 50%, hsla(0 0% 100% / 0.1) 75%, hsla(0 0% 100% / 0.24) 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor' as any,
          }}
        />

        <div className="relative z-[1]">{children}</div>
      </motion.div>
    </div>
  );
}


