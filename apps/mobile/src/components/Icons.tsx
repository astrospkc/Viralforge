import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export const BagIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.85, color, textAlign: 'center' }}>🛍️</Text>
    </View>
  );
};

export const StudioIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.85, color, textAlign: 'center' }}>🏬</Text>
    </View>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = '#A1A1AA' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>🔍</Text>
    </View>
  );
};

export const HomeIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>⌂</Text>
    </View>
  );
};

export const CompassIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>🧭</Text>
    </View>
  );
};

export const BookmarkIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>🔖</Text>
    </View>
  );
};

export const ProfileIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>👤</Text>
    </View>
  );
};

export const ChartIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>📊</Text>
    </View>
  );
};

export const BoxIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>📦</Text>
    </View>
  );
};

export const VideoCameraIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, textAlign: 'center' }}>📹</Text>
    </View>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ size = 22, color = '#000000' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size, fontWeight: '900', color, textAlign: 'center', lineHeight: size * 1.1 }}>+</Text>
    </View>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ size = 14, color = '#D4FF32' }) => {
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, fontWeight: '900', color, textAlign: 'center' }}>✓</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

