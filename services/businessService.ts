import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type Business = {
  slug: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  hours: string;
  location: string;
  section: string;
  status: string;
  image: string;
};

export async function getBusinesses(): Promise<Business[]> {
  const snapshot = await getDocs(collection(db, 'businesses'));
  return snapshot.docs.map((doc) => doc.data() as Business);
}