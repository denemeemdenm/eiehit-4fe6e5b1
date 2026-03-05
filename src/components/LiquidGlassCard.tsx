import { ReactNode, useCallback, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  // Semi-transparent background that lets backdrop-blur show through
  const bgColor = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(0, 0, 0, 0.04)';

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
          backgroundColor: bgColor,
          backdropFilter: 'blur(10px) saturate(200%)',
          WebkitBackdropFilter: 'blur(10px) saturate(200%)',
          boxShadow: isHovered
            ? isDark
              ? '0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 16px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.22)'
            : isDark
              ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.22)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* 135° diagonal specular edge highlight — mask-composite: exclude */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            borderRadius: 'inherit',
            padding: '1px',
            background: `${isHovered ? `radial-gradient(130px 130px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.38), hsla(0 0% 100% / 0) 72%), ` : ''}linear-gradient(135deg, ${
              isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'
            } 0%, ${
              isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'
            } 25%, ${
              isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'
            } 50%, ${
              isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'
            } 75%, ${
              isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'
            } 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor' as any,
          }}
        />

        {/* Specular highlight on hover — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none z-[3] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(ellipse 280px 200px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.12), transparent 70%)`,
          }}
        />

        <div className="relative z-[1]">{children}</div>
      </motion.div>
    </div>
  );
}
