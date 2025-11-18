// src/services/firebase/createUser.ts
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";
import {
  User,
  defaultRoles,
  defaultQuietHours,
} from "../../types";

export const createUserProfile = async (authUser: any, name: string) => {
  const userRef = doc(db, "users", authUser.uid);

  const now = Timestamp.now();

  const newUser: User = {
    id: authUser.uid,
    name,
    email: authUser.email,
    avatarUrl: "",
    course: "",
    year: 1,
    interests: [],

    roles: defaultRoles,
    quietHours: defaultQuietHours,

    lastSeen: now,
    createdAt: now,
    updatedAt: now, // ← FIXED
  };

  await setDoc(userRef, newUser, { merge: true });

  return newUser;
};
