import { useState, useEffect } from 'react';
import { Plane, ArrowLeft, Radar, Orbit, Clock, MapPin, Eye, Loader2, AlertTriangle, Satellite, Globe, Calendar } from 'lucide-react';
import type { PageRoute } from '../App';

interface MonitorDemoProps {
  onNavigate: (page: PageRoute) => void;
}

// ===== Himawari/GOES Geostationary Satellite Data =====
const himawariSamples = [
  {
    id: 'h1',
    title: 'Tile 267 — Pacific Corridor',
    image: '/images/demo/pixel_1087_20150720191000_tile_267.gif',
    mask: '/images/demo/mask_pixel_1087_20150720191000_tile_267.jpg',
    timestamp: '2015-07-20 19:10 UTC',
    region: 'North Pacific',
  },
  {
    id: 'h2',
    title: 'Tile 158 — Atlantic Route',
    image: '/images/demo/pixel_121_20151219034000_tile_158.gif',
    mask: '/images/demo/mask_pixel_121_20151219034000_tile_158.jpg',
    timestamp: '2015-12-19 03:40 UTC',
    region: 'North Atlantic',
  },
  {
    id: 'h3',
    title: 'Tile 190 — Continental Corridor',
    image: '/images/demo/pixel_1030_20151116170000_tile_190.gif',
    mask: '/images/demo/mask_pixel_1030_20151116170000_tile_190.jpg',
    timestamp: '2015-11-16 17:00 UTC',
    region: 'North America',
  },
];

// ===== MODIS Polar-Orbiting Satellite Data =====
const modisSamples = [
  {
    id: 'm1',
    title: 'RGB 6-3-2 — Coastal Detection',
    image: '/images/demo/MOD021KM.A2015080.1310.061.2017319232315_RGB_6_3.jpg',
    mask: '/images/demo/mask_MOD021KM.A2015080.1310.061.2017319232315_RGB_6_3.jpg',
    timestamp: '2015-03-21 13:10 UTC',
    region: 'Mediterranean',
  },
  {
    id: 'm2',
    title: 'RGB 4-2-1 — Overland Track',
    image: '/images/demo/MOD021KM.A2015079.2200.061.2017319225310_RGB_4_2.jpg',
    mask: '/images/demo/mask_MOD021KM.A2015079.2200.061.2017319225310_RGB_4_2.jpg',
    timestamp: '2015-03-20 22:00 UTC',
    region: 'European Corridor',
  },
  {
    id: 'm3',
    title: 'RGB 5-3-1 — Oceanic Pattern',
    image: '/images/demo/MOD021KM.A2015079.2200.061.2017319225310_RGB_5_3.jpg',
    mask: '/images/demo/mask_MOD021KM.A2015079.2200.061.2017319225310_RGB_5_3.jpg',
    timestamp: '2015-03-20 22:00 UTC',
    region: 'North Atlantic',
  },
];

function DetectionCard({
  sample,
  satelliteType,
}: {
  sample: (typeof himawariSamples)[0];
  satelliteType: 'geo' | 'polar';
}) {
  const [detecting, setDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMask, setShowMask] = useState(false);

  const handleDetect = () => {
    if (detecting || showMask) return;
    setDetecting(true);
    setProgress(0);
    setShowMask(false);
  };

  useEffect(() => {
    if (!detecting) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDetecting(false);
          setShowMask(true);
          return 100;
        }
        return p + 3.5; // ~3 seconds to reach 100
      });
    }, 100);
    return () => clearInterval(interval);
  }, [detecting]);

  return (
    <div className="rounded-[10px] bg-white/5 border border-white/10 overflow-hidden">
      {/* Input image */}
      <div className="relative">
        <img
          src={sample.image}
          alt={sample.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
            {satelliteType === 'geo' ? 'GEO Input' : 'Polar Input'}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          <Clock className="w-3 h-3 text-white/60" />
          <span className="text-[10px] text-white/60">{sample.timestamp}</span>
        </div>
      </div>

      {/* Detection action */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm text-white font-display font-medium">{sample.title}</h4>
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <MapPin className="w-3 h-3" /> {sample.region}
          </span>
        </div>

        {!showMask && !detecting && (
          <button
            onClick={handleDetect}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-satellite-blue hover:bg-satellite-blue/80 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Radar className="w-4 h-4" /> Run Detection
          </button>
        )}

        {detecting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Processing...
              </span>
              <span className="text-white font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-satellite-blue to-cyan-400 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-text-secondary">
              <span>Loading model...</span>
              <span>{progress > 30 ? 'Segmenting...' : progress > 70 ? 'Refining masks...' : ''}</span>
            </div>
          </div>
        )}

        {showMask && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-white/10">
              <img src={sample.mask} alt={`Mask ${sample.title}`} className="w-full h-48 object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-satellite-blue/80 text-[10px] text-white font-medium">
                Detection Result
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/80 text-[10px] text-white font-medium">
                Confidence: 0.94
              </div>
            </div>
            <button
              onClick={() => { setShowMask(false); setProgress(0); }}
              className="w-full py-2 text-xs text-text-secondary hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
            >
              Reset & Detect Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MonitorDemo({ onNavigate }: MonitorDemoProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-deep-space pt-20">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-deep-space/95 backdrop-blur-md shadow-lg shadow-black/20">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          <button
            onClick={() => onNavigate('monitor')}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Monitor</span>
          </button>
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-satellite-blue" />
            <span className="font-display font-medium text-sm text-white">ContrailVision</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-coral-accent/10 border border-coral-accent/20">
            <div className="w-1.5 h-1.5 rounded-full bg-coral-accent animate-pulse" />
            <span className="text-[10px] text-coral-accent font-medium uppercase tracking-wider">Demo Mode</span>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Radar className="w-5 h-5 text-satellite-blue" />
            <span className="text-xs uppercase tracking-[0.15em] text-satellite-blue font-medium">
              Online Contrail Detection
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
            Contrail Detection <span className="text-satellite-blue">Live Demo</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
            Real-time contrail detection demonstration using geostationary and polar-orbiting satellite imagery.
            Upload or select satellite scenes to generate pixel-level contrail segmentation masks.
          </p>
        </div>
      </section>

      {/* ===== Section 1: Geostationary Satellite (Himawari/GOES) ===== */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Satellite className="w-5 h-5 text-satellite-blue" />
                <span className="text-xs uppercase tracking-[0.1em] text-satellite-blue font-medium">
                  Geostationary Satellite
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight text-white mb-3">
                Himawari-8 / GOES-16 Detection
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Geostationary satellites provide continuous monitoring of flight corridors with
                10–15 minute temporal resolution. Ideal for tracking contrail formation, persistence,
                and dissipation over time.
              </p>
            </div>

            {/* Satellite Parameters */}
            <div className="lg:w-72 p-4 rounded-[10px] bg-night-slate border border-white/10">
              <h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium mb-3">
                Satellite Parameters
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Orbit className="w-3 h-3" /> Orbit Type
                  </span>
                  <span className="text-white font-mono">Geostationary</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> Spatial Resolution
                  </span>
                  <span className="text-white font-mono">0.5–2 km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Temporal Resolution
                  </span>
                  <span className="text-white font-mono">10–15 min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Coverage
                  </span>
                  <span className="text-white font-mono">Full Disk</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Channels
                  </span>
                  <span className="text-white font-mono">16 bands</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {himawariSamples.map(sample => (
              <DetectionCard key={sample.id} sample={sample} satelliteType="geo" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 2: Polar-Orbiting Satellite (MODIS) ===== */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Satellite className="w-5 h-5 text-cyan-400" />
                <span className="text-xs uppercase tracking-[0.1em] text-cyan-400 font-medium">
                  Polar-Orbiting Satellite
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight text-white mb-3">
                MODIS Detection
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                MODIS on Terra and Aqua provides global coverage with high spatial resolution.
                Polar orbits enable consistent daytime revisits for systematic contrail mapping
                across all latitudes.
              </p>
            </div>

            {/* Satellite Parameters */}
            <div className="lg:w-72 p-4 rounded-[10px] bg-night-slate border border-white/10">
              <h3 className="text-xs uppercase tracking-wider text-text-secondary font-medium mb-3">
                Satellite Parameters
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Orbit className="w-3 h-3" /> Orbit Type
                  </span>
                  <span className="text-white font-mono">Sun-synchronous</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> Spatial Resolution
                  </span>
                  <span className="text-white font-mono">250 m – 1 km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Revisit Frequency
                  </span>
                  <span className="text-white font-mono">1–2 days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Coverage
                  </span>
                  <span className="text-white font-mono">Global</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Swath Width
                  </span>
                  <span className="text-white font-mono">2,330 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modisSamples.map(sample => (
              <DetectionCard key={sample.id} sample={sample} satelliteType="polar" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 3: Long-Term Cumulative Visualization ===== */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.1em] text-emerald-400 font-medium">
                Temporal Analysis
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight text-white mb-3">
              300-Day Cumulative Contrail Coverage
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
              Long-term accumulation of detected contrails over a 300-day period, revealing
              persistent high-density aviation corridors and seasonal variation patterns.
            </p>
          </div>

          <div className="rounded-[10px] bg-white/5 border border-white/10 overflow-hidden">
            <div className="relative">
              <img
                src="/images/demo/global_contrails_300days_cumulative.gif"
                alt="300-day cumulative contrail coverage"
                className="w-full h-auto max-h-[500px] object-contain bg-night-slate"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
                  Global Cumulative
                </span>
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
                  300 Days
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-satellite-blue/60" />
                  <span className="text-[10px] text-text-secondary">Low Density</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-satellite-blue" />
                  <span className="text-[10px] text-text-secondary">Medium Density</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="text-[10px] text-text-secondary">High Density</span>
                </div>
              </div>
              <span className="text-[10px] text-text-secondary">
                Data source: ContrailVision Detection Network
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Disclaimer ===== */}
      <section className="py-10 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-3 p-5 rounded-[10px] bg-amber-500/5 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-400 mb-1.5">Offline Detection Demo</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                This page demonstrates the contrail detection pipeline using pre-computed results on
                sample satellite imagery. The detection process shown here is for demonstration purposes
                only — actual online real-time detection is currently under active development and will
                be available in a future release. For research collaboration or early access inquiries,
                please contact the ContrailVision team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-satellite-blue" />
            <span className="font-display text-sm text-white">ContrailVision</span>
          </div>
          <p className="text-text-secondary text-xs">
            Contrail Detection Demo — Offline processing showcase
          </p>
          <button
            onClick={() => onNavigate('monitor')}
            className="text-xs text-satellite-blue hover:text-white transition-colors"
          >
            Return to Monitor Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
}
