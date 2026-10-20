import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface StudioScreenProps {
  onPublishPress: () => void;
  onOpenTranscodeDetails?: () => void;
}

const BAR_DATA = [
  { day: 'M', height: 42, views: '1.8k' },
  { day: 'T', height: 58, views: '2.4k' },
  { day: 'W', height: 48, views: '2.1k' },
  { day: 'T', height: 75, views: '3.6k' },
  { day: 'F', height: 68, views: '3.2k' },
  { day: 'S', height: 95, views: '4.9k' },
  { day: 'S', height: 110, views: '6.8k' },
];

export const StudioScreen: React.FC<StudioScreenProps> = ({
  onPublishPress,
  onOpenTranscodeDetails,
}) => {
  const [selectedBar, setSelectedBar] = useState(6); // default to latest day

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Merchant Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MERCHANT STUDIO</Text>
        <Text style={styles.title}>Good morning, Arlo.</Text>
      </View>

      {/* Hero Analytics Card: Product Video Views with Bar Graph */}
      <View style={styles.analyticsCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.thisWeekPill}>
            <Text style={styles.sparkleIcon}>✨</Text>
            <Text style={styles.thisWeekText}>THIS WEEK</Text>
          </View>
          <View style={styles.growthBadge}>
            <Text style={styles.growthText}>↑ 18%</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricInfo}>
            <Text style={styles.largeMetric}>24.8k</Text>
            <Text style={styles.metricLabel}>product video views</Text>
          </View>

          {/* Bar Chart Visualization */}
          <View style={styles.chartContainer}>
            {BAR_DATA.map((item, index) => {
              const isSelected = selectedBar === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.barCol}
                  onPress={() => setSelectedBar(index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: item.height },
                        isSelected && styles.barFillActive,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, isSelected && styles.barDayActive]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected day tooltip */}
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterText}>
            Selected: <Text style={styles.chartFooterHighlight}>{BAR_DATA[selectedBar].views} views</Text> on {BAR_DATA[selectedBar].day}
          </Text>
        </View>
      </View>

      {/* High-Impact Neon Lime "Publish a product video" Banner */}
      <TouchableOpacity
        style={styles.publishBanner}
        onPress={onPublishPress}
        activeOpacity={0.88}
      >
        <View style={styles.publishIconCircle}>
          <Text style={styles.publishPlus}>+</Text>
        </View>
        <View style={styles.publishContent}>
          <Text style={styles.publishTitle}>Publish a product video</Text>
          <Text style={styles.publishSubtitle}>Show what's in stock, build buyer trust</Text>
        </View>
        <Text style={styles.publishArrow}>→</Text>
      </TouchableOpacity>

      {/* 2x2 Metric Grid */}
      <View style={styles.gridContainer}>
        {/* Card 1: In Stock */}
        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: '#1C2912' }]}>
            <Text style={styles.iconEmoji}>📦</Text>
          </View>
          <Text style={styles.gridLabel}>In stock</Text>
          <Text style={styles.gridNumber}>148</Text>
          <Text style={[styles.gridSubtext, { color: '#EAB308' }]}>12 low</Text>
        </View>

        {/* Card 2: Live Videos */}
        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: '#132838' }]}>
            <Text style={styles.iconEmoji}>📹</Text>
          </View>
          <Text style={styles.gridLabel}>Live videos</Text>
          <Text style={styles.gridNumber}>36</Text>
          <Text style={[styles.gridSubtext, { color: '#4ADE80' }]}>+4 this week</Text>
        </View>

        {/* Card 3: Link Taps */}
        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: '#2E182A' }]}>
            <Text style={styles.iconEmoji}>🛍️</Text>
          </View>
          <Text style={styles.gridLabel}>Link taps</Text>
          <Text style={styles.gridNumber}>892</Text>
          <Text style={[styles.gridSubtext, { color: '#4ADE80' }]}>↑ 21%</Text>
        </View>

        {/* Card 4: Watch Rate */}
        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: '#292614' }]}>
            <Text style={styles.iconEmoji}>📊</Text>
          </View>
          <Text style={styles.gridLabel}>Watch rate</Text>
          <Text style={styles.gridNumber}>72%</Text>
          <Text style={[styles.gridSubtext, { color: '#A1A1AA' }]}>Top 10%</Text>
        </View>
      </View>

      {/* Active Transcoding Pipeline Section */}
      <TouchableOpacity
        style={styles.pipelineCard}
        onPress={onOpenTranscodeDetails}
        activeOpacity={0.85}
      >
        <View style={styles.pipelineHeader}>
          <View>
            <Text style={styles.pipelineTitle}>Active HLS Encoding Pipeline</Text>
            <Text style={styles.pipelineSub}>ATH-M50x Raw Studio Demo.mp4</Text>
          </View>
          <View style={styles.pipelineBadge}>
            <Text style={styles.pipelineBadgeText}>⚡ 74%</Text>
          </View>
        </View>

        <View style={styles.pipelineTrack}>
          <View style={[styles.pipelineFill, { width: '74%' }]} />
        </View>

        <View style={styles.resolutionRow}>
          <Text style={styles.resItem}>1080p ✓</Text>
          <Text style={styles.resItem}>720p ✓</Text>
          <Text style={[styles.resItem, { color: '#D4FF32' }]}>480p ⏳</Text>
          <Text style={styles.resItem}>HLS Master •</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eyebrow: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    letterSpacing: -0.5,
  },
  analyticsCard: {
    marginHorizontal: 16,
    backgroundColor: '#141414',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  thisWeekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sparkleIcon: {
    fontSize: 12,
  },
  thisWeekText: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  growthBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  growthText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '800',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metricInfo: {
    flex: 1,
  },
  largeMetric: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    letterSpacing: -1,
    lineHeight: 52,
    marginBottom: 2,
  },
  metricLabel: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
    paddingBottom: 4,
  },
  barCol: {
    alignItems: 'center',
    width: 16,
  },
  barTrack: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: 14,
    borderRadius: 6,
    backgroundColor: '#3A4A1C', // Muted olive
  },
  barFillActive: {
    backgroundColor: '#D4FF32', // Neon lime active bar
  },
  barDay: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  barDayActive: {
    color: '#D4FF32',
  },
  chartFooter: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    paddingTop: 10,
  },
  chartFooterText: {
    color: '#71717A',
    fontSize: 12,
  },
  chartFooterHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  publishBanner: {
    marginHorizontal: 16,
    backgroundColor: '#D4FF32', // Vibrant Electric Lime
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#D4FF32',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  publishIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  publishPlus: {
    color: '#D4FF32',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  publishContent: {
    flex: 1,
  },
  publishTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  publishSubtitle: {
    color: '#3F3F46',
    fontSize: 12,
    fontWeight: '600',
  },
  publishArrow: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 8,
  },
  gridContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242424',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 18,
  },
  gridLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    marginBottom: 8,
  },
  gridSubtext: {
    fontSize: 11,
    fontWeight: '700',
  },
  pipelineCard: {
    marginHorizontal: 16,
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 40,
  },
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pipelineTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  pipelineSub: {
    color: '#71717A',
    fontSize: 11,
  },
  pipelineBadge: {
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pipelineBadgeText: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '800',
  },
  pipelineTrack: {
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  pipelineFill: {
    height: '100%',
    backgroundColor: '#D4FF32',
  },
  resolutionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resItem: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
  },
});

