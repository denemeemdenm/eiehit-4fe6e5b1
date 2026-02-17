import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

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

  // tvOS 26: weighted, smooth, human-like spring physics
  const springConfig = { stiffness: 180, damping: 22, mass: 1.0 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 250, damping: 24, mass: 0.8 });
  const translateZ = useSpring(0, springConfig);

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
      scale.set(1.035);
      translateZ.set(8);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
    });
  }, [tiltIntensity, rotateX, rotateY, scale, translateZ]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    translateZ.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, scale, translateZ]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        z: translateZ,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 16px 40px hsla(0,0%,0%,0.22), 0 0 0 0.5px hsla(0,0%,100%,0.06)'
          : 'var(--shadow-rest)',
        willChange: 'transform',
        transition: 'box-shadow 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
    >
      {/* Frosted glass — semi-transparent with blur so neural bg shows through blurred */}
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          background: 'hsla(var(--glass-bg))',
        }}
      />

      {/* Specular highlight — follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 280px 200px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.10), transparent 70%)`,
        }}
      />

      {/* Border glow on hover — hairline rim light that follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 400px 300px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.15), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '0.5px',
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
