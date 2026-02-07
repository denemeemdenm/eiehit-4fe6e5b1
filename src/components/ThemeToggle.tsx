import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full glass-panel flex items-center justify-center overflow-hidden"
      style={{
        boxShadow: '0 4px 20px hsla(0,0%,0%,0.15), 0 0 0 1px hsla(0,0%,100%,0.08)',
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Tema değiştir"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: -14, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 14, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
          >
            <Moon size={16} className="text-muted-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -14, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 14, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
          >
            <Sun size={16} className="text-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
