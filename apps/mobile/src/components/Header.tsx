import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onProfilePress?: () => void;
  userInitial?: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onProfilePress,
  userInitial,
}) => {
  const isShop = mode === 'shop';
  const initial = userInitial || (isShop ? 'MK' : 'AS');

  return (
    <View style={styles.container}>
      {/* Brand / Logo */}
      <View style={styles.brandContainer}>
        <View style={styles.playBadge}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <Text style={styles.brandText}>viralforge</Text>
      </View>

      {/* Center Segmented Pill Toggle: Shop | Studio */}
      <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.togglePill, isShop && styles.togglePillActive]}
            onPress={() => onModeChange('shop')}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleIcon, isShop && styles.toggleTextActive]}>🛍️</Text>
            <Text style={[styles.toggleText, isShop && styles.toggleTextActive]}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.togglePill, !isShop && styles.togglePillActive]}
            onPress={() => onModeChange('studio')}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleIcon, !isShop && styles.toggleTextActive]}>🏬</Text>
            <Text style={[styles.toggleText, !isShop && styles.toggleTextActive]}>Studio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Avatar Circle */}
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={onProfilePress}
        activeOpacity={0.8}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#D4FF32', // Neon lime
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  playIcon: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '900',
    marginLeft: 2,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  toggleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  togglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    gap: 4,
  },
  togglePillActive: {
    backgroundColor: '#D4FF32', // Neon lime active background
  },
  toggleIcon: {
    fontSize: 12,
  },
  toggleText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#000000', // Black text when on lime
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#383838',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
