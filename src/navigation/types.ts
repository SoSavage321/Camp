// src/navigation/types.ts

import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  NotificationSetup: undefined;
  Complete: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  StudyTab: NavigatorScreenParams<StudyStackParamList>;
  SocialTab: NavigatorScreenParams<SocialStackParamList>;
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type StudyStackParamList = {
  StudyMain: undefined;
  TaskDetail: { taskId?: string; mode?: 'create' | 'edit' };
  CramMode: undefined;
  StudyRoom: { roomId: string; course: string };
  Calendar: undefined;
};

export type SocialStackParamList = {
  SocialMain: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  EditEvent: { eventId: string };
  GroupDetail: { groupId: string };
  StudyBuddies: undefined;
  UserProfile: { userId: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatThread: { chatId: string; chatName: string; chatType: 'dm' | 'group' | 'room' };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Safety: undefined;
  BlockedUsers: undefined;
  Admin: undefined;
  Reports: undefined;
  PendingEvents: undefined;
};
