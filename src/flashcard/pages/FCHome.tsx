import { motion } from 'framer-motion';
import { ChevronRight, Flame } from 'lucide-react';
import { courses } from '../data';
import { getCardsByCourse, getUnitsByCourse } from '../data';
import { getCourseProgress, getStreak } from '../store';
import { useTheme } from '@/hooks/useTheme';
import GlassPanel from '../components/GlassPanel';
import GlassProgress from '../components/GlassProgress';
import type { FCView } from '../FlashcardApp';

export default function FCHome({ navigate }: { navigate: (v: FCView) => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const streak = getStreak();

  return (
    <motion.div
      className="px-4 pb-8 pt-2 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
          📚 Dersler
        </h1>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 mt-2" style={{ color: 'hsl(var(--accent))' }}>
            <Flame size={16} />
            <span className="text-sm font-medium">{streak} günlük seri</span>
          </div>
        )}
      </div>

      {/* Course list */}
      <div className="flex flex-col gap-3">
        {courses.map((course, i) => {
          const cards = getCardsByCourse(course.id);
          const unitCount = getUnitsByCourse(course.id).length;
          const progress = getCourseProgress(course.id, cards.map(c => c.id));

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <GlassPanel onClick={() => navigate({ type: 'course', courseId: course.id })}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="text-xl shrink-0">{course.emoji}</span>
                      <span
                        className="font-semibold text-[15px] truncate"
                        style={{ color: isDark ? '#fff' : '#000' }}
                      >
                        {course.name}
                      </span>
                    </div>
                    <ChevronRight size={18} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }} />
                  </div>

                  <GlassProgress value={progress} className="mb-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
                      {cards.length} kart · {unitCount} ünite
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'hsl(var(--primary))' }}>
                      %{progress}
                    </span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
