import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJF7xPRlmBtAm1YTq4mOehM3qb4j2CEX4",
  authDomain: "gima-6443a.firebaseapp.com",
  projectId: "gima-6443a",
  storageBucket: "gima-6443a.firebasestorage.app",
  messagingSenderId: "168304618300",
  appId: "1:168304618300:web:90515669d5f51eaf4d8c39",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const getReactNativePersistence = (
  FirebaseAuth as unknown as {
    getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
  }
).getReactNativePersistence;

let authInstance: FirebaseAuth.Auth;

try {
  if (getReactNativePersistence) {
    authInstance = FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as never,
    });
  } else {
    authInstance = FirebaseAuth.getAuth(app);
  }
} catch {
  authInstance = FirebaseAuth.getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
