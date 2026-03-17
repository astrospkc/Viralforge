import { useState, useRef } from 'react';
import {
    X, Upload, Video, Zap, ChevronRight, ChevronLeft,
    FileVideo, Sparkles, Tag, Link2, ShoppingBag,
    Megaphone, Check, Loader2, Info,
} from 'lucide-react';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type UploadType = 'video' | 'short' | null;
type ShortMode = 'normal' | 'ad' | null;
type Step = 1 | 2 | 3;

interface VideoMeta {
    title: string;
    description: string;
    category: string;
    tags: string;
    productUrl: string;
    quality: string;
}

interface NormalShortMeta {
    title: string;
    productName: string;
    productCategory: string;
    productUrl: string;
    shortDescription: string;
    tags: string;
}

interface AdShortMeta {
    brandName: string;
    targetAudience: string;
    callToAction: string;
    landingUrl: string;
    budget: string;
    aiTitle: string;
    aiHook: string;
    aiProductName: string;
}

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Optional: if a transcoded video is pre-selected (e.g. from TranscodingPage clip flow) */
    preselectedFile?: File | null;
    preselectedMode?: 'short';
}

/* ─────────────────────────────────────────
   FIELD COMPONENT
───────────────────────────────────────── */
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1.5 tracking-wide uppercase">{label}</label>
        {children}
        {hint && <p className="text-[10px] text-gray-600 mt-1">{hint}</p>}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-[#111] border border-white/8 focus:border-red-600/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className="w-full bg-[#111] border border-white/8 focus:border-red-600/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
    />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <select
        {...props}
        className="w-full bg-[#111] border border-white/8 focus:border-red-600/50 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none"
    />
);

/* ─────────────────────────────────────────
   FILE DROP ZONE
───────────────────────────────────────── */
const DropZone = ({ file, onFile, accept }: { file: File | null; onFile: (f: File) => void; accept: string }) => {
    const [drag, setDrag] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
    };

    if (file) {
        return (
            <div className="flex items-center gap-3 bg-[#111] border border-white/8 rounded-xl px-4 py-3">
                <FileVideo size={22} className="text-red-400 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}</p>
                </div>
                <button onClick={() => onFile(file)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-white/20 bg-[#111]'
                }`}
        >
            <input ref={inputRef} type="file" accept={accept} className="hidden"
                onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
            <Upload size={32} className={`mx-auto mb-3 ${drag ? 'text-red-400' : 'text-gray-600'}`} />
            <p className="text-sm font-semibold text-gray-300 mb-1">Drag & drop or <span className="text-red-400">browse</span></p>
            <p className="text-xs text-gray-600">Supports MP4, MOV, AVI, WEBM</p>
        </div>
    );
};

/* ─────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────── */
const ProgressBar = ({ step, total }: { step: number; total: number }) => (
    <div className="flex items-center gap-1.5 px-6 py-3 border-b border-white/5">
        {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-red-600' : 'bg-white/10'}`} />
        ))}
    </div>
);

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
const UploadModal = ({ isOpen, onClose, preselectedFile, preselectedMode }: UploadModalProps) => {
    const [step, setStep] = useState<Step>(preselectedMode ? 2 : 1);
    const [uploadType, setUploadType] = useState<UploadType>(preselectedMode ?? null);
    const [shortMode, setShortMode] = useState<ShortMode>(null);
    const [file, setFile] = useState<File | null>(preselectedFile ?? null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiDone, setAiDone] = useState(false);

    // Video metadata
    const [videoMeta, setVideoMeta] = useState<VideoMeta>({
        title: '', description: '', category: 'tech',
        tags: '', productUrl: '', quality: 'HD',
    });

    // Normal short metadata
    const [normalMeta, setNormalMeta] = useState<NormalShortMeta>({
        title: '', productName: '', productCategory: 'ecommerce',
        productUrl: '', shortDescription: '', tags: '',
    });

    // Ad short metadata
    const [adMeta, setAdMeta] = useState<AdShortMeta>({
        brandName: '', targetAudience: '', callToAction: 'Shop Now',
        landingUrl: '', budget: '', aiTitle: '', aiHook: '', aiProductName: '',
    });

    if (!isOpen) return null;

    const reset = () => {
        setStep(1); setUploadType(null); setShortMode(null);
        setFile(null); setAiDone(false); setAiLoading(false);
        setVideoMeta({ title: '', description: '', category: 'tech', tags: '', productUrl: '', quality: 'HD' });
        setNormalMeta({ title: '', productName: '', productCategory: 'ecommerce', productUrl: '', shortDescription: '', tags: '' });
        setAdMeta({ brandName: '', targetAudience: '', callToAction: 'Shop Now', landingUrl: '', budget: '', aiTitle: '', aiHook: '', aiProductName: '' });
    };

    const close = () => { reset(); onClose(); };

    /* Simulate AI fetching details from the video */
    const runAiFetch = async () => {
        setAiLoading(true); setAiDone(false);
        await new Promise(r => setTimeout(r, 2200));
        setAdMeta(prev => ({
            ...prev,
            aiTitle: 'Discover the Future of Smart Living',
            aiHook: 'See how this product changes everything in just 60 seconds.',
            aiProductName: file?.name.split('.')[0] ?? 'Your Product',
        }));
        setAiLoading(false); setAiDone(true);
    };

    const canProceed = (() => {
        if (step === 1) return !!uploadType && (uploadType === 'short' ? !!shortMode : true);
        if (step === 2) return !!file;
        return true;
    })();

    /* ─── STEP 1: Choose type ─── */
    const Step1 = () => (
        <div className="space-y-6 p-6">
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">What are you uploading?</p>
                <div className="grid grid-cols-2 gap-3">
                    {/* Video */}
                    <button
                        onClick={() => { setUploadType('video'); setShortMode(null); }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${uploadType === 'video'
                                ? 'border-red-600 bg-red-600/8'
                                : 'border-white/8 hover:border-white/20 bg-[#111]'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${uploadType === 'video' ? 'bg-red-600/20' : 'bg-white/5'}`}>
                            <Video size={22} className={uploadType === 'video' ? 'text-red-400' : 'text-gray-500'} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-white">Video</p>
                            <p className="text-xs text-gray-500 mt-0.5">Full proofs, demos, case studies</p>
                        </div>
                    </button>

                    {/* Short */}
                    <button
                        onClick={() => setUploadType('short')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${uploadType === 'short'
                                ? 'border-rose-500 bg-rose-600/8'
                                : 'border-white/8 hover:border-white/20 bg-[#111]'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${uploadType === 'short' ? 'bg-rose-600/20' : 'bg-white/5'}`}>
                            <Zap size={22} className={uploadType === 'short' ? 'text-rose-400' : 'text-gray-500'} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-white">Short</p>
                            <p className="text-xs text-gray-500 mt-0.5">60s clips for discovery feed</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Short sub-type */}
            {uploadType === 'short' && (
                <div className="animate-fadeIn">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Short type</p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Normal */}
                        <button
                            onClick={() => setShortMode('normal')}
                            className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all ${shortMode === 'normal' ? 'border-rose-500 bg-rose-600/8' : 'border-white/8 hover:border-white/15 bg-[#111]'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Tag size={15} className={shortMode === 'normal' ? 'text-rose-400' : 'text-gray-500'} />
                                <span className="text-sm font-bold text-white">Normal Short</span>
                                {shortMode === 'normal' && <Check size={13} className="text-rose-400 ml-auto" />}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Showcase a product or service with a short description and info.
                            </p>
                        </button>

                        {/* Ad */}
                        <button
                            onClick={() => setShortMode('ad')}
                            className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all ${shortMode === 'ad' ? 'border-amber-500 bg-amber-600/5' : 'border-white/8 hover:border-white/15 bg-[#111]'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Megaphone size={15} className={shortMode === 'ad' ? 'text-amber-400' : 'text-gray-500'} />
                                <span className="text-sm font-bold text-white">Ad Short</span>
                                {shortMode === 'ad' && <Check size={13} className="text-amber-400 ml-auto" />}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Promotional ad. AI automatically extracts product details from your video.
                            </p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    /* ─── STEP 2: File + Metadata ─── */
    const Step2 = () => {
        /* ── VIDEO form ── */
        if (uploadType === 'video') return (
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <Field label="Video File">
                    <DropZone file={file} onFile={setFile} accept="video/*" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Title" hint="Describe your work concisely">
                        <Input placeholder="e.g. SaaS Dashboard Rebuild" value={videoMeta.title}
                            onChange={e => setVideoMeta(p => ({ ...p, title: e.target.value }))} />
                    </Field>
                    <Field label="Category">
                        <Select value={videoMeta.category} onChange={e => setVideoMeta(p => ({ ...p, category: e.target.value }))}>
                            <option value="tech">Tech</option>
                            <option value="ecommerce">E-Commerce</option>
                            <option value="design">Design</option>
                            <option value="agency">Agency</option>
                            <option value="services">Services</option>
                            <option value="other">Other</option>
                        </Select>
                    </Field>
                </div>
                <Field label="Description" hint="What problem does this solve? What are the results?">
                    <Textarea rows={3} placeholder="Walk viewers through what you built, the challenge, and the outcome..."
                        value={videoMeta.description}
                        onChange={e => setVideoMeta(p => ({ ...p, description: e.target.value }))} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Tags" hint="Comma-separated">
                        <Input placeholder="React, SaaS, Figma…" value={videoMeta.tags}
                            onChange={e => setVideoMeta(p => ({ ...p, tags: e.target.value }))} />
                    </Field>
                    <Field label="Quality">
                        <Select value={videoMeta.quality} onChange={e => setVideoMeta(p => ({ ...p, quality: e.target.value }))}>
                            <option value="HD">HD (720p)</option>
                            <option value="FHD">FHD (1080p)</option>
                            <option value="4K">4K</option>
                        </Select>
                    </Field>
                </div>
                <Field label="Product / Service URL" hint="Optional link to your product or portfolio">
                    <div className="relative">
                        <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <Input className="pl-8" placeholder="https://yourproduct.com" value={videoMeta.productUrl}
                            onChange={e => setVideoMeta(p => ({ ...p, productUrl: e.target.value }))} />
                    </div>
                </Field>
            </div>
        );

        /* ── NORMAL SHORT form ── */
        if (uploadType === 'short' && shortMode === 'normal') return (
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <Field label="Short Video File (≤ 60s)">
                    <DropZone file={file} onFile={setFile} accept="video/*" />
                </Field>
                <Field label="Short Title">
                    <Input placeholder="e.g. Watch our product demo in 60s" value={normalMeta.title}
                        onChange={e => setNormalMeta(p => ({ ...p, title: e.target.value }))} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Product / Service Name">
                        <div className="relative">
                            <ShoppingBag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <Input className="pl-8" placeholder="Smart Home Hub" value={normalMeta.productName}
                                onChange={e => setNormalMeta(p => ({ ...p, productName: e.target.value }))} />
                        </div>
                    </Field>
                    <Field label="Product Category">
                        <Select value={normalMeta.productCategory} onChange={e => setNormalMeta(p => ({ ...p, productCategory: e.target.value }))}>
                            <option value="ecommerce">E-Commerce</option>
                            <option value="tech">Tech</option>
                            <option value="fashion">Fashion</option>
                            <option value="food">Food & Beverage</option>
                            <option value="health">Health & Beauty</option>
                            <option value="services">Services</option>
                            <option value="other">Other</option>
                        </Select>
                    </Field>
                </div>
                <Field label="Short Description" hint="What should viewers know about this product in one sentence?">
                    <Textarea rows={2} placeholder="Describe what makes this product unique or valuable…"
                        value={normalMeta.shortDescription}
                        onChange={e => setNormalMeta(p => ({ ...p, shortDescription: e.target.value }))} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Product Link">
                        <div className="relative">
                            <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <Input className="pl-8" placeholder="https://" value={normalMeta.productUrl}
                                onChange={e => setNormalMeta(p => ({ ...p, productUrl: e.target.value }))} />
                        </div>
                    </Field>
                    <Field label="Tags" hint="Comma-separated">
                        <Input placeholder="#Demo, #Product…" value={normalMeta.tags}
                            onChange={e => setNormalMeta(p => ({ ...p, tags: e.target.value }))} />
                    </Field>
                </div>
            </div>
        );

        /* ── AD SHORT form ── */
        if (uploadType === 'short' && shortMode === 'ad') return (
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <Field label="Short Ad Video (≤ 60s)">
                    <DropZone file={file} onFile={setFile} accept="video/*" />
                </Field>

                {/* AI Fetch button */}
                {file && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white mb-0.5">AI Product Extraction</p>
                                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                                    Let AI analyze your video to auto-fill the ad title, hook, and product name.
                                </p>
                                <button
                                    onClick={runAiFetch}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                >
                                    {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                    {aiLoading ? 'Analyzing video…' : 'Fetch with AI'}
                                </button>
                            </div>
                        </div>

                        {/* AI results */}
                        {aiDone && (
                            <div className="mt-4 pt-4 border-t border-amber-500/10 space-y-2">
                                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
                                    <Check size={12} /> AI-generated fields (editable)
                                </div>
                                <Input placeholder="AI Ad Title" value={adMeta.aiTitle}
                                    onChange={e => setAdMeta(p => ({ ...p, aiTitle: e.target.value }))} />
                                <Input placeholder="AI Hook / Tagline" value={adMeta.aiHook}
                                    onChange={e => setAdMeta(p => ({ ...p, aiHook: e.target.value }))} />
                                <Input placeholder="AI Product Name" value={adMeta.aiProductName}
                                    onChange={e => setAdMeta(p => ({ ...p, aiProductName: e.target.value }))} />
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Brand Name">
                        <Input placeholder="Your brand" value={adMeta.brandName}
                            onChange={e => setAdMeta(p => ({ ...p, brandName: e.target.value }))} />
                    </Field>
                    <Field label="Target Audience">
                        <Input placeholder="e.g. Founders 25–40" value={adMeta.targetAudience}
                            onChange={e => setAdMeta(p => ({ ...p, targetAudience: e.target.value }))} />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Call to Action">
                        <Select value={adMeta.callToAction} onChange={e => setAdMeta(p => ({ ...p, callToAction: e.target.value }))}>
                            <option>Shop Now</option>
                            <option>Learn More</option>
                            <option>Book a Demo</option>
                            <option>Get Started</option>
                            <option>Download Now</option>
                            <option>Sign Up Free</option>
                        </Select>
                    </Field>
                    <Field label="Ad Budget (USD/day)" hint="Optional">
                        <Input type="number" placeholder="50" value={adMeta.budget}
                            onChange={e => setAdMeta(p => ({ ...p, budget: e.target.value }))} />
                    </Field>
                </div>

                <Field label="Landing Page URL">
                    <div className="relative">
                        <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <Input className="pl-8" placeholder="https://yourproduct.com/ad"
                            value={adMeta.landingUrl}
                            onChange={e => setAdMeta(p => ({ ...p, landingUrl: e.target.value }))} />
                    </div>
                </Field>

                <div className="flex items-start gap-2 bg-white/3 border border-white/5 rounded-lg p-3">
                    <Info size={13} className="text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Ad shorts are shown in the discovery feed with a sponsored label. Billing is handled separately.
                    </p>
                </div>
            </div>
        );

        return null;
    };

    /* ─── STEP 3: Confirm ─── */
    const Step3 = () => {
        const isAdShort = uploadType === 'short' && shortMode === 'ad';
        const isNormalShort = uploadType === 'short' && shortMode === 'normal';
        const type = isAdShort ? 'Ad Short' : isNormalShort ? 'Normal Short' : 'Video';
        const title = uploadType === 'video' ? videoMeta.title : isNormalShort ? normalMeta.title : adMeta.aiTitle || adMeta.brandName;

        return (
            <div className="p-6 space-y-5">
                <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-5 flex items-start gap-3">
                    <Check size={18} className="text-green-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-white mb-0.5">Ready to publish</p>
                        <p className="text-xs text-gray-400">Review the summary and hit Publish.</p>
                    </div>
                </div>

                {/* Summary card */}
                <div className="bg-[#111] border border-white/8 rounded-xl p-4 space-y-3 text-sm">
                    <Row label="Type" value={<span className="text-red-400 font-bold">{type}</span>} />
                    <Row label="File" value={file?.name ?? '—'} />
                    <Row label="Title" value={title || '—'} />
                    {uploadType === 'video' && <>
                        <Row label="Category" value={videoMeta.category} />
                        <Row label="Quality" value={videoMeta.quality} />
                        {videoMeta.tags && <Row label="Tags" value={videoMeta.tags} />}
                        {videoMeta.productUrl && <Row label="Product URL" value={videoMeta.productUrl} />}
                    </>}
                    {isNormalShort && <>
                        <Row label="Product" value={normalMeta.productName} />
                        <Row label="Category" value={normalMeta.productCategory} />
                        {normalMeta.productUrl && <Row label="Product URL" value={normalMeta.productUrl} />}
                    </>}
                    {isAdShort && <>
                        <Row label="Brand" value={adMeta.brandName} />
                        <Row label="CTA" value={adMeta.callToAction} />
                        <Row label="Audience" value={adMeta.targetAudience || '—'} />
                        <Row label="AI Hook" value={adMeta.aiHook || '—'} />
                    </>}
                </div>
            </div>
        );
    };

    const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex items-start gap-3">
            <span className="text-gray-500 text-xs w-24 shrink-0 pt-0.5">{label}</span>
            <span className="text-gray-200 text-xs font-medium break-all">{value}</span>
        </div>
    );

    const titles: Record<Step, string> = {
        1: 'Create Upload',
        2: uploadType === 'video' ? 'Video Details'
            : shortMode === 'normal' ? 'Normal Short Details'
                : 'Ad Short Details',
        3: 'Review & Publish',
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-xl bg-[#181818] rounded-2xl border border-white/8 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div>
                        <h2 className="text-base font-black text-white">{titles[step]}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Step {step} of 3</p>
                    </div>
                    <button onClick={close} className="text-gray-500 hover:text-white transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                <ProgressBar step={step} total={3} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {step === 1 && <Step1 />}
                    {step === 2 && <Step2 />}
                    {step === 3 && <Step3 />}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5 bg-[#141414]">
                    <button
                        onClick={() => { if (step === 1) close(); else setStep(s => (s - 1) as Step); }}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button
                            disabled={!canProceed}
                            onClick={() => setStep(s => (s + 1) as Step)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={close}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                        >
                            <Check size={15} /> Publish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
