import { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function LiquidGlassCard({ children, className = '' }: LiquidGlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={{
        borderRadius: 20,
        backdropFilter: 'blur(10px) saturate(200%)',
        WebkitBackdropFilter: 'blur(10px) saturate(200%)',
        background: isDark ? 'hsla(0 0% 100% / 0.04)' : 'hsla(0 0% 0% / 0.03)',
      }}
    >
      {/* 135° diagonal specular edge highlight — mask-composite: exclude */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          borderRadius: 'inherit',
          padding: '1px',
          background: `linear-gradient(135deg, ${
            isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.40)'
          } 0%, ${
            isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)'
          } 25%, ${
            isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'
          } 50%, ${
            isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)'
          } 75%, ${
            isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.40)'
          } 100%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor' as any,
        }}
      />

      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
