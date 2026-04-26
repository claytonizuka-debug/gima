import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebaseConfig";

export type UserProfile = {
  uid: string;
  email: string;
  username: string;
  createdAt: string;
};

function createDefaultUsername(email: string) {
  return email.split("@")[0].toLowerCase();
}

export async function createUserProfile(
  uid: string,
  email: string,
  username?: string,
) {
  const userRef = doc(db, "users", uid);
  const cleanEmail = email.toLowerCase();
  const cleanUsername =
    username?.trim().toLowerCase() || createDefaultUsername(cleanEmail);

  await setDoc(
    userRef,
    {
      uid,
      email: cleanEmail,
      username: cleanUsername,
      createdAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function getUserByEmail(
  email: string,
): Promise<UserProfile | null> {
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("email", "==", email.toLowerCase()));

  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as UserProfile;
}

export async function getUserByUsername(
  username: string,
): Promise<UserProfile | null> {
  const cleanUsername = username.trim().replace("@", "").toLowerCase();

  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("username", "==", cleanUsername));

  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as UserProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function updateUsername(uid: string, username: string) {
  const cleanUsername = username.trim().replace("@", "").toLowerCase();

  if (!cleanUsername) {
    throw new Error("Username is required.");
  }

  if (cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 characters.");
  }

  if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
    throw new Error("Username can only use letters, numbers, and underscores.");
  }

  const existingUser = await getUserByUsername(cleanUsername);

  if (existingUser && existingUser.uid !== uid) {
    throw new Error("That username is already taken.");
  }

  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    username: cleanUsername,
  });

  return cleanUsername;
}
