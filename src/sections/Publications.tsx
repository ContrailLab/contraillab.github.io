import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Code, Link2, ChevronDown, BookOpen, Award, Quote, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume: string;
  pages: string;
  doi: string;
  abstract: string;
  pdfUrl: string;
  codeUrl: string;
  citations: number;
  tags: string[];
  featured?: boolean;
}

const publications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Deep Learning-Based Global Contrail Detection from Geostationary Satellite Imagery at Kilometer Scale',
    authors: ['Z. Li', 'A. B. Smith', 'J. Chen', 'R. Williams', 'M. K. Patel'],
    journal: 'Science Bulletin',
    year: 2026,
    volume: '71(8)',
    pages: '1124-1136',
    doi: '10.1016/j.scib.2026.03.015',
    abstract: 'We present a deep learning framework for automated contrail detection from GOES-16 Advanced Baseline Imager (ABI) observations at 2km resolution. Our U-Net++ architecture with squeeze-and-excitation modules achieves 0.941 IoU on a held-out test set of 12,000 satellite chips, enabling the first operational global contrail monitoring system with 15-minute temporal resolution.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/contrail-detection',
    citations: 47,
    tags: ['deep-learning', 'segmentation', 'geostationary'],
    featured: true,
  },
  {
    id: 'pub-2',
    title: 'Spatio-Temporal Transformer Networks for Persistent Contrail Tracking and Climate Impact Assessment',
    authors: ['J. Chen', 'R. Williams', 'Z. Li', 'S. Thompson', 'L. Wang'],
    journal: 'Journal of Atmospheric Sciences',
    year: 2026,
    volume: '83(4)',
    pages: '589-607',
    doi: '10.1175/JAS-D-25-0184.1',
    abstract: 'This study introduces a Vision Transformer-based architecture for spatio-temporal contrail tracking across sequential satellite observations. The model captures contrail evolution from formation through dissipation, enabling estimation of radiative forcing with improved accuracy over static detection methods.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/st-transformer',
    citations: 23,
    tags: ['transformer', 'temporal', 'climate'],
    featured: true,
  },
  {
    id: 'pub-3',
    title: 'Atrous Spatial Pyramid Pooling for Multi-Scale Contrail Segmentation in MODIS Imagery',
    authors: ['M. K. Patel', 'A. B. Smith', 'J. Rodriguez', 'Z. Li'],
    journal: 'Remote Sensing of Environment',
    year: 2025,
    volume: '312',
    pages: '114-128',
    doi: '10.1016/j.rse.2025.114287',
    abstract: 'We adapt the DeepLabV3+ architecture with custom atrous rates optimized for the aspect ratio of contrail features. The proposed ASPP-Contrail model achieves state-of-the-art results on MODIS-based contrail detection, with particular improvement for fragmented and aged contrail segments.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/aspp-contrail',
    citations: 31,
    tags: ['aspp', 'modis', 'multi-scale'],
  },
  {
    id: 'pub-4',
    title: 'ContrailVision: An Open Platform for Global Aviation Contrail Detection and Climate Modeling',
    authors: ['R. Williams', 'Z. Li', 'A. B. Smith', 'K. Okafor', 'P. Dubois'],
    journal: 'Environmental Data Science',
    year: 2026,
    volume: '5',
    pages: 'e28',
    doi: '10.1017/eds.2026.28',
    abstract: 'ContrailVision provides the first open-source platform integrating contrail detection datasets, pre-trained models, and real-time monitoring capabilities. The platform processes imagery from 14 geostationary and polar-orbiting satellites, serving both research and operational aviation communities.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/platform',
    citations: 18,
    tags: ['platform', 'open-source', 'dataset'],
  },
  {
    id: 'pub-5',
    title: 'Radiative Forcing Estimates from Satellite-Observed Contrail Coverage: A Machine Learning Approach',
    authors: ['S. Thompson', 'L. Wang', 'R. Williams', 'Z. Li'],
    journal: 'Journal of Geophysical Research: Atmospheres',
    year: 2025,
    volume: '130(15)',
    pages: 'e2024JD042891',
    doi: '10.1029/2024JD042891',
    abstract: 'Using machine learning-derived contrail masks from 3 years of GOES-16 observations, we estimate the global net radiative forcing from aviation contrails. Our results suggest a mean diurnal forcing of 0.034 W/m² over active flight corridors, with significant seasonal and regional variation.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/rf-estimation',
    citations: 42,
    tags: ['radiative-forcing', 'climate', 'goes-16'],
  },
  {
    id: 'pub-6',
    title: 'Pixel-Perfect Annotation and Quality Control for Contrail Training Datasets',
    authors: ['K. Okafor', 'M. K. Patel', 'A. B. Smith', 'J. Chen'],
    journal: 'IEEE Transactions on Geoscience and Remote Sensing',
    year: 2025,
    volume: '63',
    pages: '1-14',
    doi: '10.1109/TGRS.2025.3521891',
    abstract: 'We describe a rigorous annotation pipeline combining expert human labeling with AI-assisted quality control. The resulting Contrail-GEO-v1.0 dataset contains 45,000 precisely annotated contrail masks with sub-pixel boundary accuracy and comprehensive metadata for each detection.',
    pdfUrl: '#',
    codeUrl: 'https://github.com/contraillab/annotation-pipeline',
    citations: 15,
    tags: ['annotation', 'dataset', 'quality-control'],
  },
];

export default function Publications() {
  const [expandedPub, setExpandedPub] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const pageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allTags = ['all', ...Array.from(new Set(publications.flatMap(p => p.tags)))];
  const filtered = activeFilter === 'all' ? publications : publications.filter(p => p.tags.includes(activeFilter));
  const featured = publications.filter(p => p.featured);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (listRef.current) {
        gsap.fromTo(listRef.current.querySelectorAll('.pub-card'), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 80%', toggleActions: 'play none none none' }
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
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-satellite-blue" />
              <span className="text-xs uppercase tracking-[0.1em] text-satellite-blue font-medium">Peer-Reviewed</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
              Research & <span className="text-satellite-blue">Publications</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl">
              Academic breakthroughs in contrail detection, climate impact modeling, and satellite-based 
              observation systems published in high-impact journals.
            </p>
          </div>

          {/* Featured Papers */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {featured.map((pub) => (
              <div
                key={pub.id}
                className="group relative p-6 rounded-[10px] bg-gradient-to-br from-satellite-blue/10 to-transparent border border-satellite-blue/20 hover:border-satellite-blue/40 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-satellite-blue" />
                  <span className="text-[10px] uppercase tracking-wider text-satellite-blue font-medium">Featured</span>
                </div>
                <h3 className="font-display font-medium text-white text-lg mb-2 group-hover:text-satellite-blue transition-colors">
                  {pub.title}
                </h3>
                <p className="text-text-secondary text-xs mb-3">
                  {pub.authors.join(', ')} • <span className="text-white/60">{pub.journal}</span> • {pub.year}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {pub.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-text-secondary capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs transition-colors">
                    <FileText className="w-3 h-3" /> PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs transition-colors">
                    <Code className="w-3 h-3" /> Code
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs transition-colors">
                    <Link2 className="w-3 h-3" /> DOI
                  </button>
                  <span className="ml-auto text-[10px] text-text-secondary">{pub.citations} citations</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                  activeFilter === tag
                    ? 'bg-satellite-blue text-white'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
            <span className="ml-auto text-xs text-text-secondary">{filtered.length} publications</span>
          </div>

          {/* Publication List */}
          <div ref={listRef} className="space-y-4">
            {filtered.map((pub) => (
              <div
                key={pub.id}
                className="pub-card rounded-[10px] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPub(expandedPub === pub.id ? null : pub.id)}
                  className="w-full text-left p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-medium text-white mb-2 hover:text-satellite-blue transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-text-secondary text-xs mb-2">
                        {pub.authors.map((a, i) => (
                          <span key={i}>
                            <span className={i === 0 ? 'text-white/80' : ''}>{a}</span>
                            {i < pub.authors.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-satellite-blue font-medium">{pub.journal}</span>
                        <span className="text-xs text-text-secondary">{pub.year}</span>
                        <span className="text-xs text-text-secondary">Vol. {pub.volume}</span>
                        <span className="text-xs text-text-secondary">pp. {pub.pages}</span>
                        <div className="flex items-center gap-1">
                          <Quote className="w-3 h-3 text-text-secondary" />
                          <span className="text-xs text-text-secondary">{pub.citations}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden md:flex items-center gap-2">
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-satellite-blue/20 border border-white/10 hover:border-satellite-blue/30 text-white text-xs transition-all"
                        >
                          <FileText className="w-3 h-3" /> Full Text PDF
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-satellite-blue/20 border border-white/10 hover:border-satellite-blue/30 text-white text-xs transition-all"
                        >
                          <Code className="w-3 h-3" /> Code
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-satellite-blue/20 border border-white/10 hover:border-satellite-blue/30 text-white text-xs transition-all"
                        >
                          <Link2 className="w-3 h-3" /> DOI
                        </button>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-text-secondary transition-transform duration-300 flex-shrink-0 ${expandedPub === pub.id ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                </button>
                
                {/* Expanded Abstract */}
                {expandedPub === pub.id && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-white/5">
                    <div className="pt-4">
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {pub.abstract}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {pub.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-text-secondary capitalize">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-night-slate border border-white/10">
                        <ExternalLink className="w-3.5 h-3.5 text-satellite-blue" />
                        <span className="font-mono text-xs text-text-secondary">https://doi.org/{pub.doi}</span>
                      </div>
                      {/* Mobile buttons */}
                      <div className="flex md:hidden items-center gap-2 mt-4">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 text-white text-xs">
                          <FileText className="w-3 h-3" /> PDF
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 text-white text-xs">
                          <Code className="w-3 h-3" /> Code
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 text-white text-xs">
                          <Link2 className="w-3 h-3" /> DOI
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Citation Info */}
          <div className="mt-12 p-6 rounded-[10px] bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-4 h-4 text-satellite-blue" />
              <h3 className="font-display font-medium text-white">How to Cite</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              If you use ContrailVision data or models in your research, please cite the platform paper:
            </p>
            <div className="p-4 rounded-lg bg-night-slate border border-white/10">
              <p className="font-mono text-xs text-white/70 leading-relaxed">
                Williams, R., Li, Z., Smith, A.B., et al. (2026). ContrailVision: An Open Platform for Global 
                Aviation Contrail Detection and Climate Modeling. <em>Environmental Data Science</em>, 5, e28. 
                https://doi.org/10.1017/eds.2026.28
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
