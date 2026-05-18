import { useState, useEffect } from 'react';
import { Plane, Menu, X } from 'lucide-react';
import type { PageRoute } from '../App';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

const navItems: { label: string; page: PageRoute }[] = [
  { label: 'Platform', page: 'home' },
  { label: 'Data', page: 'datasets' },
  { label: 'Exhibition', page: 'exhibition' },
  { label: 'Models', page: 'models' },
  { label: 'Monitor', page: 'monitor' },
  { label: 'Publications', page: 'publications' },
];

const logoWallPartners = [
  { name: 'NASA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg' },
  { name: 'University of Birmingham', url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/University_of_Birmingham_logo.svg' },
  { name: 'University of Oxford', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet-Logo.svg' },
  { name: 'University of Cambridge', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/University_of_Cambridge_coat_of_arms_official_version.svg' },
  { name: 'UK Met Office', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Met_Office_logo.svg' },
  { name: 'University of Exeter', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/University_of_Exeter_logo.svg' },
  { name: 'Yunnan University', url: null },
  { name: 'UKRI / NERC', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/UK_Research_and_Innovation_logo.svg' },
];

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-deep-space">
      {/* Grain overlay */}
      <div className="fixed inset-0 grain-overlay z-[9999]" />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-deep-space/95 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-5">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <Plane className="w-5 h-5 text-satellite-blue group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display font-semibold text-lg tracking-tight text-white">
              ContrailLab
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  currentPage === item.page
                    ? 'text-satellite-blue bg-white/5'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-deep-space/98 backdrop-blur-lg border-t border-white/10">
            <div className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 text-left text-sm font-medium transition-all duration-300 rounded-lg ${
                    currentPage === item.page
                      ? 'text-satellite-blue bg-white/5'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>

      {/* Logo Wall — skip on home page since Home has its own */}
      {currentPage !== 'home' && (
        <section className="bg-night-slate border-t border-white/10 py-16 lg:py-20">
          <div className="px-6 lg:px-12 max-w-7xl mx-auto">
            <p className="text-center text-text-secondary text-xs uppercase tracking-[0.15em] font-medium mb-10">
              Joint Initiative & Financial Support
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {logoWallPartners.map((partner) => (
                <div
                  key={partner.name}
                  className="group flex items-center justify-center h-12 lg:h-14 px-4 transition-all duration-300"
                  title={partner.name}
                >
                  {partner.url ? (
                    <img
                      src={partner.url}
                      alt={partner.name}
                      className="h-full w-auto max-w-[140px] object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span
                    className={`font-serif text-sm lg:text-base text-white/70 group-hover:text-white group-hover:scale-105 transition-all duration-300 ${
                      partner.url ? 'hidden' : 'flex'
                    }`}
                  >
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-deep-space border-t border-white/10 py-8">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-satellite-blue" />
              <span className="font-display font-medium text-sm text-white">ContrailLab</span>
            </div>
            <p className="text-text-secondary text-xs text-center lg:text-right">
              Global contrail detection and climate impact open platform. Data for research use.
            </p>
            <div className="flex items-center gap-6 text-xs text-text-secondary">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Security</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
