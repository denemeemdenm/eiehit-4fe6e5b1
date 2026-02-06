import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';

const sections = [
  {
    title: 'Kişisel Verilerin Korunması',
    content: 'Av. Ekin İsa EROĞLU olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin güvenliği ve gizliliği konusunda azami özen gösterilmektedir. Kişisel veriler, yalnızca hukuki hizmetlerin sunulması amacıyla ve kanuni çerçevede işlenmektedir.',
  },
  {
    title: 'Veri İşleme Amaçları',
    content: 'Toplanan kişisel veriler; hukuki danışmanlık hizmeti sunulması, iletişim taleplerinin cevaplanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir. Veriler, belirtilen amaçlar dışında kullanılmamakta ve üçüncü kişilerle paylaşılmamaktadır.',
  },
  {
    title: 'Veri Güvenliği',
    content: 'Kişisel verilerinizin hukuka aykırı olarak işlenmesini ve erişilmesini önlemek ile verilerin muhafazasını sağlamak amacıyla uygun güvenlik düzeyini temin etmeye yönelik gerekli teknik ve idari tedbirler alınmaktadır.',
  },
  {
    title: 'Haklarınız',
    content: 'KVKK\'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltme veya silinmesini isteme haklarına sahipsiniz.',
  },
  {
    title: 'Çerez Politikası',
    content: 'Web sitemizde, kullanıcı deneyimini iyileştirmek amacıyla temel çerezler kullanılmaktadır. Çerezler, kişisel veri niteliği taşımayan teknik bilgiler içermekte olup tercih ayarlarınızı saklamak için kullanılmaktadır.',
  },
  {
    title: 'İletişim',
    content: 'Kişisel verilerinizle ilgili her türlü talep ve sorularınız için ekinisaeroglu@gmail.com adresine e-posta gönderebilirsiniz.',
  },
];

export default function Privacy() {
  return (
    <main className="relative z-10 pt-28 content-padding min-h-screen">
      <div className="max-w-4xl mx-auto pb-20">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 gradient-text-gray">KVKK / Gizlilik</h1>
          <p className="text-muted-foreground mb-12">Kişisel verilerin korunması ve gizlilik politikası.</p>
        </ScrollReveal>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <ScrollReveal key={section.title} delay={i * 0.08}>
              <GlassCard className="p-8 sm:p-10">
                <h2 className="font-semibold text-lg mb-4">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}
