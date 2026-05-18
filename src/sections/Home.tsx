import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Database, Globe, Code2, Radio, BookOpen,
  ArrowRight, Activity, Map, Layers
} from 'lucide-react';
import type { PageRoute } from '../App';

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

export default function Home({ onNavigate }: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const detectRef = useRef<HTMLDivElement>(null);
  const geolocateRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const predictRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const caseStudyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo('.hero-bg', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo('.hero-headline span', { opacity: 0, y: 22, rotateX: 18 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out' }, '-=0.7')
        .fromTo('.hero-sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.hero-pill', { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

      // Hero scroll exit
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3;
            gsap.set(heroTextRef.current, {
              opacity: 1 - exitProgress * 0.75,
              y: -exitProgress * 100,
              scale: 1 - exitProgress * 0.02,
            });
          } else {
            gsap.set(heroTextRef.current, { opacity: 1, y: 0, scale: 1 });
          }
        },
      });

      // Pinned sections setup
      const pinnedSections = [
        { ref: detectRef, headlineFrom: { x: '-50vw', opacity: 0 }, panelFrom: { x: '55vw', opacity: 0 } },
        { ref: geolocateRef, headlineFrom: { x: '50vw', opacity: 0 }, panelFrom: { x: '-55vw', opacity: 0 } },
        { ref: labelRef, headlineFrom: { x: '-50vw', opacity: 0 }, panelFrom: { x: '55vw', opacity: 0 } },
        { ref: predictRef, headlineFrom: { x: '50vw', opacity: 0 }, panelFrom: { x: '-55vw', opacity: 0 } },
        { ref: caseStudyRef, headlineFrom: { x: '-50vw', opacity: 0 }, panelFrom: { x: '55vw', opacity: 0 } },
      ];

      pinnedSections.forEach((section, idx) => {
        if (!section.ref.current) return;
        const headline = section.ref.current.querySelector('.pinned-headline');
        const paragraph = section.ref.current.querySelector('.pinned-paragraph');
        const panel = section.ref.current.querySelector('.pinned-panel');
        const bg = section.ref.current.querySelector('.pinned-bg');

        ScrollTrigger.create({
          trigger: section.ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;

            // Entrance (0-30%)
            if (p <= 0.3) {
              const ep = p / 0.3;
              if (headline) gsap.set(headline, { x: section.headlineFrom.x ? gsap.utils.interpolate(section.headlineFrom.x, '0', ep) : 0, opacity: ep });
              if (paragraph) gsap.set(paragraph, { y: gsap.utils.interpolate(100, 0, ep), opacity: ep });
              if (panel) gsap.set(panel, { x: section.panelFrom.x ? gsap.utils.interpolate(section.panelFrom.x, '0', ep) : 0, opacity: ep, scale: gsap.utils.interpolate(0.98, 1, ep) });
              if (bg) gsap.set(bg, { scale: gsap.utils.interpolate(1.03, 1, ep), opacity: gsap.utils.interpolate(0.85, 1, ep) });
            }
            // Settle (30-70%)
            else if (p <= 0.7) {
              if (headline) gsap.set(headline, { x: 0, opacity: 1 });
              if (paragraph) gsap.set(paragraph, { y: 0, opacity: 1 });
              if (panel) gsap.set(panel, { x: 0, opacity: 1, scale: 1 });
            }
            // Exit (70-100%)
            else {
              const xp = (p - 0.7) / 0.3;
              if (headline) gsap.set(headline, { x: idx % 2 === 0 ? -xp * 80 : xp * 80, opacity: 1 - xp * 0.75 });
              if (paragraph) gsap.set(paragraph, { opacity: 1 - xp * 0.8 });
              if (panel) gsap.set(panel, { y: xp * 100, opacity: 1 - xp * 0.75 });
            }
          },
        });
      });

      // Platform section (flowing)
      if (platformRef.current) {
        gsap.fromTo(platformRef.current.querySelector('.platform-heading'), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, scrollTrigger: { trigger: platformRef.current, start: 'top 80%', end: 'top 55%', scrub: true }
        });
        gsap.fromTo(platformRef.current.querySelectorAll('.platform-card'), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, scrollTrigger: { trigger: platformRef.current, start: 'top 70%', end: 'top 40%', scrub: true }
        });
      }

      // Card grid animations
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.querySelectorAll('.feature-card'), { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', end: 'top 40%', scrub: true }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-deep-space">
      {/* Section 1: Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden z-10">
        <div className="hero-bg absolute inset-0">
          <img
            src="/images/hero_orbit_earth.jpg"
            alt="Earth from space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/40 via-transparent to-deep-space/80" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 0%, rgba(11,15,23,0.55) 75%, rgba(11,15,23,0.75) 100%)' }} />
        </div>
        <div ref={heroTextRef} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="hero-headline font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white max-w-[78vw] leading-[1.1]">
            {'THE PLANET\'S CONTRAIL FOOTPRINT,'.split('').map((char, i) => (
              <span key={i} className="inline-block">{char}</span>
            ))}
            <br />
            <span className="text-satellite-blue">
              {'IN REAL TIME.'.split('').map((char, i) => (
                <span key={i} className="inline-block">{char}</span>
              ))}
            </span>
          </h1>
          <p className="hero-sub mt-6 text-text-secondary text-sm md:text-base max-w-lg">
            Detection, attribution, and climate-impact modeling for aviation.
          </p>
          <div className="hero-pill mt-8 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-xs text-text-secondary">Live: 14 regions • Updated hourly</span>
          </div>
        </div>
      </section>

      {/* Section 2: Detect */}
      <section ref={detectRef} className="relative h-screen w-full overflow-hidden z-20">
        <div className="pinned-bg absolute inset-0">
          <img src="/images/detect_contrail_scene.jpg" alt="Contrail detection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/30" />
        </div>
        <div className="pinned-headline absolute left-[7vw] top-[18vh] w-[34vw]">
          <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">DETECT</h2>
          <p className="text-text-secondary text-sm mt-2">From single scenes to global stacks.</p>
        </div>
        <div className="pinned-paragraph absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
          <p className="text-text-secondary text-sm leading-relaxed">
            Identify contrails across satellite captures with a model tuned for thin, fractured lines in varying light.
          </p>
        </div>
        <div className="pinned-panel absolute right-[6vw] top-[62vh] w-[88vw] md:w-[34vw] min-h-[26vh] bg-white rounded-[10px] shadow-panel p-6">
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
      </section>

      {/* Section 3: Geolocate */}
      <section ref={geolocateRef} className="relative h-screen w-full overflow-hidden z-30">
        <div className="pinned-bg absolute inset-0">
          <img src="/images/geolocate_night_map.jpg" alt="Global coverage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/40" />
        </div>
        <div className="pinned-headline absolute right-[7vw] top-[18vh] w-[34vw] text-right">
          <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">GEOLOCATE</h2>
          <p className="text-text-secondary text-sm mt-2">A detection network that follows the fleet.</p>
        </div>
        <div className="pinned-paragraph absolute right-[7vw] top-[74vh] w-[30vw] text-right hidden md:block">
          <p className="text-text-secondary text-sm leading-relaxed">
            Map contrails by corridor, region, and time. Link detections to flight routes and atmospheric conditions.
          </p>
        </div>
        <div className="pinned-panel absolute left-[6vw] top-[62vh] w-[88vw] md:w-[34vw] min-h-[26vh] bg-night-slate/80 backdrop-blur-md border border-white/10 rounded-[10px] p-6">
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
      </section>

      {/* Section 4: Label */}
      <section ref={labelRef} className="relative h-screen w-full overflow-hidden z-40">
        <div className="pinned-bg absolute inset-0">
          <img src="/images/label_land_water_contrail.jpg" alt="Labeling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/30" />
        </div>
        <div className="pinned-headline absolute left-[7vw] top-[18vh] w-[34vw]">
          <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">LABEL</h2>
          <p className="text-text-secondary text-sm mt-2">Pixel-perfect masks, human-reviewed.</p>
        </div>
        <div className="pinned-paragraph absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
          <p className="text-text-secondary text-sm leading-relaxed">
            Train and validate with precisely annotated masks. Control class balance, geometry, and edge quality.
          </p>
        </div>
        <div className="pinned-panel absolute right-[6vw] top-[62vh] w-[88vw] md:w-[34vw] min-h-[26vh] bg-white rounded-[10px] shadow-panel p-6">
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
      </section>

      {/* Section 5: Predict */}
      <section ref={predictRef} className="relative h-screen w-full overflow-hidden z-50">
        <div className="pinned-bg absolute inset-0">
          <img src="/images/predict_atmospheric_scene.jpg" alt="Predict" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/30" />
        </div>
        <div className="pinned-headline absolute right-[7vw] top-[18vh] w-[34vw] text-right">
          <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">PREDICT</h2>
          <p className="text-text-secondary text-sm mt-2">Validate, then deploy with confidence.</p>
        </div>
        <div className="pinned-paragraph absolute right-[7vw] top-[74vh] w-[30vw] text-right hidden md:block">
          <p className="text-text-secondary text-sm leading-relaxed">
            Compare model versions on real-world holds. Monitor drift, precision, and recall across regions.
          </p>
        </div>
        <div className="pinned-panel absolute left-[6vw] top-[62vh] w-[88vw] md:w-[34vw] min-h-[26vh] bg-white rounded-[10px] shadow-panel p-6">
          <h3 className="text-deep-space font-display font-medium text-lg mb-4">Model performance</h3>
          <div className="flex items-end gap-3 h-16 mb-4">
            {[65, 82, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-satellite-blue/10 rounded-md overflow-hidden" style={{ height: '60px' }}>
                  <div className="bg-satellite-blue rounded-md transition-all" style={{ height: `${h}%` }} />
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
      </section>

      {/* Section 6: Platform Capabilities */}
      <section ref={platformRef} className="relative py-24 lg:py-32 z-60 bg-deep-space">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <div className="platform-heading text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">Platform</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
              Access detection feeds, training datasets, and APIs built for analysts, modelers, and operators.
            </p>
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
            <pre className="font-mono text-xs text-white/80 overflow-x-auto">
{`from contraillab import Client
client = Client(key="YOUR_API_KEY")
detections = client.detections.latest(region="north_atlantic")`}
            </pre>
          </div>
        </div>
      </section>

      {/* Section 7: Case Study */}
      <section ref={caseStudyRef} className="relative h-screen w-full overflow-hidden z-[70]">
        <div className="pinned-bg absolute inset-0">
          <img src="/images/case_coastline_scene.jpg" alt="Case study" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/30" />
        </div>
        <div className="pinned-headline absolute left-[7vw] top-[18vh] w-[34vw]">
          <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white">CASE STUDY</h2>
          <p className="text-text-secondary text-sm mt-2">Coastline detections.</p>
        </div>
        <div className="pinned-paragraph absolute left-[7vw] top-[74vh] w-[30vw] hidden md:block">
          <p className="text-text-secondary text-sm leading-relaxed">
            High-contrast land and water improve segmentation. We use shoreline geometry to validate spatial alignment.
          </p>
        </div>
        <div className="pinned-panel absolute right-[6vw] top-[62vh] w-[88vw] md:w-[34vw] min-h-[26vh] bg-white rounded-[10px] shadow-panel p-6">
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
      </section>

      {/* Feature Card Grid */}
      <section ref={cardsRef} className="relative py-24 lg:py-32 z-[80] bg-deep-space">
        <div className="px-6 lg:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">Explore the Platform</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
              Navigate through our specialized tools and datasets designed for contrail research.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <button
                key={i}
                onClick={() => onNavigate(card.page)}
                className="feature-card group text-left relative overflow-hidden rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/40 transition-all duration-500 hover:bg-white/8 hover:-translate-y-1"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
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
    </div>
  );
}
