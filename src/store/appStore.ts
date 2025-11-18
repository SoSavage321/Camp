// src/store/appStore.ts

import { create } from "zustand";
import { ThemeMode } from "@/types";

interface AppState {
  theme: ThemeMode;
  isOnboarded: boolean;
  notificationsEnabled: boolean;

  setTheme: (theme: ThemeMode) => void;
  setOnboarded: (flag: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "system",
  isOnboarded: false,
  notificationsEnabled: false,

  setTheme: (theme) => set({ theme }),
  setOnboarded: (flag) => set({ isOnboarded: flag }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
