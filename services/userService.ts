import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type UserProfile = {
  uid: string;
  email: string;
  createdAt: string;
};

export async function createUserProfile(uid: string, email: string) {
  const userRef = doc(db, 'users', uid);

  await setDoc(
    userRef,
    {
      uid,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const usersRef = collection(db, 'users');
  const usersQuery = query(usersRef, where('email', '==', email.toLowerCase()));

  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as UserProfile;
}