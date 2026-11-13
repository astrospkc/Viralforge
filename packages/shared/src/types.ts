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

// Enums from location_merchant_architecture.md
export type BusinessType = 'RETAIL' | 'ONLINE' | 'SERVICE';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type StockAvailability = 'AVAILABLE' | 'UNKNOWN' | 'OUT_OF_STOCK';
export type ShopStatus = 'ACTIVE' | 'INACTIVE';

export interface MerchantProfile {
    id: number;
    owner_user_id: number;
    business_name: string;
    business_description: string;
    business_type: BusinessType;
    verification_status: VerificationStatus;
    created_at?: string;
    updated_at?: string;
}

export interface Shop {
    id: number;
    merchant_id: number;
    name: string;
    description?: string;
    phone?: string;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    country: string;
    latitude: number;
    longitude: number;
    status: ShopStatus;
    verification_status: VerificationStatus;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    name: string;
    brand?: string;
    description?: string;
    specifications?: Record<string, any>;
    category?: string;
}

export interface ShopProductListing {
    id: number;
    shop_id: number;
    product_id: number;
    price: number;
    currency: string;
    availability: StockAvailability;
    stock_updated_at: string;
    status: 'ACTIVE' | 'INACTIVE';
    product?: Product;
}

export interface NearbyShopResult {
    id?: number;
    shop_id?: number;
    merchant_id: number;
    name: string;
    shop_name?: string;
    description?: string;
    phone?: string;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    country: string;
    latitude: number;
    longitude: number;
    price?: number;
    availability?: StockAvailability;
    verification_status?: VerificationStatus;
    distance_meters?: number;
}

export interface VideoDetailsResponse {
    video: {
        id: number;
        title: string;
        description: string;
        playback_url?: string;
        masterCdnUrl?: string;
        thumbnail: string;
        status: string;
        duration: number;
    };
    creator?: {
        user_id: number;
        name: string;
        avatar: string;
    };
    merchant?: {
        id: number;
        business_name: string;
        business_type: BusinessType;
    };
    shop?: {
        id: number;
        name: string;
        address: string;
        phone: string;
        latitude: number;
        longitude: number;
    };
    product?: Product;
    shop_listing?: {
        id: number;
        price: number;
        currency: string;
        availability: StockAvailability;
        stock_updated_at: string;
        status?: ShopStatus;
        shop_id?: number;
        product_id?: number;
    };
}

export interface CustomerSavedLocation {
    id: number;
    user_id: number;
    label: string;
    address: string;
    city: string;
    pincode?: string;
    latitude: number;
    longitude: number;
    created_at?: string;
}

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
    merchant?: {
        id: number;
        business_name: string;
        business_type?: BusinessType;
    };
    shop?: {
        id: number;
        name: string;
        address?: string;
        phone?: string;
        latitude: number;
        longitude: number;
    };
    product?: Product;
    shop_listing?: {
        id: number;
        price: number;
        currency: string;
        availability: StockAvailability;
        stock_updated_at: string;
        status?: ShopStatus;
        shop_id?: number;
        product_id?: number;
    };
};

