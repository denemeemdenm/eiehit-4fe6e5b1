import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';

export default function NotFound() {
  return (
    <main className="relative z-10 pt-28 content-padding min-h-screen flex items-start justify-center">
      <div className="max-w-md mx-auto text-center pt-20">
        <GlassCard className="p-14">
          <h1 className="text-6xl font-bold gradient-text-gray mb-4">404</h1>
          <p className="text-muted-foreground mb-6">Aradığınız sayfa bulunamadı.</p>
          <Link
            to="/"
            className="glass-panel inline-block px-8 py-3 text-sm font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Ana Sayfaya Dön
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
