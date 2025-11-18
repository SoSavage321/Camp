// src/types/index.ts

import { Timestamp } from 'firebase/firestore';

// ==================== User Types ====================
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  course: string;
  year: number;
  interests: string[];
  roles: UserRoles;
  quietHours: QuietHours;
  lastSeen: Timestamp;
  pushToken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
}
// Default Roles
export const defaultRoles: UserRoles = {
  student: true,
  organizer: false,
  admin: false,
};

// Default Quiet Hours
export const defaultQuietHours: QuietHours = {
  start: "22:00",
  end: "06:00",
  enabled: false,
};
export interface UserRoles {
  student: boolean;
  organizer: boolean;
  admin: boolean;
}

export interface QuietHours {
  start: string; // "22:00"
  end: string; // "07:00"
  enabled: boolean;
}

// ==================== Task Types ====================
export type TaskPriority = 'low' | 'med' | 'high';

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  notes?: string;
  dueAt: Timestamp;
  course?: string;
  priority: TaskPriority;
  completed: boolean;
  reminderAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateTaskInput {
  title: string;
  notes?: string;
  dueAt: Date;
  course?: string;
  priority: TaskPriority;
  reminderAt?: Date;
}

// ==================== Event Types ====================
export type EventCategory = 'social' | 'study' | 'sports' | 'culture' | 'other';
export type EventVisibility = 'public' | 'group' | 'private';
export type EventStatus = 'pending' | 'approved' | 'rejected';
export type LocationType = 'physical' | 'link';

export interface EventLocation {
  type: LocationType;
  value: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  hostId: string;
  hostName: string;
  category: EventCategory;
  startsAt: Timestamp;
  endsAt: Timestamp;
  location: EventLocation;
  visibility: EventVisibility;
  capacity?: number;
  featured: boolean;
  status: EventStatus;
  attendeeCount: number;
  interestedCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateEventInput {
  title: string;
  description: string;
  coverUrl?: string;
  category: EventCategory;
  startsAt: Date;
  endsAt: Date;
  location: EventLocation;
  visibility: EventVisibility;
  capacity?: number;
}

// ==================== RSVP Types ====================
export type RSVPStatus = 'going' | 'interested';

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  status: RSVPStatus;
  createdAt: Timestamp;
}

// ==================== Group Types ====================
export type GroupType = 'society' | 'study';
export type GroupMemberRole = 'member' | 'moderator';

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  description: string;
  avatarUrl?: string;
  ownerId: string;
  memberCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: Timestamp;
}

// ==================== Chat Types ====================
export type ChatType = 'dm' | 'group' | 'room';

export interface Chat {
  id: string;
  type: ChatType;
  subjectId: string; // userId for DM, groupId for group, eventId for room
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  unreadCount?: { [userId: string]: number };
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: Timestamp;
  read: boolean;
}

// ==================== Study Room Types ====================
export interface StudyRoom {
  id: string;
  course: string;
  active: boolean;
  participants: string[];
  sessionType: 'pomodoro' | 'focus';
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  duration: 25 | 50;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  pausedAt?: Timestamp;
  totalFocusTime: number; // in minutes
  breaks: number;
}

// ==================== Report Types ====================
export type ReportTargetType = 'message' | 'user' | 'event';
export type ReportStatus = 'open' | 'reviewed' | 'closed';

export interface Report {
  id: string;
  reporterId: string;
  target: {
    type: ReportTargetType;
    id: string;
  };
  reason: string;
  createdAt: Timestamp;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  action?: string;
}

// ==================== Announcement Types ====================
export type AnnouncementAudience = 'all' | 'group' | 'year';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  targetId?: string; // groupId or year number
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  priority: 'low' | 'medium' | 'high';
}

// ==================== Notification Types ====================
export type NotificationType =
  | 'task_due'
  | 'event_soon'
  | 'dm_new'
  | 'group_update'
  | 'admin_announcement'
  | 'rsvp_reminder'
  | 'study_buddy_request';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data: {
    targetId: string;
    targetType: string;
    [key: string]: any;
  };
}

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: any;
  read: boolean;
  createdAt: Timestamp;
}

// ==================== Study Buddy Types ====================
export interface StudyBuddyRequest {
  id: string;
  requesterId: string;
  targetId: string;
  course: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

// ==================== Filter & Sort Types ====================
export interface TaskFilters {
  status?: 'all' | 'active' | 'completed' | 'overdue';
  course?: string;
  priority?: TaskPriority;
  dateRange?: 'today' | 'week' | 'month';
}

export interface EventFilters {
  category?: EventCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  myRSVPs?: boolean;
}

// ==================== Navigation Types ====================
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  Profile: undefined;
  Notifications: undefined;
  Complete: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Study: undefined;
  Social: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type StudyStackParamList = {
  StudyMain: undefined;
  TaskDetail: { taskId?: string };
  CramMode: undefined;
  StudyRoom: { roomId: string };
};

export type SocialStackParamList = {
  SocialMain: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  GroupDetail: { groupId: string };
  StudyBuddies: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatThread: { chatId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Safety: undefined;
  Admin: undefined;
};

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==================== Form State Types ====================
export interface FormState {
  isSubmitting: boolean;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
}

// ==================== Theme Types ====================
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  brand: {
    primary: string;
    primaryContrast: string;
    secondary: string;
    accent: string;
  };
  fg: {
    default: string;
    muted: string;
  };
  bg: {
    canvas: string;
    surface: string;
    elevated: string;
  };
  border: {
    default: string;
  };
  state: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}