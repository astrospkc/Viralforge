import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { MobileVideoItem } from '../types';

const { width } = Dimensions.get('window');

const CATEGORIES = ['For you', 'Tech', 'Style', 'Home', 'Beauty', 'Audio'];

const SHOP_VIDEOS: MobileVideoItem[] = [
  {
    id: 1,
    userId: 101,
    userName: 'AudioCraft Studio',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'AudioCraft NYC',
    productName: 'ATH-M50x Professional Studio Monitor',
    productPrice: '$149.00',
    title: 'Raw Acoustic Frequency & Build Test — In Stock Demo',
    description: 'Listen to unedited frequency response, ear-cup seal, and stress-tested metal headband on our studio bench.',
    category: 'Audio',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=550&fit=crop',
    duration: '2:14',
    views: '12.4k',
    likes: 1840,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { quality: '720p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['Audio', 'Headphones', 'Proof'],
    time: '2h ago',
  },
  {
    id: 2,
    userId: 102,
    userName: 'KeyForge Lab',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'KeyForge Lab',
    productName: 'CNC Aluminum Gasket Mechanical Keyboard',
    productPrice: '$185.00',
    title: 'Typing Sound Test & Gasket Flex Demonstration',
    description: 'Lubed linear switches with POM plate sound test recorded with binaural mic. Zero hollow ping.',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=550&fit=crop',
    duration: '1:45',
    views: '38.2k',
    likes: 4210,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    tags: ['Tech', 'Keyboards', 'Custom'],
    time: '5h ago',
  },
  {
    id: 3,
    userId: 103,
    userName: 'Oat & Clay',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'Oat & Clay Ceramic Studio',
    productName: 'Hand-Thrown Matte Ceramic Pour-Over Set',
    productPrice: '$58.00',
    title: 'Morning Flow Rate & Heat Retention Brewing Test',
    description: 'Watching extraction rate with V60 filters. Real heat tests show superior thermal stability.',
    category: 'Home',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=550&fit=crop',
    duration: '3:10',
    views: '9.1k',
    likes: 920,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['Home', 'Coffee', 'Ceramics'],
    time: '1d ago',
  },
];

interface ShopScreenProps {
  onSelectVideo: (video: MobileVideoItem) => void;
  onExploreAll?: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onSelectVideo, onExploreAll }) => {
  const [selectedCategory, setSelectedCategory] = useState('For you');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = SHOP_VIDEOS.filter((video) => {
    const matchesCategory =
      selectedCategory === 'For you' ||
      video.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      (video.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.shopName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Headline Section */}
      <View style={styles.heroSection}>
        <Text style={styles.eyebrow}>SHOP WHAT'S REAL</Text>
        <Text style={styles.heroTitleMain}>Watch it. Trust it.</Text>
        <Text style={styles.heroTitleAccent}>Make it yours.</Text>
        <Text style={styles.heroSubtitle}>
          Real product videos from trusted shops near you.
        </Text>
      </View>

      {/* Rounded Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands or shops"
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.commandPill}>
            <Text style={styles.commandText}>⌘ K</Text>
          </View>
        </View>
      </View>

      {/* Filter Category Chips */}
      <View style={styles.categoryScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionEyebrow}>TRENDING NOW</Text>
          <Text style={styles.sectionTitle}>Proof, not promises</Text>
        </View>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onExploreAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See all →</Text>
        </TouchableOpacity>
      </View>

      {/* Product Video Cards */}
      <View style={styles.videoList}>
        {filteredVideos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => onSelectVideo(item)}
          >
            {/* Thumbnail Preview with Badges */}
            <View style={styles.thumbnailWrapper}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.overlayGradient} />

              {/* Top-Left Video Proof Badge */}
              <View style={styles.proofBadge}>
                <Text style={styles.proofCheck}>✓</Text>
                <Text style={styles.proofText}>VIDEO PROOF</Text>
              </View>

              {/* Top-Right Views Badge */}
              <View style={styles.viewsBadge}>
                <Text style={styles.viewsText}>{item.views} views</Text>
              </View>

              {/* Center Play Button */}
              <View style={styles.playCenterButton}>
                <Text style={styles.playCenterIcon}>▶</Text>
              </View>

              {/* Duration Bottom Right */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>

            {/* Product & Merchant Info Footer */}
            <View style={styles.cardBody}>
              <View style={styles.productRow}>
                <View style={styles.productCol}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.shopName}>
                    {item.shopName} {item.userVerified ? '✓' : ''}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{item.productPrice}</Text>
                </View>
              </View>

              <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
              </Text>

              {/* Action Pills */}
              <View style={styles.cardActionRow}>
                <View style={styles.inStockTag}>
                  <View style={styles.greenDot} />
                  <Text style={styles.inStockText}>In Stock</Text>
                </View>
                <Text style={styles.watchProofHint}>Tap to watch proof demo & buy →</Text>
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
    backgroundColor: '#000000', // Deep black background
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  eyebrow: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroTitleMain: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroTitleAccent: {
    color: '#D4FF32', // Neon lime accent font
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    fontStyle: 'italic',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: width * 0.85,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  commandPill: {
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  commandText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryScrollWrapper: {
    marginBottom: 24,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: '#FFFFFF', // Clean high contrast active state
    borderColor: '#FFFFFF',
  },
  categoryText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionEyebrow: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    letterSpacing: -0.3,
  },
  seeAllButton: {
    paddingBottom: 2,
  },
  seeAllText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
  },
  videoList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 20,
  },
  thumbnailWrapper: {
    width: '100%',
    height: 230,
    position: 'relative',
    backgroundColor: '#0A0A0A',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  proofBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 5,
  },
  proofCheck: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '900',
  },
  proofText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  viewsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  viewsText: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: '600',
  },
  playCenterButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCenterIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 3,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productCol: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  shopName: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  priceText: {
    color: '#D4FF32',
    fontSize: 14,
    fontWeight: '800',
  },
  videoTitle: {
    color: '#D4D4D8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    paddingTop: 10,
  },
  inStockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  inStockText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '700',
  },
  watchProofHint: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
  },
});
