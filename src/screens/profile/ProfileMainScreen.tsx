// src/screens/profile/ProfileMainScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit,
  ShieldAlert,
} from 'lucide-react-native';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ProfileMainScreen() {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Edit size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              name={user.name}
              imageUrl={user.avatarUrl}
              size={80}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileCourse}>
                {user.course} • Year {user.year}
              </Text>
              <View style={styles.roles}>
                {user.roles.admin && (
                  <Badge label="Admin" variant="danger" />
                )}
                {user.roles.organizer && (
                  <Badge label="Organizer" variant="warning" />
                )}
              </View>
            </View>
          </View>

          {user.interests.length > 0 && (
            <View style={styles.interests}>
              <Text style={styles.interestsTitle}>Interests</Text>
              <View style={styles.interestsList}>
                {user.interests.map((interest, index) => (
                  <Badge key={index} label={interest} variant="default" />
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem
            icon={<Settings size={20} color="#6B7280" />}
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem
            icon={<Bell size={20} color="#6B7280" />}
            title="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <MenuItem
            icon={<Shield size={20} color="#6B7280" />}
            title="Safety & Privacy"
            onPress={() => navigation.navigate('Safety')}
          />
          <MenuItem
            icon={<HelpCircle size={20} color="#6B7280" />}
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'Contact: support@campusflow.app')}
          />
          
          {user.roles.admin && (
            <>
              <View style={styles.divider} />
              <MenuItem
                icon={<ShieldAlert size={20} color="#EF4444" />}
                title="Admin Console"
                subtitle="Manage events and reports"
                onPress={() => navigation.navigate('Admin')}
              />
            </>
          )}

          <View style={styles.divider} />
          <MenuItem
            icon={<LogOut size={20} color="#EF4444" />}
            title="Sign Out"
            onPress={handleSignOut}
            danger
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>CampusFlow v1.0.0</Text>
          <Text style={styles.copyright}>© 2024 CampusFlow</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileCourse: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  roles: {
    flexDirection: 'row',
    gap: 8,
  },
  interests: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  interestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  menuTitleDanger: {
    color: '#EF4444',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 68,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  version: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});