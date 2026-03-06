import { useCallback, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassPanel({ children, className = '', onClick, tiltIntensity = 5 }: GlassPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 150, damping: 26, mass: 1 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scaleVal = useSpring(1, { stiffness: 200, damping: 28, mass: 0.8 });

  const transform = useTransform(
    [rotateX, rotateY, scaleVal],
    ([rx, ry, s]: number[]) =>
      `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
  );

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
        scaleVal.set(1.02);
        setSpecularPos({ x: percentX * 100, y: percentY * 100 });
      });
    },
    [tiltIntensity, rotateX, rotateY, scaleVal],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scaleVal.set(1);
    setIsHovered(false);
  }, [rotateX, rotateY, scaleVal]);

  return (
    <motion.div
      ref={cardRef}
      style={{ transform, willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative rounded-[21.6px] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{
          background: 'hsla(var(--glass-bg))',
          backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
          WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
          boxShadow: isHovered
            ? isDark
              ? '0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 12px 28px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.35)'
            : isDark
              ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.35)',
        }}
        onClick={onClick}
      >
        {/* 135° diagonal specular edge highlight + hover radial glow */}
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-[2]"
          style={{
            padding: '0.85px',
            background: `${isHovered ? `radial-gradient(130px 130px at ${specularPos.x}% ${specularPos.y}%, ${isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.7)'}, transparent 72%), ` : ''}linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'} 0%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 25%, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'} 50%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 75%, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'} 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor' as any,
          }}
        />

        {/* Specular surface highlight — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none z-[3] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.3 : 0,
            background: `radial-gradient(ellipse 280px 200px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.1), transparent 70%)`,
          }}
        />

        <div className="relative z-[1]">{children}</div>
      </div>
    </motion.div>
  );
}
