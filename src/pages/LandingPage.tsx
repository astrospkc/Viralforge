import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import {
    Video,
    Zap,
    Star,
    ArrowRight,
    Play,
    ChevronRight,
} from 'lucide-react';

/* ─── Unsplash image URLs (no API key needed) ─── */
// Video editing / production:  https://unsplash.com/photos/hpjSkU2UYSU
// Mobile discovery feed:       https://unsplash.com/photos/bmJAXAz6ads
// Review / rating concept:     https://unsplash.com/photos/OQMZwNd3ThU

const IMAGES = {
    videoPlatform: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80',
    mobileDiscovery: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    teamWork: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
};

const features = [
    {
        icon: <Video size={22} className="text-red-400" />,
        title: 'Video Showcase',
        description: 'Upload real demos, case studies, and service walkthroughs. Let your work speak louder than any pitch deck.',
    },
    {
        icon: <Zap size={22} className="text-rose-300" />,
        title: 'HLS Adaptive Streaming',
        description: 'Transcoded via FFmpeg into 360p, 720p & 1080p. Quality auto-adjusts to viewer\'s network — like YouTube.',
    },
    {
        icon: <Play size={22} className="text-pink-400" />,
        title: 'Short-form Discovery',
        description: 'Scroll a feed of short clips to find and evaluate services fast. Swipe, discover, decide.',
    },
    {
        icon: <Star size={22} className="text-red-300" />,
        title: 'Review System',
        description: 'Viewers rate and review after watching. Build trust through verified, proof-based social proof.',
    },
];

const audience = [
    { emoji: '💼', title: 'Freelancers & Agencies', desc: 'Show real client work and project results instead of just listing services.' },
    { emoji: '🏪', title: 'Small Businesses', desc: 'Let potential customers see your product or service in action before reaching out.' },
    { emoji: '🔍', title: 'Service Buyers', desc: 'Discover and evaluate providers through actual video proof, not just text.' },
];

const pipeline = [
    { step: '01', label: 'Upload', desc: 'Raw video uploaded from the frontend.' },
    { step: '02', label: 'Transcode', desc: 'FFmpeg generates HLS segments at 360p, 720p & 1080p.' },
    { step: '03', label: 'Store & Stream', desc: 'Segments stored in cloud; served via adaptive .m3u8 playlist.' },
    { step: '04', label: 'Discover', desc: 'Your video surfaces in the scrollable discovery feed.' },
];

/* ─── Smooth section divider component ─── */
const SectionDivider = ({ from, to }: { from: string; to: string }) => (
    <div className="h-24 w-full" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }} />
);

const LandingPage = () => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="text-white font-sans antialiased" style={{ background: '#000' }}>
            <Navbar />

            {/* ─── HERO ── bg: black → #0d0000 ─── */}
            <Hero />

            {/* ─── FEATURES SECTION ── bg: #0d0000 → #110010 ─── */}
            <section style={{ background: 'linear-gradient(180deg, #0d0000 0%, #130008 60%, #110010 100%)' }} className="py-24 px-6 md:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-rose-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">What you get</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                            Everything you need to<br className="hidden md:block" /> build credibility through video.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="group p-8 transition-all duration-300 cursor-default"
                                style={{ background: i % 2 === 0 ? '#0e0008' : '#110010' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#1a0015')}
                                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#0e0008' : '#110010')}
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                                    style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-bold mb-2 text-white">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── IMAGE BREAK 1 — Video Platform Mockup ─── */}
            <section style={{ background: 'linear-gradient(180deg, #110010 0%, #0a0018 100%)' }} className="py-20 px-6 md:px-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    {/* Text */}
                    <div className="md:w-2/5">
                        <p className="text-pink-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Proof over promises</p>
                        <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white">
                            Your work is the best sales pitch.
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Forget lengthy proposals. Upload a walkthrough video of your project, and let potential clients see exactly what you deliver — before they ever reach out.
                        </p>
                        <a href="/signup" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
                            Start showcasing <ArrowRight size={15} />
                        </a>
                    </div>
                    {/* Image */}
                    <div className="md:w-3/5 relative">
                        <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-20" style={{ background: 'radial-gradient(ellipse, #E50914, transparent)' }} />
                        <img
                            src={IMAGES.videoPlatform}
                            alt="Video platform showcase"
                            className="relative rounded-2xl w-full object-cover shadow-2xl"
                            style={{ height: '360px', border: '1px solid rgba(229,9,20,0.15)' }}
                        />
                        {/* Floating badge overlay */}
                        <div className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs text-gray-300 font-medium">HLS Streaming Active</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PIPELINE SECTION ── bg: #0a0018 → #05001a ─── */}
            <section style={{ background: 'linear-gradient(180deg, #0a0018 0%, #05001a 100%)' }} className="py-24 px-6 md:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-2/5">
                            <p className="text-indigo-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Under the hood</p>
                            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white">
                                From upload to discovery — in seconds.
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                ViralForge handles the full pipeline: raw video in, adaptive HLS stream out, straight into the discovery feed.
                            </p>
                        </div>

                        <div className="md:w-3/5 flex flex-col gap-3">
                            {pipeline.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className="text-left p-5 rounded-xl border transition-all duration-250"
                                    style={{
                                        borderColor: activeStep === i ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.05)',
                                        background: activeStep === i ? 'rgba(99,102,241,0.07)' : 'transparent',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono font-bold" style={{ color: activeStep === i ? '#818cf8' : '#4b5563' }}>
                                            {p.step}
                                        </span>
                                        <span className="font-bold text-sm" style={{ color: activeStep === i ? '#fff' : '#9ca3af' }}>
                                            {p.label}
                                        </span>
                                        <ChevronRight size={14} className={`ml-auto transition-all ${activeStep === i ? 'text-indigo-400 translate-x-1' : 'text-gray-700'}`} />
                                    </div>
                                    {activeStep === i && (
                                        <p className="text-gray-400 text-sm mt-2 pl-10 leading-relaxed">{p.desc}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── IMAGE BREAK 2 — Discovery Feed ─── */}
            <section style={{ background: 'linear-gradient(180deg, #05001a 0%, #000d18 100%)' }} className="py-20 px-6 md:px-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
                    {/* Text */}
                    <div className="md:w-2/5">
                        <p className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Discovery Feed</p>
                        <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white">
                            Scroll. Discover. Decide.
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Short-form videos surface in a scrollable discovery feed — so buyers find you without a complicated search. Your next client is one scroll away.
                        </p>
                        <a href="/browse" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors">
                            Browse the feed <ArrowRight size={15} />
                        </a>
                    </div>
                    {/* Image */}
                    <div className="md:w-3/5 relative">
                        <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-15" style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent)' }} />
                        <img
                            src={IMAGES.mobileDiscovery}
                            alt="Short-form discovery feed"
                            className="relative rounded-2xl w-full object-cover shadow-2xl"
                            style={{ height: '360px', border: '1px solid rgba(6,182,212,0.15)' }}
                        />
                        <div className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                            <Play size={14} className="text-cyan-400 fill-cyan-400" />
                            <span className="text-xs text-gray-300 font-medium">Adaptive quality playback</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── AUDIENCE SECTION ── bg: #000d18 → #001010 ─── */}
            <section style={{ background: 'linear-gradient(180deg, #000d18 0%, #001010 100%)' }} className="py-24 px-6 md:px-16">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-teal-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Built for</p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-16 text-white">
                        Who is ViralForge for?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {audience.map((a, i) => (
                            <div
                                key={i}
                                className="group relative p-8 rounded-2xl transition-all duration-300 cursor-default text-left"
                                style={{
                                    background: '#080f10',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(20,184,166,0.3)'; (e.currentTarget as HTMLElement).style.background = '#0b1613'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = '#080f10'; }}
                            >
                                <div className="text-4xl mb-5">{a.emoji}</div>
                                <h3 className="text-base font-bold text-white mb-2">{a.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── IMAGE BREAK 3 — Team / Community ─── */}
            <section style={{ background: 'linear-gradient(180deg, #001010 0%, #000a00 100%)' }} className="py-20 px-6 md:px-16">
                <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <img
                        src={IMAGES.teamWork}
                        alt="Team working together"
                        className="w-full object-cover"
                        style={{ height: '400px', filter: 'brightness(0.3) saturate(0.8)' }}
                    />
                    {/* Overlay content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(135deg, rgba(20,0,5,0.7), rgba(5,0,20,0.7))' }}>
                        <div className="flex justify-center gap-1 mb-5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <blockquote className="text-2xl md:text-3xl font-black text-white max-w-2xl leading-snug mb-4">
                            "Upload proof of your work → Let others discover and evaluate → Build trust through video."
                        </blockquote>
                        <p className="text-gray-400 text-sm">— The ViralForge philosophy</p>
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ── bg: #000a00 → #000 ─── */}
            <section style={{ background: 'linear-gradient(180deg, #000a00 0%, #000000 100%)' }} className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-96 h-48 rounded-full blur-[80px] opacity-20" style={{ background: 'radial-gradient(ellipse, #E50914, #c2185b)' }} />
                    </div>
                    <p className="relative text-red-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Get started today</p>
                    <h2 className="relative text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                        Your work deserves to be seen.
                    </h2>
                    <p className="relative text-gray-400 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                        Join ViralForge — the video-first platform where proof of work drives trust and discovery.
                    </p>
                    <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/signup"
                            className="group inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #E50914, #c2185b)',
                                boxShadow: '0 0 0 rgba(229,9,20,0)',
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(229,9,20,0.4)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 rgba(229,9,20,0)')}
                        >
                            Create Free Account
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="/browse"
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-medium text-sm transition-all duration-300"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,9,20,0.4)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)')}
                        >
                            <Play size={14} className="fill-current" />
                            Explore Videos
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#000' }} className="py-10 px-6 text-center">
                <span className="text-red-600 font-black text-lg tracking-tighter uppercase">VIRAL_FORGE</span>
                <p className="text-gray-700 text-xs mt-2">Built with ❤️ by the ViralForge Team</p>
                <div className="flex justify-center gap-6 mt-4">
                    {['Privacy', 'Terms', 'GitHub'].map((link) => (
                        <a key={link} href="#" className="text-gray-700 hover:text-gray-400 text-xs transition-colors">{link}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
