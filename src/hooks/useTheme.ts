import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Liquid crossfade transition
    const root = document.documentElement;
    root.style.setProperty('--theme-transition', '1');
    root.classList.add('theme-transitioning');

    // Small delay to let the blur kick in before color swap
    requestAnimationFrame(() => {
      setThemeState(prev => prev === 'light' ? 'dark' : 'light');
      // Remove transition class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
        root.style.removeProperty('--theme-transition');
      }, 600);
    });
  }, []);

  return { theme, toggleTheme };
}
