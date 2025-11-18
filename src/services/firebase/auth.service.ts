// src/services/firebase/auth.service.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";

import {
  doc as createDoc,
  setDoc,
  getDoc as fetchDoc,
  Timestamp,
} from "firebase/firestore";

import { auth, db } from "@/services/firebase/config";



import { User } from "@/types";

export class AuthService {
  static async signUp(
    email: string,
    password: string,
    userData: {
      name: string;
      course: string;
      year: number;
      interests: string[];
    }
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      const user: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email,
        course: userData.course,
        year: userData.year,
        interests: userData.interests,
        roles: {
          student: true,
          organizer: false,
          admin: false,
        },
        quietHours: {
          start: "22:00",
          end: "07:00",
          enabled: true,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastSeen: Timestamp.now(),
      };

      await setDoc(createDoc(db, "users", firebaseUser.uid), user);

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const result = await this.getUserData(uid);

      if (!result) throw new Error("User data missing");

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  static async getUserData(userId: string): Promise<User | null> {
    try {
      const snap = await fetchDoc(createDoc(db, "users", userId));

      if (!snap.exists()) return null;

      return snap.data() as User;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      await setDoc(
        createDoc(db, "users", userId),
        {
          ...updates,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
