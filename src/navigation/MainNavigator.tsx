// src/navigation/MainNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react-native';

import HomeScreen from '@/screens/home/HomeScreen';
import StudyNavigator from './StudyNavigator';
import SocialNavigator from './SocialNavigator';
import ChatNavigator from './ChatNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StudyTab"
        component={StudyNavigator}
        options={{
          title: 'Study',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SocialTab"
        component={SocialNavigator}
        options={{
          title: 'Social',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
          tabBarBadge: undefined, // TODO: Add unread count
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}