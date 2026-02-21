import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import logo from '@/assets/logo.png';

export default function About() {
  return (
    <main className="relative z-10 pt-28 content-padding min-h-screen">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 heading-gradient-red">Hakkımda</h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GlassCard className="p-10 sm:p-14 mb-8">
            <div className="flex items-start gap-6 mb-8">
              <img src={logo} alt="Logo" className="w-16 h-auto shrink-0 object-contain" />
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>Av. Ekin İsa EROĞLU</h2>
                <p className="text-sm text-muted-foreground">Adana Barosu / Türkiye Barolar Birliği</p>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Hukuki süreçlerin değişen dinamiklerini yakından takip eden, teknolojiyi hukuk pratiğinin ayrılmaz bir parçası olarak benimseyen bir yaklaşımla çalışmaktadır.
              </p>
              <p>
                Müvekkillerin ihtiyaçlarını net biçimde anlayarak, karmaşık hukuki meseleleri anlaşılır ve uygulanabilir çözümlere dönüştürmek temel ilkesidir.
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <GlassCard className="p-10 sm:p-14 mb-8">
            <h3 className="text-xl font-bold mb-6 heading-gradient-cyan">Yaklaşım ve Değerler</h3>
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
    </main>
  );
}
