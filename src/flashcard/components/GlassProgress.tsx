import { useTheme } from '@/hooks/useTheme';

export default function GlassProgress({ value, className = '' }: { value: number; className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`h-2 rounded-full overflow-hidden ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: isDark
            ? 'linear-gradient(90deg, hsl(180 100% 69%), hsl(180 100% 69% / 0.7))'
            : 'linear-gradient(90deg, hsl(0 84% 60%), hsl(0 84% 60% / 0.7))',
        }}
      />
    </div>
  );
}
