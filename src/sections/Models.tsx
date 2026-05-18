import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check, Terminal, GitBranch, Star, Download, BookOpen, Cpu, Network, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ModelPipeline {
  id: string;
  name: string;
  description: string;
  architecture: string;
  accuracy: string;
  params: string;
  icon: React.ElementType;
  installCommand: string;
  codeExample: string;
  features: string[];
  paperUrl: string;
}

const pipelines: ModelPipeline[] = [
  {
    id: 'unetpp',
    name: 'U-Net++ with Deep Supervision',
    description: 'Nested skip connections with deep supervision for precise contrail boundary segmentation at multiple scales.',
    architecture: 'U-Net++',
    accuracy: '0.941',
    params: '34.5M',
    icon: Network,
    installCommand: 'pip install contraillab-segmentation',
    codeExample: `from contraillab.models import UNetPlusPlus
from contraillab.data import ContrailDataset

# Initialize model with deep supervision
model = UNetPlusPlus(
    in_channels=3,
    out_channels=1,
    deep_supervision=True,
    filters=[32, 64, 128, 256, 512]
)

# Load pretrained weights
model.load_checkpoint('unetpp-contrail-v2.4.pt')

# Inference on single image
import torch
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

image = transform(input_image).unsqueeze(0)
with torch.no_grad():
    mask = model(image)  # Pixel-level contrail mask
    confidence = torch.sigmoid(mask)`,
    features: ['Nested skip pathways', 'Deep supervision', 'Multi-scale aggregation', 'Dice loss optimization'],
    paperUrl: '#',
  },
  {
    id: 'aspp',
    name: 'ASPP Contrail Detector',
    description: 'Atrous Spatial Pyramid Pooling module for capturing contrails at multiple receptive fields simultaneously.',
    architecture: 'DeepLabV3+ ASPP',
    accuracy: '0.938',
    params: '41.2M',
    icon: Layers,
    installCommand: 'pip install contraillab-aspp',
    codeExample: `from contraillab.models import ASPPDetector
from contraillab.postprocess import morphological_refine

# Initialize ASPP-based detector
model = ASPPDetector(
    backbone='resnet101',
    atrous_rates=[6, 12, 18],
    num_classes=2,
    output_stride=16
)

# Load weights
model.load_checkpoint('aspp-contrail-v2.3.pt')

# Batch inference
batch = preprocessor.load_batch(
    paths=['scene_001.tif', 'scene_002.tif'],
    tile_size=512,
    overlap=64
)

results = model.predict(batch, 
    tta=True,  # Test-time augmentation
    refine=True  # Morphological post-processing
)

# Results contain: mask, confidence, geometry
for r in results:
    print(f"Length: {r.geometry.length_km:.1f}km")
    print(f"Confidence: {r.confidence:.3f}")`,
    features: ['Multi-rate atrous convolution', 'Encoder-decoder structure', 'Test-time augmentation', 'Morphological refinement'],
    paperUrl: '#',
  },
  {
    id: 'se-transformer',
    name: 'SE-Enhanced Spatio-Temporal Transformer',
    description: 'Squeeze-and-Excitation modules combined with Vision Transformer for spatio-temporal contrail evolution modeling.',
    architecture: 'SE + ViT + Temporal',
    accuracy: '0.952',
    params: '67.8M',
    icon: Cpu,
    installCommand: 'pip install contraillab-transformers',
    codeExample: `from contraillab.models import SpatioTemporalTransformer
from contraillab.temporal import SequenceLoader

# SE-enhanced spatio-temporal transformer
model = SpatioTemporalTransformer(
    img_size=512,
    patch_size=16,
    in_chans=3,
    embed_dim=768,
    depth=12,
    num_heads=12,
    se_ratio=16,  # Squeeze-and-Excitation
    temporal_window=4,  # Frames
    temporal_dim=256
)

# Load sequence data
sequence = SequenceLoader.load(
    satellite='goes16',
    region='north_atlantic',
    start_time='2026-05-17T08:00Z',
    window_hours=4,
    interval_minutes=15
)

# Temporal contrail tracking
model.load_checkpoint('se-transformer-v2.4.pt')
temporal_mask = model.predict_sequence(sequence)

# Track individual contrails across frames
tracks = model.track_contrails(
    temporal_mask,
    iou_threshold=0.5,
    min_persistence_minutes=30
)

print(f"Detected {len(tracks)} persistent contrails")
for track in tracks:
    print(f"  Duration: {track.duration_min}min, "
          f"Max length: {track.max_length_km:.1f}km")`,
    features: ['Squeeze-and-Excitation blocks', 'Self-attention mechanism', 'Temporal sequence modeling', 'Contrail tracking across frames'],
    paperUrl: '#',
  },
];

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-[#0d1117] border border-white/10">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-xs text-text-secondary font-mono">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-xs leading-relaxed text-white/80">
          {code.split('\n').map((line, i) => (
            <div key={i} className="table-row">
              <span className="table-cell text-right pr-4 text-white/20 select-none w-8">{i + 1}</span>
              <span className="table-cell">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function Models() {
  const [activeTab, setActiveTab] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.querySelectorAll('.model-card'), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const activeModel = pipelines[activeTab];

  return (
    <div ref={pageRef} className="min-h-screen bg-deep-space pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-satellite-blue" />
              <span className="text-xs uppercase tracking-[0.1em] text-satellite-blue font-medium">Open Source</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
              Model <span className="text-satellite-blue">Zoo</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl">
              Production-ready machine learning pipelines for contrail pixel-level semantic segmentation. 
              U-Net++, ASPP, SE modules, and Spatio-Temporal Transformers — all open source and ready to deploy.
            </p>
          </div>

          {/* Model Selector */}
          <div ref={cardsRef} className="grid lg:grid-cols-3 gap-4 mb-8">
            {pipelines.map((pipeline, i) => (
              <button
                key={pipeline.id}
                onClick={() => setActiveTab(i)}
                className={`model-card text-left p-5 rounded-[10px] border transition-all duration-300 ${
                  activeTab === i
                    ? 'bg-satellite-blue/10 border-satellite-blue/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${activeTab === i ? 'bg-satellite-blue/20' : 'bg-white/5'}`}>
                    <pipeline.icon className={`w-5 h-5 ${activeTab === i ? 'text-satellite-blue' : 'text-text-secondary'}`} />
                  </div>
                  <h3 className="font-display font-medium text-white text-sm">{pipeline.name}</h3>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed mb-3">{pipeline.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-text-secondary">Acc: {pipeline.accuracy}</span>
                  <span className="text-[10px] text-text-secondary">{pipeline.params} params</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Model Details */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Code & Install */}
            <div className="lg:col-span-3 space-y-6">
              {/* Install Command */}
              <CodeBlock code={activeModel.installCommand} label="terminal — bash" />
              
              {/* Code Example */}
              <CodeBlock code={activeModel.codeExample} label={`python — ${activeModel.id}.py`} />
            </div>

            {/* Right: Model Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metrics */}
              <div className="p-5 rounded-[10px] bg-white/5 border border-white/10">
                <h3 className="font-display font-medium text-white mb-4">Model Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Architecture</span>
                    <span className="text-xs text-white font-mono">{activeModel.architecture}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Accuracy (IoU)</span>
                    <span className="text-xs text-satellite-blue font-mono">{activeModel.accuracy}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Parameters</span>
                    <span className="text-xs text-white font-mono">{activeModel.params}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Framework</span>
                    <span className="text-xs text-white font-mono">PyTorch 2.0+</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-text-secondary">License</span>
                    <span className="text-xs text-white font-mono">Apache 2.0</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-5 rounded-[10px] bg-white/5 border border-white/10">
                <h3 className="font-display font-medium text-white mb-4">Key Features</h3>
                <div className="space-y-2">
                  {activeModel.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-satellite-blue" />
                      <span className="text-xs text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-satellite-blue hover:bg-satellite-blue/90 text-white text-sm font-medium rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Download Checkpoint
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-colors">
                  <BookOpen className="w-4 h-4" /> View Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
