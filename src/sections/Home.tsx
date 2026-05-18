import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  Database, Globe, Code2, Radio, BookOpen,
  ArrowRight, Activity, Map, Layers, ChevronDown
} from 'lucide-react';
import type { PageRoute } from '../App';
import { loadPartners, type Partner } from './PartnersConfig';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

function PartnerLogo({ partner, size = 32 }: { partner: Partner; size?: number }) {
  const [hasError, setHasError] = useState(false);
  const src = hasError ? (partner.logoFallback || '') : (partner.logo || partner.logoFallback || '');

  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded font-serif text-xs font-bold text-white/60 shrink-0"
        style={{ width: size, height: size }}
      >
        {partner.name.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={partner.name}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}

// ===== Scroll to next section — ONE CLICK =====
function scrollToNextSection() {
  const currentY = window.scrollY;
  const vh = window.innerHeight;

  // A pinned section with `end: "+=100%"` creates a spacer of
  // `sectionHeight + pinDistance = vh + vh = 2*vh`. Scrolling by
  // `1.5*vh` lands us clearly inside the next section's range so snap
  // snaps to its settle center (never gets stuck on the boundary).
  const targetY = currentY + vh * 1.5;

  const snapTrigger = ScrollTrigger.getAll().find(st => st.vars.snap && !st.vars.pin);
  if (snapTrigger) snapTrigger.disable(false);

  window.scrollTo(0, targetY);

  if (snapTrigger) snapTrigger.enable();
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
  }, []);

  useEffect(() => {
    if (partners.length === 0) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo('.hero-bg', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo('.hero-headline .word', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, '-=0.7')
        .fromTo('.hero-sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.hero-pill', { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

      // ===== PINNED SECTIONS =====
      const pinnedSectionIds = [
        { ref: heroRef },
        { ref: detectRef },
        { ref: geolocateRef },
        { ref: labelRef },
        { ref: predictRef },
        { ref: caseStudyRef },
      ];

      pinnedSectionIds.forEach((sec, i) => {
        if (!sec.ref.current) return;

        const headline = sec.ref.current.querySelector('.pinned-headline');
        const paragraph = sec.ref.current.querySelector('.pinned-paragraph');
        const panel = sec.ref.current.querySelector('.pinned-panel');

        gsap.fromTo(headline, { x: i % 2 === 0 ? '-40vw' : '40vw', opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: sec.ref.current, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo(paragraph, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: sec.ref.current, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo(panel, { x: i % 2 === 0 ? '40vw' : '-40vw', opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: sec.ref.current, start: 'top 85%', toggleActions: 'play none none reverse' }
        });

        ScrollTrigger.create({
          trigger: sec.ref.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        });
      });

      // ===== GLOBAL SNAP =====
      setTimeout(() => {
        const all = ScrollTrigger.getAll();
        const pinned = all.filter(st => st.vars.pin).sort((a, b) => a.start - b.start);

        if (pinned.length > 0) {
          const maxScroll = ScrollTrigger.maxScroll(window);
          if (maxScroll) {
            const ranges = pinned.map(st => {
              const s = st.start / maxScroll;
              const e = (st.end ?? st.start) / maxScroll;
              return { start: s, end: e, center: s + (e - s) * 0.5 };
            });

            ScrollTrigger.create({
              snap: {
                snapTo: (value: number) => {
                  const inPinned = ranges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
                  if (!inPinned) return value;
                  let nearest = ranges[0].center;
                  let minD = Math.abs(nearest - value);
                  for (const r of ranges) {
                    const d = Math.abs(r.center - value);
                    if (d < minD) { minD = d; nearest = r.center; }
                  }
                  return nearest;
                },
                duration: { min: 0.15, max: 0.35 },
                delay: 0,
                ease: 'power2.out',
              }
            });
          }
        }
      }, 50);

      // Flowing sections
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
  }, [partners]);

  const allPartners = partners;
  // Split into two rows for hero: 4 + 4
  const heroRow1 = partners.slice(0, 4);
  const heroRow2 = partners.slice(4, 8);

  return (
    <div className="bg-deep-space">
      {/* Fixed scroll indicator — stacked chevrons */}
      <button
        onClick={scrollToNextSection}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[900] flex flex-col items-center text-white/25 hover:text-white/55 transition-all duration-300 cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-4 h-4 -mb-2 opacity-60" />
        <ChevronDown className="w-6 h-6" />
      </button>

      {/* ===== Section 1: Hero (PINNED) ===== */}
      <section id="hero" ref={heroRef} className="relative h-screen w-full overflow-hidden">
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
          <p className="hero-sub mt-6 text-text-secondary text-sm md:text-base max-w-lg">Detection, attribution, and climate-impact modeling for aviation.</p>
          <div className="hero-pill mt-8 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-xs text-text-secondary">Live: 14 regions &bull; Updated hourly</span>
          </div>
        </div>

        {/* Hero partners — two rows: 4 + 4, icon + text pairs */}
        <div className="absolute bottom-5 left-0 right-0 z-20">
          <p className="text-center text-text-secondary/50 text-[10px] uppercase tracking-[0.15em] mb-3">Joint Initiative & Research Partners</p>
          <div className="flex flex-col items-center gap-y-1.5">
            {/* Row 1 */}
            <div className="flex items-center justify-center gap-x-4 lg:gap-x-7 px-6">
              {heroRow1.map(p => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 transition-all duration-300" title={p.name}>
                  <PartnerLogo partner={p} size={28} />
                  <span className="text-[10px] lg:text-xs text-white/50 group-hover:text-white transition-all duration-300 whitespace-nowrap">{p.name}</span>
                </a>
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex items-center justify-center gap-x-4 lg:gap-x-7 px-6">
              {heroRow2.map(p => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 transition-all duration-300" title={p.name}>
                  <PartnerLogo partner={p} size={28} />
                  <span className="text-[10px] lg:text-xs text-white/50 group-hover:text-white transition-all duration-300 whitespace-nowrap">{p.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Detect (PINNED) ===== */}
      <section id="detect" ref={detectRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/detect_contrail_scene.jpg" alt="Contrail detection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 h-full">
          <div className="absolute left-[7vw] top-[18vh] w-[34vw]">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">DETECT</h2>
              <p className="text-text-secondary text-sm mt-2">From single scenes to global stacks.</p>
            </div>
          </div>
          <div className="absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Identify contrails across satellite captures with a model tuned for thin, fractured lines in varying light.</p>
            </div>
          </div>
          <div className="absolute right-[6vw] top-[22vh] w-[88vw] md:w-[34vw]">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Contrail analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-black/5"><span className="text-sm text-gray-600">Length estimate</span><span className="text-sm font-mono font-medium text-deep-space">18.4 km</span></div>
                <div className="flex justify-between items-center py-2 border-b border-black/5"><span className="text-sm text-gray-600">Confidence</span><span className="text-sm font-mono font-medium text-deep-space">0.94</span></div>
              </div>
              <p className="text-xs text-gray-400 mt-4">GOES-16 &bull; 2026-05-17 08:14 UTC</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 3: Geolocate (PINNED) ===== */}
      <section id="geolocate" ref={geolocateRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/geolocate_night_map.jpg" alt="Global coverage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 h-full">
          <div className="absolute right-[7vw] top-[18vh] w-[34vw] text-right">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">GEOLOCATE</h2>
              <p className="text-text-secondary text-sm mt-2">A detection network that follows the fleet.</p>
            </div>
          </div>
          <div className="absolute right-[7vw] top-[74vh] w-[30vw] text-right hidden md:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Map contrails by corridor, region, and time. Link detections to flight routes and atmospheric conditions.</p>
            </div>
          </div>
          <div className="absolute left-[6vw] top-[22vh] w-[88vw] md:w-[34vw]">
            <div className="pinned-panel bg-night-slate/80 backdrop-blur-md border border-white/10 rounded-[10px] p-6">
              <h3 className="text-white font-display font-medium text-lg mb-4">Coverage snapshot</h3>
              <div className="space-y-3">
                {[{ label: 'Active regions', value: '14' }, { label: 'Corridors mapped', value: '186' }, { label: "Today's detections", value: '2,847' }].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-sm text-text-secondary">{item.label}</span><span className="text-sm font-mono font-medium text-white">{item.value}</span></div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-4">Latency: ~8 minutes from capture</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 4: Label (PINNED) ===== */}
      <section id="label" ref={labelRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/label_land_water_contrail.jpg" alt="Labeling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 h-full">
          <div className="absolute left-[7vw] top-[18vh] w-[34vw]">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">LABEL</h2>
              <p className="text-text-secondary text-sm mt-2">Pixel-perfect masks, human-reviewed.</p>
            </div>
          </div>
          <div className="absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Train and validate with precisely annotated masks. Control class balance, geometry, and edge quality.</p>
            </div>
          </div>
          <div className="absolute right-[6vw] top-[22vh] w-[88vw] md:w-[34vw]">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-3">Mask info</h3>
              <div className="flex gap-2 mb-4">
                {['contrail', 'shadow', 'ambient'].map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-deep-space/5 text-xs font-medium text-deep-space capitalize">{tag}</span>)}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-black/5"><span className="text-sm text-gray-600">Mean width</span><span className="text-sm font-mono font-medium text-deep-space">112 m</span></div>
                <div className="flex justify-between items-center py-2 border-b border-black/5"><span className="text-sm text-gray-600">Persistence (est.)</span><span className="text-sm font-mono font-medium text-deep-space">2.1 h</span></div>
              </div>
              <p className="text-xs text-gray-400 mt-4">Reviewer: v2.4 pipeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Predict (PINNED) ===== */}
      <section id="predict" ref={predictRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/predict_atmospheric_scene.jpg" alt="Predict" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 h-full">
          <div className="absolute right-[7vw] top-[18vh] w-[34vw] text-right">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">PREDICT</h2>
              <p className="text-text-secondary text-sm mt-2">Validate, then deploy with confidence.</p>
            </div>
          </div>
          <div className="absolute right-[7vw] top-[74vh] w-[30vw] text-right hidden md:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">Compare model versions on real-world holds. Monitor drift, precision, and recall across regions.</p>
            </div>
          </div>
          <div className="absolute left-[6vw] top-[22vh] w-[88vw] md:w-[34vw]">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Model performance</h3>
              <div className="flex items-end gap-3 h-16 mb-4">
                {[65, 82, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-satellite-blue/10 rounded-md overflow-hidden" style={{ height: '60px' }}><div className="bg-satellite-blue rounded-md" style={{ height: `${h}%` }} /></div>
                    <span className="text-[10px] text-gray-500">v2.{i === 0 ? 1 : i === 1 ? 3 : 4}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[{ label: 'Precision', value: '0.92' }, { label: 'Recall', value: '0.89' }, { label: 'F1', value: '0.90' }].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1 border-b border-black/5"><span className="text-sm text-gray-600">{item.label}</span><span className="text-sm font-mono font-medium text-deep-space">{item.value}</span></div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Evaluated on 12k test chips</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 6: Platform (FLOWING) ===== */}
      <section id="platform" ref={platformRef} className="relative py-24 lg:py-32 bg-deep-space">
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

      {/* ===== Section 7: Case Study (PINNED) ===== */}
      <section id="case" ref={caseStudyRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/case_coastline_scene.jpg" alt="Case study" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/50" />
        </div>
        <div className="relative z-10 h-full">
          <div className="absolute left-[7vw] top-[18vh] w-[34vw]">
            <div className="pinned-headline">
              <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">CASE STUDY</h2>
              <p className="text-text-secondary text-sm mt-2">Coastline detections.</p>
            </div>
          </div>
          <div className="absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
            <div className="pinned-paragraph">
              <p className="text-text-secondary text-sm leading-relaxed">High-contrast land and water improve segmentation. We use shoreline geometry to validate spatial alignment.</p>
            </div>
          </div>
          <div className="absolute right-[6vw] top-[22vh] w-[88vw] md:w-[34vw]">
            <div className="pinned-panel bg-white rounded-[10px] shadow-panel p-6">
              <h3 className="text-deep-space font-display font-medium text-lg mb-4">Detection summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-satellite-blue/20 flex items-center justify-center"><div className="w-3 h-3 bg-satellite-blue rounded-sm" /></div><span className="text-sm text-gray-700">Primary</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center"><div className="w-3 h-3 bg-gray-500 rounded-sm" /></div><span className="text-sm text-gray-700">Shadow</span></div>
              </div>
              <p className="text-xs text-gray-400 mt-4">18 detections &bull; 6 shadows &bull; 0 false positives</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 8: Card Grid (FLOWING) ===== */}
      <section id="cards" ref={cardsRef} className="relative py-24 lg:py-32 bg-deep-space">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">Explore the Platform</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">Navigate through our specialized tools and datasets designed for contrail research.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <button key={i} onClick={() => onNavigate(card.page)} className="feature-card group text-left relative overflow-hidden rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/40 transition-all duration-500 hover:bg-white/8 hover:-translate-y-1">
                <div className="h-40 overflow-hidden"><img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/50 to-transparent" /></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3"><card.icon className="w-4 h-4 text-satellite-blue" /><h3 className="font-display font-medium text-white">{card.title}</h3></div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-satellite-blue text-xs font-medium group-hover:gap-2 transition-all">Explore <ArrowRight className="w-3 h-3" /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 9: Partners (FLOWING) — icon+text pairs, vertical ===== */}
      <section id="partners" className="relative py-16 lg:py-20 bg-night-slate border-t border-white/10">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <p className="text-center text-text-secondary text-xs uppercase tracking-[0.15em] font-medium mb-8">Joint Initiative & Financial Support</p>
          <div className="flex flex-col items-center gap-3 mb-10">
            {allPartners.map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 transition-all duration-300" title={p.name}>
                <PartnerLogo partner={p} size={32} />
                <span className="text-xs lg:text-sm text-white/60 group-hover:text-white transition-all duration-300">{p.name}</span>
              </a>
            ))}
          </div>
          <p className="text-center text-text-secondary/60 text-xs max-w-lg mx-auto">Funded by UKRI / NERC and supported by a global consortium of atmospheric science and aviation research institutions.</p>
        </div>
      </section>
    </div>
  );
}
