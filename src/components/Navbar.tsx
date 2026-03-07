import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';
import LiquidGlassModal from '@/components/LiquidGlassModal';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  theme: 'light' | 'dark';
  onHitClick?: (rect?: DOMRect) => void;
  flashcardOpen?: boolean;
  onFlashcardClose?: () => void;
}

const navItems = [
{ label: 'Ana Sayfa', id: 'hero' },
{ label: 'Hakkımda', id: 'about' },
{ label: 'Çalışma Alanları', id: 'practice' },
{ label: 'İletişim', id: 'contact' }];


export default function Navbar({ theme, onHitClick, flashcardOpen, onFlashcardClose }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hitModalOpen, setHitModalOpen] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [navHovered, setNavHovered] = useState(false);
  const [navSpecular, setNavSpecular] = useState({ x: 50, y: 50 });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [pendingRect, setPendingRect] = useState<DOMRect | undefined>();
  const hitButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navRaf = useRef<number>(0);

  const handleNavMouseMove = useCallback((e: React.MouseEvent) => {
    const el = navRef.current;
    if (!el) return;
    cancelAnimationFrame(navRaf.current);
    navRaf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      setNavSpecular({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    });
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {if (entry.isIntersecting) setActiveSection(id);},
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
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
          <motion.nav
            ref={navRef}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            className="px-2 flex-row flex items-center justify-start gap-[8px] rounded-[21.6px] py-[8px] relative overflow-hidden"
            style={{
              background: 'hsla(var(--glass-bg))',
              backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
              WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
              boxShadow: isDark ?
              '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' :
              '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.22)'
            }}
            onMouseMove={handleNavMouseMove}
            onMouseEnter={() => setNavHovered(true)}
            onMouseLeave={() => setNavHovered(false)}
          >
            {/* 135° diagonal specular edge highlight — corner-to-corner highlight */}
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-[2]" style={{
              padding: '1px',
              background: `${navHovered ? `radial-gradient(80px 30px at ${navSpecular.x}px ${navSpecular.y}px, ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)'}, transparent 100%), ` : ''}linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'} 0%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 25%, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'} 50%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'} 75%, ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'} 100%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor' as any
            }} />

            {/* Logo */}
            <button onClick={() => { if (flashcardOpen) { onFlashcardClose?.(); } else { scrollTo('hero'); } }} className="shrink-0 flex items-center pl-2">
              <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center relative">
              {!flashcardOpen && navItems.map((item) => {
                const isActive = activeSection === item.id;
                const isClicked = clickedId === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="relative px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap z-10 rounded-[14px] transition-colors duration-300"
                    style={{
                      color: isActive ?
                      isDark ? '#fff' : '#000' :
                      isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
                    }}
                    animate={isClicked ? { scale: [1, 0.96, 1] } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    whileHover={{
                      backgroundColor: isActive ? 'transparent' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
                    }}>

                    {isActive &&
                    <motion.div
                      layoutId="nav-capsule"
                      className="absolute inset-0 rounded-[14px] overflow-hidden"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: isDark ?
                        '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' :
                        '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}>

                        {/* Hairline glass edge */}
                        <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
                        padding: '1px',
                        background: `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 0%, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'} 25%, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)'} 50%, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'} 75%, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 100%)`,
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor' as any
                      }} />

                        {/* Click flash highlight */}
                        <AnimatePresence>
                          {isClicked &&
                        <motion.div
                          className="absolute inset-0 rounded-[inherit]"
                          style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)' }}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }} />

                        }
                        </AnimatePresence>
                      </motion.div>
                    }
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>);

              })}

              {flashcardOpen && (
                <motion.button
                  layout
                  onClick={() => onFlashcardClose?.()}
                  className="relative px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap z-10 rounded-[14px]"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                  whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="relative z-10">Ana Sayfa</span>
                </motion.button>
              )}

              {!flashcardOpen && <span className="w-px h-4 mx-1.5 shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }} />}

              {/* HiT logo — opens popover */}
              <div className="relative">
                <motion.button
                  ref={hitButtonRef}
                  onClick={() => {
                    const rect = hitButtonRef.current?.getBoundingClientRect();
                    setPendingRect(rect || undefined);
                    setPassword('');
                    setPasswordError(false);
                    setShowPasswordModal(true);
                  }}
                  className="relative px-3.5 py-1.5 flex items-center rounded-[14px]"
                  whileHover={{ scale: 1.05, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  aria-label="HiT — Çok Yakında">

                  {flashcardOpen && (
                    <motion.div
                      layoutId="nav-capsule"
                      className="absolute inset-0 rounded-[14px] overflow-hidden"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: isDark
                          ? '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                          : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
                    >
                      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
                        padding: '1px',
                        background: `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 0%, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'} 25%, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)'} 50%, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'} 75%, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 100%)`,
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor' as any
                      }} />
                    </motion.div>
                  )}

                  <img
                    src={isDark ? logoLight : logoDark}
                    alt="HiTKURT"
                    className="h-5 w-auto object-contain relative z-10" />

                </motion.button>
                
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
              aria-label="Menü">

              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </motion.nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen &&
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-nav rounded-[16px] mt-2 p-2 md:hidden"
            style={{
              background: 'hsla(var(--glass-bg))',
              backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
              WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)'
            }}>

              {flashcardOpen ? (
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <button
                    onClick={() => { onFlashcardClose?.(); setMobileOpen(false); }}
                    className="relative block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: isDark ? '#fff' : '#000', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)' }}>
                    Ana Sayfa
                  </button>
                </motion.div>
              ) : navItems.map((item, i) => {
              const isActive = activeSection === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}>
                    <button
                    onClick={() => scrollTo(item.id)}
                    className="relative block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                    style={{
                      color: isActive ? isDark ? '#fff' : '#000' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                      background: isActive ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)' : 'transparent'
                    }}>
                      {item.label}
                    </button>
                  </motion.div>);

            })}
              {/* Mobile HiT button */}
              <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.04, duration: 0.2 }}>

                <button
                onClick={() => {
                  setPendingRect(undefined);
                  setPassword('');
                  setPasswordError(false);
                  setShowPasswordModal(true);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>

                  HiT
                </button>
              </motion.div>
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPasswordModal(false)} />
            <motion.div
              className="relative z-10 w-[320px] rounded-[24px] p-8 overflow-hidden"
              style={{
                background: 'hsla(210, 15%, 8%, 0.75)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Noise texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '128px',
                }}
              />
              {/* Top shine */}
              <div
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[inherit]"
                style={{ background: 'linear-gradient(180deg, hsla(180, 100%, 69%, 0.08) 0%, transparent 100%)' }}
              />
              {/* Glass border with cyan/red accents */}
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(100,255,255,0.3) 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 75%, rgba(255,75,0,0.25) 100%)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor' as any,
              }} />

              <div className="flex flex-col items-center gap-4">
                <Lock size={24} style={{ color: isDark ? 'hsl(180, 100%, 69%)' : 'hsl(0, 84%, 60%)' }} />
                <h3 className="text-base font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                  Erişim Şifresi
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (password === '1071') {
                      setShowPasswordModal(false);
                      onHitClick?.(pendingRect);
                    } else {
                      setPasswordError(true);
                      setPassword('');
                    }
                  }}
                  className="w-full flex flex-col gap-3"
                >
                  <Input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                    autoFocus
                    className="text-center"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      borderColor: passwordError ? 'hsl(0, 84%, 60%)' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    }}
                  />
                  {passwordError && (
                    <p className="text-xs text-center" style={{ color: 'hsl(0, 84%, 60%)' }}>
                      Yanlış şifre
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: isDark ? 'hsl(180, 100%, 69%)' : 'hsl(0, 84%, 60%)',
                      color: isDark ? '#000' : '#fff',
                    }}
                  >
                    Giriş
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>);

}