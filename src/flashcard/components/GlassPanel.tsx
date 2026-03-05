import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassPanel({ children, className = '', onClick }: GlassPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`relative rounded-[21.6px] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: isDark ? 'hsla(var(--glass-bg))' : 'hsla(var(--glass-bg))',
        backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
        WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.22)',
      }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Glass edge - matching navbar border */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          padding: '0.85px',
          background: `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.30)'} 0%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 25%, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'} 50%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 75%, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.30)'} 100%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor' as any,
        }}
      />
      {children}
    </motion.div>
  );
}
