// src/screens/study/StudyRoomScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudyStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Message, User } from '@/types';
import { where, orderBy, onSnapshot, collection, query, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { Send, Users as UsersIcon } from 'lucide-react-native';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

type Props = NativeStackScreenProps<StudyStackParamList, 'StudyRoom'>;

export default function StudyRoomScreen({ route, navigation }: Props) {
  const { roomId, course } = route.params;
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadParticipants();

    // Real-time message listener
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', roomId),
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
    });

    return () => unsubscribe();
  }, [roomId]);

  const loadParticipants = async () => {
    // TODO: Load participants from study room
  };

  const handleSend = async () => {
    if (!messageText.trim() || !user) return;

    try {
      const messageData = {
        chatId: roomId,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatarUrl,
        text: messageText.trim(),
        read: false,
      };

      await FirestoreService.addDocument('messages', messageData);
      setMessageText('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={roomStyles.header}>
        <View style={roomStyles.headerInfo}>
          <Badge label={course} variant="info" />
          <View style={roomStyles.participants}>
            <UsersIcon size={16} color="#6B7280" />
            <Text style={roomStyles.participantsText}>
              {participants.length} studying
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={roomStyles.message}>
            <Avatar
              name={item.senderName}
              imageUrl={item.senderAvatar}
              size={32}
            />
            <View style={roomStyles.messageContent}>
              <Text style={roomStyles.messageSender}>{item.senderName}</Text>
              <Text style={roomStyles.messageText}>{item.text}</Text>
            </View>
          </View>
        )}
        inverted
        contentContainerStyle={roomStyles.messagesList}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send encouragement..."
          placeholderTextColor="#9CA3AF"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!messageText.trim()}
        >
          <Send
            size={20}
            color={messageText.trim() ? '#FFFFFF' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});


const roomStyles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  participantsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
});

Object.assign(styles, roomStyles);