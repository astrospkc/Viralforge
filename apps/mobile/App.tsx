import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/HomeScreen';
import { VideoDetailScreen } from './src/screens/VideoDetailScreen';
import { TranscodeStatusScreen } from './src/screens/TranscodeStatusScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { MobileVideoItem, ScreenTab } from './src/types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [selectedVideo, setSelectedVideo] = useState<MobileVideoItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSelectVideo = (video: MobileVideoItem) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#141414" />

      {/* Header */}
      <Header
        isAuthenticated={isAuthenticated}
        onProfilePress={() => {
          setSelectedVideo(null);
          setCurrentTab('auth');
        }}
      />

      {/* Main Content Area */}
      <View style={styles.body}>
        {selectedVideo ? (
          <VideoDetailScreen
            video={selectedVideo}
            onClose={handleCloseVideo}
          />
        ) : currentTab === 'home' ? (
          <HomeScreen onSelectVideo={handleSelectVideo} />
        ) : currentTab === 'transcode' ? (
          <TranscodeStatusScreen />
        ) : (
          <AuthScreen
            onSuccess={() => {
              setIsAuthenticated(true);
              setCurrentTab('home');
            }}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedVideo(null);
            setCurrentTab('home');
          }}
        >
          <Text style={[styles.navIcon, currentTab === 'home' && !selectedVideo && styles.navIconActive]}>
            📺
          </Text>
          <Text style={[styles.navLabel, currentTab === 'home' && !selectedVideo && styles.navLabelActive]}>
            Proofs Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedVideo(null);
            setCurrentTab('transcode');
          }}
        >
          <Text style={[styles.navIcon, currentTab === 'transcode' && styles.navIconActive]}>
            ⚡
          </Text>
          <Text style={[styles.navLabel, currentTab === 'transcode' && styles.navLabelActive]}>
            Transcode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedVideo(null);
            setCurrentTab('auth');
          }}
        >
          <Text style={[styles.navIcon, currentTab === 'auth' && styles.navIconActive]}>
            👤
          </Text>
          <Text style={[styles.navLabel, currentTab === 'auth' && styles.navLabelActive]}>
            {isAuthenticated ? 'Profile' : 'Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#282828',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#E50914',
    fontWeight: '700',
  },
});

