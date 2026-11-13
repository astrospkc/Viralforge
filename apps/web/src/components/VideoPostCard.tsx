import { Bookmark, CheckCircle, Heart, MessageCircle, MoreHorizontal, Play, Share2, MapPin, ShoppingBag } from "lucide-react";
import ReviewThread from "./ReviewThread";
//import { CommentService } from "../services/comment_service";
import { useAuthStore } from "../store/auth_store";
//import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { VideoPost, LocationData } from "../../types";
import VideoModal from "./VideoModal";

const VideoPostCard = ({
    post,
    currentUserName,
    onSelectLocation,
}: {
    post: VideoPost;
    currentUserName: string;
    onSelectLocation?: (location: LocationData) => void;
}) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(typeof post.likes === 'number' ? post.likes : 0);
    const [saved, setSaved] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const token = useAuthStore((state) => state.token);
    const toggleLike = () => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); };
    const fmtLikes = (n: number) => {
        const num = Number(n) || 0;
        return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num);
    };

    const authorName = post.userName || currentUserName || 'Creator';
    const authorAvatar = post.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
    const thumbnail = post.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop';
    const quality = post?.qualities?.[0]?.quality || '1080p';
    const duration = post.duration || '2:30';
    const views = post.views || '1.2K';
    const reviewCount = Array.isArray(post.reviews) ? post.reviews.length : 0;

    return (
        <article className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 group">
            {/* ── Author bar ── */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-9 h-9 rounded-full border border-white/10 object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                    }}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{authorName}</span>
                        {post.userVerified && <CheckCircle size={13} className="text-red-400 fill-red-400 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs flex-wrap">
                        <span>{post.time || 'recently'}</span>
                        <span>·</span>
                        <span className="capitalize">{post.category || 'proof'}</span>
                        {post.location && (
                            <>
                                <span>·</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectLocation?.(post.location!);
                                    }}
                                    className="inline-flex items-center gap-0.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-1.5 py-0.5 rounded border border-white/5 transition-colors"
                                    title={`Filter by ${post.location.city}`}
                                >
                                    <MapPin size={10} className="text-red-500" />
                                    <span>{post.location.city}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <button className="text-gray-600 hover:text-gray-300 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* ── Title & Description ── */}
            <div className="px-4 mb-2">
                <h2 className="text-base font-bold text-white mb-1 leading-snug">{post.title || 'Product Proof Demonstration'}</h2>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{post.description || ''}</p>
            </div>

            {/* ── Product & Shop Card Pill ── */}
            {(post.product || post.shop || post.shop_listing) && (
                <div className="mx-4 mb-3 p-2.5 rounded-xl bg-[#141722] border border-violet-300/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                        <ShoppingBag size={14} className="text-yellow-400 shrink-0" />
                        <span className="font-semibold text-white truncate">
                            {post.product?.name || post.shop?.name || 'Verified Product'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {post.shop_listing?.price !== undefined && (
                            <span className="font-bold text-yellow-400">
                                {post.shop_listing.currency === 'INR' ? '₹' : (post.shop_listing.currency || '$')}
                                {Number(post.shop_listing.price).toLocaleString()}
                            </span>
                        )}
                        {post.shop_listing?.availability && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                post.shop_listing.availability === 'AVAILABLE'
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-red-500/10 text-red-400'
                            }`}>
                                {post.shop_listing.availability === 'AVAILABLE' ? 'In Stock' : 'Out'}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Tags ── */}
            <div className="px-4 mb-3 flex flex-wrap gap-1.5">
                {Array.isArray(post.tags) && post.tags.map(t => (
                    <span key={t} className="bg-white/5 border border-white/8 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        #{t}
                    </span>
                ))}
            </div>

            {/* ── Thumbnail / Player ── */}
            <div className="relative aspect-video overflow-hidden cursor-pointer bg-black/40" onClick={() => setModalOpen(true)}>
                <img
                    src={thumbnail}
                    alt={post.title || 'Video Proof'}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    style={{ filter: 'brightness(0.85)' }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop';
                    }}
                />
                {/* Quality badge */}
                <span className="absolute top-3 left-3 bg-black/70 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                    {quality}
                </span>
                {/* Duration */}
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                    {duration}
                </span>
                {/* Views */}
                <span className="absolute bottom-3 left-3 text-gray-300 text-xs font-medium">
                    {views} views
                </span>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/40 hover:scale-110 hover:bg-red-500 transition-all duration-300">
                        <Play size={28} className="fill-white text-white ml-1" />
                    </div>
                </div>
            </div>

            {/* ── Engagement Bar ── */}
            <div className="px-4 py-3 flex items-center gap-5 border-b border-white/5">
                {/* Like */}
                <button onClick={toggleLike} className="flex items-center gap-1.5 group/like">
                    <Heart size={17} className={`transition-all ${liked ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500 group-hover/like:text-red-400'}`} />
                    <span className={`text-xs font-semibold transition-colors ${liked ? 'text-red-400' : 'text-gray-500'}`}>{fmtLikes(likes)}</span>
                </button>

                {/* Reviews count */}
                <div className="flex items-center gap-1.5 text-gray-500">
                    <MessageCircle size={17} />
                    <span className="text-xs font-semibold">{reviewCount} reviews</span>
                </div>

                {/* Share */}
                <div className="relative">
                    <button
                        onClick={() => setShowShare(s => !s)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 transition-colors"
                    >
                        <Share2 size={17} />
                        <span className="text-xs font-semibold">Share</span>
                    </button>
                    {showShare && (
                        <div className="absolute bottom-8 left-0 bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 shadow-xl whitespace-nowrap z-10">
                            <p className="text-xs font-bold text-white mb-2">Share this video</p>
                            {['Copy link', 'Twitter / X', 'LinkedIn'].map(opt => (
                                <button key={opt} onClick={() => setShowShare(false)}
                                    className="block text-xs text-gray-400 hover:text-white py-1 transition-colors w-full text-left">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bookmark */}
                <button onClick={() => setSaved(s => !s)} className="ml-auto">
                    <Bookmark size={17} className={saved ? 'text-red-400 fill-red-400' : 'text-gray-500 hover:text-gray-300 transition-colors'} />
                </button>
            </div>

            {/* ── Reviews Section ── */}
            <div className="px-4 pb-4">
                <ReviewThread videoId={post.id} token={token} />
            </div>

            {/* ── Video Modal ── */}
            {modalOpen && (
                <VideoModal
                    post={post}
                    token={token}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </article>
    );
};

export default VideoPostCard;