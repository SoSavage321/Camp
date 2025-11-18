// src/navigation/ChatNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatStackParamList } from './types';

import ChatListScreen from '@/screens/chat/ChatListScreen';
import ChatThreadScreen from '@/screens/chat/ChatThreadScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '600',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="ChatThread"
        component={ChatThreadScreen}
        options={({ route }) => ({ title: route.params.chatName })}
      />
    </Stack.Navigator>
  );
}