import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background image from Unsplash — cinematic video/camera setup */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1800&auto=format&fit=crop&q=80"
                    alt="Cinematic background"
                    className="w-full h-full object-cover object-center scale-105"
                    style={{ filter: 'brightness(0.28) saturate(1.1)' }}
                />
                {/* Multi-stop color gradient overlay for transition into next section */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0305]/40 to-[#0d0000]" />
                {/* Red glow orbs */}
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-rose-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Floating pill badges */}
            <div className="absolute top-32 left-8 md:left-20 hidden md:flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                HLS Adaptive Streaming
            </div>
            <div className="absolute top-44 right-8 md:right-20 hidden md:flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                360p · 720p · 1080p
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-20">
                {/* Eyebrow label */}
                <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 px-4 py-1.5 rounded-full mb-8">
                    <Play size={12} className="text-red-400 fill-red-400" />
                    <span className="text-red-300 text-xs font-semibold tracking-widest uppercase">Video-First Platform</span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-white">
                    Showcase your work.{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #E50914 50%, #c2185b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Let video
                    </span>{' '}
                    build trust.
                </h1>

                <p className="text-lg md:text-xl text-gray-300 font-normal max-w-2xl mb-12 leading-relaxed">
                    Upload proof-based videos, get discovered by your ideal clients, and let your work speak louder than any pitch.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                        onClick={() => navigate('/signup')}
                        style={{ background: 'linear-gradient(135deg, #E50914, #c2185b)' }}
                        className="group flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50"
                    >
                        Start Creating Free
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/browse')}
                        className="flex items-center gap-2 text-gray-300 hover:text-white border border-white/15 hover:border-red-500/50 px-8 py-4 rounded-lg font-medium text-base transition-all duration-300 backdrop-blur-sm"
                    >
                        <Play size={16} className="fill-current" />
                        Browse Videos
                    </button>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-10 mt-16 pt-8 border-t border-white/10">
                    {[
                        { value: 'HLS', label: 'Adaptive Streaming' },
                        { value: '3x', label: 'Quality Levels' },
                        { value: '∞', label: 'Video Uploads' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1 tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom fade — transitions into red-tinted section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d0000] to-transparent" />
        </div>
    );
};

export default Hero;
