import { Scale, Building2, Briefcase, HandshakeIcon, Users, Landmark, Gavel, TrendingUp, DollarSign, Shield, Lock, Cpu, Home, HardHat, Handshake, Zap, Fuel, Mountain, Truck, Plane, Umbrella, HeartPulse, Sword, ShoppingCart } from 'lucide-react';

export interface PracticeArea {
  id: string;
  title: string;
  icon: any;
  description: string;
  category: string;
}

export const practiceAreas: PracticeArea[] = [
  { id: 'aile-hukuku', title: 'Aile Hukuku', icon: Users, description: 'Boşanma, velayet, nafaka ve aile içi hukuki uyuşmazlıklar.', category: 'Temel' },
  { id: 'bankacilik', title: 'Bankacılık, Finans ve Finansal Hizmetler', icon: Building2, description: 'Bankacılık düzenlemeleri, finansal uyuşmazlıklar ve finansal hizmetler hukuku.', category: 'Finans' },
  { id: 'birlesme-devralma', title: 'Birleşmeler ve Devralmalar, Şirketler Hukuku', icon: Briefcase, description: 'Şirket birleşmeleri, devralmaları ve kurumsal yeniden yapılanma süreçleri.', category: 'Şirket' },
  { id: 'ticaret-borclar', title: 'Ticaret ve Borçlar Hukuku', icon: HandshakeIcon, description: 'Ticari sözleşmeler, borç ilişkileri ve ticari uyuşmazlıkların çözümü.', category: 'Temel' },
  { id: 'is-hukuku', title: 'İş Hukuku', icon: Users, description: 'İşçi-işveren ilişkileri, iş sözleşmeleri ve işçi hakları.', category: 'Temel' },
  { id: 'icra-iflas', title: 'İcra ve İflas Hukuku', icon: Landmark, description: 'Alacak takibi, icra işlemleri ve iflas süreçlerinin yönetimi.', category: 'Temel' },
  { id: 'uyusmazlik-cozumu', title: 'Uyuşmazlık Çözümü ve Dava Takibi', icon: Gavel, description: 'Arabuluculuk, tahkim ve dava süreçlerinin etkin yönetimi.', category: 'Temel' },
  { id: 'rekabet', title: 'Rekabet Hukuku', icon: TrendingUp, description: 'Rekabet ihlalleri, birleşme kontrolleri ve uyum danışmanlığı.', category: 'Düzenleyici' },
  { id: 'sermaye-piyasalari', title: 'Sermaye Piyasaları', icon: DollarSign, description: 'Halka arz, tahvil ihracı ve sermaye piyasası düzenlemelerine uyum.', category: 'Finans' },
  { id: 'ozel-sermaye', title: 'Özel Sermaye ve Risk Sermayesi', icon: TrendingUp, description: 'Yatırım yapılandırmaları, fon oluşumu ve çıkış stratejileri.', category: 'Finans' },
  { id: 'etik-uyum', title: 'Etik ve Uyum, İç Soruşturmalar', icon: Shield, description: 'Kurumsal uyum programları, iç soruşturmalar ve etik standartlar.', category: 'Düzenleyici' },
  { id: 'kvkk-veri', title: 'Kişisel Verilerin Korunması ve Veri Yönetişimi', icon: Lock, description: 'KVKK uyumu, veri işleme süreçleri ve veri güvenliği danışmanlığı.', category: 'Teknoloji' },
  { id: 'teknoloji-medya', title: 'Teknoloji, Medya ve Telekomünikasyon', icon: Cpu, description: 'Dijital hukuk, telekomünikasyon düzenlemeleri ve medya hukuku.', category: 'Teknoloji' },
  { id: 'gayrimenkul', title: 'Gayrimenkul ve İnşaat Hukuku', icon: Home, description: 'Gayrimenkul alım-satım, kira sözleşmeleri ve imar hukuku.', category: 'Gayrimenkul' },
  { id: 'insaat-enerji', title: 'İnşaat, Enerji ve Altyapı Projeleri', icon: HardHat, description: 'Büyük ölçekli inşaat ve altyapı projelerinin hukuki yönetimi.', category: 'Gayrimenkul' },
  { id: 'kamu-ozel', title: 'Kamu Özel İşbirlikleri ve İmtiyazlar', icon: Handshake, description: 'PPP projeleri, imtiyaz sözleşmeleri ve kamu ihale hukuku.', category: 'Düzenleyici' },
  { id: 'enerji-elektrik', title: 'Enerji ve Elektrik', icon: Zap, description: 'Enerji lisansları, elektrik piyasası ve yenilenebilir enerji hukuku.', category: 'Enerji' },
  { id: 'petrol-gaz', title: 'Petrol ve Doğal Gaz', icon: Fuel, description: 'Petrol ve doğal gaz arama, üretim ve dağıtım sözleşmeleri.', category: 'Enerji' },
  { id: 'madencilik', title: 'Madencilik ve Metaller', icon: Mountain, description: 'Maden ruhsatları, çevre uyumu ve madencilik sözleşmeleri.', category: 'Enerji' },
  { id: 'tasimacilik', title: 'Taşımacılık ve Lojistik', icon: Truck, description: 'Taşıma sözleşmeleri, lojistik düzenlemeleri ve deniz hukuku.', category: 'Sektörel' },
  { id: 'havacilik', title: 'Havacılık', icon: Plane, description: 'Havacılık düzenlemeleri, havayolu sözleşmeleri ve uçak finansmanı.', category: 'Sektörel' },
  { id: 'sigorta', title: 'Sigorta', icon: Umbrella, description: 'Sigorta sözleşmeleri, tazminat talepleri ve reasürans.', category: 'Finans' },
  { id: 'saglik-ilac', title: 'Sağlık ve İlaç', icon: HeartPulse, description: 'İlaç ruhsatlandırma, sağlık düzenlemeleri ve tıbbi cihaz hukuku.', category: 'Sektörel' },
  { id: 'savunma', title: 'Savunma Sanayii', icon: Sword, description: 'Savunma ihaleleri, offset anlaşmaları ve savunma sanayi düzenlemeleri.', category: 'Sektörel' },
  { id: 'tuketim-perakende', title: 'Tüketim Ürünleri ve Perakende', icon: ShoppingCart, description: 'Tüketici hakları, perakende düzenlemeleri ve franchise hukuku.', category: 'Sektörel' },
];

export const categories = [...new Set(practiceAreas.map(a => a.category))];
