import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, Lock, Cpu } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import ImageCard from '@/components/ImageCard';
import ScrollReveal from '@/components/ScrollReveal';
import StaggerText from '@/components/StaggerText';
import { practiceAreas } from '@/lib/practiceAreas';
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
import areaBanking from '@/assets/cards/area-banking.jpg';
import areaCorporate from '@/assets/cards/area-corporate.jpg';
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
  'bankacilik': areaBanking,
  'birlesme-devralma': areaCorporate,
  'ticaret-borclar': areaTrade,
  'is-hukuku': areaEmployment,
  'icra-iflas': areaEnforcement
};
const featuredAreas = practiceAreas.slice(0, 6);
export default function Home() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);
  return <main className="relative z-10">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center content-padding pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{
          opacity: 0,
          scale: 0.8,
          filter: 'blur(20px)'
        }} animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        }} transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }} className="flex justify-center">
            <div className="relative">
              <motion.img src={logo} alt="HiT Logo" className="h-36 sm:h-44 w-auto mx-auto mb-8 object-contain relative z-10" animate={{
              y: [0, -6, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }} />
              <motion.div className="absolute inset-0 -m-6 mb-2 rounded-full z-0" style={{
              background: 'radial-gradient(circle, rgba(255,204,0,0.18) 0%, rgba(255,180,0,0.06) 50%, transparent 70%)',
              filter: 'blur(24px)'
            }} animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.9, 0.6]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }} />
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 30,
          filter: 'blur(10px)'
        }} animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }} transition={{
          duration: 1,
          delay: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }} className="flex justify-center">
            <img src={isDark ? nameWhite : nameBlack} alt="Ekin İsa EROĞLU" className="h-10 sm:h-14 md:h-16 w-auto object-contain" />
          </motion.div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight gradient-text-brand leading-[1.1]">
            <StaggerText text="Hukuk × İnovasyon × Teknoloji" delay={0.6} stagger={0.025} charDuration={0.6} />
          </h1>

          <motion.p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed gradient-text-brand" style={{
          fontFamily: "'Georgia', 'Times New Roman', serif"
        }} initial={{
          opacity: 0,
          y: 30,
          filter: 'blur(10px)'
        }} animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }} transition={{
          duration: 1,
          delay: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}>
            "Ay-Yıldız'ın Işığında; Atatürk'ün Yolunda…"
          </motion.p>

          <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" initial={{
          opacity: 0,
          y: 30,
          filter: 'blur(10px)'
        }} animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }} transition={{
          duration: 1,
          delay: 1.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}>
            Değişen dünyanın hukuki gereksinimlerine, bilgi birikimi ve teknoloji okuryazarlığıyla yanıt veren profesyonel danışmanlık.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 1.8
        }}>
            <Link to="/iletisim" className="glass-panel px-8 py-3.5 font-semibold text-sm inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-300 bg-primary/10">
              İletişim <ArrowRight size={16} />
            </Link>
            <Link to="/calisma-alanlari" className="glass-panel px-8 py-3.5 font-semibold text-sm inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-300">
              Çalışma Alanları
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="section-spacing content-padding">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 gradient-text-brand-heading">
              Profesyonel Yaklaşım
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((item, i) => <ScrollReveal key={item.title} delay={i * 0.1}>
                <ImageCard image={item.image} title={item.title} description={item.desc} className="h-full" />
              </ScrollReveal>)}
          </div>
        </div>
      </section>

      {/* Featured Practice Areas */}
      <section className="section-spacing content-padding">
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
            {featuredAreas.map((area, i) => <ScrollReveal key={area.id} delay={i * 0.08}>
                <Link to={`/calisma-alanlari#${area.id}`}>
                  <ImageCard image={areaImages[area.id] || ''} title={area.title} description={area.description} className="h-full" />
                </Link>
              </ScrollReveal>)}
          </div>
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-12">
              <Link to="/calisma-alanlari" className="glass-panel inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold hover:scale-105 active:scale-95 transition-transform duration-300">
                Tüm Alanları Görüntüle <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* HiT Signature */}
      <section className="section-spacing content-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 sm:p-16 text-center">
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text-gray">HUKUK x İNOVASYON x  TEKNOLOJİ</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Geleneksel hukuk anlayışını dijital çağın gereksinimleriyle harmanlayan, 
                yenilikçi ve teknoloji odaklı bir yaklaşımla hukuki çözümler üretilmektedir.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </main>;
}