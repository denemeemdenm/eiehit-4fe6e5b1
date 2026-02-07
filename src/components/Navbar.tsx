import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navItems = [
  { label: 'Ana Sayfa', id: 'hero' },
  { label: 'Hakkımda', id: 'about' },
  { label: 'Çalışma Alanları', id: 'practice' },
  { label: 'İletişim', id: 'contact' },
];

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Intersection Observer for scroll-based active section detection
  useEffect(() => {
    const sectionIds = navItems.map(item => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2">
        <nav className="glass-nav rounded-[20px] px-4 py-2.5 flex items-center gap-3">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200 whitespace-nowrap ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <motion.div
                    className="absolute bottom-0 left-[20%] right-[20%] h-[2px] rounded-full"
                    style={{
                      background: 'hsl(var(--accent))',
                    }}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scaleX: isActive ? 1 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            <span className="w-px h-4 bg-border/50 mx-2 shrink-0" />

            <span
              className="inline-flex items-center gap-0.5 text-[13px] font-bold whitespace-nowrap"
              style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}
            >
              <span className="gradient-text-cyan-word">Hukuk</span>
              <span className="text-muted-foreground/50">×</span>
              <span className="gradient-text-orange-word">İnovasyon</span>
              <span className="text-muted-foreground/50">×</span>
              <span className="gradient-text-yellow-word">Teknoloji</span>
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
            {navItems.map((item, i) => {
              const isActive = activeSection === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`relative block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-accent bg-accent/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline-mobile"
                        className="absolute left-4 right-4 bottom-0 h-[2px] rounded-full"
                        style={{
                          background: 'hsl(var(--accent))',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
