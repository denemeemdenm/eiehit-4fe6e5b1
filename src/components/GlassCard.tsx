import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassCard({ children, className = '', onClick, tiltIntensity = 15 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();

  // tvOS 26 spring physics: weighty, human-like
  const springConfig = { stiffness: 300, damping: 20, mass: 1 };
  const resetSpring = { stiffness: 150, damping: 15, mass: 1 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const translateZ = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = x / rect.width;
      const percentY = y / rect.height;
      // tvOS: tilt OPPOSITE to cursor position
      rotateY.set((percentX - 0.5) * tiltIntensity);
      rotateX.set(-(percentY - 0.5) * tiltIntensity);
      scale.set(1.05);
      translateZ.set(30);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
    });
  }, [isMobile, tiltIntensity, rotateX, rotateY, scale, translateZ]);

  const handleMouseLeave = useCallback(() => {
    // Use softer spring for return
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    translateZ.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, scale, translateZ]);

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
        z: translateZ,
        perspective: 800,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 20px 60px rgba(100, 255, 255, 0.15), 0 0 0 1px hsla(0,0%,100%,0.06), inset 0 1px 0 hsla(0,0%,100%,0.06)'
          : 'var(--shadow-rest)',
        willChange: 'transform',
        transition: 'box-shadow 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
    >
      {/* Liquid glass backdrop blur */}
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      />

      {/* Glare/shine overlay — follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-[inherit]"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.5s ease',
          background: `radial-gradient(ellipse 300px 220px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.15), transparent 70%)`,
        }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-[inherit]"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.7s ease',
          background: `radial-gradient(ellipse 350px 250px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.18), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor' as any,
          padding: '1px',
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
