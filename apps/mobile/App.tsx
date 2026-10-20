import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { ShopScreen } from './src/screens/ShopScreen';
import { StudioScreen } from './src/screens/StudioScreen';
import { VideoDetailScreen } from './src/screens/VideoDetailScreen';
import { TranscodeStatusScreen } from './src/screens/TranscodeStatusScreen';
import { UploadVideoModal } from './src/components/UploadVideoModal';
import { AppMode, MobileVideoItem, ShopTab, StudioTab } from './src/types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('shop');
  const [shopTab, setShopTab] = useState<ShopTab>('home');
  const [studioTab, setStudioTab] = useState<StudioTab>('overview');
  const [selectedVideo, setSelectedVideo] = useState<MobileVideoItem | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const isShop = mode === 'shop';

  const handleSelectVideo = (video: MobileVideoItem) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#000000" />

      {/* Top Header with Brand Logo, Shop | Studio Toggle, and Avatar */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setSelectedVideo(null);
          setMode(newMode);
        }}
        onProfilePress={() => {
          setSelectedVideo(null);
          if (isShop) setShopTab('profile');
          else setStudioTab('profile');
        }}
      />

      {/* Main Body */}
      <View style={styles.body}>
        {selectedVideo ? (
          <VideoDetailScreen video={selectedVideo} onClose={handleCloseVideo} />
        ) : isShop ? (
          /* ================= SHOP MODE ================= */
          shopTab === 'home' ? (
            <ShopScreen
              onSelectVideo={handleSelectVideo}
              onExploreAll={() => setShopTab('explore')}
            />
          ) : shopTab === 'explore' ? (
            <ShopScreen onSelectVideo={handleSelectVideo} />
          ) : shopTab === 'saved' ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyIcon}>🔖</Text>
              <Text style={styles.emptyTitle}>Saved Video Proofs</Text>
              <Text style={styles.emptySub}>
                Bookmark product video demonstrations to review their uncut tests and shop availability anytime.
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShopTab('home')}
              >
                <Text style={styles.actionBtnText}>Discover Trending Proofs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyView}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>MK</Text>
              </View>
              <Text style={styles.emptyTitle}>Maya Kensington</Text>
              <Text style={styles.emptySub}>Verified Customer • New York, NY</Text>
              <View style={styles.profileStatRow}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>14</Text>
                  <Text style={styles.profileStatLabel}>Orders</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>8</Text>
                  <Text style={styles.profileStatLabel}>Reviews</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>23</Text>
                  <Text style={styles.profileStatLabel}>Saved Proofs</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.switchModeCard}
                onPress={() => setMode('studio')}
              >
                <Text style={{ fontSize: 20 }}>🏬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchModeTitle}>Switch to Merchant Studio</Text>
                  <Text style={styles.switchModeSub}>Manage your shop, live videos & transcoding</Text>
                </View>
                <Text style={{ color: '#D4FF32', fontSize: 18, fontWeight: '800' }}>→</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          /* ================= STUDIO MODE ================= */
          studioTab === 'overview' ? (
            <StudioScreen
              onPublishPress={() => setUploadModalVisible(true)}
              onOpenTranscodeDetails={() => setStudioTab('videos')}
            />
          ) : studioTab === 'inventory' ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Merchant Inventory</Text>
              <Text style={styles.emptySub}>
                148 products in stock across your linked shop. Each item is linked to an uncut Video Proof demonstration.
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setUploadModalVisible(true)}
              >
                <Text style={styles.actionBtnText}>+ Link New Product Demo</Text>
              </TouchableOpacity>
            </View>
          ) : studioTab === 'videos' ? (
            <TranscodeStatusScreen
              onNewUpload={() => setUploadModalVisible(true)}
            />
          ) : (
            <View style={styles.emptyView}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>AS</Text>
              </View>
              <Text style={styles.emptyTitle}>Arlo Studios</Text>
              <Text style={styles.emptySub}>Verified Merchant & Maker • Brooklyn, NY</Text>
              <View style={styles.profileStatRow}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>36</Text>
                  <Text style={styles.profileStatLabel}>Videos</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>24.8k</Text>
                  <Text style={styles.profileStatLabel}>Views</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>99.4%</Text>
                  <Text style={styles.profileStatLabel}>Trust Score</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.switchModeCard}
                onPress={() => setMode('shop')}
              >
                <Text style={{ fontSize: 20 }}>🛍️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchModeTitle}>Switch to Shop Discovery</Text>
                  <Text style={styles.switchModeSub}>View customer feed & trending proofs</Text>
                </View>
                <Text style={{ color: '#D4FF32', fontSize: 18, fontWeight: '800' }}>→</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      {isShop ? (
        /* SHOP MODE BOTTOM BAR (4 TABS) */
        <View style={styles.shopBottomBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setShopTab('home');
            }}
          >
            <Text style={[styles.navIcon, shopTab === 'home' && !selectedVideo && styles.navIconActive]}>
              ⌂
            </Text>
            <Text style={[styles.navLabel, shopTab === 'home' && !selectedVideo && styles.navLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setShopTab('explore');
            }}
          >
            <Text style={[styles.navIcon, shopTab === 'explore' && styles.navIconActive]}>
              🧭
            </Text>
            <Text style={[styles.navLabel, shopTab === 'explore' && styles.navLabelActive]}>
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setShopTab('saved');
            }}
          >
            <Text style={[styles.navIcon, shopTab === 'saved' && styles.navIconActive]}>
              🔖
            </Text>
            <Text style={[styles.navLabel, shopTab === 'saved' && styles.navLabelActive]}>
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setShopTab('profile');
            }}
          >
            <Text style={[styles.navIcon, shopTab === 'profile' && styles.navIconActive]}>
              👤
            </Text>
            <Text style={[styles.navLabel, shopTab === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* STUDIO MODE BOTTOM BAR (5 ITEMS WITH CENTER FLOATING FAB) */
        <View style={styles.studioBottomBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setStudioTab('overview');
            }}
          >
            <Text style={[styles.navIcon, studioTab === 'overview' && !selectedVideo && styles.navIconActive]}>
              📊
            </Text>
            <Text style={[styles.navLabel, studioTab === 'overview' && !selectedVideo && styles.navLabelActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setStudioTab('inventory');
            }}
          >
            <Text style={[styles.navIcon, studioTab === 'inventory' && styles.navIconActive]}>
              📦
            </Text>
            <Text style={[styles.navLabel, studioTab === 'inventory' && styles.navLabelActive]}>
              Inventory
            </Text>
          </TouchableOpacity>

          {/* Elevated Circular Neon Lime "+ Add" Button */}
          <TouchableOpacity
            style={styles.fabCenterButton}
            onPress={() => setUploadModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.fabCenterPlus}>+</Text>
            <Text style={styles.fabCenterLabel}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setStudioTab('videos');
            }}
          >
            <Text style={[styles.navIcon, studioTab === 'videos' && styles.navIconActive]}>
              📹
            </Text>
            <Text style={[styles.navLabel, studioTab === 'videos' && styles.navLabelActive]}>
              Videos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedVideo(null);
              setStudioTab('profile');
            }}
          >
            <Text style={[styles.navIcon, studioTab === 'profile' && styles.navIconActive]}>
              👤
            </Text>
            <Text style={[styles.navLabel, studioTab === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload & Transcoding Modal */}
      <UploadVideoModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSuccess={() => {
          setUploadModalVisible(false);
          setStudioTab('videos');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as any } : {}),
    paddingTop: Platform.OS === 'android' ? (RNStatusBar?.currentHeight ?? 0) : 0,
  },
  body: {
    flex: 1,
  },
  shopBottomBar: {
    height: 64,
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  studioBottomBar: {
    height: 68,
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
    position: 'relative',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#71717A',
  },
  navIconActive: {
    color: '#D4FF32', // Neon lime active icon
  },
  navLabel: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '700',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  fabCenterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D4FF32', // Neon lime floating action button
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#D4FF32',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabCenterPlus: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
  fabCenterLabel: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
    marginTop: -2,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    color: '#A1A1AA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 290,
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: '#D4FF32',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#D4FF32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileStatRow: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: '#141414',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginVertical: 16,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileStatLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  switchModeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  switchModeSub: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2,
  },
});
