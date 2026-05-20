import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity, Globe, Radio, Zap, TrendingUp, AlertTriangle,
  Plane, MapPin, Clock, Signal, Server, Wind,
  Thermometer, Eye, BarChart3, ArrowUpRight, Satellite
} from 'lucide-react';
import type { PageRoute } from '../App';

gsap.registerPlugin(ScrollTrigger);

interface LiveMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  alert?: boolean;
}

const liveMetrics: LiveMetric[] = [
  { label: 'Active Detections', value: '2,847', change: '+12%', icon: Eye, alert: false },
  { label: 'Processing Latency', value: '4.2s', change: '-18%', icon: Zap, alert: false },
  { label: 'Corridors Monitored', value: '186', change: '+3', icon: MapPin, alert: false },
  { label: 'Model Confidence', value: '0.941', change: '+0.8%', icon: TrendingUp, alert: false },
  { label: 'Satellites Online', value: '14/14', change: 'All OK', icon: Satellite, alert: false },
  { label: 'Alert Status', value: 'Normal', change: '0 alerts', icon: AlertTriangle, alert: false },
];

const regionData = [
  { name: 'North Atlantic', detections: 1247, trend: '+8%', color: 'bg-satellite-blue' },
  { name: 'North Pacific', detections: 892, trend: '+15%', color: 'bg-cyan-500' },
  { name: 'European Corridors', detections: 456, trend: '+5%', color: 'bg-emerald-500' },
  { name: 'Asian Routes', detections: 203, trend: '+22%', color: 'bg-amber-500' },
  { name: 'Polar Routes', detections: 49, trend: '-3%', color: 'bg-rose-500' },
];

const recentDetections = [
  { id: 'DET-28471', flight: 'BA117', region: 'North Atlantic', confidence: 0.97, time: '08:42 UTC', length: '18.4 km' },
  { id: 'DET-28470', flight: 'UA954', region: 'North Pacific', confidence: 0.94, time: '08:38 UTC', length: '24.1 km' },
  { id: 'DET-28469', flight: 'LH401', region: 'North Atlantic', confidence: 0.91, time: '08:35 UTC', length: '12.8 km' },
  { id: 'DET-28468', flight: 'AF006', region: 'European', confidence: 0.89, time: '08:31 UTC', length: '31.2 km' },
  { id: 'DET-28467', flight: 'CX845', region: 'North Pacific', confidence: 0.96, time: '08:28 UTC', length: '15.6 km' },
];

interface MonitorProps {
  onNavigate: (page: PageRoute) => void;
}

export default function Monitor({ onNavigate }: MonitorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pageRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const ctx = gsap.context(() => {
      if (dashboardRef.current) {
        gsap.fromTo(dashboardRef.current.querySelectorAll('.metric-card'), { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.fromTo(dashboardRef.current.querySelectorAll('.panel-card'), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top 70%', toggleActions: 'play none none none' }
        });
      }
    });
    
    return () => { clearInterval(timer); ctx.revert(); };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-space pt-20">
      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/monitor_dashboard.jpg" alt="WebGIS Dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-space/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/50 via-transparent to-deep-space" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-coral-accent animate-pulse" />
            <span className="text-xs uppercase tracking-[0.15em] text-coral-accent font-medium">Live System</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
            Live <span className="text-satellite-blue">Monitor</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-lg mb-8">
            Real-time contrail detection and climate impact monitoring across global aviation corridors.
          </p>
          <button
            onClick={() => onNavigate('monitor-demo')}
            className="animate-pulse-glow flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-satellite-blue to-cyan-500 hover:from-satellite-blue/90 hover:to-cyan-500/90 text-white font-display font-medium text-lg rounded-[10px] transition-all duration-300 hover:scale-105"
          >
            <RocketIcon className="w-5 h-5" />
            Launch Web GIS Live Platform
          </button>
        </div>
      </section>

      {/* Dashboard */}
      <section ref={dashboardRef} className="relative py-12 lg:py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-coral-accent/10 border border-coral-accent/20">
              <div className="w-2 h-2 rounded-full bg-coral-accent animate-pulse" />
              <span className="text-xs text-coral-accent font-medium">LIVE</span>
            </div>
            <span className="text-xs text-text-secondary font-mono">
              {currentTime.toISOString().replace('T', ' ').split('.')[0]} UTC
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Signal className="w-3.5 h-3.5" />
            <span>All systems operational</span>
            <Server className="w-3.5 h-3.5 ml-3" />
            <span>14 nodes active</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {liveMetrics.map((metric, i) => (
            <div
              key={i}
              className="metric-card p-4 rounded-[10px] bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <metric.icon className="w-4 h-4 text-satellite-blue" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider">{metric.label}</span>
              </div>
              <p className="font-display text-xl md:text-2xl font-light text-white mb-1">{metric.value}</p>
              <span className={`text-[10px] ${metric.change.startsWith('+') ? 'text-emerald-400' : metric.change.startsWith('-') ? 'text-rose-400' : 'text-text-secondary'}`}>
                {metric.change}
              </span>
            </div>
          ))}
        </div>

        {/* Main Panels */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* World Map Panel */}
          <div className="panel-card lg:col-span-2 rounded-[10px] bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-satellite-blue" />
                <span className="text-sm text-white font-medium">Global Detection Map</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-md bg-satellite-blue/10 text-satellite-blue text-xs">Contrails</button>
                <button className="px-3 py-1 rounded-md bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors">Emissions</button>
                <button className="px-3 py-1 rounded-md bg-white/5 text-text-secondary text-xs hover:bg-white/10 transition-colors">Weather</button>
              </div>
            </div>
            <div className="relative h-80 md:h-96">
              <img src="/images/geolocate_night_map.jpg" alt="Global map" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-satellite-blue/30 mx-auto mb-4" />
                  <p className="text-text-secondary text-sm">Interactive WebGIS visualization</p>
                  <p className="text-text-secondary text-xs mt-1">Click "Launch Web GIS" to activate full interface</p>
                </div>
              </div>
              {/* Floating stats on map */}
              <div className="absolute top-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <Plane className="w-3 h-3 text-satellite-blue" />
                  <span className="text-xs text-white">Live tracks: <span className="font-mono text-satellite-blue">4,821</span></span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-white">Wind: <span className="font-mono">240° / 45kt</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Region Breakdown */}
          <div className="panel-card rounded-[10px] bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-satellite-blue" />
              <span className="text-sm text-white font-medium">Regional Breakdown</span>
            </div>
            <div className="space-y-3">
              {regionData.map((region, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{region.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-mono">{region.detections.toLocaleString()}</span>
                      <span className={`text-[10px] ${region.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {region.trend}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${region.color} transition-all duration-1000`}
                      style={{ width: `${(region.detections / 1247) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-4 h-4 text-coral-accent" />
                <span className="text-sm text-white font-medium">Climate Impact (Est.)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-[10px] text-text-secondary">RF Index Today</p>
                  <p className="font-display text-lg text-white">0.034</p>
                  <p className="text-[10px] text-emerald-400">W/m²</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-[10px] text-text-secondary">CO₂ Equiv.</p>
                  <p className="font-display text-lg text-white">2.1 Mt</p>
                  <p className="text-[10px] text-rose-400">+3.2% vs avg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Detections Table */}
        <div className="panel-card mt-6 rounded-[10px] bg-white/5 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-satellite-blue" />
              <span className="text-sm text-white font-medium">Recent Detections</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-satellite-blue hover:text-satellite-blue/80 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">Flight</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">Region</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">Confidence</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">Length</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-text-secondary font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((det, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-xs text-white font-mono">{det.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3 h-3 text-satellite-blue" />
                        <span className="text-xs text-white">{det.flight}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{det.region}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-satellite-blue rounded-full" style={{ width: `${det.confidence * 100}%` }} />
                        </div>
                        <span className="text-xs text-white font-mono">{det.confidence}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white font-mono">{det.length}</td>
                    <td className="px-4 py-3 text-xs text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {det.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
