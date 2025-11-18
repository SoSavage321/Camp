// src/components/ui/Badge.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: '#DBEAFE',
  },
  success: {
    backgroundColor: '#D1FAE5',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  danger: {
    backgroundColor: '#FEE2E2',
  },
  info: {
    backgroundColor: '#E0E7FF',
  },
  default: {
    backgroundColor: '#F3F4F6',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  text_primary: {
    color: '#1E40AF',
  },
  text_success: {
    color: '#065F46',
  },
  text_warning: {
    color: '#92400E',
  },
  text_danger: {
    color: '#991B1B',
  },
  text_info: {
    color: '#3730A3',
  },
  text_default: {
    color: '#374151',
  },
});
