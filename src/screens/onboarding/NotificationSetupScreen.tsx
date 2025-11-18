// src/screens/onboarding/NotificationSetupScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Bell, Clock, MessageCircle, Calendar, Shield } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'NotificationSetup'>;

export default function NotificationSetupScreen({ navigation }: Props) {
  const { setNotificationsEnabled } = useAppStore();
  
  const [settings, setSettings] = useState({
    tasks: true,
    events: true,
    messages: true,
    admin: true,
    quietHours: true,
  });

  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');

  const requestPermissions = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications later in Settings'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    const granted = await requestPermissions();
    setNotificationsEnabled(granted);
    
    // TODO: Save notification preferences to Firestore
    
    navigation.navigate('Complete');
  };

  const handleSkip = () => {
    setNotificationsEnabled(false);
    navigation.navigate('Complete');
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bell size={64} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.title}>Stay Updated</Text>
        <Text style={styles.subtitle}>
          Choose what notifications you'd like to receive
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Calendar size={24} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Tasks & Deadlines</Text>
                <Text style={styles.settingDescription}>
                  Get reminded about upcoming tasks
                </Text>
              </View>
            </View>
            <Switch
              value={settings.tasks}
              onValueChange={() => toggleSetting('tasks')}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.tasks ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Calendar size={24} color="#10B981" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Events</Text>
                <Text style={styles.settingDescription}>
                  Alerts for events you're interested in
                </Text>
              </View>
            </View>
            <Switch
              value={settings.events}
              onValueChange={() => toggleSetting('events')}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.events ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MessageCircle size={24} color="#F59E0B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Messages</Text>
                <Text style={styles.settingDescription}>
                  New messages and chat updates
                </Text>
              </View>
            </View>
            <Switch
              value={settings.messages}
              onValueChange={() => toggleSetting('messages')}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.messages ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Shield size={24} color="#8B5CF6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Admin Announcements</Text>
                <Text style={styles.settingDescription}>
                  Important campus updates
                </Text>
              </View>
            </View>
            <Switch
              value={settings.admin}
              onValueChange={() => toggleSetting('admin')}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.admin ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Clock size={24} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Quiet Hours</Text>
                <Text style={styles.settingDescription}>
                  Silence notifications from 22:00 to 07:00
                </Text>
              </View>
            </View>
            <Switch
              value={settings.quietHours}
              onValueChange={() => toggleSetting('quietHours')}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={settings.quietHours ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button
          title="Enable Notifications"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
        />
        <Button
          title="Skip for Now"
          onPress={handleSkip}
          variant="tertiary"
          size="md"
          style={styles.skipButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  actions: {
    paddingTop: 16,
  },
  skipButton: {
    marginTop: 12,
  },
});