import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Brain, BookOpen } from 'lucide-react';
import { courses, getUnitsByCourse, getCardsByCourse, getCardsByUnit, flashcards } from '../data';
import { getCourseProgress, getAllProgress, isStarred } from '../store';
import { isDueToday } from '../sm2';
import { getCardProgress } from '../store';
import { useTheme } from '@/hooks/useTheme';
import GlassPanel from '../components/GlassPanel';
import GlassProgress from '../components/GlassProgress';
import type { FCView } from '../FlashcardApp';

type Tab = 'cards' | 'spaced' | 'starred';

export default function FCCourseDetail({ courseId, navigate }: { courseId: string; navigate: (v: FCView) => void }) {
  const [tab, setTab] = useState<Tab>('cards');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const course = courses.find(c => c.id === courseId)!;
  const courseUnits = getUnitsByCourse(courseId);
  const courseCards = getCardsByCourse(courseId);

  const dueCards = useMemo(() => {
    return courseCards.filter(c => {
      const p = getCardProgress(c.id);
      return isDueToday(p);
    });
  }, [courseCards]);

  const starredCards = useMemo(() => {
    return courseCards.filter(c => isStarred(c.id));
  }, [courseCards]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'cards', label: 'Kartlar', icon: <BookOpen size={14} /> },
    { id: 'spaced', label: 'Aralıklı Tekrar', icon: <Brain size={14} /> },
    { id: 'starred', label: 'Sihirli Notlar', icon: <Star size={14} /> },
  ];

  return (
    <motion.div
      className="px-4 pb-8 pt-2 max-w-lg mx-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
    >
      {/* Course title */}
      <div className="mb-5">
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
          <span className="text-2xl">{course.emoji}</span>
          {course.name}
        </h1>
      </div>

      {/* Segmented control */}
      <GlassPanel className="mb-5">
        <div className="flex p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200 relative"
              style={{
                color: tab === t.id
                  ? isDark ? '#fff' : '#000'
                  : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
                background: tab === t.id
                  ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)'
                  : 'transparent',
                boxShadow: tab === t.id
                  ? isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'
                  : 'none',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Cards tab */}
      {tab === 'cards' && (
        <div className="flex flex-col gap-3">
          {courseUnits.map((unit, i) => {
            const unitCards = getCardsByUnit(unit.id);
            const progress = getCourseProgress(courseId, unitCards.map(c => c.id));
            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassPanel onClick={() => navigate({ type: 'study', courseId, unitId: unit.id })}>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                      Ünite {unit.order}: {unit.name}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
                      {unitCards.length} kart · %{progress} öğrenildi
                    </p>
                    <GlassProgress value={progress} />
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
          {/* Study all CTA */}
          <motion.button
            className="w-full py-3.5 rounded-2xl font-semibold text-sm mt-2"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
              color: '#000',
              boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ type: 'study', courseId })}
          >
            Tümünü Çalış
          </motion.button>
        </div>
      )}

      {/* Spaced repetition tab */}
      {tab === 'spaced' && (
        <div className="flex flex-col gap-4">
          <GlassPanel>
            <div className="p-5 text-center">
              <Brain size={32} className="mx-auto mb-3" style={{ color: 'hsl(var(--primary))' }} />
              <h3 className="font-bold text-lg mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                Aralıklı Tekrar
              </h3>
              <p className="text-sm mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
                Bugün <strong>{dueCards.length}</strong> kart tekrar bekliyor
              </p>
              {dueCards.length > 0 ? (
                <motion.button
                  className="px-6 py-3 rounded-2xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                    color: '#000',
                    boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate({ type: 'spaced', courseId })}
                >
                  Tekrara Başla
                </motion.button>
              ) : (
                <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>
                  Şimdilik bekleyen kart yok. Harika iş! 🎉
                </p>
              )}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Starred tab */}
      {tab === 'starred' && (
        <div className="flex flex-col gap-3">
          {starredCards.length === 0 ? (
            <GlassPanel>
              <div className="p-8 text-center">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Star size={40} className="mx-auto mb-3" style={{ color: 'hsl(var(--accent))' }} />
                </motion.div>
                <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                  Henüz yıldızlı kartınız yok
                </p>
                <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
                  Kartları çalışırken ⭐ simgesine tıklayarak favorilerinize ekleyin.
                </p>
              </div>
            </GlassPanel>
          ) : (
            <>
              {starredCards.map((card, i) => (
                <StarredCardItem key={card.id} card={card} isDark={isDark} index={i} />
              ))}
              <motion.button
                className="w-full py-3.5 rounded-2xl font-semibold text-sm mt-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent) / 0.8))',
                  color: '#000',
                  boxShadow: '0 4px 20px hsl(var(--accent) / 0.3)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate({ type: 'study', courseId, starredOnly: true })}
              >
                Sadece Sihirli Notları Çalış
              </motion.button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

function StarredCardItem({ card, isDark, index }: { card: any; isDark: boolean; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <GlassPanel onClick={() => setFlipped(!flipped)}>
        <div className="p-4">
          <div className="flex items-start gap-2">
            <Star size={14} className="shrink-0 mt-0.5" style={{ color: 'hsl(var(--accent))', fill: 'hsl(var(--accent))' }} />
            <p className="text-sm" style={{ color: isDark ? '#fff' : '#000', whiteSpace: 'pre-line' }}>
              {flipped ? card.back : card.front}
            </p>
          </div>
          <p className="text-[10px] mt-2" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }}>
            {flipped ? 'Cevap — tekrar dokun' : 'Cevabı görmek için dokun'}
          </p>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
