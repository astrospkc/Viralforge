import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { useAuthStore } from '../store/auth_store';
import type { VideoPost } from '../../types';
import {
    Upload, X, Search,
    Flame, Clock, Layers, ShoppingBag, Code2,
    Paintbrush, Briefcase, Zap,

} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoService } from '../services/video_service';
import { useInfiniteQuery } from '@tanstack/react-query';

import VideoPostCard from '../components/VideoPostCard';



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
