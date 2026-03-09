import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Cpu, Phone, Mail, Copy } from 'lucide-react';
import LiquidGlassCard from '@/components/LiquidGlassCard';
import ImageCard from '@/components/ImageCard';
import ScrollReveal from '@/components/ScrollReveal';
import { practiceAreas } from '@/lib/practiceAreas';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import nameWhite from '@/assets/name-white.png';
import nameBlack from '@/assets/name-black.png';

// Trust signal images — dark
import trustProcess from '@/assets/cards/trust-process.jpg';
import trustClarity from '@/assets/cards/trust-clarity.png';
import trustPrivacy from '@/assets/cards/trust-privacy.jpeg';
import trustTech from '@/assets/cards/teknoloji-okuryazarligi.png';
// Trust signal images — light
import trustProcessLight from '@/assets/cards/trust-process-light.jpg';
import trustClarityLight from '@/assets/cards/trust-clarity-light.jpg';
import trustPrivacyLight from '@/assets/cards/trust-privacy-light.jpg';
import trustTechLight from '@/assets/cards/teknoloji-okuryazarligi.png';

// Practice area images — uploaded replacements (both themes)
import aileHukukuImg from '@/assets/cards/aile-hukuku.png';
import bilisimHukukuImg from '@/assets/cards/bilisim-hukuku.png';
import ticaretHukukuImg from '@/assets/cards/ticaret-ve-borclar-hukuku.png';
import isHukukuImg from '@/assets/cards/is-hukuku.png';
import icraHukukuImg from '@/assets/cards/icra-ve-iflas-hukuku.png';
import cezaHukukuImg from '@/assets/cards/ceza-hukuku.png';
// Ceza Hukuku fallback visuals
import areaObligations from '@/assets/cards/area-obligations.jpg';
import areaObligationsLight from '@/assets/cards/area-obligations-light.jpg';

const trustSignalsDark = [{
  icon: Shield, title: 'Güvenilir Süreç', desc: 'Her adımda şeffaf ve ölçülebilir hukuki süreç yönetimi.', image: trustProcess
}, {
  icon: Eye, title: 'Netlik ve Açıklık', desc: 'Karmaşık hukuki meselelerin sade ve anlaşılır aktarımı.', image: trustClarity
}, {
  icon: Lock, title: 'Gizlilik', desc: 'Müvekkil bilgilerinin korunması en temel önceliğimizdir.', image: trustPrivacy
}, {
  icon: Cpu, title: 'Teknoloji Okuryazarlığı', desc: 'Dijital çağın hukuki gereksinimlerine hakimiyet.', image: trustTech
}];

const trustSignalsLight = [{
  icon: Shield, title: 'Güvenilir Süreç', desc: 'Her adımda şeffaf ve ölçülebilir hukuki süreç yönetimi.', image: trustProcess
}, {
  icon: Eye, title: 'Netlik ve Açıklık', desc: 'Karmaşık hukuki meselelerin sade ve anlaşılır aktarımı.', image: trustClarity
}, {
  icon: Lock, title: 'Gizlilik', desc: 'Müvekkil bilgilerinin korunması en temel önceliğimizdir.', image: trustPrivacy
}, {
  icon: Cpu, title: 'Teknoloji Okuryazarlığı', desc: 'Dijital çağın hukuki gereksinimlerine hakimiyet.', image: trustTech
}];

const areaImagesDark: Record<string, string> = {
  'aile-hukuku': aileHukukuImg,
  'ceza-hukuku': cezaHukukuImg,
  'bilisim-hukuku': bilisimHukukuImg,
  'ticaret-hukuku': ticaretHukukuImg,
  'is-hukuku': isHukukuImg,
  'icra-iflas': icraHukukuImg
};
const areaImagesLight: Record<string, string> = {
  'aile-hukuku': aileHukukuImg,
  'ceza-hukuku': cezaHukukuImg,
  'bilisim-hukuku': bilisimHukukuImg,
  'ticaret-hukuku': ticaretHukukuImg,
  'is-hukuku': isHukukuImg,
  'icra-iflas': icraHukukuImg
};
const featuredAreas = practiceAreas.slice(0, 6);

// Animated gradient heading with serif font — alternates red/cyan
const AnimatedGradientHeading = forwardRef<HTMLHeadingElement, {children: React.ReactNode;className?: string;color?: 'red' | 'cyan';as?: 'h2' | 'h3';}>(
  ({ children, className, color = 'red', as: Tag = 'h2' }, ref) => (
    <Tag ref={ref as any} className={`${color === 'red' ? 'heading-gradient-red' : 'heading-gradient-cyan'} ${className || ''}`}>
      {children}
    </Tag>
  )
);
AnimatedGradientHeading.displayName = 'AnimatedGradientHeading';

export default function Home() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı`);
  };

  return (
    <main className="relative z-10">

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center content-padding pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex justify-center">
            <div className="relative">
              <motion.img src={logo} alt="HiT Logo" className="h-36 sm:h-44 w-auto mx-auto mb-8 object-contain relative z-10 cursor-grab active:cursor-grabbing" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} drag dragConstraints={heroRef} dragElastic={0.15} dragMomentum dragTransition={{ timeConstant: 150, power: 0.3, bounceDamping: 15, bounceStiffness: 300 }} whileDrag={{ scale: 1.08, rotate: 0, filter: 'drop-shadow(0 0 24px rgba(255,204,0,0.5)) drop-shadow(0 8px 32px rgba(0,0,0,0.3))' }} whileTap={{ scale: 0.97 }} />
              <motion.div className="absolute inset-0 -m-6 mb-2 rounded-full z-0" style={{ background: 'radial-gradient(circle, rgba(255,204,0,0.18) 0%, rgba(255,180,0,0.06) 50%, transparent 70%)', filter: 'blur(24px)' }} animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex justify-center">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold heading-gradient-silver"
              style={{ fontFamily: "'HiT Vision Pro Max', sans-serif", lineHeight: 1.4, paddingTop: '0.15em', overflow: 'visible', letterSpacing: '-0.05em' }}
            >
              EKİN İSA EROĞLU
            </h1>
          </motion.div>

          <motion.p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed heading-gradient-gold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
            "Ay-Yıldız'ın Işığında; Atatürk'ün Yolunda…"
          </motion.p>

          <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            Değişen dünyanın hukuki gereksinimlerine, bilgi birikimi ve teknoloji okuryazarlığıyla yanıt veren profesyonel danışmanlık.
          </motion.p>

        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <AnimatedGradientHeading color="red" className="text-2xl sm:text-[30px] font-bold mb-12 text-center">Hakkımda</AnimatedGradientHeading>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="p-10 sm:p-14 mb-8">
              <div className="flex items-start gap-6 mb-8">
                <img src={logo} alt="Logo" className="w-16 h-auto shrink-0 object-contain" />
                <div>
                  <h3 className="text-2xl font-bold mb-1 heading-gradient-silver" style={{ fontFamily: "'HiT Vision Pro Max', sans-serif" }}>Av. Ekin İsa EROĞLU</h3>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Hukuki süreçlerin değişen dinamiklerini yakından takip eden, teknolojiyi hukuk pratiğinin ayrılmaz bir parçası olarak benimseyen bir yaklaşımla çalışmaktadır.</p>
                <p>Müvekkillerin ihtiyaçlarını net biçimde anlayarak, karmaşık hukuki meseleleri anlaşılır ve uygulanabilir çözümlere dönüştürmek temel ilkesidir.</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="p-10 sm:p-14">
              <AnimatedGradientHeading as="h3" color="cyan" className="text-xl font-bold mb-6">Yaklaşım ve Değerler</AnimatedGradientHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                { title: 'Şeffaflık', desc: 'Her aşamada müvekkile açık ve net bilgilendirme.' },
                { title: 'Gizlilik', desc: 'Müvekkil bilgilerinin korunması en üst düzeyde sağlanır.' },
                { title: 'Teknoloji Odaklılık', desc: 'Dijital araçlar ve yenilikçi yaklaşımlarla etkin hukuki hizmet.' },
                { title: 'Sonuç Odaklı İletişim', desc: 'Karmaşık süreçlerin sade ve etkili biçimde yönetimi.' }].
                map((item) =>
                <div key={item.title} className="space-y-2">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section className="section-spacing content-padding">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <AnimatedGradientHeading color="cyan" className="text-2xl sm:text-[30px] font-bold text-center mb-16">
              Profesyonel Yaklaşım
            </AnimatedGradientHeading>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isDark ? trustSignalsDark : trustSignalsLight).map((item, i) =>
            <ScrollReveal key={item.title} delay={i * 0.1}>
                <ImageCard image={item.image} title={item.title} description={item.desc} className="h-full" aspectRatio="1/1" />
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PRACTICE AREAS ═══ */}
      <section id="practice" className="section-spacing content-padding">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <AnimatedGradientHeading color="red" className="text-2xl sm:text-[30px] font-bold text-center mb-4">
              Çalışma Alanları
            </AnimatedGradientHeading>
            <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">Aşağıdaki tüm alanlarda ve daha birçok farklı hukuk alanında  profesyonel danışmanlık hizmeti sunulmaktadır.

            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAreas.map((area, i) =>
            <ScrollReveal key={area.id} delay={i * 0.08}>
                <ImageCard image={(isDark ? areaImagesDark : areaImagesLight)[area.id] || ''} title={area.title} description={area.description} className="h-full" aspectRatio="4/3" />
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <AnimatedGradientHeading color="cyan" className="text-2xl sm:text-[30px] font-bold mb-4 text-center">İletişim</AnimatedGradientHeading>
            <p className="text-muted-foreground mb-12 max-w-xl text-center mx-auto">
              Hukuki danışmanlık veya bilgi talepleriniz için iletişime geçebilirsiniz.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
              <div className="max-w-lg mx-auto space-y-4">
                {[
              { icon: Phone, label: 'Telefon', value: '0537 550 17 40', raw: '05375501740' },
              { icon: Mail, label: 'E-posta', value: 'ekinisaeroglu@gmail.com', raw: 'ekinisaeroglu@gmail.com' }].
              map((item) =>
              <LiquidGlassCard key={item.label} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 shrink-0 icon-gradient-cyan" />
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium">{item.value}</p>
                        </div>
                      </div>
                      <button onClick={() => copyToClipboard(item.raw, item.label)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label={`${item.label} kopyala`}>
                        <Copy size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </LiquidGlassCard>
              )}
              </div>
            </ScrollReveal>
        </div>
      </section>

      {/* ═══ HiT SIGNATURE ═══ */}
      <section className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <LiquidGlassCard className="p-12 sm:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'HiT Vision Pro Max', sans-serif" }}>
                <span className="gradient-text-cyan-word">HUKUK</span>
                <span className="text-foreground/40"> × </span>
                <span className="gradient-text-orange-word">İNOVASYON</span>
                <span className="text-foreground/40"> × </span>
                <span className="gradient-text-yellow-word">TEKNOLOJİ</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Geleneksel hukuk anlayışını dijital çağın gereksinimleriyle harmanlayan,
                yenilikçi ve teknoloji odaklı bir yaklaşımla hukuki çözümler üretilmektedir.
              </p>
            </LiquidGlassCard>
          </ScrollReveal>
        </div>
      </section>
    </main>);

}