// src/screens/profile/admin/AdminScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Flag, Users, Bell, ChevronRight } from 'lucide-react-native';
import Card from '@/components/ui/Card';

export default function AdminScreen() {
  const navigation = useNavigation<any>();

  const adminItems = [
    {
      icon: <Calendar size={24} color="#3B82F6" />,
      title: 'Pending Events',
      description: 'Review and approve event submissions',
      count: 3,
      onPress: () => navigation.navigate('PendingEvents'),
    },
    {
      icon: <Flag size={24} color="#EF4444" />,
      title: 'Reports',
      description: 'Handle user reports and violations',
      count: 5,
      onPress: () => navigation.navigate('Reports'),
    },
    {
      icon: <Users size={24} color="#10B981" />,
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      count: 0,
      onPress: () => {/* TODO */},
    },
    {
      icon: <Bell size={24} color="#F59E0B" />,
      title: 'Announcements',
      description: 'Send campus-wide notifications',
      count: 0,
      onPress: () => {/* TODO */},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Console</Text>
        <Text style={styles.subtitle}>
          Manage events, handle reports, and moderate content
        </Text>
      </View>

      <View style={styles.content}>
        {adminItems.map((item, index) => (
          <AdminItem
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            count={item.count}
            onPress={item.onPress}
          />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatItem label="Total Users" value="1,234" />
            <StatItem label="Active Events" value="45" />
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <StatItem label="Groups" value="23" />
            <StatItem label="Messages" value="5.6k" />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function AdminItem({
  icon,
  title,
  description,
  count,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  onPress: () => void;
}) {
  return (
    <Card style={styles.adminItem} onPress={onPress}>
      <View style={styles.adminItemContent}>
        <View style={styles.adminItemIcon}>{icon}</View>
        <View style={styles.adminItemText}>
          <View style={styles.adminItemHeader}>
            <Text style={styles.adminItemTitle}>{title}</Text>
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </View>
          <Text style={styles.adminItemDescription}>{description}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 24,
    gap: 12,
  },
  adminItem: {
    padding: 0,
  },
  adminItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  adminItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminItemText: {
    flex: 1,
  },
  adminItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  adminItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  adminItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 999,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsSection: {
    padding: 24,
    paddingTop: 0,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  statsCard: {
    padding: 0,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});