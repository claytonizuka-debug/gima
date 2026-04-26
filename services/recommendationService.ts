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
  toUserId: string;
  businessSlug: string;
  fromUserId: string;
  fromEmail: string;
  message?: string;
  createdAt: string;
  read: boolean;
  pinned?: boolean;
  archived?: boolean;
};

type SendRecommendationInput = {
  toUserId: string;
  businessSlug: string;
  fromUserId: string;
  fromEmail: string;
  message?: string;
};

export async function sendRecommendation(input: SendRecommendationInput) {
  await addDoc(collection(db, 'recommendations'), {
    toUserId: input.toUserId,
    businessSlug: input.businessSlug,
    fromUserId: input.fromUserId,
    fromEmail: input.fromEmail,
    message: input.message || '',
    createdAt: new Date().toISOString(),
    read: false,
    pinned: false,
    archived: false,
  });
}

export async function getRecommendationsForUser(
  userId: string
): Promise<Recommendation[]> {
  const recommendationsRef = collection(db, 'recommendations');

  const recommendationsQuery = query(
    recommendationsRef,
    where('toUserId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(recommendationsQuery);

  return snapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      toUserId: data.toUserId,
      businessSlug: data.businessSlug,
      fromUserId: data.fromUserId,
      fromEmail: data.fromEmail,
      message: data.message || '',
      createdAt: data.createdAt,
      read: data.read ?? false,
      pinned: data.pinned ?? false,
      archived: data.archived ?? false,
    };
  });
}

export async function markAllRecommendationsAsRead(userId: string) {
  const recommendations = await getRecommendationsForUser(userId);

  await Promise.all(
    recommendations
      .filter((recommendation) => !recommendation.read)
      .map((recommendation) =>
        updateDoc(doc(db, 'recommendations', recommendation.id), {
          read: true,
        })
      )
  );
}

export function subscribeToUnreadRecommendationCount(
  userId: string,
  callback: (count: number) => void
) {
  const unreadRecommendationsQuery = query(
    collection(db, 'recommendations'),
    where('toUserId', '==', userId),
    where('read', '==', false),
    where('archived', '==', false)
  );

  return onSnapshot(unreadRecommendationsQuery, (snapshot) => {
    callback(snapshot.size);
  });
}

export async function updateRecommendationPinned(
  recommendationId: string,
  pinned: boolean
) {
  await updateDoc(doc(db, 'recommendations', recommendationId), {
    pinned,
  });
}

export async function updateRecommendationArchived(
  recommendationId: string,
  archived: boolean
) {
  await updateDoc(doc(db, 'recommendations', recommendationId), {
    archived,
  });
}