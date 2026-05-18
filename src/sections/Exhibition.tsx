import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, ZoomIn, Info, X, Calendar, Satellite, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExhibitImage {
  id: string;
  src: string;
  title: string;
  description: string;
  sensor: string;
  date: string;
  region: string;
  resolution: string;
  tags: string[];
}

const exhibits: ExhibitImage[] = [
  {
    id: 'ex-1',
    src: '/images/exhibit_polar.jpg',
    title: 'Polar Route Detections',
    description: 'High-latitude contrail formations captured over Arctic ice caps, demonstrating model capability in extreme cold conditions with low solar angles.',
    sensor: 'VIIRS / Suomi NPP',
    date: '2026-04-12',
    region: 'Arctic Circle (70°N)',
    resolution: '375m',
    tags: ['polar', 'ice', 'high-latitude'],
  },
  {
    id: 'ex-2',
    src: '/images/exhibit_geostationary.jpg',
    title: 'North American Corridor',
    description: 'Geostationary observation of transcontinental flight corridors showing dense contrail patterns over major air traffic routes.',
    sensor: 'GOES-16 ABI',
    date: '2026-05-08',
    region: 'North America',
    resolution: '2km',
    tags: ['geostationary', 'corridor', 'continental'],
  },
  {
    id: 'ex-3',
    src: '/images/exhibit_temporal.jpg',
    title: 'Temporal Dispersion Series',
    description: 'Time-lapse sequence showing contrail evolution from formation (t=0) through spreading (t=2h) to cirrus-like dissipation (t=4h).',
    sensor: 'MODIS Terra / Aqua',
    date: '2026-03-22',
    region: 'North Atlantic',
    resolution: '1km',
    tags: ['temporal', 'evolution', 'dispersion'],
  },
  {
    id: 'ex-4',
    src: '/images/detect_contrail_scene.jpg',
    title: 'Single Scene Analysis',
    description: 'High-resolution detection of a crisp contrail over textured cloud field, demonstrating thin linear feature extraction capability.',
    sensor: 'Sentinel-2 MSI',
    date: '2026-05-15',
    region: 'North Pacific',
    resolution: '10m',
    tags: ['single-scene', 'high-res', 'clouds'],
  },
  {
    id: 'ex-5',
    src: '/images/label_land_water_contrail.jpg',
    title: 'Coastal Boundary Detection',
    description: 'Contrail detection over coastal boundaries where land-sea contrast provides validation for spatial alignment accuracy.',
    sensor: 'Landsat-9 OLI',
    date: '2026-04-28',
    region: 'Mediterranean Coast',
    resolution: '30m',
    tags: ['coastal', 'boundary', 'validation'],
  },
  {
    id: 'ex-6',
    src: '/images/predict_atmospheric_scene.jpg',
    title: 'Multi-Contrail Intersection',
    description: 'Complex scene with multiple intersecting contrails at different flight levels, testing model discrimination capability.',
    sensor: 'GOES-16 ABI',
    date: '2026-05-10',
    region: 'North Atlantic',
    resolution: '2km',
    tags: ['multi-track', 'intersection', 'complex'],
  },
];

export default function Exhibition() {
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filters = ['all', ...Array.from(new Set(exhibits.flatMap(e => e.tags)))].slice(0, 7);
  
  const filteredExhibits = activeFilter === 'all' 
    ? exhibits 
    : exhibits.filter(e => e.tags.includes(activeFilter));

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(gridRef.current.querySelectorAll('.exhibit-card'), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
      }
    });
    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-space pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
                Spatio-Temporal <span className="text-satellite-blue">Exhibition</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-xl">
                Scientific time-series variations of contrail cloud structures mapped across polar and geostationary observations, 
                highlighting our model's capability in capturing thin, fractured linear characteristics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Eye className="w-4 h-4" />
              <span>{exhibits.length} observations</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                  activeFilter === filter
                    ? 'bg-satellite-blue text-white'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibits.map((exhibit) => (
              <button
                key={exhibit.id}
                onClick={() => setSelectedExhibit(exhibit)}
                className="exhibit-card group text-left relative overflow-hidden rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/30 transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={exhibit.src}
                    alt={exhibit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/30 to-transparent" />
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {exhibit.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[10px] text-white/80 capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-medium text-white mb-1 group-hover:text-satellite-blue transition-colors">
                    {exhibit.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 mb-3">
                    {exhibit.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Satellite className="w-3 h-3" /> {exhibit.sensor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {exhibit.date}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight text-white mb-8">
            Core Observation Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Polar Observations',
                description: 'High-latitude contrail detection in extreme cold conditions with specialized models for low solar angle imagery.',
                metric: '70°N+ coverage',
              },
              {
                title: 'Geostationary Tracking',
                description: 'Continuous monitoring of flight corridors using geostationary satellites with 15-minute refresh cycles.',
                metric: '15-min updates',
              },
              {
                title: 'Temporal Evolution',
                description: 'Time-series analysis capturing contrail formation, spreading, and dissipation over multi-hour sequences.',
                metric: '4h+ persistence',
              },
            ].map((cap, i) => (
              <div key={i} className="p-6 rounded-[10px] bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-medium text-white">{cap.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-satellite-blue/10 text-satellite-blue text-[10px] font-medium">
                    {cap.metric}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedExhibit && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedExhibit(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-night-slate rounded-[10px] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedExhibit(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="h-72 md:h-96 overflow-hidden">
              <img src={selectedExhibit.src} alt={selectedExhibit.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedExhibit.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-satellite-blue/10 text-satellite-blue text-xs capitalize">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h2 className="font-display text-2xl md:text-3xl font-medium text-white mb-3">
                {selectedExhibit.title}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {selectedExhibit.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary">Sensor</span>
                  <p className="text-sm text-white font-mono mt-1">{selectedExhibit.sensor}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary">Date</span>
                  <p className="text-sm text-white font-mono mt-1">{selectedExhibit.date}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary">Region</span>
                  <p className="text-sm text-white font-mono mt-1">{selectedExhibit.region}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary">Resolution</span>
                  <p className="text-sm text-white font-mono mt-1">{selectedExhibit.resolution}</p>
                </div>
              </div>
              
              <button className="mt-6 flex items-center gap-2 text-satellite-blue text-sm font-medium hover:gap-3 transition-all">
                <Info className="w-4 h-4" /> View Full Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
