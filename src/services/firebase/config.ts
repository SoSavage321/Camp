// src/services/firebase/config.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// 🔥 Hard-coded Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCCiD73I_Qc1VpCN08AStndrlW3fYs2AYE",
  authDomain: "apps-bb7a8.firebaseapp.com",
  projectId: "apps-bb7a8",
  storageBucket: "apps-bb7a8.firebasestorage.app",
  messagingSenderId: "986119413448",
  appId: "1:986119413448:web:2fcdfbeedc1f083a9f0ffd",
  measurementId: "G-Z7VN47149P"
};


// Init app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

// Functions
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
