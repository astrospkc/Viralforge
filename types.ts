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




// example of the post
//   {
//         id: 1, userId: 10, userName: 'Alex Rivera', userAvatar: 'https://i.pravatar.cc/40?img=11', userVerified: true,
//         title: 'Full-Stack SaaS Build — 0 to Launch',
//         description: 'Watch how I built and shipped a complete SaaS product in 3 weeks. Auth, billing, and deployment all covered.',
//         category: 'tech', thumbnail: 'https://picsum.photos/seed/101/800/450',
//         duration: '8:24', views: '84K', likes: 3200, quality: 'HD', tags: ['SaaS', 'React', 'Node.js'], reviews: makeReviews(1), time: '3h ago',
//     },
// const POSTS: VideoPost[] = [
//     {
//         id: 1, userId: 10, userName: 'Alex Rivera', userAvatar: 'https://i.pravatar.cc/40?img=11', userVerified: true,
//         title: 'Full-Stack SaaS Build — 0 to Launch',
//         description: 'Watch how I built and shipped a complete SaaS product in 3 weeks. Auth, billing, and deployment all covered.',
//         category: 'tech', thumbnail: 'https://picsum.photos/seed/101/800/450',
//         duration: '8:24', views: '84K', likes: 3200, quality: 'HD', tags: ['SaaS', 'React', 'Node.js'], reviews: makeReviews(1), time: '3h ago',
//     },
//     {
//         id: 2, userId: 11, userName: 'Sofia Khan', userAvatar: 'https://i.pravatar.cc/40?img=9', userVerified: true,
//         title: 'E-Commerce Store Redesign — Client Case Study',
//         description: 'Before and after redesign of a fashion brand\'s Shopify store. Conversion rate went up 38% post-launch.',
//         category: 'ecommerce', thumbnail: 'https://picsum.photos/seed/202/800/450',
//         duration: '6:11', views: '51K', likes: 1750, quality: '4K', tags: ['Shopify', 'UI/UX', 'E-Commerce'], reviews: makeReviews(2), time: '5h ago',
//     },
//     {
//         id: 3, userId: 12, userName: 'James Wu', userAvatar: 'https://i.pravatar.cc/40?img=7', userVerified: false,
//         title: 'Brand Identity Design — From Brief to Final',
//         description: 'Complete walkthrough of a brand identity project for a fintech startup — logo, colors, typography, and guidelines.',
//         category: 'design', thumbnail: 'https://picsum.photos/seed/303/800/450',
//         duration: '5:45', views: '29K', likes: 980, quality: 'HD', tags: ['Branding', 'Figma', 'Identity'], reviews: makeReviews(3), time: '7h ago',
//     },
//     {
//         id: 4, userId: 13, userName: 'Nadia Osei', userAvatar: 'https://i.pravatar.cc/40?img=16', userVerified: true,
//         title: 'Agency Project Showcase — Q1 2024',
//         description: 'Our agency\'s top 5 projects this quarter — digital marketing, web, and video production work for enterprise clients.',
//         category: 'agency', thumbnail: 'https://picsum.photos/seed/404/800/450',
//         duration: '9:02', views: '62K', likes: 2400, quality: '4K', tags: ['Agency', 'Marketing', 'Portfolio'], reviews: makeReviews(4), time: '1d ago',
//     },
//     {
//         id: 5, userId: 14, userName: 'Ravi Patel', userAvatar: 'https://i.pravatar.cc/40?img=12', userVerified: false,
//         title: 'Product Launch — Smart Home Device Demo',
//         description: 'Live product demo of our new IoT home hub. See real-time automation, setup flow, and integrations in action.',
//         category: 'ecommerce', thumbnail: 'https://picsum.photos/seed/505/800/450',
//         duration: '4:58', views: '117K', likes: 5600, quality: 'HD', tags: ['IoT', 'Product', 'Hardware'], reviews: makeReviews(5), time: '2d ago',
//     },
//     {
//         id: 6, userId: 15, userName: 'Emily Chen', userAvatar: 'https://i.pravatar.cc/40?img=25', userVerified: true,
//         title: 'API Integration Deep Dive — Stripe + Webhooks',
//         description: 'Complete guide to integrating Stripe with webhooks in a Node.js app — real production code, no fluff.',
//         category: 'tech', thumbnail: 'https://picsum.photos/seed/606/800/450',
//         duration: '11:17', views: '38K', likes: 1300, quality: 'HD', tags: ['Stripe', 'Node.js', 'Backend'], reviews: makeReviews(6), time: '2d ago',
//     },
// ];


// const makeReviews = (videoId: number): Review[] => [
//     {
//         id: videoId * 10 + 1,
//         userId: 2,
//         userName: 'Priya Nair',
//         avatar: 'https://i.pravatar.cc/36?img=5',
//         rating: 5,
//         comment: 'Absolutely loved the depth of this demo. The real use-case made it super convincing. Hired them right after watching!',
//         helpful: 42,
//         time: '2h ago',
//     },
//     {
//         id: videoId * 10 + 2,
//         userId: 3,
//         userName: 'Marcus Lee',
//         avatar: 'https://i.pravatar.cc/36?img=3',
//         rating: 4,
//         comment: 'Great walkthrough overall. Would love to see a follow-up on the backend architecture. Solid proof of work.',
//         helpful: 18,
//         time: '1d ago',
//     },
// ];
