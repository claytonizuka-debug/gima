import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type Recommendation = {
  id: string;
  businessSlug: string;
  fromUserId: string;
  fromEmail: string;
  createdAt: string;
  read: boolean;
};

type SendRecommendationInput = {
  toUserId: string;
  businessSlug: string;
  fromUserId: string;
  fromEmail: string;
};

export async function sendRecommendation({
  toUserId,
  businessSlug,
  fromUserId,
  fromEmail,
}: SendRecommendationInput) {
  const ref = collection(db, 'users', toUserId, 'recommendations');

  await addDoc(ref, {
    businessSlug,
    fromUserId,
    fromEmail: fromEmail.toLowerCase(),
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function getRecommendationsForUser(userId: string) {
  const ref = collection(db, 'users', userId, 'recommendations');

  const q = query(ref, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Recommendation, 'id'>),
  }));
}

export function subscribeToUnreadRecommendationCount(
  userId: string,
  callback: (count: number) => void
) {
  const ref = collection(db, 'users', userId, 'recommendations');

  const q = query(ref, where('read', '==', false));

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

export async function markAllRecommendationsAsRead(userId: string) {
  const ref = collection(db, 'users', userId, 'recommendations');

  const snapshot = await getDocs(ref);

  const updates = snapshot.docs
    .filter((docItem) => !docItem.data().read)
    .map((docItem) =>
      updateDoc(doc(db, 'users', userId, 'recommendations', docItem.id), {
        read: true,
      })
    );

  await Promise.all(updates);
}