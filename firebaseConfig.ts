import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBJF7xPRlmBtAm1YTq4mOehM3qb4j2CEX4',
  authDomain: 'gima-6443a.firebaseapp.com',
  projectId: 'gima-6443a',
  storageBucket: 'gima-6443a.firebasestorage.app',
  messagingSenderId: '168304618300',
  appId: '1:168304618300:web:90515669d5f51eaf4d8c39',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);