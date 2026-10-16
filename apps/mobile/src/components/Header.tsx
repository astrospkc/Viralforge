import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  onProfilePress?: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress, isAuthenticated }) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>VF</Text>
        </View>
        <Text style={styles.brandTitle}>
          VIRAL<Text style={styles.brandAccent}>FORGE</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <Text style={styles.profileText}>
          {isAuthenticated ? 'Account' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandAccent: {
    color: '#E50914',
  },
  profileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

