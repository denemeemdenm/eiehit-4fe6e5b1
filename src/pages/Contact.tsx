import { useState } from 'react';
import { Phone, Mail, MapPin, Copy, Check } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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
    <main className="relative z-10 pt-28 content-padding min-h-screen">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 heading-gradient-cyan">İletişim</h1>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Hukuki danışmanlık veya bilgi talepleriniz için iletişime geçebilirsiniz.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
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
                      <item.icon className="w-5 h-5 shrink-0 icon-gradient-cyan" />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.raw, item.label)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label={`${item.label} kopyala`}
                    >
                      <Copy size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.2}>
            <GlassCard className="p-8">
              <h3 className="font-semibold text-base mb-6">Mesaj Gönderin</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Ad Soyad</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">E-posta</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Mesaj</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent outline-none resize-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full glass-panel py-3 text-sm font-semibold bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Gönder
                </button>
              </form>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
