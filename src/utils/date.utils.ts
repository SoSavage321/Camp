// src/utils/date.utils.ts

import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM d, h:mm a');
};

export const formatTimeAgo = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const isOverdue = (date: Date): boolean => {
  return isPast(date);
};