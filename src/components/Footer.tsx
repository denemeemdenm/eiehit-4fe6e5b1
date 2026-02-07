import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 mt-auto">
      <div className="max-w-6xl mx-auto content-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-10 h-auto object-contain" />
              <div>
                <p className="font-bold text-sm">Av. Ekin İsa EROĞLU</p>
                <p className="text-xs" style={{
                  background: 'linear-gradient(135deg, #c9a227 0%, #f4d03f 40%, #d4a017 70%, #c9a227 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Hukuk × İnovasyon × Teknoloji</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground" style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              background: 'linear-gradient(135deg, #c9a227 0%, #f4d03f 40%, #d4a017 70%, #c9a227 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              "Ay-Yıldız'ın Işığında; Atatürk'ün Yolunda…"
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Sayfalar</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/hakkimda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hakkımda</Link>
              <Link to="/calisma-alanlari" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Çalışma Alanları</Link>
              <Link to="/iletisim" className="text-sm text-muted-foreground hover:text-foreground transition-colors">İletişim</Link>
              <Link to="/kvkk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">KVKK / Gizlilik</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">İletişim</h4>
            <div className="space-y-2">
              <a href="tel:+905375501740" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone size={14} /> 0537 550 17 40
              </a>
              <a href="mailto:ekinisaeroglu@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={14} /> ekinisaeroglu@gmail.com
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} /> Adana, Seyhan
              </p>
              <a href="https://instagram.com/ekinisaeroglu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={14} /> @ekinisaeroglu
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 pt-8 border-t border-border/30 space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            Adana Barosu / Türkiye Barolar Birliği üyesi
          </p>
          <p className="text-xs text-muted-foreground/70 text-center max-w-2xl mx-auto">
            Bu web sitesinde yer alan bilgiler yalnızca bilgilendirme amacıyla sunulmakta olup hukuki danışmanlık niteliği taşımamaktadır.
            Avukat-müvekkil ilişkisi ancak yazılı sözleşme ile kurulur. Sonuç taahhüdü verilmemektedir.
          </p>
          <p className="text-xs text-muted-foreground/50 text-center">
            © {new Date().getFullYear()} Av. Ekin İsa EROĞLU. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
