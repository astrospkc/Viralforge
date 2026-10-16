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
};

