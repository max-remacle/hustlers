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
import { doc, getDoc, setDoc } from "firebase/firestore";

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
      id: user.uid,
      admin: false,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
  }
}

export async function signIn(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const userData: any = await signInWithEmailAndPassword(auth, email, password);
  const docRef = doc(db, "players", userData.user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userData.user.admin = docSnap.data().admin;
  } else {
    console.log("No such document!");
  }
  return userData;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function useUser() {
  const [user, setUser] = useState<any | null | false>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const docRef = doc(db, "players", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          user.admin = docSnap.data().admin;
        }
      }
      setUser(user);
    });
  }, []);

  return user;
}
