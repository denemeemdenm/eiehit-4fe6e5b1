import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, Lock, Cpu, Phone, Mail, MapPin, Copy } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import ImageCard from '@/components/ImageCard';
import ScrollReveal from '@/components/ScrollReveal';
import { practiceAreas } from '@/lib/practiceAreas';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import nameWhite from '@/assets/name-white.png';
import nameBlack from '@/assets/name-black.png';

// Trust signal images
import trustProcess from '@/assets/cards/trust-process.jpg';
import trustClarity from '@/assets/cards/trust-clarity.jpg';
import trustPrivacy from '@/assets/cards/trust-privacy.jpg';
import trustTech from '@/assets/cards/trust-tech.jpg';

// Practice area images
import areaFamily from '@/assets/cards/area-family.jpg';
import areaObligations from '@/assets/cards/area-obligations.jpg';
import areaItLaw from '@/assets/cards/area-it-law.jpg';
import areaTrade from '@/assets/cards/area-trade.jpg';
import areaEmployment from '@/assets/cards/area-employment.jpg';
import areaEnforcement from '@/assets/cards/area-enforcement.jpg';

const trustSignals = [{
  icon: Shield,
  title: 'Güvenilir Süreç',
  desc: 'Her adımda şeffaf ve ölçülebilir hukuki süreç yönetimi.',
  image: trustProcess
}, {
  icon: Eye,
  title: 'Netlik ve Açıklık',
  desc: 'Karmaşık hukuki meselelerin sade ve anlaşılır aktarımı.',
  image: trustClarity
}, {
  icon: Lock,
  title: 'Gizlilik',
  desc: 'Müvekkil bilgilerinin korunması en temel önceliğimizdir.',
  image: trustPrivacy
}, {
  icon: Cpu,
  title: 'Teknoloji Okuryazarlığı',
  desc: 'Dijital çağın hukuki gereksinimlerine hakimiyet.',
  image: trustTech
}];

const areaImages: Record<string, string> = {
  'aile-hukuku': areaFamily,
  'borclar-hukuku': areaObligations,
  'bilisim-hukuku': areaItLaw,
  'ticaret-hukuku': areaTrade,
  'is-hukuku': areaEmployment,
  'icra-iflas': areaEnforcement
};
const featuredAreas = practiceAreas.slice(0, 6);

export default function Home() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mesajınız alınmıştır. En kısa sürede dönüş sağlanacaktır.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="relative z-10">
      {/* ═══ PROGRESSIVE BLUR SCROLL OVERLAY ═══ */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none h-36"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          mask: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          WebkitMask: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
        }}
      />
      <div className="fixed top-0 left-0 right-0 z-[39] pointer-events-none h-36"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.8) 35%, hsl(var(--background) / 0.4) 60%, transparent 100%)',
        }}
      />

      {/* ═══ HERO ═══ */}
      <section id="hero" className="min-h-screen flex items-center justify-center content-padding pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex justify-center">
            <div className="relative">
              <motion.img src={logo} alt="HiT Logo" className="h-36 sm:h-44 w-auto mx-auto mb-8 object-contain relative z-10" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute inset-0 -m-6 mb-2 rounded-full z-0" style={{ background: 'radial-gradient(circle, rgba(255,204,0,0.18) 0%, rgba(255,180,0,0.06) 50%, transparent 70%)', filter: 'blur(24px)' }} animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex justify-center">
            <img src={isDark ? nameWhite : nameBlack} alt="Ekin İsa EROĞLU" className="h-10 sm:h-14 md:h-16 w-auto object-contain" />
          </motion.div>

          <motion.p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed gradient-text-gold" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }} initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
            "Ay-Yıldız'ın Işığında; Atatürk'ün Yolunda…"
          </motion.p>

          <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            Değişen dünyanın hukuki gereksinimlerine, bilgi birikimi ve teknoloji okuryazarlığıyla yanıt veren profesyonel danışmanlık.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="glass-panel px-8 py-3.5 font-semibold text-sm inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-300 bg-primary/10">
              İletişim <ArrowRight size={16} />
            </button>
            <button onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })} className="glass-panel px-8 py-3.5 font-semibold text-sm inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-300">
              Çalışma Alanları
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 gradient-text-brand-heading">Hakkımda</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard className="p-10 sm:p-14 mb-8">
              <div className="flex items-start gap-6 mb-8">
                <img src={logo} alt="Logo" className="w-16 h-auto shrink-0 object-contain" />
                <div>
                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>Av. Ekin İsa EROĞLU</h3>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Hukuki süreçlerin değişen dinamiklerini yakından takip eden, teknolojiyi hukuk pratiğinin ayrılmaz bir parçası olarak benimseyen bir yaklaşımla çalışmaktadır.</p>
                <p>Müvekkillerin ihtiyaçlarını net biçimde anlayarak, karmaşık hukuki meseleleri anlaşılır ve uygulanabilir çözümlere dönüştürmek temel ilkesidir.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <GlassCard className="p-10 sm:p-14">
              <h3 className="text-xl font-bold mb-6 gradient-text-brand-heading">Yaklaşım ve Değerler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Şeffaflık', desc: 'Her aşamada müvekkile açık ve net bilgilendirme.' },
                  { title: 'Gizlilik', desc: 'Müvekkil bilgilerinin korunması en üst düzeyde sağlanır.' },
                  { title: 'Teknoloji Odaklılık', desc: 'Dijital araçlar ve yenilikçi yaklaşımlarla etkin hukuki hizmet.' },
                  { title: 'Sonuç Odaklı İletişim', desc: 'Karmaşık süreçlerin sade ve etkili biçimde yönetimi.' },
                ].map(item => (
                  <div key={item.title} className="space-y-2">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section className="section-spacing content-padding">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 gradient-text-brand-heading">
              Profesyonel Yaklaşım
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <ImageCard image={item.image} title={item.title} description={item.desc} className="h-full" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRACTICE AREAS ═══ */}
      <section id="practice" className="section-spacing content-padding">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 gradient-text-brand-heading">
              Çalışma Alanları
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
              25 farklı hukuk dalında profesyonel danışmanlık hizmeti sunulmaktadır.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAreas.map((area, i) => (
              <ScrollReveal key={area.id} delay={i * 0.08}>
                <ImageCard image={areaImages[area.id] || ''} title={area.title} description={area.description} className="h-full" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text-brand-heading">İletişim</h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              Hukuki danışmanlık veya bilgi talepleriniz için iletişime geçebilirsiniz.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Telefon', value: '0537 550 17 40', raw: '05375501740' },
                  { icon: Mail, label: 'E-posta', value: 'ekinisaeroglu@gmail.com', raw: 'ekinisaeroglu@gmail.com' },
                  { icon: MapPin, label: 'Adres', value: 'Adana, Seyhan', raw: 'Adana, Seyhan' },
                ].map(item => (
                  <GlassCard key={item.label} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium">{item.value}</p>
                        </div>
                      </div>
                      <button onClick={() => copyToClipboard(item.raw, item.label)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label={`${item.label} kopyala`}>
                        <Copy size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <GlassCard className="p-8">
                <h3 className="font-semibold text-base mb-6">Mesaj Gönderin</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Ad Soyad</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">E-posta</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Mesaj</label>
                    <textarea required rows={4} value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none resize-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <button type="submit" className="w-full glass-panel py-3 text-sm font-semibold bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Gönder
                  </button>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ HiT SIGNATURE ═══ */}
      <section className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 sm:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>
                <span className="gradient-text-cyan-word">HUKUK</span>
                <span className="text-foreground/40 dark:text-gray-400"> × </span>
                <span className="gradient-text-orange-word">İNOVASYON</span>
                <span className="text-foreground/40 dark:text-gray-400"> × </span>
                <span className="gradient-text-yellow-word">TEKNOLOJİ</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Geleneksel hukuk anlayışını dijital çağın gereksinimleriyle harmanlayan,
                yenilikçi ve teknoloji odaklı bir yaklaşımla hukuki çözümler üretilmektedir.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
