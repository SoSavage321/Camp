// src/components/cards/StudyBuddyCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/types';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface StudyBuddyCardProps {
  user: User;
  onConnect: () => void;
  isConnecting?: boolean;
}

export default function StudyBuddyCard({
  user,
  onConnect,
  isConnecting = false,
}: StudyBuddyCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Avatar name={user.name} imageUrl={user.avatarUrl} size={64} />

        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.course}>
            {user.course} • Year {user.year}
          </Text>

          <View style={styles.interests}>
            {user.interests.slice(0, 3).map((interest, index) => (
              <Badge key={index} label={interest} variant="default" />
            ))}
            {user.interests.length > 3 && (
              <Badge label={`+${user.interests.length - 3}`} variant="default" />
            )}
          </View>

          <Button
            title="Connect"
            onPress={onConnect}
            variant="primary"
            size="sm"
            fullWidth
            loading={isConnecting}
            style={styles.button}
          />
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
    alignItems: 'center',
  },
  content: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  course: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});