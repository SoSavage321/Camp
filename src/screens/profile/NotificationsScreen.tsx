import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'study' | 'social' | 'system';
}

const NotificationsScreen = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Study Reminders',
      description: 'Get notified about upcoming study sessions',
      enabled: true,
      category: 'study',
    },
    {
      id: '2',
      title: 'Assignment Deadlines',
      description: 'Reminders for assignment due dates',
      enabled: true,
      category: 'study',
    },
    {
      id: '3',
      title: 'Exam Alerts',
      description: 'Notifications about upcoming exams',
      enabled: true,
      category: 'study',
    },
    {
      id: '4',
      title: 'Study Group Invites',
      description: 'When someone invites you to a study group',
      enabled: true,
      category: 'social',
    },
    {
      id: '5',
      title: 'Friend Requests',
      description: 'New connection requests from other students',
      enabled: true,
      category: 'social',
    },
    {
      id: '6',
      title: 'Messages',
      description: 'New messages from your connections',
      enabled: true,
      category: 'social',
    },
    {
      id: '7',
      title: 'Event Updates',
      description: 'Changes to events you\'re attending',
      enabled: false,
      category: 'social',
    },
    {
      id: '8',
      title: 'App Updates',
      description: 'News about new features and improvements',
      enabled: false,
      category: 'system',
    },
    {
      id: '9',
      title: 'Tips & Suggestions',
      description: 'Helpful study tips and recommendations',
      enabled: false,
      category: 'system',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const getCategorySettings = (category: string) => {
    return settings.filter((s) => s.category === category);
  };

  const renderCategory = (
    title: string,
    category: 'study' | 'social' | 'system'
  ) => {
    const categorySettings = getCategorySettings(category);

    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {categorySettings.map((setting) => (
          <View key={setting.id} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              <Text style={styles.settingDescription}>
                {setting.description}
              </Text>
            </View>
            <Switch
              value={setting.enabled}
              onValueChange={() => toggleSetting(setting.id)}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={setting.enabled ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Manage your notification preferences to stay updated on what matters
            most to you.
          </Text>
        </View>

        {renderCategory('Study & Academics', 'study')}
        {renderCategory('Social & Connections', 'social')}
        {renderCategory('System & Updates', 'system')}

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All Notifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  clearButton: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export default NotificationsScreen;