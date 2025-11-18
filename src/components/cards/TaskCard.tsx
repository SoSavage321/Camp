// src/components/cards/TaskCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/types';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react-native';
import { format, isPast } from 'date-fns';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

export default function TaskCard({ task, onPress, onToggle }: TaskCardProps) {
  const dueDate = task.dueAt.toDate();
  const isOverdue = isPast(dueDate) && !task.completed;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#EF4444';
      case 'med': return '#F59E0B';
      case 'low': return '#6B7280';
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          {task.completed ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              task.completed && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          <View style={styles.meta}>
            <View style={styles.dueDate}>
              {isOverdue ? (
                <AlertCircle size={14} color="#EF4444" />
              ) : (
                <Clock size={14} color="#6B7280" />
              )}
              <Text
                style={[
                  styles.dueDateText,
                  isOverdue && styles.overdueText,
                ]}
              >
                {format(dueDate, 'MMM d, h:mm a')}
              </Text>
            </View>

            {task.course && (
              <Badge label={task.course} variant="info" />
            )}
          </View>
        </View>

        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor() },
          ]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginLeft: 12,
  },
});