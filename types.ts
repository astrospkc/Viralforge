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
}

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export type Review = {
    id: number;
    userId: number;
    userName: string;
    avatar: string;
    rating: number;
    comment: string;
    helpful: number;
    time: string;
};

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
    tags: string[];
    reviews: Review[];
    time: string;
};
type QualityOption = {
    cdnUrl: string
    quality: string
}