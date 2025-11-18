// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppStore } from '@/store/appStore';
import { Moon, Sun, Globe } from 'lucide-react-native';
import Card from '@/components/ui/Card';

export default function SettingsScreen() {
  const { theme, setTheme } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Globe },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Card style={styles.card}>
          {themes.map((t, index) => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.themeOption,
                index > 0 && styles.themeOptionBorder,
              ]}
              onPress={() => setTheme(t.value as any)}
            >
              <View style={styles.themeInfo}>
                <View style={styles.themeIcon}>
                  <t.icon size={20} color="#6B7280" />
                </View>
                <Text style={styles.themeLabel}>{t.label}</Text>
              </View>
              {theme === t.value && (
                <View style={styles.themeSelected} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates about tasks, events, and messages
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.dataItem}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.dataTitle}>Download Your Data</Text>
            <Text style={styles.dataDescription}>
              Request a copy of your information
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.dataItem}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.dataTitle}>Delete Account</Text>
            <Text style={[styles.dataDescription, styles.dangerText]}>
              Permanently remove your account and data
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    padding: 24,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeOptionBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  themeSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  dataItem: {
    padding: 16,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dataDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  dangerText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});
