import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import { practiceAreas, categories } from '@/lib/practiceAreas';
import { Search } from 'lucide-react';

export default function PracticeAreas() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = practiceAreas.filter(area => {
    const matchesSearch = area.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || area.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="relative z-10 pt-28 content-padding min-h-screen">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 gradient-text-gray">Çalışma Alanları</h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            25 farklı hukuk dalında profesyonel danışmanlık hizmeti.
          </p>
        </ScrollReveal>

        {/* Search & Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="glass-panel flex items-center gap-3 px-4 py-2.5 flex-1 max-w-md">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Alan ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`glass-panel px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  !activeCategory ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                }`}
              >
                Tümü
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`glass-panel px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                    activeCategory === cat ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filtered.map((area, i) => (
            <ScrollReveal key={area.id} delay={i * 0.04}>
              {area.id === 'hmgs' ? (
                <Link to="/hmgs">
                  <GlassCard className="p-8 h-full">
                    <area.icon className="w-7 h-7 text-primary mb-4" />
                    <h3 className="font-semibold text-base mb-2">{area.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                  </GlassCard>
                </Link>
              ) : (
                <GlassCard className="p-8 h-full">
                  <area.icon className="w-7 h-7 text-primary mb-4" />
                  <h3 className="font-semibold text-base mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                  <span className="inline-block mt-4 text-xs font-medium text-primary/70 glass-panel px-3 py-1">{area.category}</span>
                </GlassCard>
              )}
            </ScrollReveal>
          ))}
        </div>

        {/* HMGS Link */}
        <ScrollReveal delay={0.2}>
          <div className="pb-20">
            <Link to="/hmgs">
              <GlassCard className="p-10 text-center">
                <h3 className="font-semibold text-lg mb-2">HMGS ve Adli Yargı (Yakında)</h3>
                <p className="text-sm text-muted-foreground">Bu alan yakında hizmete sunulacaktır.</p>
              </GlassCard>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
