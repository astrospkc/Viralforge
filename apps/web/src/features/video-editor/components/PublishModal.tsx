import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { useAuthStore } from '../../../store/auth_store.ts';
import { PublishService } from '../services/publishService.ts';
import { formatTimeMs } from '../utils/time.ts';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Store, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose }) => {
    const { project, localBlobUrl } = useEditorStore();
    const { token, isAuthenticated } = useAuthStore();

    const [isPublishing, setIsPublishing] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishedVideoId, setPublishedVideoId] = useState<number | string | null>(null);

    // Optional merchant entity links
    const [merchantShopId, setMerchantShopId] = useState('');
    const [productId, setProductId] = useState('');

    if (!isOpen || !project) return null;

    const videoClip = project.tracks.find(t => t.type === 'video')?.clips[0];
    const sourceStartMs = videoClip ? videoClip.sourceStartMs : 0;
    const sourceEndMs = videoClip ? videoClip.sourceEndMs : project.source.durationMs;
    const finalDurationMs = sourceEndMs - sourceStartMs;

    const handlePublish = async () => {
        if (!isAuthenticated || !token) {
            toast.error('Please sign in to publish video reels.');
            return;
        }

        setIsPublishing(true);
        setProgressPercent(5);
        setStatusMessage('Preparing video asset and editing instructions...');

        try {
            // Fetch blob from ephemeral preview URL to create raw file for S3 upload
            const response = await fetch(localBlobUrl!);
            const blob = await response.blob();
            const file = new File([blob], project.source.fileName || 'viralforge_reel.mp4', {
                type: project.source.mimeType || 'video/mp4',
            });

            const entityLinks = (merchantShopId || productId) ? {
                shop_id: merchantShopId ? parseInt(merchantShopId, 10) : undefined,
                product_id: productId ? parseInt(productId, 10) : undefined,
            } : undefined;

            const res = await PublishService.publishProject(
                file,
                project,
                token,
                (_phase, percent, msg) => {
                    setProgressPercent(percent);
                    setStatusMessage(msg);
                },
                entityLinks
            );

            if (res.success && res.videoId) {
                setPublishSuccess(true);
                setPublishedVideoId(res.videoId);
                toast.success('Reel published & rendering on server!');
            } else {
                toast.error(res.message);
                setStatusMessage(`Error: ${res.message}`);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Publish failed';
            toast.error(msg);
            setStatusMessage(`Error: ${msg}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Dialog */}
            <div className="relative z-10 w-full max-w-lg bg-[#12141D] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-400" />
                        <h2 className="text-base font-black text-white">Publish Video Reel</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                {publishSuccess ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto shadow-lg shadow-green-500/10">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Published Successfully!</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                Video ID <span className="text-yellow-400 font-mono font-bold">#{publishedVideoId}</span> has been queued for production FFmpeg rendering on the backend.
                            </p>
                        </div>
                        <div className="pt-2 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-yellow-500/20"
                            >
                                Back to Editor
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        {/* Summary Details */}
                        <div className="p-3.5 rounded-2xl bg-[#161824] border border-slate-800 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Reel Title:</span>
                                <span className="font-bold text-white truncate max-w-[200px]">{project.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Trimmed Duration:</span>
                                <span className="font-mono font-bold text-yellow-400">{formatTimeMs(finalDurationMs, true)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Canvas Aspect Ratio:</span>
                                <span className="font-bold text-violet-300 uppercase">{project.transform.aspectRatio}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Text Overlays:</span>
                                <span className="font-bold text-slate-200">{project.textOverlays.length} attached</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Audio:</span>
                                <span className="text-slate-200">{project.audio.originalMuted ? 'Muted' : `Volume ${Math.round(project.audio.originalVolume * 100)}%`}</span>
                            </div>
                        </div>

                        {/* Optional Merchant Entity Linking */}
                        <div className="space-y-2 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Optional Merchant Attribution
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-[#181B26] border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                                    <Store size={13} className="text-yellow-400 shrink-0" />
                                    <input
                                        type="number"
                                        placeholder="Shop ID (opt)"
                                        value={merchantShopId}
                                        onChange={(e) => setMerchantShopId(e.target.value)}
                                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#181B26] border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                                    <ShoppingBag size={13} className="text-violet-300 shrink-0" />
                                    <input
                                        type="number"
                                        placeholder="Product ID (opt)"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar (during upload) */}
                        {isPublishing && (
                            <div className="space-y-1.5 pt-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                                        <Loader2 size={12} className="animate-spin text-yellow-400" />
                                        {statusMessage}
                                    </span>
                                    <span className="font-mono text-yellow-400 font-bold">{progressPercent}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>You are currently not signed in. Please sign in to publish.</span>
                            </div>
                        )}

                        {/* Footer Action */}
                        <div className="pt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isPublishing}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={isPublishing || !isAuthenticated}
                                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md shadow-yellow-500/20 transition cursor-pointer"
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={13} />
                                        Confirm & Publish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
