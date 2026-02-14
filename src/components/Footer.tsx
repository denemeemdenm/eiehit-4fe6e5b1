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
                <p className="font-bold text-sm" style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>Av. Ekin İsa EROĞLU</p>
                <p className="text-xs" style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>
                  <span className="gradient-text-cyan-word">Hukuk</span>
                  <span className="text-foreground/40 dark:text-gray-400"> × </span>
                  <span className="gradient-text-orange-word">İnovasyon</span>
                  <span className="text-foreground/40 dark:text-gray-400"> × </span>
                  <span className="gradient-text-yellow-word">Teknoloji</span>
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Sayfalar</h4>
            <nav className="flex flex-col gap-2">
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Hakkımda</button>
              <button onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">Çalışma Alanları</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">İletişim</button>
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
          <p className="text-xs text-muted-foreground/70 text-center max-w-2xl mx-auto">
            Bu web sitesinde yer alan bilgiler yalnızca bilgilendirme amacıyla sunulmakta olup hukuki danışmanlık niteliği taşımamaktadır.
            Avukat-müvekkil ilişkisi ancak yazılı sözleşme ile kurulur. Sonuç taahhüdü verilmemektedir.
          </p>
          <p className="text-xs text-muted-foreground/50 text-center">
            © {new Date().getFullYear()} <span style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}>Av. Ekin İsa EROĞLU</span>. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
