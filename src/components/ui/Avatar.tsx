// src/components/ui/Avatar.tsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  online?: boolean;
}

export default function Avatar({ name, imageUrl, size = 40, online }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1',
  ];

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const backgroundColor = colors[colorIndex];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, { width: size, height: size }]} />
      ) : (
        <View style={[styles.placeholder, { backgroundColor, width: size, height: size }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}
      
      {online && (
        <View style={[styles.onlineIndicator, { width: size * 0.25, height: size * 0.25 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: 999,
  },
  placeholder: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});