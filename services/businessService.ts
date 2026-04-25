import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

export type Business = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  category: string;
  section: string;
  status: string;
  hours: string;
  location: string;

  phone?: string;
  website?: string;
  priceRange?: string;
};

export async function getBusinesses(): Promise<Business[]> {
  const businessesRef = collection(db, 'businesses');
  const businessesQuery = query(businessesRef, orderBy('name', 'asc'));
  const snapshot = await getDocs(businessesQuery);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Business, 'id'>),
  }));
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const businessRef = doc(db, 'businesses', slug);
  const snapshot = await getDoc(businessRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Business, 'id'>),
  };
}