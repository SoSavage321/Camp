// src/components/ui/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#3B82F6'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 16,
  },
  size_md: {
    height: 44,
    paddingHorizontal: 24,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: 32,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#3B82F6',
  },
  text_tertiary: {
    color: '#3B82F6',
  },
  text_destructive: {
    color: '#FFFFFF',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.5,
  },
});