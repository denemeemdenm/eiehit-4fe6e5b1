import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';
import LiquidGlassModal from '@/components/LiquidGlassModal';

interface NavbarProps {
  theme: 'light' | 'dark';
}

const navItems = [
  { label: 'Ana Sayfa', id: 'hero' },
  { label: 'Hakkımda', id: 'about' },
  { label: 'Çalışma Alanları', id: 'practice' },
  { label: 'İletişim', id: 'contact' },
];

export default function Navbar({ theme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hitModalOpen, setHitModalOpen] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = navItems.map(item => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = useCallback((id: string) => {
    setActiveSection(id);
    setClickedId(id);
    setTimeout(() => setClickedId(null), 400);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  }, []);

  const isDark = theme === 'dark';

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2">
          <nav
            className="glass-nav rounded-[22px] px-2 py-1.5 flex items-center gap-2"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
            }}
          >
            {/* Logo */}
            <button onClick={() => scrollTo('hero')} className="shrink-0 flex items-center pl-2">
              <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center relative">
              {navItems.map(item => {
                const isActive = activeSection === item.id;
                const isClicked = clickedId === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="relative px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap z-10 rounded-[14px] transition-colors duration-300"
                    style={{
                      color: isActive
                        ? (isDark ? '#fff' : '#000')
                        : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'),
                    }}
                    animate={isClicked ? { scale: [1, 0.96, 1] } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    whileHover={{
                      backgroundColor: isActive ? 'transparent' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-capsule"
                        className="absolute inset-0 rounded-[14px] overflow-hidden"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          boxShadow: isDark
                            ? '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                            : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
                      >
                        {/* Hairline glass edge */}
                        <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
                          padding: '0.5px',
                          background: `linear-gradient(180deg, ${isDark ? 'hsla(0 0% 100% / 0.2)' : 'hsla(0 0% 100% / 0.7)'} 0%, ${isDark ? 'hsla(0 0% 100% / 0.04)' : 'hsla(0 0% 100% / 0.2)'} 50%, ${isDark ? 'hsla(0 0% 100% / 0.1)' : 'hsla(0 0% 100% / 0.4)'} 100%)`,
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          WebkitMaskComposite: 'xor' as any,
                        }} />

                        {/* Click flash highlight */}
                        <AnimatePresence>
                          {isClicked && (
                            <motion.div
                              className="absolute inset-0 rounded-[inherit]"
                              style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)' }}
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>
                );
              })}

              <span className="w-px h-4 mx-1.5 shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }} />

              {/* HiT logo — opens modal */}
              <motion.button
                onClick={() => setHitModalOpen(true)}
                className="px-2 flex items-center rounded-xl"
                whileHover={{ scale: 1.05, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-label="HiT — Çok Yakında"
              >
                <img
                  src={isDark ? logoLight : logoDark}
                  alt="HiTKURT"
                  className="h-5 w-auto object-contain"
                />
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
              aria-label="Menü"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-nav rounded-[16px] mt-2 p-2 md:hidden"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(60px) saturate(200%)',
                WebkitBackdropFilter: 'blur(60px) saturate(200%)',
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
              }}
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
                      className="relative block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                      style={{
                        color: isActive ? (isDark ? '#fff' : '#000') : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'),
                        background: isActive ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)') : 'transparent',
                      }}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                );
              })}
              {/* Mobile HiT button */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.04, duration: 0.2 }}
              >
                <button
                  onClick={() => { setHitModalOpen(true); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                >
                  HiT
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LiquidGlassModal isOpen={hitModalOpen} onClose={() => setHitModalOpen(false)} />
    </>
  );
}
