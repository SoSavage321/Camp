// src/components/ui/Chip.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
}

export default function Chip({ label, onPress, selected = false, style }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  textSelected: {
    color: '#FFFFFF',
  },
});