import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

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
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 220, damping: 24, mass: 0.6 });

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
      scale.set(1.03);
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
    <motion.div
      ref={cardRef}
      className={`glass-card relative cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        borderRadius: 'var(--radius)',
        boxShadow: isHovered
          ? '0 20px 50px hsla(0,0%,0%,0.25), 0 0 0 0.5px hsla(0,0%,100%,0.06)'
          : 'var(--shadow-rest)',
        minHeight: '240px',
        transition: 'box-shadow 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
    >
      {/* Background image */}
      {image ? (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            style={{
              filter: isDark ? 'none' : 'brightness(1.25) saturate(0.75) contrast(0.9)',
            }}
          />
          {/* Pure blur overlay — no color tint, only blur */}
          <div className="absolute inset-0 z-[3]"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              mask: 'linear-gradient(to top, black 0%, black 25%, transparent 60%)',
              WebkitMask: 'linear-gradient(to top, black 0%, black 25%, transparent 60%)',
            }}
          />
          {/* Subtle scrim for text readability — minimal opacity */}
          <div className="absolute inset-0 z-[2]"
            style={{
              background: isDark
                ? 'linear-gradient(to top, hsla(0,0%,0%,0.65) 0%, hsla(0,0%,0%,0.3) 30%, transparent 55%)'
                : 'linear-gradient(to top, hsla(0,0%,100%,0.7) 0%, hsla(0,0%,100%,0.3) 25%, transparent 50%)',
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 w-full h-full rounded-[inherit]"
          style={{
            background: 'hsla(var(--glass-bg))',
            backdropFilter: 'blur(60px) saturate(200%)',
            WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          }}
        />
      )}

      {/* Specular highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `radial-gradient(ellipse 300px 220px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.22), transparent 70%)`,
        }}
      />

      {/* Hover rim light */}
      <div
        className="absolute inset-0 pointer-events-none z-[7] rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(ellipse 400px 300px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.14), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '0.5px',
        }}
      />

      {/* Content — theme-aware text colors */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] p-6">
        <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-foreground'}`}>{title}</h3>
        {description && <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>{description}</p>}
        {children}
      </div>
    </motion.div>
  );
}
