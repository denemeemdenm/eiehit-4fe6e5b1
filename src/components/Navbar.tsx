import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import nameWhite from '@/assets/name-white.png';
import nameBlack from '@/assets/name-black.png';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navItems = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Hakkımda', path: '/hakkimda' },
  { label: 'Çalışma Alanları', path: '/calisma-alanlari' },
  { label: 'İletişim', path: '/iletisim' },
];

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <nav className="glass-nav rounded-2xl px-4 py-2.5 flex items-center justify-between">
        {/* Logo + Name */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Logo" className="w-8 h-auto object-contain" />
          <div className="hidden sm:flex items-center gap-0.5 text-xs font-bold tracking-tight">
            <span className="gradient-text-cyan-word">Hukuk</span>
            <span className="text-foreground/40 dark:text-gray-400"> × </span>
            <span className="gradient-text-orange-word">İnovasyon</span>
            <span className="text-foreground/40 dark:text-gray-400"> × </span>
            <span className="gradient-text-yellow-word">Teknoloji</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg border border-primary/20"
                    style={{ background: 'hsl(var(--primary) / 0.08)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <motion.span
                  className="relative z-10 inline-block"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {item.label}
                </motion.span>
                {!isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-primary/60 transition-all duration-300 group-hover:w-3/4" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 overflow-hidden"
            aria-label="Tema değiştir"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'light' ? (
                <motion.div
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Moon size={16} className="text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Sun size={16} className="text-accent" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl glass-panel flex items-center justify-center"
            aria-label="Menü"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-nav rounded-2xl mt-2 p-4 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
