import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { MobileVideoItem } from '../types';

const { width } = Dimensions.get('window');

const MOCK_VIDEOS: MobileVideoItem[] = [
  {
    id: 1,
    userId: 10,
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    userVerified: true,
    title: 'Full-Stack SaaS Build — 0 to Launch in 3 Weeks',
    description: 'Watch how I built and shipped a complete SaaS product in 3 weeks. Auth, billing, transcoding, and deployment all covered.',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    duration: '8:24',
    views: '84K',
    likes: 3200,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { quality: '720p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { quality: '480p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['SaaS', 'React', 'Node.js'],
    time: '3h ago',
  },
  {
    id: 2,
    userId: 11,
    userName: 'Sofia Khan',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    userVerified: true,
    title: 'E-Commerce Store Redesign — 38% Conversion Jump',
    description: 'Before and after redesign of a fashion brand Shopify store. Conversion rate skyrocketed post launch.',
    category: 'E-Commerce',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    duration: '6:11',
    views: '51K',
    likes: 1750,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { quality: '720p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    tags: ['Shopify', 'UI/UX', 'Design'],
    time: '5h ago',
  },
  {
    id: 3,
    userId: 12,
    userName: 'James Wu',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    userVerified: false,
    title: 'Brand Identity Design — From Brief to Final Deliverable',
    description: 'Complete walkthrough of a brand identity project for a fintech startup — logo, typography, guidelines.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=450&fit=crop',
    duration: '5:45',
    views: '29K',
    likes: 980,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['Branding', 'Figma', 'Identity'],
    time: '7h ago',
  },
  {
    id: 4,
    userId: 13,
    userName: 'Nadia Osei',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    userVerified: true,
    title: 'Agency Project Showcase — Video Production & Tech',
    description: 'Our agency top 5 projects this quarter — digital marketing, web, and video production work.',
    category: 'Agency',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
    duration: '9:02',
    views: '62K',
    likes: 2400,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['Agency', 'Marketing', 'Portfolio'],
    time: '1d ago',
  },
];

const CATEGORIES = ['All', 'Tech', 'E-Commerce', 'Design', 'Agency'];

interface HomeScreenProps {
  onSelectVideo: (video: MobileVideoItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectVideo }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos = selectedCategory === 'All'
    ? MOCK_VIDEOS
    : MOCK_VIDEOS.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase());

  const heroVideo = MOCK_VIDEOS[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <TouchableOpacity
        style={styles.heroContainer}
        activeOpacity={0.9}
        onPress={() => onSelectVideo(heroVideo)}
      >
        <Image source={{ uri: heroVideo.thumbnail }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>FEATURED SHOWCASE</Text>
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>
            {heroVideo.title}
          </Text>
          <Text style={styles.heroMeta}>
            By {heroVideo.userName} • {heroVideo.views} views • {heroVideo.duration}
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.heroPlayButton}
              onPress={() => onSelectVideo(heroVideo)}
            >
              <Text style={styles.heroPlayText}>▶ Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Categories Bar */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Videos List */}
      <View style={styles.feedHeader}>
        <Text style={styles.feedTitle}>
          {selectedCategory === 'All' ? 'Trending Proof of Work' : `${selectedCategory} Proofs`}
        </Text>
        <Text style={styles.feedSubtitle}>{filteredVideos.length} videos available</Text>
      </View>

      <View style={styles.videoList}>
        {filteredVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            activeOpacity={0.8}
            onPress={() => onSelectVideo(video)}
          >
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>

            <View style={styles.videoInfo}>
              <Image source={{ uri: video.userAvatar }} style={styles.authorAvatar} />
              <View style={styles.metaCol}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.authorName}>
                  {video.userName} {video.userVerified ? '✓' : ''}
                </Text>
                <Text style={styles.statsText}>
                  {video.views} views • {video.time} • 👍 {video.likes}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  heroContainer: {
    width: width,
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E50914',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroMeta: {
    color: '#D1D5DB',
    fontSize: 12,
    marginBottom: 12,
  },
  heroActions: {
    flexDirection: 'row',
  },
  heroPlayButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  heroPlayText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  categoryText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  feedHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  feedTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  feedSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  videoList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  videoCard: {
    marginBottom: 20,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  thumbnailContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  videoInfo: {
    flexDirection: 'row',
    padding: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  metaCol: {
    flex: 1,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  authorName: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '500',
  },
  statsText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
});

