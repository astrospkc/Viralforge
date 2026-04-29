import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle } from "lucide-react";
import ReviewThread from "./ReviewThread";
import CustomVideoPlayer from "./CustomVideoPlayer";
import type { VideoPost } from "../../types";

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
