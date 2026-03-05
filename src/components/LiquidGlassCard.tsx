import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function LiquidGlassCard({ children, className = '' }: LiquidGlassCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      style={{
        borderRadius: 20,
        background: 'hsla(var(--glass-bg))',
        backdropFilter: 'blur(10px) saturate(200%)',
        WebkitBackdropFilter: 'blur(10px) saturate(200%)',
        boxShadow: 'var(--shadow-rest)',
        willChange: 'transform, backdrop-filter',
        transform: 'translateZ(0)',
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {/* 135° diagonal specular edge highlight — mask-composite: exclude */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          borderRadius: 'inherit',
          padding: '1px',
          background:
            'linear-gradient(135deg, hsla(0 0% 100% / 0.24) 0%, hsla(0 0% 100% / 0.1) 25%, hsla(0 0% 100% / 0.03) 50%, hsla(0 0% 100% / 0.1) 75%, hsla(0 0% 100% / 0.24) 100%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor' as any,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: '0 0 32px hsla(var(--ring) / 0.16) inset, 0 8px 28px hsla(var(--ring) / 0.08)' }}
      />

      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}

