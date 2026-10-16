export * from '@viralforge/shared';

export type ScreenTab = 'home' | 'transcode' | 'auth';

export interface MobileVideoItem {
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
  qualities: { cdnUrl: string; quality: string }[];
  masterCdnUrl: string;
  tags: string[];
  time: string;
}

