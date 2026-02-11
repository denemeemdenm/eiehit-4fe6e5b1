import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassCard({ children, className = '', onClick, tiltIntensity = 4 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  // tvOS 26-style physics: high damping, lower stiffness = smooth, weighty feel
  const springConfig = { stiffness: 150, damping: 28, mass: 1.2 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const translateZ = useSpring(0, springConfig);
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
      scale.set(1.015);
      translateZ.set(6);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
      borderAngle.set(Math.atan2(percentY - 0.5, percentX - 0.5) * (180 / Math.PI) + 180);
    });
  }, [tiltIntensity, rotateX, rotateY, scale, translateZ, borderAngle]);

  const handleMouseLeave = useCallback(() => {
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
        perspective: 1200,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 16px 40px hsla(0,0%,0%,0.25), 0 0 0 1px hsla(0,0%,100%,0.06), inset 0 1px 0 hsla(0,0%,100%,0.06)'
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
      {/* Liquid glass backdrop blur for non-image cards */}
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 350px 250px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.18), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 250px 180px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.12), transparent 70%)`,
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
