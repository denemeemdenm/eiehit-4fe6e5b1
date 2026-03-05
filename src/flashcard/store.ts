import { CardProgress, StudySession, DailyStats } from './types';

const PROGRESS_KEY = 'fc_progress';
const SESSIONS_KEY = 'fc_sessions';
const STREAK_KEY = 'fc_streak';

export function getAllProgress(): Record<string, CardProgress> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch { return {}; }
}

export function getCardProgress(cardId: string): CardProgress {
  const all = getAllProgress();
  return all[cardId] || {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    lapses: 0,
    starred: false,
  };
}

export function saveCardProgress(progress: CardProgress) {
  const all = getAllProgress();
  all[progress.cardId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function toggleStar(cardId: string) {
  const p = getCardProgress(cardId);
  p.starred = !p.starred;
  saveCardProgress(p);
  return p.starred;
}

export function isStarred(cardId: string): boolean {
  return getCardProgress(cardId).starred;
}

// Sessions & stats
export function getSessions(): StudySession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); }
  catch { return []; }
}

export function addSession(session: StudySession) {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getDailyStats(days = 90): DailyStats[] {
  const sessions = getSessions();
  const map: Record<string, DailyStats> = {};
  sessions.forEach(s => {
    if (!map[s.date]) map[s.date] = { date: s.date, cardsStudied: 0, timeSpentSeconds: 0 };
    map[s.date].cardsStudied += s.cardsStudied;
    map[s.date].timeSpentSeconds += s.timeSpentSeconds;
  });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date)).slice(-days);
}

export function getStreak(): number {
  const stats = getDailyStats(365);
  if (stats.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (stats.find(s => s.date === key && s.cardsStudied > 0)) {
      streak++;
    } else if (i > 0) break;
  }
  return streak;
}

export function getCourseProgress(courseId: string, cardIds: string[]): number {
  const all = getAllProgress();
  if (cardIds.length === 0) return 0;
  const learned = cardIds.filter(id => {
    const p = all[id];
    return p && p.repetitions >= 2;
  }).length;
  return Math.round((learned / cardIds.length) * 100);
}
