export const COURSES = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Education',
  'Architecture',
  'Other',
] as const;

export const EVENT_CATEGORIES = [
  'social',
  'study',
  'sports',
  'culture',
  'other',
] as const;

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#6B7280' },
  { value: 'med', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
] as const;

export const POMODORO_DURATIONS = [
  { value: 25, label: '25 minutes' },
  { value: 50, label: '50 minutes' },
] as const;

export const INTERESTS = [
  'Sports',
  'Music',
  'Art',
  'Technology',
  'Gaming',
  'Reading',
  'Cooking',
  'Travel',
  'Photography',
  'Fitness',
  'Movies',
  'Fashion',
  'Dance',
  'Writing',
  'Volunteering',
] as const;

export const APP_CONFIG = {
  APP_NAME: 'CampusFlow',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@campusflow.app',
  PRIVACY_URL: 'https://campusflow.app/privacy',
  TERMS_URL: 'https://campusflow.app/terms',
} as const;

export const LIMITS = {
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_NOTES_LENGTH: 500,
  MAX_EVENT_TITLE_LENGTH: 100,
  MAX_EVENT_DESCRIPTION_LENGTH: 1000,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_REPORT_REASON_LENGTH: 500,
  MAX_BIO_LENGTH: 200,
} as const;