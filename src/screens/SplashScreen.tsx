
// src/screens/SplashScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BookOpen size={64} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.title}>CampusFlow</Text>
        <Text style={styles.tagline}>Study hard. Live harder.</Text>
      </View>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});
