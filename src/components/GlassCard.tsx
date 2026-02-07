import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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
      // Animate border gradient angle based on mouse position
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
      className={`glass-card-wrapper relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        perspective: 800,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
        willChange: 'transform',
        borderRadius: 'var(--radius)',
        background: 'hsla(var(--glass-bg))',
        backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
        WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    >
      {/* Animated border gradient — white/grey light only */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 rounded-[var(--radius)]"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: `conic-gradient(from ${isHovered ? borderAngle.get() : 135}deg, rgba(255,255,255,0.45) 0%, transparent 15%, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%, transparent 85%, rgba(255,255,255,0.45) 100%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          borderRadius: 'inherit',
        }}
      />

      {/* Specular highlight — stronger sweep */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 250px 180px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.4), transparent 70%)`,
        }}
      />

      {/* Secondary diffuse glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle 400px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.08), transparent 80%)`,
        }}
      />

      {/* Static rim highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-[var(--radius)]"
        style={{
          opacity: isHovered ? 0 : 1,
          transition: 'opacity 0.4s ease',
          border: '1px solid hsla(var(--glass-border))',
          borderRadius: 'inherit',
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
