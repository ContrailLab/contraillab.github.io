import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Spline from '@splinetool/react-spline';
import { Download, Database, Globe, Clock, MapPin, FileJson, HardDrive, ChevronRight, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DatasetItem {
  id: string;
  name: string;
  sensor: string;
  resolution: string;
  frequency: string;
  coverage: string;
  format: string;
  size: string;
  updated: string;
}

const datasets: DatasetItem[] = [
  {
    id: 'contrail-geo-v1',
    name: 'Contrail-GEO-v1.0',
    sensor: 'GOES-16 Imager',
    resolution: '2km',
    frequency: '15-min',
    coverage: 'North America',
    format: 'NetCDF / GeoTIFF',
    size: '124 GB',
    updated: '2026-05-17',
  },
  {
    id: 'contrail-modis-global',
    name: 'Contrail-MODIS-Global',
    sensor: 'MODIS Sensor',
    resolution: '1km',
    frequency: 'Daily',
    coverage: 'Global Hotspots',
    format: 'HDF / GeoJSON',
    size: '386 GB',
    updated: '2026-05-16',
  },
  {
    id: 'contrail-training-v2',
    name: 'Training-Chips-v2.4',
    sensor: 'Multi-sensor',
    resolution: '512x512 px',
    frequency: 'Batch',
    coverage: '14 Regions',
    format: 'PNG / NumPy',
    size: '42 GB',
    updated: '2026-05-15',
  },
  {
    id: 'contrail-masks-v2',
    name: 'Annotated-Masks-v2.4',
    sensor: 'Human + AI',
    resolution: 'Pixel-level',
    frequency: 'Batch',
    coverage: 'Global',
    format: 'PNG / COCO',
    size: '18 GB',
    updated: '2026-05-15',
  },
];

export default function Datasets() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.querySelectorAll('.dataset-card'), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const selectedData = datasets.find(d => d.id === selectedDataset);

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-space pt-20">
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {!splineLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-night-slate to-deep-space flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-12 h-12 text-satellite-blue animate-pulse mx-auto mb-4" />
                <p className="text-text-secondary text-sm">Loading 3D Globe...</p>
              </div>
            </div>
          )}
          <Spline
            scene="https://prod.spline.design/oRNhRZSX6z6hY99s/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
            style={{ width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/60 via-transparent to-deep-space" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
            Contrail <span className="text-satellite-blue">Database</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-lg">
            Interactive 3D globe visualization with downloadable satellite datasets for contrail research.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} className="relative py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Glassmorphism Drawer */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 backdrop-blur-md bg-night-slate/60 border border-white/10 rounded-[10px] p-6">
              <h2 className="font-display font-medium text-white text-xl mb-1">Data Products</h2>
              <p className="text-text-secondary text-xs mb-6">Select a dataset to view details and download</p>
              
              <div className="space-y-3">
                {datasets.map((dataset) => (
                  <button
                    key={dataset.id}
                    onClick={() => setSelectedDataset(dataset.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                      selectedDataset === dataset.id
                        ? 'bg-satellite-blue/10 border-satellite-blue/40'
                        : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className={`w-4 h-4 ${selectedDataset === dataset.id ? 'text-satellite-blue' : 'text-text-secondary'}`} />
                        <span className="text-sm font-medium text-white">{dataset.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedDataset === dataset.id ? 'text-satellite-blue rotate-90' : 'text-text-secondary'}`} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-7">
                      <span className="text-[10px] text-text-secondary">{dataset.sensor}</span>
                      <span className="text-[10px] text-text-secondary">{dataset.size}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dataset Detail Panel */}
              {selectedData && (
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-display font-medium text-white mb-4">{selectedData.name}</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Sensor
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.sensor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Resolution
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.resolution}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Frequency
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.frequency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Coverage
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.coverage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <FileJson className="w-3 h-3" /> Format
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.format}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3" /> Size
                      </span>
                      <span className="text-xs text-white font-mono">{selectedData.size}</span>
                    </div>
                  </div>
                  <button className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 bg-satellite-blue hover:bg-satellite-blue/90 text-white text-sm font-medium rounded-lg transition-colors">
                    <Download className="w-4 h-4" /> HTTPS Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dataset Cards Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-medium text-white text-2xl">Available Datasets</h2>
              <span className="text-text-secondary text-xs">{datasets.length} products</span>
            </div>
            
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="dataset-card p-6 rounded-[10px] bg-white/5 border border-white/10 hover:border-satellite-blue/30 transition-all duration-300 hover:bg-white/8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-satellite-blue" />
                      <h3 className="font-display font-medium text-white text-lg">{dataset.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-satellite-blue/10 text-satellite-blue text-[10px] font-medium">
                        {dataset.frequency}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">
                      {dataset.sensor} • {dataset.resolution} resolution • {dataset.coverage}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <FileJson className="w-3 h-3" /> {dataset.format}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <HardDrive className="w-3 h-3" /> {dataset.size}
                      </span>
                      <span className="text-xs text-text-secondary">Updated: {dataset.updated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-satellite-blue/40 text-white text-sm rounded-lg transition-all">
                      <ExternalLink className="w-4 h-4" /> Preview
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-satellite-blue hover:bg-satellite-blue/90 text-white text-sm rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* API Access Card */}
            <div className="dataset-card p-6 rounded-[10px] bg-gradient-to-br from-satellite-blue/10 to-transparent border border-satellite-blue/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-satellite-blue/10">
                  <Globe className="w-6 h-6 text-satellite-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-medium text-white text-lg mb-2">API Access</h3>
                  <p className="text-text-secondary text-sm mb-4">
                    Stream contrail data directly into your applications via our RESTful API. 
                    Supports GeoJSON, NetCDF, and cloud-native formats.
                  </p>
                  <div className="p-3 rounded-lg bg-night-slate/80 border border-white/10">
                    <code className="font-mono text-xs text-white/70">
                      GET https://api.contraillab.org/v1/detections?region=north_atlantic&format=geojson
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
