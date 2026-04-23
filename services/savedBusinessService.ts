import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Get all saved business slugs for a user
export async function getSavedBusinessSlugs(userId: string): Promise<string[]> {
  const snapshot = await getDocs(
    collection(db, 'users', userId, 'savedBusinesses')
  );

  return snapshot.docs.map((doc) => doc.id);
}

// Save a business for a user
export async function saveBusinessForUser(userId: string, slug: string) {
  await setDoc(doc(db, 'users', userId, 'savedBusinesses', slug), {
    savedAt: new Date().toISOString(),
  });
}

// Remove a saved business for a user
export async function unsaveBusinessForUser(userId: string, slug: string) {
  await deleteDoc(doc(db, 'users', userId, 'savedBusinesses', slug));
}