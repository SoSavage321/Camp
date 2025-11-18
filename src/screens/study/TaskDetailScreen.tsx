// src/screens/study/TaskDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudyStackParamList } from '@/navigation/types';
import { useTaskStore } from '@/store/taskStore';
import { TaskPriority } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2, Bell } from 'lucide-react-native';
import { format } from 'date-fns';
import { Task } from "@/types";
import { Timestamp } from 'firebase/firestore';


type Props = NativeStackScreenProps<StudyStackParamList, 'TaskDetail'>;

const COURSES = ['ECO101', 'CS102', 'MTH201', 'BIO110', 'ENG120', 'Other'];

export default function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId, mode } = route.params || {};
  const { tasks, addTask, updateTask, deleteTask, isLoading } = useTaskStore();

  const existingTask = taskId ? tasks.find(t => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [notes, setNotes] = useState(existingTask?.notes || '');
  const [dueDate, setDueDate] = useState(
    existingTask ? existingTask.dueAt.toDate() : new Date()
  );
  const [course, setCourse] = useState(existingTask?.course || '');
  const [priority, setPriority] = useState<TaskPriority>(
    existingTask?.priority || 'med'
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
       title: title.trim(),
       notes: notes.trim(),
       dueAt: Timestamp.fromDate(dueDate),
       course: course || undefined,
       priority,
       ownerId: existingTask?.ownerId || "default",  // or get from auth
       completed: existingTask?.completed ?? false,  // default false
     };
     
      if (mode === 'edit' && taskId) {
        await updateTask(taskId, taskData);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        await addTask(taskData);
        Alert.alert('Success', 'Task created successfully');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save task');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (taskId) {
              await deleteTask(taskId);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title *"
          placeholder="e.g., Complete ECO101 Essay"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label="Notes"
          placeholder="Add any additional details..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Due Date & Time *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              📅 {format(dueDate, 'MMM d, yyyy')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              🕐 {format(dueDate, 'h:mm a')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Course */}
        <View style={styles.section}>
          <Text style={styles.label}>Course (Optional)</Text>
          <View style={styles.chips}>
            {COURSES.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={course === c}
                onPress={() => setCourse(course === c ? '' : c)}
              />
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.chips}>
            <Chip
              label="Low"
              selected={priority === 'low'}
              onPress={() => setPriority('low')}
            />
            <Chip
              label="Medium"
              selected={priority === 'med'}
              onPress={() => setPriority('med')}
            />
            <Chip
              label="High"
              selected={priority === 'high'}
              onPress={() => setPriority('high')}
            />
          </View>
        </View>

        {mode === 'edit' && (
          <Button
            title="Delete Task"
            onPress={handleDelete}
            variant="destructive"
            size="md"
            fullWidth
            style={styles.deleteButton}
          />
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title={mode === 'edit' ? 'Update Task' : 'Create Task'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        />
      </View>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setDueDate(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateButton: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deleteButton: {
    marginTop: 24,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});