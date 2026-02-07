import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassCard({ children, className = '', onClick, tiltIntensity = 8 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const rotateX = useSpring(0, { stiffness: 260, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 20 });
  const scale = useSpring(1, { stiffness: 260, damping: 20 });
  const borderAngle = useMotionValue(135);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = x / rect.width;
      const percentY = y / rect.height;
      rotateY.set((percentX - 0.5) * tiltIntensity * 2);
      rotateX.set(-(percentY - 0.5) * tiltIntensity * 2);
      scale.set(1.04);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
      borderAngle.set(Math.atan2(percentY - 0.5, percentX - 0.5) * (180 / Math.PI) + 180);
    });
  }, [tiltIntensity, rotateX, rotateY, scale, borderAngle]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setIsHovered(false);
  }, [rotateX, rotateY, scale]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        perspective: 800,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    >
      {/* Animated border gradient on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-20 rounded-[inherit]"
          style={{
            background: `conic-gradient(from ${borderAngle.get()}deg, rgba(255,255,255,0.5) 0%, transparent 15%, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%, transparent 85%, rgba(255,255,255,0.5) 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />
      )}

      {/* Specular highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 250px 180px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.35), transparent 70%)`,
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
