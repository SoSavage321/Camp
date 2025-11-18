// src/store/eventStore.ts

import { create } from "zustand";
import {
  Event,
  EventFilters,
  CreateEventInput,
  EventRSVP,
  RSVPStatus,
} from "@/types";
import { FirestoreService } from "@/services/firebase/firestore.service";
import { where, orderBy, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./authStore";
import { EventStatus } from '@/types';



interface EventState {
  events: Event[];
  myRSVPs: EventRSVP[];
  isLoading: boolean;
  error: string | null;
  filters: EventFilters;

  fetchEvents: () => Promise<void>;
  fetchMyRSVPs: () => Promise<void>;
  createEvent: (input: CreateEventInput) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  rsvpToEvent: (eventId: string, status: RSVPStatus) => Promise<void>;
  removeRSVP: (eventId: string) => Promise<void>;
  setFilters: (filters: EventFilters) => void;
  clearFilters: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  myRSVPs: [],
  isLoading: false,
  error: null,
  filters: {},

  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const constraints = [
        where("status", "==", "approved"),
        where("visibility", "in", ["public", "group"]),
        orderBy("startsAt", "asc"),
      ];

      const events = await FirestoreService.getDocuments<Event>(
        "events",
        constraints
      );

      set({ events, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMyRSVPs: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;

      const constraints = [where("userId", "==", userId)];

      const rsvps = await FirestoreService.getDocuments<EventRSVP>(
        "event_rsvps",
        constraints
      );

      set({ myRSVPs: rsvps });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
createEvent: async (eventInput) => {
  try {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });

    const eventData = {
      ...eventInput,
      hostId: user.id,
      hostName: user.name,
      startsAt: Timestamp.fromDate(eventInput.startsAt),
      endsAt: Timestamp.fromDate(eventInput.endsAt),

      // FIXED 🔥
      status: (user.roles.admin || user.roles.organizer
        ? 'approved'
        : 'pending') as EventStatus,

      featured: false,
      attendeeCount: 0,
      interestedCount: 0,
    };

    const eventId = await FirestoreService.addDocument('events', eventData);

    const newEvent: Event = {
      id: eventId,
      ...eventData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    set((state) => ({
      events: [...state.events, newEvent],
      isLoading: false,
    }));
  } catch (error: any) {
    set({ error: error.message, isLoading: false });
    throw error;
  }
},


  updateEvent: async (eventId, updates) => {
    try {
      set({ isLoading: true, error: null });

      await FirestoreService.updateDocument("events", eventId, updates);

      set((state) => ({
        events: state.events.map((e) =>
          e.id === eventId ? { ...e, ...updates } : e
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      set({ isLoading: true, error: null });

      await FirestoreService.deleteDocument("events", eventId);

      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  rsvpToEvent: async (eventId, status) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error("User not authenticated");

      const existing = get().myRSVPs.find((r) => r.eventId === eventId);

      if (existing) {
        await FirestoreService.updateDocument("event_rsvps", existing.id, {
          status,
        });
      } else {
        await FirestoreService.addDocument("event_rsvps", {
          eventId,
          userId,
          status,
        });
      }

      await get().fetchMyRSVPs();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  removeRSVP: async (eventId) => {
    try {
      const match = get().myRSVPs.find((r) => r.eventId === eventId);
      if (!match) return;

      await FirestoreService.deleteDocument("event_rsvps", match.id);
      await get().fetchMyRSVPs();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
