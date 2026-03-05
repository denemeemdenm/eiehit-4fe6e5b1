import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, BookOpen } from 'lucide-react';
import { courses, getCardsByCourse } from '../data';
import { getStreak, getDailyStats, getCourseProgress, getAllProgress } from '../store';
import { useTheme } from '@/hooks/useTheme';
import GlassPanel from '../components/GlassPanel';
import GlassProgress from '../components/GlassProgress';

export default function FCStats() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const streak = getStreak();
  const dailyStats = getDailyStats(90);
  const allProgress = getAllProgress();

  const todayKey = new Date().toISOString().split('T')[0];
  const today = dailyStats.find(d => d.date === todayKey);
  const todayCards = today?.cardsStudied || 0;
  const todayTime = today?.timeSpentSeconds || 0;

  // Weekly chart data
  const weekData = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    const dayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.date === key);
      days.push({ label: dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1], value: stat?.cardsStudied || 0 });
    }
    return days;
  }, [dailyStats]);

  const maxWeek = Math.max(...weekData.map(d => d.value), 1);

  // Retention rate
  const allCards = Object.values(allProgress);
  const totalReviews = allCards.reduce((s, c) => s + c.repetitions, 0);
  const avgEF = allCards.length > 0 ? (allCards.reduce((s, c) => s + c.easeFactor, 0) / allCards.length).toFixed(2) : '2.50';
  const totalLapses = allCards.reduce((s, c) => s + c.lapses, 0);
  const retention = totalReviews > 0 ? Math.round(((totalReviews - totalLapses) / totalReviews) * 100) : 0;

  // Heatmap (last 90 days)
  const heatmapData = useMemo(() => {
    const cells: { date: string; value: number }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.date === key);
      cells.push({ date: key, value: stat?.cardsStudied || 0 });
    }
    return cells;
  }, [dailyStats]);

  const maxHeat = Math.max(...heatmapData.map(d => d.value), 1);

  const getHeatColor = (value: number) => {
    if (value === 0) return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
    const intensity = value / maxHeat;
    if (intensity < 0.33) return 'hsl(var(--primary) / 0.25)';
    if (intensity < 0.66) return 'hsl(var(--primary) / 0.5)';
    return 'hsl(var(--primary) / 0.85)';
  };

  return (
    <motion.div
      className="px-4 pb-8 pt-2 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-xl font-bold mb-5" style={{ color: isDark ? '#fff' : '#000' }}>📊 İstatistikler</h1>

      {/* Daily summary */}
      <GlassPanel className="mb-4">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Flame size={18} style={{ color: 'hsl(var(--accent))' }} />
            <span className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>Seri: {streak} gün</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>Bugün: {todayCards} kart</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }} />
            <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              Bugün: {Math.round(todayTime / 60)} dakika
            </span>
          </div>
        </div>
      </GlassPanel>

      {/* Weekly chart */}
      <GlassPanel className="mb-4">
        <div className="p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>Haftalık Grafik</h3>
          <div className="flex items-end gap-2 h-24">
            {weekData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${Math.max(4, (d.value / maxWeek) * 80)}px`,
                    background: d.value > 0 ? 'hsl(var(--primary))' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  }}
                />
                <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Course progress */}
      <GlassPanel className="mb-4">
        <div className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>Ders Bazlı İlerleme</h3>
          <div className="space-y-3">
            {courses.map(course => {
              const cards = getCardsByCourse(course.id);
              const progress = getCourseProgress(course.id, cards.map(c => c.id));
              return (
                <div key={course.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs truncate" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                      {course.emoji} {course.name}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'hsl(var(--primary))' }}>%{progress}</span>
                  </div>
                  <GlassProgress value={progress} />
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>

      {/* Spaced repetition stats */}
      <GlassPanel className="mb-4">
        <div className="p-5 space-y-2">
          <h3 className="text-sm font-semibold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>Aralıklı Tekrar</h3>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>Retention Rate</span>
            <span className="text-xs font-medium" style={{ color: isDark ? '#fff' : '#000' }}>%{retention}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>Toplam Tekrar</span>
            <span className="text-xs font-medium" style={{ color: isDark ? '#fff' : '#000' }}>{totalReviews.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>Ortalama EF</span>
            <span className="text-xs font-medium" style={{ color: isDark ? '#fff' : '#000' }}>{avgEF}</span>
          </div>
        </div>
      </GlassPanel>

      {/* Heatmap */}
      <GlassPanel>
        <div className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>Son 90 Gün</h3>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
            {heatmapData.map((cell, i) => (
              <div
                key={i}
                className="aspect-square rounded-[3px]"
                style={{ background: getHeatColor(cell.value) }}
                title={`${cell.date}: ${cell.value} kart`}
              />
            ))}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
