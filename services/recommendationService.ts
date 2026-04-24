import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
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
  const recommendationsRef = collection(
    db,
    'users',
    toUserId,
    'recommendations'
  );

  await addDoc(recommendationsRef, {
    businessSlug,
    fromUserId,
    fromEmail: fromEmail.toLowerCase(),
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function getRecommendationsForUser(
  userId: string
): Promise<Recommendation[]> {
  const recommendationsRef = collection(
    db,
    'users',
    userId,
    'recommendations'
  );

  const recommendationsQuery = query(
    recommendationsRef,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(recommendationsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Recommendation, 'id'>),
  }));
}