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
import { MobileVideoItem, LocationData, POPULAR_LOCATIONS } from '../types';
import { MobileLocationMap } from '../components/MobileLocationMap';

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
    location: { city: 'New York', state: 'NY', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
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
    location: { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
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
    location: { city: 'San Francisco', state: 'CA', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
  },
  {
    id: 4,
    userId: 104,
    userName: 'Lumina Timepieces',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'Lumina London',
    productName: 'Titanium Field Automatic 38mm Watch',
    productPrice: '$320.00',
    title: 'Water Pressure Rig & Lume Stress Test',
    description: 'Submerged in 100m pressure chamber and darkroom SuperLumiNova glow degradation test over 8 hours.',
    category: 'Style',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=550&fit=crop',
    duration: '4:15',
    views: '24.6k',
    likes: 2150,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['Style', 'Watches', 'London'],
    time: '1d ago',
    location: { city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  },
  {
    id: 5,
    userId: 105,
    userName: 'Modular Synth Works',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'Modular Berlin',
    productName: 'Analog Low-Pass Filter Eurorack Module',
    productPrice: '$210.00',
    title: 'Oscilloscope Voltage Waveform & Resonance Sweep',
    description: 'Direct uncut audio output demonstrating filter self-oscillation and diode overdrive warmth.',
    category: 'Audio',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=550&fit=crop',
    duration: '5:02',
    views: '16.8k',
    likes: 1420,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['Audio', 'Synth', 'Berlin'],
    time: '2d ago',
    location: { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  },
  {
    id: 6,
    userId: 106,
    userName: 'Microstream Systems',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    userVerified: true,
    shopName: 'Microstream Labs Bangalore',
    productName: '4K Micro Transcoding Edge Accelerator Box',
    productPrice: '$390.00',
    title: 'Thermal Imaging & 100 Stream Live Encoding Test',
    description: 'FLIR thermal camera inspection while transcoding 100 concurrent streams at 60 FPS without fan throttle.',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=550&fit=crop',
    duration: '6:30',
    views: '41.2k',
    likes: 3890,
    hasProofBadge: true,
    inStock: true,
    qualities: [
      { quality: '1080p', cdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    masterCdnUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    tags: ['Tech', 'Hardware', 'Bangalore'],
    time: '2d ago',
    location: { city: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  },
];

interface ShopScreenProps {
  onSelectVideo: (video: MobileVideoItem) => void;
  onExploreAll?: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onSelectVideo, onExploreAll }) => {
  const [selectedCategory, setSelectedCategory] = useState('For you');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const filteredVideos = SHOP_VIDEOS.filter((video) => {
    const matchesCategory =
      selectedCategory === 'For you' ||
      video.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      (video.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.shopName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.location?.country || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !selectedLocation ||
      (video.location &&
        video.location.city.toLowerCase() === selectedLocation.city.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
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
            placeholder="Search products, brands, or cities..."
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
              <Text style={{ color: '#A1A1AA', fontSize: 11 }}>✕</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.commandPill}>
              <Text style={styles.commandText}>⌘ K</Text>
            </View>
          )}
        </View>
      </View>

      {/* Location Presets & Map Toggle Pill Strip */}
      <View style={styles.locationScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationScroll}
        >
          {/* Map View Toggle Button */}
          <TouchableOpacity
            style={[styles.mapToggleChip, isMapVisible && styles.mapToggleChipActive]}
            onPress={() => setIsMapVisible(!isMapVisible)}
            activeOpacity={0.8}
          >
            <Text style={styles.mapToggleIcon}>🗺️</Text>
            <Text style={[styles.mapToggleText, isMapVisible && styles.mapToggleTextActive]}>
              {isMapVisible ? 'Hide Map' : 'Map View'}
            </Text>
          </TouchableOpacity>

          {/* All Locations Pill */}
          <TouchableOpacity
            style={[
              styles.locationChip,
              selectedLocation === null && styles.locationChipActive,
            ]}
            onPress={() => setSelectedLocation(null)}
            activeOpacity={0.8}
          >
            <Text style={styles.locationChipIcon}>🌐</Text>
            <Text
              style={[
                styles.locationChipText,
                selectedLocation === null && styles.locationChipTextActive,
              ]}
            >
              All Locations
            </Text>
          </TouchableOpacity>

          {/* Popular Cities */}
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation?.city === loc.city;
            return (
              <TouchableOpacity
                key={loc.city}
                style={[styles.locationChip, isSelected && styles.locationChipActive]}
                onPress={() => setSelectedLocation(isSelected ? null : loc)}
                activeOpacity={0.8}
              >
                <Text style={styles.locationChipIcon}>📍</Text>
                <Text
                  style={[
                    styles.locationChipText,
                    isSelected && styles.locationChipTextActive,
                  ]}
                >
                  {loc.city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Interactive MapLibre Map for Mobile */}
      {isMapVisible && (
        <View style={styles.mapSectionWrapper}>
          <MobileLocationMap
            videos={SHOP_VIDEOS}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            height={250}
            onClose={() => setIsMapVisible(false)}
          />
        </View>
      )}

      {/* Active Location Filter Banner */}
      {selectedLocation && (
        <View style={styles.activeLocationBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIconBox}>
              <Text style={{ fontSize: 16 }}>📍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                Showing Proofs in {selectedLocation.city}, {selectedLocation.country}
              </Text>
              <Text style={styles.bannerSub}>
                {filteredVideos.length} product demonstration{filteredVideos.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bannerClearBtn}
            onPress={() => setSelectedLocation(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.bannerClearText}>✕ Clear</Text>
          </TouchableOpacity>
        </View>
      )}

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

      {/* Section Header with dynamic video count */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionEyebrow}>TRENDING NOW</Text>
          <Text style={styles.sectionTitle}>
            {selectedLocation ? `Verified in ${selectedLocation.city}` : 'Proof, not promises'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onExploreAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>
            {filteredVideos.length} videos →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Video Cards */}
      <View style={styles.videoList}>
        {filteredVideos.length === 0 ? (
          <View style={styles.noVideosBox}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📍</Text>
            <Text style={styles.noVideosTitle}>No video proofs in this area</Text>
            <Text style={styles.noVideosSub}>
              Try zooming out on the MapLibre map or picking another popular city.
            </Text>
            <TouchableOpacity
              style={styles.showAllLocationsBtn}
              onPress={() => setSelectedLocation(null)}
            >
              <Text style={styles.showAllLocationsText}>Show All Locations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredVideos.map((item) => (
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

                {/* Action Pills & Location Badge */}
                <View style={styles.cardActionRow}>
                  <View style={styles.inStockTag}>
                    <View style={styles.greenDot} />
                    <Text style={styles.inStockText}>In Stock</Text>
                  </View>

                  {item.location && (
                    <TouchableOpacity
                      style={styles.cardLocationTag}
                      onPress={() => {
                        setSelectedLocation(item.location!);
                        setIsMapVisible(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cardLocationIcon}>📍</Text>
                      <Text style={styles.cardLocationText}>
                        {item.location.city}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <Text style={styles.watchProofHint}>Watch demo →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    marginBottom: 12,
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
  searchClearBtn: {
    padding: 6,
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
  locationScrollWrapper: {
    marginBottom: 14,
  },
  locationScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mapToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 6,
  },
  mapToggleChipActive: {
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    borderColor: '#D4FF32',
  },
  mapToggleIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  mapToggleText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  mapToggleTextActive: {
    color: '#D4FF32',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    marginRight: 6,
  },
  locationChipActive: {
    backgroundColor: '#D4FF32',
    borderColor: '#D4FF32',
  },
  locationChipIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  locationChipText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },
  locationChipTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  mapSectionWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activeLocationBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#14170B',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 50, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  bannerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 50, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerSub: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  bannerClearBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 8,
  },
  bannerClearText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryScrollWrapper: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  categoryText: {
    color: '#A1A1AA',
    fontSize: 12,
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
  noVideosBox: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 20,
  },
  noVideosTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  noVideosSub: {
    color: '#71717A',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  showAllLocationsBtn: {
    backgroundColor: '#D4FF32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  showAllLocationsText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
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
  cardLocationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 255, 50, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 50, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  cardLocationIcon: {
    fontSize: 10,
  },
  cardLocationText: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '700',
  },
  watchProofHint: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
  },
});
