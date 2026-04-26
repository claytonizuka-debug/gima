import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { createUserProfile } from "./userService";

function generateUsername(email: string) {
  return email.split("@")[0].toLowerCase();
}

export async function signUp(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  const username = generateUsername(email);

  await createUserProfile(result.user.uid, email, username);

  return result.user;
}

export async function logIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut() {
  await signOut(auth);
}
