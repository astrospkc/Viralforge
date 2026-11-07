import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { useAuthStore } from '../store/auth_store';
import type { FeedsPage } from '../services/video_service';
import {
    Upload, X, Search,
    Flame, Clock, Layers, ShoppingBag, Code2,
    Paintbrush, Briefcase, Zap, MapPin, Map, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoService } from '../services/video_service';
import { useInfiniteQuery } from '@tanstack/react-query';
import VideoPostCard from '../components/VideoPostCard';
import { LocationVideoMap } from '../components/LocationVideoMap';
import type { VideoPost, LocationData } from '../../types';

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

// Curated Popular City Presets for Quick Filtering
export const POPULAR_LOCATIONS: LocationData[] = [
    { city: 'San Francisco', state: 'CA', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
    { city: 'New York', state: 'NY', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
    { city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
    { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
    { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
    { city: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

// Fallback seed videos with real world coordinates for map testing if backend feeds are empty
const SEED_LOCATION_VIDEOS: VideoPost[] = [
    {
        id: 101,
        userId: 1,
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        userVerified: true,
        title: 'Full-Stack SaaS Build — 0 to Launch in 3 Weeks',
        description: 'Live architecture walkthrough and stress-test benchmarks from our Silicon Valley lab.',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        duration: '8:24',
        views: '84K',
        likes: 3200,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        tags: ['SaaS', 'React', 'SiliconValley'],
        reviews: [],
        time: '3h ago',
        location: { city: 'San Francisco', state: 'CA', country: 'USA', latitude: 37.7749, longitude: -122.4194 }
    },
    {
        id: 102,
        userId: 2,
        userName: 'Sofia Khan',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        userVerified: true,
        title: 'E-Commerce Store Redesign — 38% Conversion Jump',
        description: 'Before & after audit on luxury apparel client store recorded in our Manhattan studio.',
        category: 'ecommerce',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
        duration: '6:11',
        views: '51K',
        likes: 1750,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        tags: ['Shopify', 'NYC', 'Fashion'],
        reviews: [],
        time: '5h ago',
        location: { city: 'New York', state: 'NY', country: 'USA', latitude: 40.7128, longitude: -74.0060 }
    },
    {
        id: 103,
        userId: 3,
        userName: 'Kenji Sato',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        userVerified: true,
        title: 'Bespoke CNC Keyboards — Sound & Flex Test',
        description: 'Uncut mechanical switch testing and frequency response in Akihabara workshop.',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=450&fit=crop',
        duration: '5:45',
        views: '38K',
        likes: 2100,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        tags: ['Keyboards', 'Tokyo', 'Hardware'],
        reviews: [],
        time: '7h ago',
        location: { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 }
    },
    {
        id: 104,
        userId: 4,
        userName: 'James Wu',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        userVerified: false,
        title: 'Brand Identity Design — Fintech Unicorn',
        description: 'Complete brand guidelines and design system created for London fintech startup.',
        category: 'design',
        thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=450&fit=crop',
        duration: '9:02',
        views: '29K',
        likes: 980,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        tags: ['Design', 'London', 'Fintech'],
        reviews: [],
        time: '1d ago',
        location: { city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 }
    },
    {
        id: 105,
        userId: 5,
        userName: 'Nadia Osei',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        userVerified: true,
        title: 'Commercial Film Production Reel — Q1 2026',
        description: 'Cinematic camera rigs, color grading breakdown, and audio mastering from Berlin soundstage.',
        category: 'agency',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
        duration: '4:58',
        views: '62K',
        likes: 2400,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        tags: ['Agency', 'Berlin', 'Cinematography'],
        reviews: [],
        time: '2d ago',
        location: { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 }
    },
    {
        id: 106,
        userId: 6,
        userName: 'Priya Nair',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
        userVerified: true,
        title: 'Distributed HLS Transcoding Engine in Go',
        description: 'Microservices benchmark running 100 concurrent 4K encodings with real-time adaptive streaming.',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
        duration: '11:17',
        views: '38K',
        likes: 1300,
        qualities: [{ quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }],
        masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        tags: ['Golang', 'Bangalore', 'HLS'],
        reviews: [],
        time: '2d ago',
        location: { city: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 }
    }
];

const MainPage = () => {
    const { user, isAuthenticated } = useAuthStore();
    const currentUserName = user?.name ?? 'You';

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [isMapVisible, setIsMapVisible] = useState(true);
    const [viewMode, setViewMode] = useState<'feed' | 'split'>('feed');
    const { token } = useAuthStore();

    const fetchFeeds = async ({ pageParam = "" }): Promise<FeedsPage> => {
        const response = await VideoService.GetAllFeeds(pageParam, 10, token);
        return response ?? { data: [], nextCursor: null };
    };

    const { data: feedsData } = useInfiniteQuery({
        queryKey: ["feeds"],
        queryFn: fetchFeeds,
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    });

    const rawFeeds = feedsData?.pages.flatMap(page => page.data) ?? [];

    // Helper to safely parse tags from string/array/json
    const safeParseTags = (raw: any): string[] => {
        if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
        if (typeof raw === 'string' && raw.trim()) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
            } catch {}
            return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        return ['Proof', 'Featured'];
    };

    // Helper to safely parse or create location
    const safeParseLocation = (rawLoc: any, idx: number): LocationData => {
        const fallback = POPULAR_LOCATIONS[idx % POPULAR_LOCATIONS.length];
        if (!rawLoc) return fallback;

        if (typeof rawLoc === 'string') {
            const found = POPULAR_LOCATIONS.find(p => p.city.toLowerCase() === rawLoc.toLowerCase());
            if (found) return found;
            return {
                city: rawLoc,
                country: 'Global',
                latitude: fallback.latitude,
                longitude: fallback.longitude,
            };
        }

        const lat = Number(rawLoc.latitude ?? rawLoc.lat);
        const lng = Number(rawLoc.longitude ?? rawLoc.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
            return fallback;
        }

        return {
            city: rawLoc.city || fallback.city,
            state: rawLoc.state || fallback.state,
            country: rawLoc.country || fallback.country,
            latitude: lat,
            longitude: lng,
            placeName: rawLoc.placeName || rawLoc.city,
        };
    };

    // Augment backend feeds with complete, defensive fields and coordinates
    const allVideos: VideoPost[] = useMemo(() => {
        if (!Array.isArray(rawFeeds) || rawFeeds.length === 0) {
            return SEED_LOCATION_VIDEOS;
        }

        return rawFeeds.map((feed: any, idx: number): VideoPost => {
            const location = safeParseLocation(feed.location, idx);
            const tags = safeParseTags(feed.tags);
            const qualities = Array.isArray(feed.qualities) && feed.qualities.length > 0
                ? feed.qualities
                : [{ quality: '1080p', cdnUrl: feed.file_url || feed.masterCdnUrl || '' }];
            const thumbnail = feed.thumbnail ||
                feed.selected_thumbnail ||
                (Array.isArray(feed.thumbnails) && feed.thumbnails[0]) ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop';

            return {
                id: Number(feed.id ?? feed.video_id ?? (idx + 1)),
                userId: Number(feed.userId ?? feed.user_id ?? 1),
                userName: feed.userName || feed.user_name || feed.user?.name || `Creator #${idx + 1}`,
                userAvatar: feed.userAvatar || feed.user_avatar || feed.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                userVerified: Boolean(feed.userVerified ?? feed.user_verified ?? true),
                title: feed.title || feed.video_title || 'Product Proof Demonstration',
                description: feed.description || feed.video_description || 'Real verified video proof for product inspection.',
                category: feed.category || 'tech',
                thumbnail,
                duration: feed.duration || '2:30',
                views: feed.views ? String(feed.views) : '1.4K',
                likes: typeof feed.likes === 'number' ? feed.likes : 42,
                qualities,
                masterCdnUrl: feed.masterCdnUrl || feed.file_url || qualities[0]?.cdnUrl || '',
                tags,
                reviews: Array.isArray(feed.reviews) ? feed.reviews : [],
                time: feed.time || (feed.created_at ? new Date(feed.created_at).toLocaleDateString() : 'recent'),
                location,
            };
        });
    }, [rawFeeds]);

    /* Filter logic by Category, Search Query, and Selected Location */
    const filtered = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return allVideos.filter(p => {
            const matchesCat =
                activeCategory === 'all' ||
                activeCategory === 'trending' ||
                activeCategory === 'recent' ||
                p.category === activeCategory;

            const tagsMatch = Array.isArray(p.tags) && p.tags.some(
                (t: string) => typeof t === 'string' && t.toLowerCase().includes(query)
            );

            const matchesSearch =
                !query ||
                p.title?.toLowerCase().includes(query) ||
                tagsMatch ||
                p.location?.city?.toLowerCase().includes(query) ||
                p.location?.country?.toLowerCase().includes(query);

            const matchesLocation =
                !selectedLocation ||
                (p.location &&
                    (p.location.city.toLowerCase() === selectedLocation.city.toLowerCase() ||
                        selectedLocation.city === 'Your Nearby Area'));

            return matchesCat && matchesSearch && matchesLocation;
        });
    }, [allVideos, activeCategory, searchQuery, selectedLocation]);

    // Count of unique active video locations
    const activeLocationsCount = useMemo(() => {
        const cities = new Set(allVideos.map(v => v.location?.city).filter(Boolean));
        return cities.size;
    }, [allVideos]);

    return (
        <div className="min-h-screen text-white font-sans antialiased" style={{ background: '#111111' }}>
            <Navbar />

            {/* ══════════════════════════════════════════
                PAGE HEADER — title + search + upload + location controls
            ══════════════════════════════════════════ */}
            <div
                className="sticky top-[64px] z-40 border-b border-white/5 backdrop-blur-xl"
                style={{ background: 'rgba(17,17,17,0.92)' }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col gap-3">
                    {/* Top row: title + upload + map toggle */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-black text-white tracking-tight">Discover</h1>
                                {selectedLocation && (
                                    <span className="text-[11px] font-bold bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <MapPin size={10} /> {selectedLocation.city}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-xs">Proof-based videos filtered by location & creators</p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Map View Toggle Button */}
                            <button
                                onClick={() => setIsMapVisible(!isMapVisible)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    isMapVisible
                                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30'
                                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                                }`}
                                title={isMapVisible ? 'Hide Map' : 'Show Map'}
                            >
                                <Map size={14} />
                                <span className="hidden sm:inline">{isMapVisible ? 'Hide Map' : 'Map View'}</span>
                            </button>

                            {/* Split layout toggle (visible when map is on) */}
                            {isMapVisible && (
                                <button
                                    onClick={() => setViewMode(viewMode === 'feed' ? 'split' : 'feed')}
                                    className={`hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                        viewMode === 'split'
                                            ? 'bg-white/20 text-white border-white/30'
                                            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                                    }`}
                                    title="Toggle Split View"
                                >
                                    <Compass size={14} />
                                    <span>{viewMode === 'split' ? 'Stacked' : 'Split'}</span>
                                </button>
                            )}

                            <Link to={isAuthenticated ? "/transcode" : "/signin"}>
                                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-900/40">
                                    <Upload size={15} /> Upload Video
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Search & Location Bar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search videos, tags, cities, categories…"
                                className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600/40 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Location Dropdown / Status Pill */}
                        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setSelectedLocation(null)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    selectedLocation === null
                                        ? 'bg-white/15 text-white border-white/20'
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                                }`}
                            >
                                🌐 All Locations
                            </button>

                            {/* Popular City Pills */}
                            {POPULAR_LOCATIONS.slice(0, 4).map(loc => {
                                const isSelected = selectedLocation?.city === loc.city;
                                return (
                                    <button
                                        key={loc.city}
                                        onClick={() => setSelectedLocation(isSelected ? null : loc)}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                            isSelected
                                                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30'
                                                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <MapPin size={11} className={isSelected ? 'text-white' : 'text-red-500'} />
                                        <span>{loc.city}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                        {CATEGORIES.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveCategory(id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                                    activeCategory === id
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
                MAIN CONTENT AREA: MAP & VIDEO FEED
            ══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {/* Active Location Filter Banner */}
                {selectedLocation && (
                    <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-red-950/40 via-[#1b1212] to-transparent border border-red-600/30 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>Showing Proofs around {selectedLocation.city}, {selectedLocation.country}</span>
                                </div>
                                <p className="text-gray-400 text-xs">
                                    Displaying {filtered.length} video{filtered.length !== 1 ? 's' : ''} uploaded by creators in this location
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                        >
                            <X size={14} /> Clear Filter
                        </button>
                    </div>
                )}

                {/* Split View Layout (Map on Left / Feed on Right) */}
                {viewMode === 'split' && isMapVisible ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Sticky Map Column (5 cols) */}
                        <div className="lg:col-span-5 sticky top-[240px]">
                            <LocationVideoMap
                                videos={allVideos}
                                selectedLocation={selectedLocation}
                                onSelectLocation={setSelectedLocation}
                                height="650px"
                            />
                        </div>

                        {/* Video Feed Column (7 cols) */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Stats */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <span className="text-xs text-gray-500 font-medium">
                                    Showing {filtered.length} of {allVideos.length} videos
                                </span>
                                <span className="text-xs text-gray-400">
                                    {activeLocationsCount} creator locations worldwide
                                </span>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="text-center py-20 bg-[#161616] rounded-2xl border border-white/5">
                                    <MapPin size={36} className="text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium text-sm">No videos found for this location</p>
                                    <button
                                        onClick={() => setSelectedLocation(null)}
                                        className="mt-3 text-red-500 hover:underline text-xs font-bold"
                                    >
                                        Clear location filter
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {filtered.map(post => (
                                        <VideoPostCard
                                            key={post.id}
                                            post={post}
                                            currentUserName={currentUserName}
                                            onSelectLocation={setSelectedLocation}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Stacked / Default Grid Layout */
                    <div>
                        {/* Interactive MapLibre Map (Full Width) */}
                        {isMapVisible && (
                            <div className="mb-8">
                                <LocationVideoMap
                                    videos={allVideos}
                                    selectedLocation={selectedLocation}
                                    onSelectLocation={setSelectedLocation}
                                    height="380px"
                                />
                            </div>
                        )}

                        {/* Stats strip */}
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5">
                            {[
                                { value: `${allVideos?.length || 0}`, label: 'Videos' },
                                { value: `${activeLocationsCount || 0}`, label: 'Locations' },
                                { value: `${allVideos?.reduce((a, p) => a + (Array.isArray(p.reviews) ? p.reviews.length : 0), 0) || 0}`, label: 'Reviews' },
                                { value: `${new Set(allVideos.map(v => v.userId)).size || 1}`, label: 'Creators' },
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

                        {/* Video feed grid */}
                        {filtered.length === 0 ? (
                            <div className="text-center py-24 bg-[#141414] rounded-2xl border border-white/5">
                                <Search size={40} className="text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No videos found</p>
                                <p className="text-gray-600 text-sm mt-1">Try selecting a different place on the map or resetting filters</p>
                                {selectedLocation && (
                                    <button
                                        onClick={() => setSelectedLocation(null)}
                                        className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                                    >
                                        Show All Locations
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
                                {filtered.map(post => (
                                    <div key={post.id} className="break-inside-avoid">
                                        <VideoPostCard
                                            post={post}
                                            currentUserName={currentUserName}
                                            onSelectLocation={setSelectedLocation}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Upload call-to-action — bottom banner */}
                <div
                    className="mt-12 rounded-2xl overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(135deg, #1a0005 0%, #0d001a 100%)',
                        border: '1px solid rgba(229,9,20,0.15)',
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #E50914, transparent 60%)' }}
                    />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-8">
                        <div>
                            <h3 className="text-xl font-black text-white mb-1">Have proof of work in your city?</h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Upload videos of your products, services, or walkthroughs with geo-tagging so local and global clients find your work.
                            </p>
                        </div>
                        <Link to={isAuthenticated ? "/transcode" : "/signin"}>
                            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-900/40 shrink-0">
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
