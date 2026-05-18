import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Database, Globe, Code2, Radio, BookOpen,
  ArrowRight, Activity, Map, Layers, ChevronDown
} from 'lucide-react';
import type { PageRoute } from '../App';
import { loadPartners, type Partner } from './PartnersConfig';

gsap.registerPlugin(ScrollTrigger);

interface HomeProps {
  onNavigate: (page: PageRoute) => void;
}

const featureCards = [
  {
    icon: Database,
    title: 'Contrail Database',
    description: '3D interactive globe with satellite-tracked contrail datasets. Download GEO and MODIS collections.',
    page: 'datasets' as PageRoute,
    image: '/images/data_globe_graphic.jpg',
  },
  {
    icon: Globe,
    title: 'Spatio-Temporal Exhibition',
    description: 'Scientific time-series grids of contrail cloud structures across polar and geostationary observations.',
    page: 'exhibition' as PageRoute,
    image: '/images/exhibit_geostationary.jpg',
  },
  {
    icon: Code2,
    title: 'Open-Source Model Zoo',
    description: 'U-Net++, ASPP, SE modules, and Spatio-Temporal Transformers for contrail segmentation.',
    page: 'models' as PageRoute,
    image: '/images/predict_atmospheric_scene.jpg',
  },
  {
    icon: Radio,
    title: 'Live Monitor',
    description: 'Real-time WebGIS processing console with global aviation emissions monitoring.',
    page: 'monitor' as PageRoute,
    image: '/images/monitor_dashboard.jpg',
  },
  {
    icon: BookOpen,
    title: 'Research Publications',
    description: 'Academic breakthroughs in contrail detection and climate impact modeling.',
    page: 'publications' as PageRoute,
    image: '/images/label_land_water_contrail.jpg',
  },
];

const capabilities = [
  {
    icon: Activity,
    title: 'Global Feeds',
    description: 'Hourly contrail detections with location, altitude, and confidence scoring.',
  },
  {
    icon: Layers,
    title: 'Training Data',
    description: 'Labeled masks, metadata, and chips for model development and validation.',
  },
  {
    icon: Map,
    title: 'API & Formats',
    description: 'GeoJSON, NetCDF, and cloud-native access for seamless integration.',
  },
];

// Scroll to next major section — guaranteed one-click
function scrollToNextSection() {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const currentY = window.scrollY + 20;
  for (const section of sections) {
    if (section.offsetTop > currentY) {
      window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
      return;
    }
  }
  // If no next section, scroll to bottom
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// NASA placeholder SVG as data URI for fallback
const NASA_PLACEHOLDER = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg';

function PartnerLogo({ partner, size = 32 }: { partner: Partner; size?: number }) {
  const [hasError, setHasError] = useState(false);
  const src = hasError
    ? (partner.logoFallback || NASA_PLACEHOLDER)
    : (partner.logo || partner.logoFallback || NASA_PLACEHOLDER);
  const isSvg = src.endsWith('.svg');

  if (!partner.logo && !partner.logoFallback) {
    return (
      <div
        className="flex items-center justify-center rounded bg-white/10 text-white/60 font-serif text-xs font-bold shrink-0"
        style={{ width: size, height: size }}
      >
        {partner.name.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded bg-white/5 overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {isSvg ? (
        <img
          src={src}
          alt={partner.name}
          className="w-full h-full object-contain p-1"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <img
          src={src}
          alt={partner.name}
          className="w-full h-full object-contain p-1"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const detectRef = useRef<HTMLDivElement>(null);
  const geolocateRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const predictRef = useRef<HTMLDivElement>(null);
  const caseStudyRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPartners().then(data => setPartners(data.partners));

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo('.hero-bg', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo('.hero-headline .word', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, '-=0.7')
        .fromTo('.hero-sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.hero-pill', { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.75) {
            const exitProgress = (progress - 0.75) / 0.25;
            gsap.set('.hero-content', { opacity: 1 - exitProgress * 0.75, y: -exitProgress * 80 });
          } else {
            gsap.set('.hero-content', { opacity: 1, y: 0 });
          }
        },
        onLeaveBack: () => { gsap.set('.hero-content', { opacity: 1, y: 0 }); }
      });

      const pinnedConfigs = [
        { ref: detectRef, headlineX: '-40vw', panelX: '40vw' },
        { ref: geolocateRef, headlineX: '40vw', panelX: '-40vw' },
        { ref: labelRef, headlineX: '-40vw', panelX: '40vw' },
        { ref: predictRef, headlineX: '40vw', panelX: '-40vw' },
        { ref: caseStudyRef, headlineX: '-40vw', panelX: '40vw' },
      ];

      pinnedConfigs.forEach((section) => {
        if (!section.ref.current) return;
        const headline = section.ref.current.querySelector('.pinned-headline');
        const paragraph = section.ref.current.querySelector('.pinned-paragraph');
        const panel = section.ref.current.querySelector('.pinned-panel');

        gsap.fromTo(headline, { x: section.headlineX, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: section.ref.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo(paragraph, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: section.ref.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo(panel, { x: section.panelX, opacity: 0, scale: 0.96 }, {
          x: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: section.ref.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
      });

      if (platformRef.current) {
        gsap.fromTo(platformRef.current.querySelector('.platform-heading'), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, scrollTrigger: { trigger: platformRef.current, start: 'top 80%', end: 'top 55%', scrub: true }
        });
        gsap.fromTo(platformRef.current.querySelectorAll('.platform-card'), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, scrollTrigger: { trigger: platformRef.current, start: 'top 70%', end: 'top 40%', scrub: true }
        });
      }

      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.querySelectorAll('.feature-card'), { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', end: 'top 40%', scrub: true }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const heroPartners = partners.slice(0, 5);
  const allPartners = partners;

  return (
    <div className="bg-deep-space">
      {/* Fixed scroll indicator — double chevron down, transparent white */}
      <button
        onClick={scrollToNextSection}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[900] flex items-center gap-0 text-white/25 hover:text-white/55 transition-all duration-300 cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5" />
        <ChevronDown className="w-5 h-5 -ml-3" />
      </button>

      {/* Section 1: Hero */}
      <section id="hero" ref={heroRef} className="relative h-screen w-full overflow-hidden z-10">
        <div className="hero-bg absolute inset-0">
          <img src="/images/hero_orbit_earth.jpg" alt="Earth from space" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/40 via-transparent to-deep-space/80" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 0%, rgba(11,15,23,0.55) 75%, rgba(11,15,23,0.75) 100%)' }} />
        </div>
        <div className="hero-content relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="hero-headline font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white max-w-[78vw] leading-[1.1]">
            <span className="word inline-block">THE&nbsp;</span>
            <span className="word inline-block">PLANET&apos;S&nbsp;</span>
            <span className="word inline-block">CONTRAIL&nbsp;</span>
            <span className="word inline-block">FOOTPRINT,</span>
            <br />
            <span className="word inline-block text-satellite-blue">IN&nbsp;</span>
            <span className="word inline-block text-satellite-blue">REAL&nbsp;</span>
            <span className="word inline-block text-satellite-blue">TIME.</span>
          </h1>
          <p className="hero-sub mt-6 text-text-secondary text-sm md:text-base max-w-lg">
            Detection, attribution, and climate-impact modeling for aviation.
          </p>
          <div className="hero-pill mt-8 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-xs text-text-secondary">Live: 14 regions • Updated hourly</span>
          </div>
        </div>

        {/* Hero partners — 5 pairs: icon + text, icon + text, horizontal */}
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <p className="text-center text-text-secondary/50 text-[10px] uppercase tracking-[0.15em] mb-3">
            Joint Initiative & Research Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:gap-x-8 px-6">
            {heroPartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 transition-all duration-300"
                title={partner.name}
              >
                <PartnerLogo partner={partner} size={28} />
                <span className="text-[10px] lg:text-xs text-white/50 group-hover:text-white transition-all duration-300 whitespace-nowrap">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Detect */}
      <section id="detect" ref={detectRef} className="relative min-h-screen w-full overflow-hidden z-20 py-20 lg:py-0 lg:flex lg:items-center">
        <div className="absolute inset-0">
          <img src="/images/detect_contrail_scene.jpg" alt="Contrail detection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-0 lg:pt-0">
          <div className="lg:absolute lg:left-[7vw] lg:top-[18vh] lg:w-[34vw] mb-6 lg:mb-0">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">DETECT</h2>
              <p className="text-text-secondary text-sm mt-2">From single scenes to global stacks.</p>
            </div>
          </div>
          <div className="lg:absolute lg:left-[7vw] lg:top-[74vh] lg:w-[30vw] hidden lg:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Identify contrails across satellite captures with a model tuned for thin, fractured lines in varying light.</p>
            </div>
          </div>
          <div className="lg:absolute lg:right-[6vw] lg:top-[22vh] lg:w-[34vw] mt-8 lg:mt-0">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Contrail analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-sm text-gray-600">Length estimate</span>
                  <span className="text-sm font-mono font-medium text-deep-space">18.4 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className="text-sm font-mono font-medium text-deep-space">0.94</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">GOES-16 • 2026-05-17 08:14 UTC</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Geolocate */}
      <section id="geolocate" ref={geolocateRef} className="relative min-h-screen w-full overflow-hidden z-30 py-20 lg:py-0 lg:flex lg:items-center">
        <div className="absolute inset-0">
          <img src="/images/geolocate_night_map.jpg" alt="Global coverage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-0 lg:pt-0">
          <div className="lg:absolute lg:right-[7vw] lg:top-[18vh] lg:w-[34vw] lg:text-right mb-6 lg:mb-0">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">GEOLOCATE</h2>
              <p className="text-text-secondary text-sm mt-2">A detection network that follows the fleet.</p>
            </div>
          </div>
          <div className="lg:absolute lg:right-[7vw] lg:top-[74vh] lg:w-[30vw] lg:text-right hidden lg:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Map contrails by corridor, region, and time. Link detections to flight routes and atmospheric conditions.</p>
            </div>
          </div>
          <div className="lg:absolute lg:left-[6vw] lg:top-[22vh] lg:w-[34vw] mt-8 lg:mt-0">
            <div className="pinned-panel bg-night-slate/80 backdrop-blur-md border border-white/10 rounded-[10px] p-6">
              <h3 className="text-white font-display font-medium text-lg mb-4">Coverage snapshot</h3>
              <div className="space-y-3">
                {[{ label: 'Active regions', value: '14' }, { label: 'Corridors mapped', value: '186' }, { label: "Today's detections", value: '2,847' }].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="text-sm font-mono font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-4">Latency: ~8 minutes from capture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Label */}
      <section id="label" ref={labelRef} className="relative min-h-screen w-full overflow-hidden z-40 py-20 lg:py-0 lg:flex lg:items-center">
        <div className="absolute inset-0">
          <img src="/images/label_land_water_contrail.jpg" alt="Labeling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-0 lg:pt-0">
          <div className="lg:absolute lg:left-[7vw] lg:top-[18vh] lg:w-[34vw] mb-6 lg:mb-0">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">LABEL</h2>
              <p className="text-text-secondary text-sm mt-2">Pixel-perfect masks, human-reviewed.</p>
            </div>
          </div>
          <div className="lg:absolute lg:left-[7vw] lg:top-[74vh] lg:w-[30vw] hidden lg:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Train and validate with precisely annotated masks. Control class balance, geometry, and edge quality.</p>
            </div>
          </div>
          <div className="lg:absolute lg:right-[6vw] lg:top-[22vh] lg:w-[34vw] mt-8 lg:mt-0">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-3">Mask info</h3>
              <div className="flex gap-2 mb-4">
                {['contrail', 'shadow', 'ambient'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-deep-space/5 text-xs font-medium text-deep-space capitalize">{tag}</span>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-sm text-gray-600">Mean width</span>
                  <span className="text-sm font-mono font-medium text-deep-space">112 m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-sm text-gray-600">Persistence (est.)</span>
                  <span className="text-sm font-mono font-medium text-deep-space">2.1 h</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">Reviewer: v2.4 pipeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Predict */}
      <section id="predict" ref={predictRef} className="relative min-h-screen w-full overflow-hidden z-50 py-20 lg:py-0 lg:flex lg:items-center">
        <div className="absolute inset-0">
          <img src="/images/predict_atmospheric_scene.jpg" alt="Predict" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-0 lg:pt-0">
          <div className="lg:absolute lg:right-[7vw] lg:top-[18vh] lg:w-[34vw] lg:text-right mb-6 lg:mb-0">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">PREDICT</h2>
              <p className="text-text-secondary text-sm mt-2">Validate, then deploy with confidence.</p>
            </div>
          </div>
          <div className="lg:absolute lg:right-[7vw] lg:top-[74vh] lg:w-[30vw] lg:text-right hidden lg:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Compare model versions on real-world holds. Monitor drift, precision, and recall across regions.</p>
            </div>
          </div>
          <div className="lg:absolute lg:left-[6vw] lg:top-[22vh] lg:w-[34vw] mt-8 lg:mt-0">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Model performance</h3>
              <div className="flex items-end gap-3 h-16 mb-4">
                {[65, 82, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-satellite-blue/10 rounded-md overflow-hidden" style={{ height: '60px' }}>
                      <div className="bg-satellite-blue rounded-md" style={{ height: `${h}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">v2.{i === 0 ? 1 : i === 1 ? 3 : 4}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[{ label: 'Precision', value: '0.92' }, { label: 'Recall', value: '0.89' }, { label: 'F1', value: '0.90' }].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1 border-b border-black/5">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-mono font-medium text-deep-space">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Evaluated on 12k test chips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Platform Capabilities */}
      <section id="platform" ref={platformRef} className="relative py-24 lg:py-32 z-60 bg-deep-space">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <div className="platform-heading text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">Platform</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">Access detection feeds, training datasets, and APIs built for analysts, modelers, and operators.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="platform-card p-6 rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/30 transition-all duration-300 hover:bg-white/8">
                <cap.icon className="w-6 h-6 text-satellite-blue mb-4" />
                <h3 className="font-display font-medium text-white text-lg mb-2">{cap.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 rounded-[10px] bg-night-slate border border-white/10">
            <p className="text-xs uppercase tracking-[0.1em] text-text-secondary mb-3">Python quick start</p>
            <pre className="font-mono text-xs text-white/80 overflow-x-auto">{`from contraillab import Client
client = Client(key="YOUR_API_KEY")
detections = client.detections.latest(region="north_atlantic")`}</pre>
          </div>
        </div>
      </section>

      {/* Section 7: Case Study */}
      <section id="case" ref={caseStudyRef} className="relative min-h-screen w-full overflow-hidden z-[70] py-20 lg:py-0 lg:flex lg:items-center">
        <div className="absolute inset-0">
          <img src="/images/case_coastline_scene.jpg" alt="Case study" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-0 lg:pt-0">
          <div className="lg:absolute lg:left-[7vw] lg:top-[18vh] lg:w-[34vw] mb-6 lg:mb-0">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">CASE STUDY</h2>
              <p className="text-text-secondary text-sm mt-2">Coastline detections.</p>
            </div>
          </div>
          <div className="lg:absolute lg:left-[7vw] lg:top-[74vh] lg:w-[30vw] hidden lg:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">High-contrast land and water improve segmentation. We use shoreline geometry to validate spatial alignment.</p>
            </div>
          </div>
          <div className="lg:absolute lg:right-[6vw] lg:top-[22vh] lg:w-[34vw] mt-8 lg:mt-0">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Detection summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-satellite-blue/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-satellite-blue rounded-sm" />
                  </div>
                  <span className="text-sm text-gray-700">Primary</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-sm" />
                  </div>
                  <span className="text-sm text-gray-700">Shadow</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">18 detections • 6 shadows • 0 false positives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Card Grid */}
      <section id="cards" ref={cardsRef} className="relative py-24 lg:py-32 z-[80] bg-deep-space">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">Explore the Platform</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">Navigate through our specialized tools and datasets designed for contrail research.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <button
                key={i}
                onClick={() => onNavigate(card.page)}
                className="feature-card group text-left relative overflow-hidden rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/40 transition-all duration-500 hover:bg-white/8 hover:-translate-y-1"
              >
                <div className="h-40 overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/50 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <card.icon className="w-4 h-4 text-satellite-blue" />
                    <h3 className="font-display font-medium text-white">{card.title}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-satellite-blue text-xs font-medium group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Last page partners — all icon+text pairs, vertical layout */}
      <section id="partners" className="relative py-16 lg:py-20 z-[85] bg-night-slate border-t border-white/10">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <p className="text-center text-text-secondary text-xs uppercase tracking-[0.15em] font-medium mb-8">
            Joint Initiative & Financial Support
          </p>
          <div className="flex flex-col items-center gap-3 mb-10">
            {allPartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 transition-all duration-300"
                title={partner.name}
              >
                <PartnerLogo partner={partner} size={32} />
                <span className="text-xs lg:text-sm text-white/60 group-hover:text-white transition-all duration-300">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
          <p className="text-center text-text-secondary/60 text-xs max-w-lg mx-auto">
            Funded by UKRI / NERC and supported by a global consortium of atmospheric science and aviation research institutions.
          </p>
        </div>
      </section>
    </div>
  );
}
