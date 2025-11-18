// src/components/cards/GroupCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Group } from '@/types';
import { Users, Calendar } from 'lucide-react-native';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <Avatar
          name={group.name}
          imageUrl={group.avatarUrl}
          size={56}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {group.name}
            </Text>
            <Badge
              label={group.type === 'society' ? 'Society' : 'Study Group'}
              variant={group.type === 'society' ? 'primary' : 'success'}
            />
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {group.description}
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.statText}>
                {group.memberCount} members
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
