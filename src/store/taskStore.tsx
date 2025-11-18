import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Task } from '@/types';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true });
      const data = await FirestoreService.getCollection('tasks');

      const tasks = data.map((doc: any) => ({
        id: doc.id,
        ...doc,
        dueAt: doc.dueAt instanceof Timestamp ? doc.dueAt : Timestamp.fromDate(new Date(doc.dueAt)),
        createdAt: doc.createdAt || Timestamp.now(),
        updatedAt: doc.updatedAt || Timestamp.now(),
      }));

      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleTaskComplete: async (taskId: string) => {
    try {
      const task = get().tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updated = { completed: !task.completed, updatedAt: Timestamp.now() };

      await FirestoreService.updateDocument('tasks', taskId, updated);

      set({
        tasks: get().tasks.map((t) =>
          t.id === taskId ? { ...t, ...updated } : t
        ),
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await FirestoreService.addDocument('tasks', newTask);
      
      const id = typeof docRef === 'string' ? docRef : (docRef as any).id;

      const task: Task = {
        id,
        ...newTask,
      };

      set({ tasks: [...get().tasks, task] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await FirestoreService.updateDocument('tasks', taskId, updateData);

      set({
        tasks: get().tasks.map((t) =>
          t.id === taskId ? { ...t, ...updateData } : t
        ),
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      await FirestoreService.deleteDocument('tasks', taskId);

      set({
        tasks: get().tasks.filter((t) => t.id !== taskId),
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));