export type AuthState = {
    user: any;
    isAuthenticated: boolean;
    userLoading: boolean;
    token: string;
    setToken: (value: string) => void;
    setUser: (user: User) => void;
    setIsAuthenticated: (value: boolean) => void;
    setUserLoading: (value: boolean) => void;
    logout: () => void;
};

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type Comment = {
    id: number;
    videoId: number;
    userId: number;
    parentCommentId: number;
    rootCommentId: number;
    depth: number;
    content: string;
    likeCount: number;
    replyCount: number;
    rating: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    user: User;
};

export type QualityOption = {
    cdnUrl: string;
    quality: string;
};

export type LocationData = {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
    placeName?: string;
};

export const POPULAR_LOCATIONS: LocationData[] = [
    { city: 'San Francisco', state: 'CA', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
    { city: 'New York', state: 'NY', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
    { city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
    { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
    { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
    { city: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

export type VideoPost = {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    userVerified: boolean;
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    duration: string;
    views: string;
    likes: number;
    qualities: QualityOption[];
    masterCdnUrl: string;
    tags: string[];
    reviews: Comment[];
    time: string;
    location?: LocationData;
};

