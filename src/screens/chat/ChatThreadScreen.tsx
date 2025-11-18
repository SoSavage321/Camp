// src/screens/chat/ChatThreadScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Message } from '@/types';
import { where, orderBy, Timestamp, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { Send, MoreVertical } from 'lucide-react-native';
import { format, isToday, isYesterday } from 'date-fns';
import Avatar from '@/components/ui/Avatar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatThread'>;

export default function ChatThreadScreen({ route, navigation }: Props) {
  const { chatId, chatName, chatType } = route.params;
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Real-time message listener
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: Message[] = [];
      
      snapshot.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });

      setMessages(messageList);
      setIsLoading(false);

      // Mark messages as read
      markMessagesAsRead(messageList);
    });

    return () => unsubscribe();
  }, [chatId]);

  const markMessagesAsRead = async (messageList: Message[]) => {
    // TODO: Update unread count in chat document
  };

  const handleSend = async () => {
    if (!messageText.trim() || !user) return;

    try {
      setIsSending(true);

      const messageData = {
        chatId,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatarUrl,
        text: messageText.trim(),
        read: false,
      };

      await FirestoreService.addDocument('messages', messageData);

      // Update chat with last message
      await FirestoreService.updateDocument('chats', chatId, {
        lastMessage: messageText.trim(),
        lastMessageAt: Timestamp.now(),
      });

      setMessageText('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;
    const messageDate = item.createdAt.toDate();

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && (
          <Avatar
            name={item.senderName}
            imageUrl={item.senderAvatar}
            size={32}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          {!isOwnMessage && chatType !== 'dm' && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownText : styles.otherText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isOwnMessage ? styles.ownTime : styles.otherTime,
            ]}
          >
            {formatMessageTime(messageDate)}
          </Text>
        </View>
      </View>
    );
  };

  const renderSafetyNote = () => (
    <View style={styles.safetyNote}>
      <Text style={styles.safetyText}>
        Be kind. No harassment. Violations may lead to suspension.
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.messagesList}
        ListFooterComponent={renderSafetyNote}
        onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
        >
          <Send
            size={20}
            color={messageText.trim() ? '#FFFFFF' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherTime: {
    color: '#9CA3AF',
  },
  safetyNote: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  safetyText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});

