// src/hooks/useTheme.ts

import { useColorScheme } from 'react-native';
import { useAppStore } from '@/store/appStore';
import { ThemeColors } from '@/types';

const lightColors: ThemeColors = {
  brand: {
    primary: '#3B82F6',
    primaryContrast: '#FFFFFF',
    secondary: '#10B981',
    accent: '#F59E0B',
  },
  fg: {
    default: '#111827',
    muted: '#6B7280',
  },
  bg: {
    canvas: '#FFFFFF',
    surface: '#F9FAFB',
    elevated: '#FFFFFF',
  },
  border: {
    default: '#E5E7EB',
  },
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};

const darkColors: ThemeColors = {
  brand: {
    primary: '#3B82F6',
    primaryContrast: '#FFFFFF',
    secondary: '#10B981',
    accent: '#F59E0B',
  },
  fg: {
    default: '#F9FAFB',
    muted: '#9CA3AF',
  },
  bg: {
    canvas: '#0B1220',
    surface: '#111827',
    elevated: '#1F2937',
  },
  border: {
    default: '#374151',
  },
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { theme } = useAppStore();

  const activeTheme = theme === 'system' 
    ? systemColorScheme || 'light'
    : theme;

  const colors = activeTheme === 'dark' ? darkColors : lightColors;
  const isDark = activeTheme === 'dark';

  return { colors, isDark, theme: activeTheme };
}