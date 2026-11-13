import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Store, MapPin, Navigation, ChevronDown, ChevronUp, ShoppingBag, PhoneCall, Loader2 } from "lucide-react";
import ReviewThread from "./ReviewThread";
import CustomVideoPlayer from "./CustomVideoPlayer";
import MerchantShopService from "../services/merchant_shop_service";
import type { VideoPost, NearbyShopResult } from "../../types";

/* ─────────────────────────────────────────────────────────────
   VideoModal — centred, proportional overlay (not full-page)
───────────────────────────────────────────────────────────── */
interface VideoModalProps {
    post: VideoPost;
    token: string;
    onClose: () => void;
}

const VideoModal = ({ post, token, onClose }: VideoModalProps) => {
    const [visible, setVisible] = useState(false);
    const [relatedShops, setRelatedShops] = useState<NearbyShopResult[]>([]);
    const [showRelatedShops, setShowRelatedShops] = useState(false);
    const [loadingRelatedShops, setLoadingRelatedShops] = useState(false);

    /* Fetch related shops if video has a product */
    useEffect(() => {
        let isMounted = true;
        const fetchRelated = async () => {
            try {
                if (post.id) {
                    setLoadingRelatedShops(true);
                    const res = await MerchantShopService.getRelatedShopsForVideo(post.id);
                    if (isMounted && res?.success && Array.isArray(res.data)) {
                        setRelatedShops(res.data);
                    }
                }
            } catch (err) {
                console.warn("Could not fetch related shops for video:", err);
            } finally {
                if (isMounted) setLoadingRelatedShops(false);
            }
        };
        fetchRelated();
        return () => { isMounted = false; };
    }, [post.id]);

    /* Animate in */
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    /* Lock body scroll */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    /* Keyboard: Esc to close */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const modal = (
        /* ── Backdrop ── */
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            style={{
                background: visible ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0)",
                backdropFilter: visible ? "blur(6px)" : "none",
                transition: "background 0.3s ease, backdrop-filter 0.3s ease",
            }}
            onClick={handleClose}
        >
            {/* ── Modal card ── */}
            <div
                className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style={{
                    width: "min(860px, 95vw)",
                    maxHeight: "88vh",
                    background: "#141414",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
                    opacity: visible ? 1 : 0,
                    transition: "transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.32s ease",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Close button ── */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 border border-white/10 text-white transition-all duration-200 hover:rotate-90 hover:scale-110 hover:border-transparent"
                    title="Close (Esc)"
                >
                    <X size={17} />
                </button>

                {/* ── Video player area ── */}
                <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                    <CustomVideoPlayer src={post.masterCdnUrl} autoPlay />
                    {/* Quality badge */}
                    {post.qualities?.[0]?.quality && (
                        <span className="absolute top-3 left-3 bg-black/70 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-bold backdrop-blur-sm pointer-events-none z-10">
                            {post.qualities[0].quality}
                        </span>
                    )}
                </div>

                {/* ── Meta + Reviews section (scrollable) ── */}
                <div
                    className="flex flex-col overflow-y-auto"
                    style={{ maxHeight: "calc(88vh - (95vw * 9/16))", scrollbarWidth: "thin" }}
                >
                    {/* Post meta */}
                    <div className="px-5 pt-4 pb-3">
                        {/* Author row */}
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={post.userAvatar}
                                alt={post.userName}
                                className="w-9 h-9 rounded-full border border-white/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-white truncate">{post.userName}</span>
                                    {post.userVerified && (
                                        <CheckCircle size={13} className="text-red-400 fill-red-400 shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                    <span>{post.time}</span>
                                    <span>·</span>
                                    <span className="capitalize">{post.category}</span>
                                    {post.duration && (
                                        <>
                                            <span>·</span>
                                            <span className="font-mono">{post.duration}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 shrink-0">{post.views} views</div>
                        </div>

                        {/* Title & description */}
                        <h2 className="text-sm font-extrabold text-white leading-snug mb-1">{post.title}</h2>
                        <p className="text-gray-400 text-xs leading-relaxed">{post.description}</p>

                        {/* ── Merchant, Shop & Product Rich Bottom Sheet (Flow 4) ── */}
                        {(post.shop || post.product || post.shop_listing || post.merchant) && (
                            <div className="mt-4 p-4 rounded-xl bg-[#1c1f2b] border border-violet-300/20 shadow-lg">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                                                <ShoppingBag size={12} />
                                                {post.product?.name || post.title}
                                            </span>
                                            {post.shop_listing?.availability && (
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        post.shop_listing.availability === 'AVAILABLE'
                                                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                                            : post.shop_listing.availability === 'OUT_OF_STOCK'
                                                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                                            : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                                    }`}
                                                >
                                                    {post.shop_listing.availability === 'AVAILABLE'
                                                        ? 'In Stock'
                                                        : post.shop_listing.availability === 'OUT_OF_STOCK'
                                                        ? 'Out of Stock'
                                                        : 'Check Availability'}
                                                </span>
                                            )}
                                        </div>
                                        {post.product?.brand && (
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Brand: <span className="text-white font-medium">{post.product.brand}</span>
                                            </p>
                                        )}
                                    </div>

                                    {post.shop_listing?.price !== undefined && (
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 block text-left sm:text-right">Shop Price</span>
                                            <span className="text-lg font-black text-yellow-400">
                                                {post.shop_listing.currency === 'INR' ? '₹' : (post.shop_listing.currency || '$')}
                                                {Number(post.shop_listing.price).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Shop Details & Direction Action */}
                                {post.shop && (
                                    <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                        <div className="flex items-start gap-2 text-slate-300">
                                            <Store size={15} className="text-violet-300 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold text-white block">
                                                    {post.shop.name}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {post.shop.address}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            {post.shop.latitude && post.shop.longitude && (
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${post.shop.latitude},${post.shop.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                                                >
                                                    <Navigation size={12} /> Get Directions
                                                </a>
                                            )}
                                            {post.shop.phone && (
                                                <a
                                                    href={`tel:${post.shop.phone}`}
                                                    className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                                                >
                                                    <PhoneCall size={12} /> Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Related Shops Accordion (Flow 4: Other Shops Selling This) ── */}
                        {relatedShops.length > 0 && (
                            <div className="mt-3 rounded-xl border border-slate-800 bg-[#161822] overflow-hidden">
                                <button
                                    onClick={() => setShowRelatedShops(!showRelatedShops)}
                                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-[#1a1e2c] transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-2">
                                        <Store size={14} className="text-yellow-400" />
                                        Other Nearby Shops Selling This ({relatedShops.length})
                                        {loadingRelatedShops && <Loader2 size={12} className="animate-spin text-slate-400" />}
                                    </span>
                                    {showRelatedShops ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {showRelatedShops && (
                                    <div className="p-3 border-t border-slate-800 space-y-2 bg-[#12141d]">
                                        {relatedShops.map((s, idx) => (
                                            <div
                                                key={s.id || s.shop_id || idx}
                                                className="p-2.5 rounded-lg bg-[#181a24] border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                                            >
                                                <div>
                                                    <span className="font-bold text-white block">
                                                        {s.name || s.shop_name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} className="text-violet-300" />
                                                        {s.address} {s.distance_meters ? `(${Math.round(s.distance_meters)}m away)` : ''}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {s.price !== undefined && (
                                                        <span className="font-bold text-yellow-400">
                                                            ₹{Number(s.price).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {s.latitude && s.longitude && (
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                                            title="Navigate to shop"
                                                        >
                                                            <Navigation size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {post.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="bg-white/5 border border-white/8 text-gray-400 text-xs px-2 py-0.5 rounded-full"
                                    >
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="mx-5 border-t border-white/5" />

                    {/* ── Collapsible Reviews ── */}
                    <div className="px-5 pb-5">
                        {/* ReviewThread already has its own collapsible toggle */}
                        <ReviewThread videoId={post.id} token={token} />
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default VideoModal;
