// src/services/firebase/firestore.service.ts

import {
  collection,
  doc as createDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
} from "firebase/firestore";

import { db } from "./config";

export class FirestoreService {
  static async getDocument<T>(collectionName: string, documentId: string) {
    const docRef = createDoc(db, collectionName, documentId);
    const snap = await getDoc(docRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
  }
  static async getCollection(collectionName: string) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

  static async getDocuments<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ) {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as T[];
  }

  static async addDocument<T>(
    collectionName: string,
    data: Omit<T, "id">
  ): Promise<string> {
    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return ref.id;
  }

  static async updateDocument<T>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ) {
    const docRef = createDoc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  static async deleteDocument(collectionName: string, documentId: string) {
    const docRef = createDoc(db, collectionName, documentId);
    await deleteDoc(docRef);
  }

  static async getPaginatedDocuments<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    pageSize = 20,
    lastDoc?: DocumentSnapshot
  ) {
    const q = query(
      collection(db, collectionName),
      ...constraints,
      limit(pageSize),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );

    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as T[];

    return {
      items,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  }
}
