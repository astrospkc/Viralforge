import { useState, useEffect } from 'react';
import {
    UploadCloud,
    Cpu,
    Sparkles,
    MapPin,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    Store,
    PhoneCall,
    ShoppingBag,
    Eye,
} from 'lucide-react';

interface Stage {
    id: number;
    title: string;
    label: string;
    durationMs: number;
    icon: typeof UploadCloud;
    actor: 'Merchant' | 'System' | 'Customer';
    description: string;
}

const STAGES: Stage[] = [
    {
        id: 0,
        title: 'Merchant Video Upload',
        label: 'Upload',
        durationMs: 4200,
        icon: UploadCloud,
        actor: 'Merchant',
        description: 'Shop owner records a 60-second product proof demo and uploads with price tag and pinned location.',
    },
    {
        id: 1,
        title: 'Screening & HLS Transcoding',
        label: 'Process',
        durationMs: 4200,
        icon: Cpu,
        actor: 'System',
        description: 'ViralForge AI checks content relevance, validates resolution, and generates multi-bitrate HLS streams.',
    },
    {
        id: 2,
        title: 'Location & Map Indexing',
        label: 'Index',
        durationMs: 4200,
        icon: MapPin,
        actor: 'System',
        description: 'Product video is pinned to the physical shop coordinates within a 5 km customer search radius.',
    },
    {
        id: 3,
        title: 'Customer Discovery & Action',
        label: 'Discover',
        durationMs: 4600,
        icon: ShoppingBag,
        actor: 'Customer',
        description: 'Customer opens the map feed, watches the video demonstration, verifies live stock, and gets directions.',
    },
];

export const AnimatedProductFlow = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    // Auto-advance loop when playing
    useEffect(() => {
        if (!isPlaying) return;

        const stageDuration = STAGES[currentStage].durationMs;
        const intervalTime = 50;
        const step = (intervalTime / stageDuration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentStage((s) => (s + 1) % STAGES.length);
                    return 0;
                }
                return prev + step;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isPlaying, currentStage]);

    const handleSelectStage = (idx: number) => {
        setCurrentStage(idx);
        setProgress(0);
    };

    const handleReset = () => {
        setCurrentStage(0);
        setProgress(0);
        setIsPlaying(true);
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#0E1015] via-[#12151E] to-[#0E1015] border-y border-violet-300/10 relative overflow-hidden">
            {/* Ambient background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={13} className="text-yellow-400" />
                        Live Product Lifecycle
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        See What Actually Happens Inside ViralForge
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base mt-3 leading-relaxed">
                        Watch the continuous journey from a merchant filming inventory in their shop, to automated screening and geospatial indexing, to customer discovery and purchase.
                    </p>
                </div>

                {/* Animated Interactive Flow Simulator Box */}
                <div className="bg-[#141722] rounded-3xl border border-violet-300/20 shadow-2xl shadow-black/80 overflow-hidden">
                    {/* Top Stage Navigation Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-800 bg-[#10131B]">
                        {STAGES.map((stage, idx) => {
                            const isActive = currentStage === idx;
                            const isCompleted = currentStage > idx;
                            const IconComponent = stage.icon;

                            return (
                                <button
                                    key={stage.id}
                                    onClick={() => handleSelectStage(idx)}
                                    className={`p-4 md:p-5 text-left transition-all relative flex items-center gap-3.5 cursor-pointer ${
                                        isActive
                                            ? 'bg-[#181C28]'
                                            : 'hover:bg-[#151823]'
                                    }`}
                                >
                                    {/* Progress track underneath active tab */}
                                    {isActive && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-violet-300"
                                            style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
                                        />
                                    )}

                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                            isActive
                                                ? 'bg-yellow-400 text-slate-950 font-bold shadow-md shadow-yellow-500/20'
                                                : isCompleted
                                                ? 'bg-violet-400/20 text-violet-200 border border-violet-300/30'
                                                : 'bg-[#1C202C] text-slate-500'
                                        }`}
                                    >
                                        <IconComponent size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <span className="text-[10px] font-black uppercase tracking-wider block text-slate-400">
                                            Stage 0{idx + 1} · {stage.actor}
                                        </span>
                                        <h4
                                            className={`text-xs md:text-sm font-bold truncate ${
                                                isActive ? 'text-white' : 'text-slate-400'
                                            }`}
                                        >
                                            {stage.title}
                                        </h4>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Visual Animation Canvas & Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                        {/* Left Side: Animated Dynamic Screen Preview (Mockup UI) */}
                        <div className="lg:col-span-7 p-6 md:p-8 flex items-center justify-center bg-[#0C0E14] relative border-b lg:border-b-0 lg:border-r border-slate-800">
                            {/* Stage 0: Merchant Uploading */}
                            {currentStage === 0 && (
                                <div className="w-full max-w-md bg-[#161924] rounded-2xl border border-slate-800 p-5 shadow-2xl animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-xs text-slate-400 font-mono ml-2">merchant-studio.viralforge</span>
                                        </div>
                                        <span className="text-[10px] bg-yellow-400/10 text-yellow-300 border border-yellow-400/25 px-2 py-0.5 rounded font-bold">
                                            Step 1 of 4
                                        </span>
                                    </div>

                                    {/* Video File Drop & Upload Simulation */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center mb-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop"
                                            alt="Product Demo Recording"
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                                        
                                        {/* Live Upload Progress overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center bg-black/40 backdrop-blur-xs">
                                            <div className="w-12 h-12 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center mb-3 animate-bounce">
                                                <UploadCloud size={24} />
                                            </div>
                                            <span className="text-xs font-bold text-white mb-1">
                                                Uploading "ATH_M50X_Acoustic_Test.mp4"
                                            </span>
                                            <span className="text-[11px] text-slate-400 mb-2">4K · 60fps · 28.4 MB</span>
                                            
                                            {/* Simulated Progress bar */}
                                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                                                <div
                                                    className="bg-yellow-400 h-full rounded-full transition-all duration-100"
                                                    style={{ width: `${Math.min(100, progress * 1.2)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs bg-[#10131B] px-3 py-2 rounded-lg border border-slate-800">
                                            <span className="text-slate-400">Attached Product:</span>
                                            <span className="text-white font-semibold">ATH-M50x Studio Headphones</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs bg-[#10131B] px-3 py-2 rounded-lg border border-slate-800">
                                            <span className="text-slate-400">Store Address:</span>
                                            <span className="text-yellow-400 font-semibold flex items-center gap-1">
                                                <MapPin size={11} /> AudioCraft NYC (Verified)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stage 1: Screening & Transcoding */}
                            {currentStage === 1 && (
                                <div className="w-full max-w-md bg-[#161924] rounded-2xl border border-slate-800 p-5 shadow-2xl animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                        <span className="text-xs font-mono text-violet-300 font-bold flex items-center gap-1.5">
                                            <Cpu size={14} className="animate-spin text-yellow-400" />
                                            FFmpeg & Screening Engine
                                        </span>
                                        <span className="text-[10px] bg-violet-400/10 text-violet-200 border border-violet-300/25 px-2 py-0.5 rounded font-bold">
                                            Auto-Screening
                                        </span>
                                    </div>

                                    {/* Pipeline Nodes */}
                                    <div className="space-y-3 mb-4">
                                        <div className="p-3 rounded-xl bg-[#10131B] border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-green-400" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">Content Relevance Screen</div>
                                                    <div className="text-[10px] text-slate-400">Verified product match · No spam detected</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">PASSED</span>
                                        </div>

                                        <div className="p-3 rounded-xl bg-[#10131B] border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-green-400" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">Adaptive HLS Bitrates</div>
                                                    <div className="text-[10px] text-slate-400">Generated 1080p, 720p, 360p segments</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">HLS READY</span>
                                        </div>

                                        <div className="p-3 rounded-xl bg-[#10131B] border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-green-400" />
                                                <div>
                                                    <div className="text-xs font-bold text-white">CDN Edge Ingestion</div>
                                                    <div className="text-[10px] text-slate-400">Low-latency playback globally</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-violet-300 bg-violet-400/10 px-2 py-0.5 rounded">STREAMABLE</span>
                                        </div>
                                    </div>

                                    {/* Console output snippet */}
                                    <div className="bg-black/90 p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 leading-relaxed">
                                        <p className="text-yellow-400">&gt; video_id: 1042 · status: APPROVED</p>
                                        <p>&gt; playlist generated: master.m3u8 (3 streams)</p>
                                        <p className="text-green-400">&gt; Ready for geospatial index</p>
                                    </div>
                                </div>
                            )}

                            {/* Stage 2: Location & Map Indexing */}
                            {currentStage === 2 && (
                                <div className="w-full max-w-md bg-[#161924] rounded-2xl border border-slate-800 p-5 shadow-2xl animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <MapPin size={14} className="text-yellow-400" />
                                            MapLibre Geospatial Engine
                                        </span>
                                        <span className="text-[10px] bg-yellow-400/10 text-yellow-300 border border-yellow-400/25 px-2 py-0.5 rounded font-bold">
                                            Live Pin
                                        </span>
                                    </div>

                                    {/* Simulated Map Canvas */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#11131A] border border-slate-800 mb-3 flex items-center justify-center">
                                        {/* Vector grid lines representing map */}
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                backgroundImage:
                                                    'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                                                backgroundSize: '24px 24px',
                                            }}
                                        />

                                        {/* Radial 5km radius ring */}
                                        <div className="w-36 h-36 rounded-full border-2 border-dashed border-violet-400/40 flex items-center justify-center bg-violet-500/5 animate-pulse">
                                            <span className="text-[9px] text-violet-300 font-bold bg-[#141722] px-2 py-0.5 rounded border border-violet-300/30">
                                                5 km Discovery Radius
                                            </span>
                                        </div>

                                        {/* Center Shop Pin with glowing badge */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-slate-950 overflow-hidden shadow-lg shadow-yellow-500/50 flex items-center justify-center">
                                                <Store size={18} className="text-yellow-400" />
                                            </div>
                                            <div className="mt-1 bg-black/90 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-slate-700 whitespace-nowrap">
                                                AudioCraft NYC · 1.2 km away
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2.5 rounded-lg bg-[#10131B] border border-slate-800 text-center">
                                            <span className="text-slate-400 text-[10px] block">Coordinates</span>
                                            <span className="text-white font-mono font-bold">40.7128° N, -74.0060° W</span>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-[#10131B] border border-slate-800 text-center">
                                            <span className="text-slate-400 text-[10px] block">Stock Status</span>
                                            <span className="text-green-400 font-bold">In Stock (Verified)</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stage 3: Customer Discovery & Purchase */}
                            {currentStage === 3 && (
                                <div className="w-full max-w-md bg-[#161924] rounded-2xl border border-slate-800 p-5 shadow-2xl animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <ShoppingBag size={14} className="text-yellow-400" />
                                            Customer Discovery Feed
                                        </span>
                                        <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/25 px-2 py-0.5 rounded font-bold">
                                            Verified Proof
                                        </span>
                                    </div>

                                    {/* Video Card Preview */}
                                    <div className="rounded-xl overflow-hidden bg-black border border-slate-800 relative mb-3">
                                        <img
                                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop"
                                            alt="Video Proof"
                                            className="w-full h-36 object-cover opacity-80"
                                        />
                                        <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-400 border border-yellow-400/30">
                                            ✓ Video Proof Demo
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                                            1080p · 2:14
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-xs p-2 rounded-lg border border-slate-800">
                                            <div>
                                                <div className="text-xs font-bold text-white">ATH-M50x Headphones</div>
                                                <div className="text-[10px] text-slate-400">AudioCraft NYC · $149</div>
                                            </div>
                                            <span className="text-xs font-black text-yellow-400">$149.00</span>
                                        </div>
                                    </div>

                                    {/* Instant Action Row */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex items-center justify-center gap-1.5 bg-yellow-400 text-slate-950 font-bold py-2 rounded-xl text-xs shadow-md shadow-yellow-500/15">
                                            <MapPin size={13} />
                                            Get Directions
                                        </button>
                                        <button className="flex items-center justify-center gap-1.5 bg-[#10131B] hover:bg-[#1A1F2C] text-violet-200 border border-violet-300/20 py-2 rounded-xl text-xs font-semibold">
                                            <PhoneCall size={13} />
                                            Call Shop
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Deep Explainer Panel & Interactive Steps */}
                        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-[#12151E]">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
                                        Phase 0{currentStage + 1} of 04
                                    </span>
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-400/10 text-violet-200 border border-violet-300/20">
                                        Role: {STAGES[currentStage].actor}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-3">
                                    {STAGES[currentStage].title}
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    {STAGES[currentStage].description}
                                </p>

                                {/* Feature checklist for this step */}
                                <div className="space-y-3 mb-8">
                                    {currentStage === 0 && (
                                        <>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>Merchant captures uncut demonstration in their workshop or store</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>Direct attachment of price, specifications, and physical address</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>Direct S3 upload via secure presigned endpoints</span>
                                            </div>
                                        </>
                                    )}

                                    {currentStage === 1 && (
                                        <>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>Automated AI screening checks product relevance and flags spam</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>FFmpeg segments video into adaptive 360p, 720p, 1080p streams</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>Thumbnail frame extraction and instant CDN readiness</span>
                                            </div>
                                        </>
                                    )}

                                    {currentStage === 2 && (
                                        <>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>MapLibre GL pins product to real-world store GPS coordinates</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>Enables 5 km radius filtering for customers searching nearby</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <span>Live inventory status timestamped to avoid stale stock info</span>
                                            </div>
                                        </>
                                    )}

                                    {currentStage === 3 && (
                                        <>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>Customer scrolls visual feed and clicks pins on interactive map</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>Inspects build proof and compares prices across nearby shops</span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                                <span>Calls merchant directly or navigates to shop to buy in person</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Player / Flow Controls */}
                            <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                                        title={isPlaying ? 'Pause animation' : 'Play animation'}
                                    >
                                        {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-slate-950" />}
                                        <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                                        title="Restart flow simulation"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Eye size={13} className="text-violet-300" />
                                    <span>Interactive Walkthrough</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnimatedProductFlow;
