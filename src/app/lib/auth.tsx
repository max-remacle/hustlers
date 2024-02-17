import { useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signOut as firebaseSignOut,
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "./Firebase";

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "players", user.uid), {
      firstName: firstName,
      lastName: lastName,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
  }
}

export async function signIn(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function useUser() {
  const [user, setUser] = useState<FirebaseUser | null | false>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  return user;
}
