import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-2rem)]">
      <div className="flex items-center gap-2">
        {/* Main navbar */}
        <nav className="glass-nav rounded-[20px] px-3 py-2 flex items-center gap-2 overflow-hidden">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 whitespace-nowrap">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.span
                    className="relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}

            {/* Divider */}
            <span className="w-px h-4 bg-border/50 mx-1" />

            {/* HiT Brand */}
            <motion.span
              className="inline-flex items-center gap-0.5 text-[13px] font-bold px-2"
              style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="gradient-text-cyan-word">Hukuk</span>
              <span className="text-muted-foreground/50">×</span>
              <span className="gradient-text-orange-word">İnovasyon</span>
              <span className="text-muted-foreground/50">×</span>
              <span className="gradient-text-yellow-word">Teknoloji</span>
            </motion.span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Menü"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="shrink-0 w-9 h-9 rounded-[12px] glass-panel flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 overflow-hidden"
          aria-label="Tema değiştir"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'light' ? (
              <motion.div
                key="moon"
                initial={{ y: -16, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 16, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
              >
                <Moon size={14} className="text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ y: -16, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 16, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
              >
                <Sun size={14} className="text-accent" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-nav rounded-[16px] mt-2 p-3 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
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
