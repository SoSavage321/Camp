import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

interface SafetySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const SafetyScreen = () => {
  const [settings, setSettings] = useState<SafetySetting[]>([
    {
      id: '1',
      title: 'Private Profile',
      description: 'Only approved connections can view your profile',
      enabled: false,
    },
    {
      id: '2',
      title: 'Hide Online Status',
      description: 'Don\'t show when you\'re active on the app',
      enabled: false,
    },
    {
      id: '3',
      title: 'Require Message Approval',
      description: 'Review message requests before they reach your inbox',
      enabled: true,
    },
    {
      id: '4',
      title: 'Location Sharing',
      description: 'Share your location with study groups',
      enabled: false,
    },
    {
      id: '5',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false,
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

  const handleReportIssue = () => {
    Alert.alert(
      'Report Safety Issue',
      'You will be directed to the reporting form. All reports are confidential.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Report pressed') },
      ]
    );
  };

  const handleBlockedUsers = () => {
    // Navigation would be handled by your navigator
    console.log('Navigate to Blocked Users');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'This will open the Campus Flow Privacy Policy in your browser.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Open privacy policy') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety & Privacy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>🛡️ Your Safety Matters</Text>
          <Text style={styles.alertText}>
            Campus Flow is committed to creating a safe environment for all
            students. Use these settings to control your privacy and security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          {settings.map((setting) => (
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBlockedUsers}
          >
            <Text style={styles.actionButtonText}>Blocked Users</Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReportIssue}
          >
            <Text style={styles.actionButtonText}>Report a Safety Issue</Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrivacyPolicy}
          >
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you're experiencing harassment or feel unsafe, please report it
            immediately. Our team reviews all reports within 24 hours.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>
              Contact Support Team
            </Text>
          </TouchableOpacity>
        </View>
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
  alertCard: {
    backgroundColor: '#f0fdf4',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
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
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  actionButtonArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  helpSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SafetyScreen;