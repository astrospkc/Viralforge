import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { useAuthStore } from '../store/auth_store';
import type { VideoPost, Review } from '../../types';
import {
    Heart, MessageCircle, Share2, Star, Upload,
    ThumbsUp, MoreHorizontal, Play, Bookmark,
    ChevronDown, ChevronUp, X, Send, Search,
    Flame, Clock, Layers, ShoppingBag, Code2,
    Paintbrush, Briefcase, Zap, CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoService } from '../services/video_service';
import { useInfiniteQuery } from '@tanstack/react-query';


const CATEGORIES = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
    { id: 'tech', label: 'Tech', icon: Code2 },
    { id: 'design', label: 'Design', icon: Paintbrush },
    { id: 'agency', label: 'Agency', icon: Briefcase },
    { id: 'shorts', label: 'Shorts', icon: Zap },
    { id: 'recent', label: 'Recent', icon: Clock },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];


const Misc_Thumbnails = ['https://picsum.photos/seed/101/800/450']





/* ─────────────────────────────────────────
   Star Rating
───────────────────────────────────────── */
const StarRating = ({ value, size = 13 }: { value: number; size?: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={size} className={s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />
        ))}
    </div>
);

/* ─────────────────────────────────────────
   Interactive Star Picker
───────────────────────────────────────── */
const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onChange(s)}>
                    <Star size={18} className={(hover || value) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                </button>
            ))}
        </div>
    );
};

/* ─────────────────────────────────────────
   Review thread (collapsible)
───────────────────────────────────────── */
const ReviewThread = ({ videoId: _videoId, reviews: initialReviews, userName }:
    { videoId: number; reviews: Review[]; userName: string }) => {
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState(initialReviews);
    const [helpful, setHelpful] = useState<Record<number, boolean>>({});
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const commentRef = useRef<HTMLTextAreaElement>(null);

    const avgRating = reviews?.length ? Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;

    const submitReview = () => {
        if (!newRating || !newComment.trim()) return;
        const r: Review = {
            id: Date.now(), userId: 99, userName, avatar: 'https://i.pravatar.cc/36?img=33',
            rating: newRating, comment: newComment.trim(), helpful: 0, time: 'just now',
        };
        setReviews(prev => [r, ...prev]);
        setNewRating(0);
        setNewComment('');
    };

    const toggleHelpful = (id: number) => {
        setHelpful(p => ({ ...p, [id]: !p[id] }));
        setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: helpful[id] ? r.helpful - 1 : r.helpful + 1 } : r));
    };

    return (
        <div className="border-t border-white/5 mt-4 pt-3 ">
            {/* Toggle header */}
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 group">
                <div className="flex items-center gap-2 flex-1">
                    <MessageCircle size={14} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                        {reviews?.length} Review{reviews?.length !== 1 ? 's' : ''}
                    </span>
                    {reviews?.length > 0 && (
                        <span className="flex items-center gap-1">
                            <StarRating value={avgRating} size={11} />
                            <span className="text-gray-600 text-xs">{avgRating}.0</span>
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={14} className="text-gray-600" /> : <ChevronDown size={14} className="text-gray-600" />}
            </button>

            {open && (
                <div className="mt-4 space-y-4">
                    {/* Write a review */}
                    <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5">
                        <p className="text-xs font-bold text-white mb-3">Write a Review</p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Your rating:</span>
                            <StarPicker value={newRating} onChange={setNewRating} />
                        </div>
                        <textarea
                            ref={commentRef}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Share your honest experience with this product or service..."
                            rows={2}
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-red-600/50 transition-colors"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={submitReview}
                                disabled={!newRating || !newComment.trim()}
                                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                            >
                                <Send size={12} /> Submit Review
                            </button>
                        </div>
                    </div>

                    {/* Existing reviews */}
                    {reviews.map(r => (
                        <div key={r.id} className="flex gap-3">
                            <img src={r.avatar} alt={r.userName} className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-bold text-white">{r.userName}</span>
                                    <StarRating value={r.rating} size={11} />
                                    <span className="text-gray-600 text-[10px] ml-auto">{r.time}</span>
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed mb-2">"{r.comment}"</p>
                                <button
                                    onClick={() => toggleHelpful(r.id)}
                                    className="flex items-center gap-1 group"
                                >
                                    <ThumbsUp size={12} className={helpful[r.id] ? 'text-blue-400 fill-blue-400' : 'text-gray-600 group-hover:text-blue-400 transition-colors'} />
                                    <span className={`text-[10px] transition-colors ${helpful[r.id] ? 'text-blue-400' : 'text-gray-600'}`}>
                                        {r.helpful} helpful
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────
   Video Post Card
───────────────────────────────────────── */
const VideoPostCard = ({ post, currentUserName }: { post: VideoPost; currentUserName: string }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);
    const [saved, setSaved] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const toggleLike = () => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); };
    const fmtLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    return (
        <article className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 group">
            {/* ── Author bar ── */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <img src={post.userAvatar} alt={post.userName} className="w-9 h-9 rounded-full border border-white/10" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{post.userName}</span>
                        {post.userVerified && <CheckCircle size={13} className="text-red-400 fill-red-400 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <span>{post.time}</span>
                        <span>·</span>
                        <span className="capitalize">{post.category}</span>
                    </div>
                </div>
                <button className="text-gray-600 hover:text-gray-300 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* ── Title & Description ── */}
            <div className="px-4 mb-3">
                <h2 className="text-base font-bold text-white mb-1 leading-snug">{post.title}</h2>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{post.description}</p>
            </div>

            {/* ── Tags ── */}
            <div className="px-4 mb-3 flex flex-wrap gap-1.5">
                {post.tags && post.tags.map(t => (
                    <span key={t} className="bg-white/5 border border-white/8 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        #{t}
                    </span>
                ))}
            </div>

            {/* ── Thumbnail / Player ── */}
            <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => setPlaying(true)}>
                <img
                    src={post?.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    style={{ filter: playing ? 'brightness(0.2)' : 'brightness(0.85)' }}
                />
                {/* Quality badge */}
                <span className="absolute top-3 left-3 bg-black/70 border border-white/20 text-white text-xs px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                    {post?.qualities?.[0]?.quality}
                </span>
                {/* Duration */}
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                    {post.duration}
                </span>
                {/* Views */}
                <span className="absolute bottom-3 left-3 text-gray-300 text-xs font-medium">
                    {post.views} views
                </span>
                {/* Play overlay */}
                {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl shadow-red-900/50 hover:scale-110 transition-transform">
                            <Play size={24} className="fill-white text-white ml-1" />
                        </div>
                    </div>
                )}
                {playing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                            <Play size={24} className="fill-white ml-1" />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">Playing via HLS stream…</p>
                        <button onClick={e => { e.stopPropagation(); setPlaying(false); }} className="text-gray-500 hover:text-white text-xs flex items-center gap-1 transition-colors">
                            <X size={12} /> Close
                        </button>
                    </div>
                )}
            </div>

            {/* ── Engagement Bar ── */}
            <div className="px-4 py-3 flex items-center gap-5 border-b border-white/5">
                {/* Like */}
                <button onClick={toggleLike} className="flex items-center gap-1.5 group/like">
                    <Heart size={17} className={`transition-all ${liked ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500 group-hover/like:text-red-400'}`} />
                    <span className={`text-xs font-semibold transition-colors ${liked ? 'text-red-400' : 'text-gray-500'}`}>{fmtLikes(likes)}</span>
                </button>

                {/* Reviews count (opens on click to section below) */}
                <div className="flex items-center gap-1.5 text-gray-500">
                    <MessageCircle size={17} />
                    <span className="text-xs font-semibold">{post.reviews?.length} reviews</span>
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
                <ReviewThread videoId={post.id} reviews={post.reviews} userName={currentUserName} />
            </div>
        </article>
    );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const MainPage = () => {
    const { user } = useAuthStore();
    const currentUserName = user?.name ?? 'You';

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [feeds, setFeeds] = useState<VideoPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuthStore()


    const fetchFeeds = async ({ pageParam = "" }) => {
        try {
            const response = await VideoService.GetAllFeeds(pageParam, 10, token);
            if (response) {
                setFeeds(response);
            }
        } catch (error) {
            console.error("error in getting all posts: ", error)
        }
    }

    const { data: feedsData, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["feeds"],
        queryFn: fetchFeeds,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
    })

    console.log("feedsData: ", feedsData)
    console.log('feeds: ', feeds)
    // console.log("posts: ", POSTS)



    /* Filter logic */
    const filtered = feeds.filter(p => {
        const matchesCat = activeCategory === 'all' || activeCategory === 'trending' || activeCategory === 'recent' || p.category === activeCategory;
        const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
    });
    console.log("filtered: ", filtered)

    // const filtered = feedsData?.pages.flatMap(page => page.VideoFiles) || [];

    return (
        <div className="min-h-screen text-white font-sans antialiased " style={{ background: '#111111' }}>
            <Navbar />

            {/* ══════════════════════════════════════════
                PAGE HEADER — title + search + upload
            ══════════════════════════════════════════ */}
            <div className="sticky top-[64px] z-40 border-b border-white/5 backdrop-blur-xl "
                style={{ background: 'rgba(17,17,17,0.92)' }}>
                <div className="max-w-full mx-auto px-4 md:px-6 py-3 flex flex-col gap-3 ">
                    {/* Top row: title + upload */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-black text-white tracking-tight">Discover</h1>
                            <p className="text-gray-500 text-xs">Proof-based videos from creators worldwide</p>
                        </div>
                        <Link to="/transcode">
                            <button
                                // onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-900/40"
                            >
                                <Upload size={15} /> Upload Video
                            </button>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search videos, tags, categories…"
                            className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-colors"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                        {CATEGORIES.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveCategory(id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${activeCategory === id
                                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                <Icon size={12} /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                FEED
            ══════════════════════════════════════════ */}
            <div className="max-w-full mx-auto px-4 md:px-6 py-8">
                {/* Stats strip */}
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5 ">
                    {[
                        { value: `${feeds?.length}`, label: 'Videos' },
                        { value: `${feeds?.reduce((a, p) => a + p.reviews?.length, 0)}`, label: 'Reviews' },
                        { value: '6', label: 'Creators' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="text-xl font-black text-white">{s.value}</div>
                            <div className="text-gray-600 text-xs">{s.label}</div>
                        </div>
                    ))}
                    <div className="ml-auto text-xs text-gray-600">
                        Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Video feed — 2-col on desktop, 1-col on mobile */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Search size={40} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No videos found</p>
                        <p className="text-gray-700 text-sm mt-1">Try a different category or search term</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-3 gap-5 space-y-5">
                        {filtered.map(post => (
                            <div key={post.id} className="break-inside-avoid">
                                <VideoPostCard post={post} currentUserName={currentUserName} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload call-to-action — bottom banner */}
                <div className="mt-12 rounded-2xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #1a0005 0%, #0d001a 100%)', border: '1px solid rgba(229,9,20,0.15)' }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #E50914, transparent 60%)' }} />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-8">
                        <div>
                            <h3 className="text-xl font-black text-white mb-1">Have proof of work to share?</h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Upload videos of your products, services, case studies, or walkthroughs. Let your work speak for itself.
                            </p>
                        </div>
                        <Link to="/transcode">
                            <button
                                // onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-900/40 shrink-0"
                            >
                                <Upload size={16} /> Upload Your Video
                            </button>
                        </Link>

                    </div>
                </div>
            </div>

            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};

export default MainPage;
