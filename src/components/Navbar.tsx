import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';
import LiquidGlassModal from '@/components/LiquidGlassModal';
import { Input } from '@/components/ui/input';

/* ── Interactive Glass Popover with 3D tilt + specular ── */
interface PopoverGlassProps {
  popoverRef: React.RefObject<HTMLDivElement>;
  popoverPos: { top: number; right: number };
  isDark: boolean;
  password: string;
  setPassword: (v: string) => void;
  passwordError: boolean;
  setPasswordError: (v: boolean) => void;
  setShowPasswordModal: (v: boolean) => void;
  onHitClick?: (rect?: DOMRect) => void;
  pendingRect?: DOMRect;
}

function PopoverGlass({
  popoverRef,
  popoverPos,
  isDark,
  password,
  setPassword,
  passwordError,
  setPasswordError,
  setShowPasswordModal,
  onHitClick,
  pendingRect,
}: PopoverGlassProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [specPos, setSpecPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const springCfg = useMemo(() => ({ stiffness: 150, damping: 26, mass: 1 }), []);
  const rotateX = useSpring(0, springCfg);
  const rotateY = useSpring(0, springCfg);
  const scaleVal = useSpring(1, { stiffness: 200, damping: 28, mass: 0.8 });

  const transform = useTransform(
    [rotateX, rotateY, scaleVal],
    ([rx, ry, s]: number[]) =>
      `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * 8);
      rotateX.set(-(py - 0.5) * 8);
      scaleVal.set(1.02);
      setSpecPos({ x: px * 100, y: py * 100 });
    });
  }, [rotateX, rotateY, scaleVal]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scaleVal.set(1);
    setIsHovered(false);
  }, [rotateX, rotateY, scaleVal]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        position: 'fixed',
        zIndex: 200,
        top: popoverPos.top,
        right: popoverPos.right,
        transform,
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
    >
      <div
        ref={popoverRef}
        className="relative w-[240px] overflow-hidden p-6 text-center"
        style={{
          borderRadius: '16px',
          background: 'hsla(var(--glass-bg))',
          backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
          WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturation))',
          boxShadow: isHovered
            ? isDark
              ? '0 20px 52px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)'
              : '0 20px 52px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
            : isDark
              ? '0 16px 48px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)'
              : '0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* 135° diagonal specular edge highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            borderRadius: 'inherit',
            padding: '1px',
            background: `${isHovered ? `radial-gradient(130px 130px at ${specPos.x}% ${specPos.y}%, hsla(0 0% 100% / 0.4), hsla(0 0% 100% / 0) 72%), ` : ''}linear-gradient(135deg, ${
              isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'
            } 0%, ${
              isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'
            } 25%, ${
              isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'
            } 50%, ${
              isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'
            } 75%, ${
              isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.35)'
            } 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor' as any,
          }}
        />

        {/* Specular surface highlight — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none z-[3] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.3 : 0,
            background: `radial-gradient(ellipse 280px 200px at ${specPos.x}% ${specPos.y}%, hsla(0 0% 100% / 0.1), transparent 70%)`,
          }}
        />

        {/* Noise/grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.25 }}
        >
          <Lock size={18} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }} />
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif", color: isDark ? '#fff' : '#000' }}
          >
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
            className="w-full flex flex-col gap-2.5"
          >
            <div className="relative group/input rounded-[12px] overflow-hidden">
              <Input
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                autoFocus
                className="text-center text-sm placeholder:text-muted-foreground/40 border-none focus-visible:ring-0 focus-visible:ring-offset-0 relative z-10"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#000',
                }}
              />
              <div className="absolute inset-0 rounded-[12px] pointer-events-none transition-opacity duration-300 opacity-60 group-hover/input:opacity-100" style={{
                padding: '1px',
                background: `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 0%, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'} 25%, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'} 50%, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'} 75%, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 100%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor' as any,
              }} />
            </div>
            {passwordError && (
              <motion.p
                className="text-xs text-center text-destructive"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Yanlış şifre
              </motion.p>
            )}
            <div className="relative group/btn rounded-xl overflow-hidden">
              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-semibold transition-all relative z-10"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                }}
              >
                Giriş
              </button>
              <div className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover/btn:opacity-100" style={{
                padding: '1px',
                background: `linear-gradient(135deg, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 0%, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'} 25%, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'} 50%, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'} 75%, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.5)'} 100%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor' as any,
              }} />
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}


  interface NavbarProps {
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

  // Close password popover on click outside
  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showPasswordModal) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (hitButtonRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setShowPasswordModal(false);
    };
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowPasswordModal(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', escHandler); };
  }, [showPasswordModal]);

  // Calculate popover position from HiT button
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 });
  useEffect(() => {
    if (!showPasswordModal || !hitButtonRef.current) return;
    const updatePos = () => {
      const rect = hitButtonRef.current!.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, [showPasswordModal]);

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
                    className="relative px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap z-10 rounded-[14px] transition-colors duration-300"
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
                  className="relative px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap z-10 rounded-[14px]"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                  whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="relative z-10">Ana Sayfa</span>
                </motion.button>
              )}

            </div>

            {/* Separator — desktop only, not in flashcard mode */}
            {!flashcardOpen && <span className="hidden md:block w-px h-4 mx-1.5 shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }} />}

            {/* HiT button — always visible */}
            <div className="relative">
              <motion.button
                ref={hitButtonRef}
                onClick={() => {
                  if (showPasswordModal) {
                    setShowPasswordModal(false);
                  } else {
                    const rect = hitButtonRef.current?.getBoundingClientRect();
                    setPendingRect(rect || undefined);
                    setPassword('');
                    setPasswordError(false);
                    setShowPasswordModal(true);
                  }
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
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Password Popover — fixed, macOS menu bar dropdown style */}
      <AnimatePresence>
        {showPasswordModal && (
          <PopoverGlass
            popoverRef={popoverRef}
            popoverPos={popoverPos}
            isDark={isDark}
            password={password}
            setPassword={setPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            setShowPasswordModal={setShowPasswordModal}
            onHitClick={onHitClick}
            pendingRect={pendingRect}
          />
        )}
      </AnimatePresence>

    </>);

}