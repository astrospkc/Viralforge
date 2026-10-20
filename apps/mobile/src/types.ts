export * from '@viralforge/shared';

export type AppMode = 'shop' | 'studio';

export type ShopTab = 'home' | 'explore' | 'saved' | 'profile';
export type StudioTab = 'overview' | 'inventory' | 'add' | 'videos' | 'profile';

export interface MobileVideoItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  shopName?: string;
  productName?: string;
  productPrice?: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: number;
  hasProofBadge?: boolean;
  inStock?: boolean;
  qualities: { cdnUrl: string; quality: string }[];
  masterCdnUrl: string;
  tags: string[];
  time: string;
}

export interface StudioMetric {
  title: string;
  value: string;
  subtext: string;
  iconType: 'box' | 'video' | 'bag' | 'chart';
  accentColor: string;
}
