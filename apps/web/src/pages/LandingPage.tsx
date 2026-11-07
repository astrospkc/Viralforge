import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AnimatedProductFlow from '../components/AnimatedProductFlow';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
    MapPin,
    Video,
    Store,
    ShieldCheck,
    PhoneCall,
    ExternalLink,
    ArrowRight,
    Play,
    Sparkles,
    CheckCircle2,
    Compass,
    Tag,
    ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CORE_USER_FEATURES = [
    {
        icon: <Video className="text-yellow-400" size={24} />,
        badge: 'Visual Proof',
        title: 'Video-First Product Feed',
        description:
            'Watch authentic, uncut product demonstrations uploaded directly by verified shops and creators. See build quality, fit, and real-time usage before making a decision.',
    },
    {
        icon: <MapPin className="text-violet-300" size={24} />,
        badge: 'Nearby First',
        title: 'Location & Interactive Map',
        description:
            'Browse shops within a 5 km radius, view live distances, pin locations across popular cities, and filter the video feed to local merchants in your immediate area.',
    },
    {
        icon: <Tag className="text-yellow-400" size={24} />,
        badge: 'Transparent',
        title: 'Compare Prices & Real Stock',
        description:
            'Compare which nearby shops stock the exact item you need. View verified prices, recent inventory timestamps, specifications, and avoid out-of-stock surprises.',
    },
    {
        icon: <PhoneCall className="text-violet-300" size={24} />,
        badge: 'One-Tap Action',
        title: 'Direct Merchant Contact & Directions',
        description:
            'Call the shop owner, send a direct WhatsApp/enquiry with the exact product attached, or launch turn-by-turn navigation straight to their physical storefront.',
    },
    {
        icon: <ExternalLink className="text-yellow-400" size={24} />,
        badge: 'Online & Local',
        title: 'Online Sellers & Creator Links',
        description:
            'Not just local storefronts — explore curated online products, direct brand links, and creator walkthroughs with secure external checkout.',
    },
    {
        icon: <ShieldCheck className="text-violet-300" size={24} />,
        badge: 'Quality Guard',
        title: 'Screened & Verified Video Quality',
        description:
            'Automated screening ensures product relevance and filters spam, while adaptive HLS streaming guarantees buffer-free playback across any network.',
    },
];

const AUDIENCE_ROLES = [
    {
        tag: 'FOR SHOPPERS',
        title: 'Discover What & Where to Buy',
        subtitle: 'From scrolling on your couch to picking it up at a shop down the street.',
        bulletPoints: [
            'Search by product, brand, or local neighbourhood',
            'Watch genuine video proof instead of edited product renders',
            'Compare prices across verified local physical stores',
            'Get instant driving directions or call the merchant directly',
        ],
        ctaText: 'Start Browsing Nearby',
        ctaLink: '/browse',
        primary: true,
    },
    {
        tag: 'FOR LOCAL MERCHANTS',
        title: 'Turn Footfall into Digital Visibility',
        subtitle: 'Your physical shop now has a digital storefront reachable by local customers.',
        bulletPoints: [
            'Claim your shop profile and pin your exact physical location',
            'Upload quick 60-second product clips to attract nearby buyers',
            'Update stock status and transparent pricing in seconds',
            'Receive direct customer enquiries and shop visit clicks',
        ],
        ctaText: 'Register Your Shop',
        ctaLink: '/signup',
        primary: false,
    },
    {
        tag: 'FOR ONLINE SELLERS & CREATORS',
        title: 'Showcase Products with External Links',
        subtitle: 'Let your video reviews drive direct conversion to your store or affiliate pages.',
        bulletPoints: [
            'No physical storefront required — upload anywhere',
            'Attach direct checkout links or marketplace URLs',
            'Track video views, link clicks, and buyer interest analytics',
            'Monetize social commerce through genuine product evaluation',
        ],
        ctaText: 'Join as a Creator',
        ctaLink: '/signup',
        primary: false,
    },
];

const DISCOVERY_STEPS = [
    {
        step: '01',
        title: 'Search & Pick Location',
        desc: 'Allow your device GPS or pick a city on the MapLibre map to discover products stocked nearby.',
    },
    {
        step: '02',
        title: 'Watch Product Video Proof',
        desc: 'Swipe through short, uncut demonstration clips showing how the product really works and looks.',
    },
    {
        step: '03',
        title: 'Compare Price & Live Stock',
        desc: 'Check live availability, transparent merchant pricing, and specs across multiple nearby stores.',
    },
    {
        step: '04',
        title: 'Visit Shop or Buy Online',
        desc: 'Tap for turn-by-turn directions, call the seller, or click external checkout links to buy directly.',
    },
];

const LandingPage = () => {
    const [activeStep, setActiveStep] = useState(0);

    // Scroll reveal hooks for each major page landmark
    const [stripRef, stripVisible] = useScrollReveal<HTMLElement>({ threshold: 0.1 });
    const [featuresHeaderRef, featuresHeaderVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
    const [featuresGridRef, featuresGridVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });
    const [stepsRef, stepsVisible] = useScrollReveal<HTMLElement>({ threshold: 0.1 });
    const [audienceHeaderRef, audienceHeaderVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
    const [audienceGridRef, audienceGridVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });
    const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>({ threshold: 0.15 });

    return (
        <div className="text-white font-sans antialiased bg-[#0E1015] selection:bg-yellow-400 selection:text-slate-950">
            <Navbar />

            {/* ─── HERO SECTION ─── */}
            <Hero />

            {/* ─── SECTION 1: CORE VALUE HIGHLIGHT STRIP ─── */}
            <section
                ref={stripRef}
                className={`border-y border-violet-300/10 bg-[#12151D] py-10 px-6 md:px-12 reveal-on-scroll ${
                    stripVisible ? 'is-visible' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/25 flex items-center justify-center shrink-0">
                            <Compass size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base md:text-lg">
                                Bridging Online Video Discovery with Local Offline Stores
                            </h3>
                            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                                Moving customers from <span className="text-yellow-300 font-semibold">seeing a product</span> to <span className="text-violet-200 font-semibold">finding and buying it</span>.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 bg-[#1A1F2B] hover:bg-[#23293B] text-violet-200 hover:text-white border border-violet-300/20 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 hover:scale-[1.02] shadow-sm shadow-black"
                    >
                        Try Interactive Map Feed <ArrowRight size={14} className="text-yellow-400" />
                    </Link>
                </div>
            </section>

            {/* ─── SECTION 2: THE 6 CORE FEATURES EVERY USER MUST KNOW ─── */}
            <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div
                    ref={featuresHeaderRef}
                    className={`text-center max-w-2xl mx-auto mb-16 reveal-on-scroll ${
                        featuresHeaderVisible ? 'is-visible' : ''
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-400/10 border border-violet-300/20 text-violet-200 text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={12} className="text-yellow-400" />
                        What You Can Do
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Everything needed to discover and buy with certainty.
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
                        ViralForge is not an endless generic social feed. Every video belongs to a real product, a verified shop, or a confirmed online listing.
                    </p>
                </div>

                <div
                    ref={featuresGridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {CORE_USER_FEATURES.map((feat, idx) => (
                        <div
                            key={idx}
                            style={{ transitionDelay: `${idx * 80}ms` }}
                            className={`group p-7 rounded-2xl bg-[#141720] border border-slate-800 hover:border-violet-300/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between reveal-on-scroll ${
                                featuresGridVisible ? 'is-visible' : ''
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#1C212E] border border-slate-700/60 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#23293B] transition-all">
                                        {feat.icon}
                                    </div>
                                    <span className="text-[11px] font-bold text-violet-200 bg-violet-400/10 border border-violet-300/20 px-2.5 py-1 rounded-full">
                                        {feat.badge}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                                    {feat.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feat.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-slate-400 group-hover:text-yellow-400 transition-colors">
                                <span>Learn more</span>
                                <ChevronRight size={13} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── ANIMATED PRODUCT FLOW SECTION (LIFECYCLE SIMULATOR) ─── */}
            <AnimatedProductFlow />

            {/* ─── SECTION 3: HOW IT WORKS (THE 4-STEP DISCOVERY FLOW) ─── */}
            <section
                ref={stepsRef}
                className={`py-24 px-6 md:px-16 bg-[#12151D] border-y border-violet-300/10 reveal-on-scroll ${
                    stepsVisible ? 'is-visible' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Left column explanation */}
                        <div className="lg:w-2/5">
                            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3 block">
                                Simple 4-Step Journey
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
                                How ViralForge works for customers.
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                No more guessing how an item looks from flat photos, and no more driving to a local store only to find out they are out of stock.
                            </p>

                            <div className="p-6 rounded-2xl bg-[#181C26] border border-violet-300/15 hover:border-violet-300/30 transition-colors">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                                    <Store size={16} className="text-yellow-400" />
                                    Are you a merchant?
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    List your products, pin your shop on our map, and upload 60-second video clips to drive foot traffic.
                                </p>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
                                >
                                    Register shop profile →
                                </Link>
                            </div>
                        </div>

                        {/* Right column step selector */}
                        <div className="lg:w-3/5 flex flex-col gap-3.5 w-full">
                            {DISCOVERY_STEPS.map((s, idx) => {
                                const isSelected = activeStep === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStep(idx)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#1A1F2C] border-yellow-400/40 shadow-lg shadow-black/40 scale-[1.01]'
                                                : 'bg-[#151821] border-slate-800/80 hover:border-slate-700 hover:bg-[#181C27]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`text-sm font-mono font-black px-2.5 py-1 rounded-lg transition-colors ${
                                                    isSelected
                                                        ? 'bg-yellow-400 text-slate-950'
                                                        : 'bg-slate-800 text-slate-400'
                                                }`}
                                            >
                                                {s.step}
                                            </span>
                                            <span
                                                className={`font-bold text-base transition-colors ${
                                                    isSelected ? 'text-white' : 'text-slate-300'
                                                }`}
                                            >
                                                {s.title}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className={`ml-auto transition-transform duration-300 ${
                                                    isSelected
                                                        ? 'text-yellow-400 rotate-90'
                                                        : 'text-slate-600'
                                                }`}
                                            />
                                        </div>
                                        {isSelected && (
                                            <p className="text-slate-300 text-sm mt-3 pl-12 leading-relaxed animate-in fade-in duration-200">
                                                {s.desc}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── SECTION 4: WHO IT IS BUILT FOR (CUSTOMERS / MERCHANTS / CREATORS) ─── */}
            <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
                <div
                    ref={audienceHeaderRef}
                    className={`text-center max-w-2xl mx-auto mb-16 reveal-on-scroll ${
                        audienceHeaderVisible ? 'is-visible' : ''
                    }`}
                >
                    <span className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                        One Unified Platform
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Built for Everyone in the Discovery Loop
                    </h2>
                </div>

                <div
                    ref={audienceGridRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {AUDIENCE_ROLES.map((role, idx) => (
                        <div
                            key={idx}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                            className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 reveal-on-scroll ${
                                audienceGridVisible ? 'is-visible' : ''
                            } ${
                                role.primary
                                    ? 'bg-[#161A24] border-yellow-400/35 shadow-xl shadow-yellow-500/5'
                                    : 'bg-[#13161F] border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div>
                                <span className="text-[11px] font-black text-yellow-400 tracking-wider uppercase mb-3 block">
                                    {role.tag}
                                </span>
                                <h3 className="text-xl font-black text-white mb-2 leading-snug">
                                    {role.title}
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                    {role.subtitle}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {role.bulletPoints.map((pt, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle2 size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                to={role.ctaLink}
                                className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all ${
                                    role.primary
                                        ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-md shadow-yellow-500/20 hover:scale-[1.02]'
                                        : 'bg-[#1A1F2C] hover:bg-[#242A3C] text-violet-200 border border-violet-300/20 hover:border-violet-300/40'
                                }`}
                            >
                                {role.ctaText} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── SECTION 5: FINAL CALL TO ACTION BANNER ─── */}
            <section
                ref={ctaRef}
                className={`py-20 px-6 reveal-on-scroll-scale ${
                    ctaVisible ? 'is-visible' : ''
                }`}
            >
                <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#171B26] via-[#1E2333] to-[#171B26] border border-violet-300/20 p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                            Ready to Experience Product Discovery?
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                            Start discovering products around you right now.
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed mb-8">
                            Whether you are looking for tech gear, fashion, home upgrades, or listing your shop inventory — join ViralForge today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                            <Link
                                to="/browse"
                                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-yellow-500/20 hover:scale-105"
                            >
                                <Play size={16} className="fill-slate-950" />
                                Open Video Discovery Feed
                            </Link>

                            <Link
                                to="/signup"
                                className="flex items-center justify-center gap-2 bg-[#141720] hover:bg-[#1E2333] text-violet-200 hover:text-white border border-violet-300/25 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                            >
                                Create Free Merchant Account
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-slate-800/80 bg-[#0A0C10] py-12 px-6 text-center">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs">
                            VF
                        </span>
                        <span className="text-lg font-black tracking-tight text-white">
                            VIRAL<span className="text-violet-300 font-light ml-0.5">FORGE</span>
                        </span>
                    </div>

                    <p className="text-slate-400 text-xs max-w-md">
                        Video-first, location-aware product discovery platform connecting local merchants, online creators, and customers.
                    </p>

                    <div className="flex gap-5 text-xs text-slate-400">
                        <Link to="/browse" className="hover:text-yellow-400 transition-colors">Feed</Link>
                        <Link to="/signin" className="hover:text-yellow-400 transition-colors">Sign In</Link>
                        <Link to="/signup" className="hover:text-yellow-400 transition-colors">Join</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
