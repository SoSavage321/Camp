// src/components/cards/ChatListItem.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chat } from '@/types';
import { format, isToday, isYesterday } from 'date-fns';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ChatListItemProps {
  chat: Chat;
  chatName: string;
  chatAvatar?: string;
  onPress: () => void;
  unreadCount?: number;
}

export default function ChatListItem({
  chat,
  chatName,
  chatAvatar,
  onPress,
  unreadCount = 0,
}: ChatListItemProps) {
  const formatTime = (date: Date) => {
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const lastMessageTime = chat.lastMessageAt?.toDate();

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <Avatar
          name={chatName}
          imageUrl={chatAvatar}
          size={48}
          online={false} // TODO: Add online status
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {chatName}
            </Text>
            {lastMessageTime && (
              <Text style={styles.time}>
                {formatTime(lastMessageTime)}
              </Text>
            )}
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.message,
                unreadCount > 0 && styles.messageUnread,
              ]}
              numberOfLines={1}
            >
              {chat.lastMessage || 'No messages yet'}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    padding: 12,
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
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  messageUnread: {
    fontWeight: '600',
    color: '#111827',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});