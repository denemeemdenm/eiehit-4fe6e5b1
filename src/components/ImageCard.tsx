import { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface ImageCardProps {
  image: string;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  tiltIntensity?: number;
}

export default function ImageCard({ image, title, description, className = '', onClick, children, tiltIntensity = 6 }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        className={`relative cursor-pointer group ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          minHeight: '240px',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'transparent',
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
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onClick={onClick}
        whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      >
        {/* Glass edge highlight — mask-composite: exclude, 135° diagonal specular */}
        <div
          className="absolute inset-0 pointer-events-none z-[8]"
          style={{
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(135deg, ${
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

        {/* Image layer */}
        {image && (
          <div className="absolute inset-0" style={{ borderRadius: 20, overflow: 'hidden' }}>
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* Dark gradient for text readability */}
            <div
              className="absolute inset-0 z-[3] pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)',
              }}
            />
            {/* Progressive blur at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none"
              style={{
                height: '40%',
                backdropFilter: 'blur(25px) saturate(180%)',
                WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                mask: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
                WebkitMask: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
              }}
            />
          </div>
        )}

        {/* Specular highlight on hover */}
        <div
          className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.4 : 0,
            background: `radial-gradient(ellipse 300px 220px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.2), transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-[5] p-6">
          <h3
            className="font-semibold text-base mb-1 text-white"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4)' }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm leading-relaxed text-white/85"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
            >
              {description}
            </p>
          )}
          {children}
        </div>

        {/* Invisible spacer */}
        <div style={{ minHeight: '240px', borderRadius: 20 }} />
      </motion.div>
    </div>
  );
}
