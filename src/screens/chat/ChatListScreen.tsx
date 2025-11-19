// src/screens/chat/ChatListScreen.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Chat, User } from '@/types';
import { where, orderBy } from 'firebase/firestore';
import ChatListItem from '@/components/cards/ChatListItem';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MessageCircle, Search } from 'lucide-react-native';

export default function ChatListScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [chats, setChats] = useState<Chat[]>([]);
  const [chatUsers, setChatUsers] = useState<Map<string, User>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get chats with user as participant, sorted by last message time
      const constraints = [
        where('participants', 'array-contains', user.id),
        orderBy('lastMessageAt', 'desc')
      ];

      const userChats = await FirestoreService.getDocuments<Chat>('chats', constraints);
      setChats(userChats);

      // Batch load user data for DM chats
      const userIds = new Set<string>();
      userChats.forEach((chat) => {
        if (chat.type === 'dm') {
          const otherUserId = chat.participants.find((id) => id !== user.id);
          if (otherUserId) userIds.add(otherUserId);
        }
      });

      // Batch fetch users instead of sequential calls
      const usersMap = new Map<string, User>();
      if (userIds.size > 0) {
        const userPromises = Array.from(userIds).map(async (userId) => {
          const userData = await FirestoreService.getDocument<User>('users', userId);
          return { userId, userData };
        });
        
        const userResults = await Promise.allSettled(userPromises);
        userResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.userData) {
            usersMap.set(result.value.userId, result.value.userData);
          }
        });
      }

      setChatUsers(usersMap);
    } catch (error) {
      // Remove console.error in production
      if (__DEV__) {
        console.error('Failed to load chats:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const getChatName = useCallback((chat: Chat): string => {
    if (chat.type === 'dm') {
      const otherUserId = chat.participants.find((id) => id !== user?.id);
      const otherUser = otherUserId ? chatUsers.get(otherUserId) : null;
      return otherUser?.name || 'Unknown User';
    }
    // TODO: Get group/event name
    return 'Group Chat';
  }, [user?.id, chatUsers]);

  const getChatAvatar = useCallback((chat: Chat): string | undefined => {
    if (chat.type === 'dm') {
      const otherUserId = chat.participants.find((id) => id !== user?.id);
      const otherUser = otherUserId ? chatUsers.get(otherUserId) : null;
      return otherUser?.avatarUrl;
    }
    return undefined;
  }, [user?.id, chatUsers]);

  const getUnreadCount = useCallback((chat: Chat): number => {
    if (!user || !chat.unreadCount) return 0;
    return chat.unreadCount[user.id] || 0;
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {/* TODO: Implement search */}}
        >
          <Search size={20} color="#6B7280" />
          <Text style={styles.searchText}>Search messages...</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              chat={item}
              chatName={getChatName(item)}
              chatAvatar={getChatAvatar(item)}
              onPress={() =>
                navigation.navigate('ChatThread', {
                  chatId: item.id,
                  chatName: getChatName(item),
                  chatType: item.type,
                })
              }
              unreadCount={getUnreadCount(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon={<MessageCircle size={64} color="#9CA3AF" />}
          title="No messages yet"
          description="Start a conversation with study buddies"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  searchText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  listContent: {
    padding: 16,
  },
});