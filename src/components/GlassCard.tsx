import { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassCard({ children, className = '', onClick, tiltIntensity = 5 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const springConfig = { stiffness: 150, damping: 26, mass: 1 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 200, damping: 28, mass: 0.8 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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
  }, [tiltIntensity, rotateX, rotateY, scale]);

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
        className={`glass-card relative cursor-pointer group ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'hsl(var(--surface))',
          backdropFilter: 'blur(10px) saturate(var(--glass-saturation))',
          WebkitBackdropFilter: 'blur(10px) saturate(var(--glass-saturation))',
          boxShadow: isHovered
            ? '0 16px 40px hsla(0,0%,0%,0.22), 0 0 0 0.5px hsla(0,0%,100%,0.06)'
            : 'var(--shadow-rest)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onClick={onClick}
        whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      >
        {/* Subtle inner gradient */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(135deg, hsla(0 0% 100% / 0.08) 0%, hsla(0 0% 100% / 0.02) 50%, hsla(0 0% 100% / 0.06) 100%)',
          }}
        />

        {/* Specular highlight on hover */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse 280px 200px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.12), transparent 70%)`,
          }}
        />

        {/* Content — normal flow, determines card height */}
        <div className="relative z-[5]">{children}</div>
      </motion.div>
    </div>
  );
}
