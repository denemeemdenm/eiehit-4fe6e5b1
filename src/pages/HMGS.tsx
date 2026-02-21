import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import { Clock } from 'lucide-react';

export default function HMGS() {
  return (
    <main className="relative z-10 pt-28 content-padding min-h-screen flex items-start justify-center">
      <div className="max-w-2xl mx-auto text-center pt-20">
        <ScrollReveal>
          <GlassCard className="p-14 sm:p-20">
            <Clock className="w-12 h-12 text-primary mx-auto mb-6 opacity-60" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 heading-gradient-red">
              HMGS ve Adli Yargı
            </h1>
            <p className="text-lg text-muted-foreground mb-2">Yakında</p>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
              Bu alan yakında hizmete sunulacaktır. Gelişmelerden haberdar olmak için iletişim sayfamızı ziyaret edebilirsiniz.
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>
    </main>
  );
}
