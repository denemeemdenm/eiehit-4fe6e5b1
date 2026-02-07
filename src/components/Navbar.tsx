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
          <img
            src={theme === 'dark' ? nameWhite : nameBlack}
            alt="Ekin İsa EROĞLU"
            className="h-4 sm:h-[18px] w-auto object-contain hidden sm:block"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'hsla(var(--glass-bg))' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
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
                  <Moon size={16} className="text-indigo-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Sun size={16} className="text-amber-400" />
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
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
