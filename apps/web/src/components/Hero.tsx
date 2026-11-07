import { ArrowRight, Play, MapPin, Store, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';

const Hero = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden pt-24 pb-16">
            {/* Cinematic dark grey canvas background with ambient warm yellow & soft violet glow */}
            <div className="absolute inset-0 bg-[#0E1015]">
                {/* Subtle photography backdrop with soft dark grade */}
                <img
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1800&auto=format&fit=crop&q=80"
                    alt="Physical store showcase"
                    className="w-full h-full object-cover object-center opacity-15 filter saturate-50"
                />
                {/* Radial ambient lighting: Light violet top-right & warm yellow bottom-left */}
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-[130px] pointer-events-none" />
                {/* Multi-layer gradient mask for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0E1015]/80 via-[#0E1015]/90 to-[#0E1015]" />
            </div>

            {/* Floating live indicator badges with gentle float animation */}
            <div className="absolute top-28 left-6 md:left-16 hidden lg:flex items-center gap-2.5 bg-[#161922]/90 border border-violet-300/20 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs text-slate-200 shadow-xl shadow-black/40 animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <MapPin size={13} className="text-violet-300" />
                <span className="font-medium">5km Local Radius Discovery</span>
            </div>

            <div className="absolute top-36 right-6 md:right-16 hidden lg:flex items-center gap-2.5 bg-[#161922]/90 border border-yellow-400/25 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs text-slate-200 shadow-xl shadow-black/40 animate-float-delayed">
                <ShieldCheck size={14} className="text-yellow-400" />
                <span className="font-semibold text-white">Live Verified Stock</span>
                <span className="text-[10px] bg-violet-400/20 text-violet-200 px-1.5 py-0.5 rounded font-bold">Auto-Screened</span>
            </div>

            {/* Main Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 bg-[#1A1F2B] border border-violet-300/25 px-4 py-1.5 rounded-full mb-7 shadow-sm">
                    <Sparkles size={13} className="text-yellow-400" />
                    <span className="text-violet-200 text-xs font-bold tracking-wide uppercase">
                        Video-First · Location-Aware Product Discovery
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6 text-white">
                    Discover products nearby.{' '}
                    <span className="block mt-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                        Watch before you buy.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal max-w-2xl mb-10 leading-relaxed">
                    ViralForge connects you with local shops and creator showcases through authentic short videos.
                    Check verified stock, compare prices, and navigate to physical stores.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 items-center w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/browse')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-yellow-500/20"
                    >
                        <Play size={16} className="fill-slate-950" />
                        Explore Video Feed & Map
                    </button>

                    {!isAuthenticated ? (
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1F2C] hover:bg-[#23293B] text-violet-200 hover:text-white border border-violet-300/25 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                        >
                            <Store size={16} className="text-yellow-400" />
                            List Your Shop & Products
                            <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/transcode')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1F2C] hover:bg-[#23293B] text-violet-200 hover:text-white border border-violet-300/25 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                        >
                            Upload Product Video
                            <ArrowRight size={15} />
                        </button>
                    )}
                </div>

                {/* Proof Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-14 pt-8 border-t border-slate-800/80 w-full max-w-3xl">
                    {[
                        { label: 'Video Showcase', desc: 'Real uncut product demos' },
                        { label: 'Location Map', desc: 'Find shops in 5km radius' },
                        { label: 'Stock & Pricing', desc: 'Transparent availability' },
                        { label: 'Direct Contact', desc: 'Call, directions, or order' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <span className="text-yellow-400 font-bold text-sm tracking-tight">{item.label}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
