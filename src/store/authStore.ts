// src/store/authStore.ts
import { create } from "zustand";
import { User } from "@/types";

// Default fake role data
const defaultRoles = {
  student: true,
  organizer: false,
  admin: false,
};

// Default fake quiet-hours
const defaultQuietHours = {
  start: "22:00",
  end: "07:00",
  enabled: false,
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  // -----------------------------------------------------
  // 🔥 BYPASS FIREBASE — local fake sign in
  // -----------------------------------------------------
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });

    const fakeUser: User = {
      id: "fake-user-123",
      name: "Test User",
      email: email,
      avatarUrl: "",
      course: "Computer Science",
      year: 2,
      interests: ["AI", "Gaming"],

      roles: defaultRoles,          // FIXED
      quietHours: defaultQuietHours, // FIXED

      lastSeen: new Date() as any,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      pushToken: "",
    };

    set({
      user: fakeUser,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // -----------------------------------------------------
  // 🔥 BYPASS FIREBASE — local fake sign up
  // -----------------------------------------------------
  signUp: async (email, password, userData) => {
    set({ isLoading: true, error: null });

    const fakeUser: User = {
      id: "fake-new-user-456",
      name: userData.name || "New User",
      email: email,
      avatarUrl: "",
      course: userData.course || "",
      year: userData.year || 1,
      interests: userData.interests || [],

      roles: defaultRoles,           // FIXED
      quietHours: defaultQuietHours, // FIXED

      lastSeen: new Date() as any,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      pushToken: "",
    };

    set({
      user: fakeUser,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  signOut: async () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateProfile: async (updates) => {
    const current = get().user;
    if (!current) throw new Error("No user logged in");

    set({
      user: { ...current, ...updates },
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
