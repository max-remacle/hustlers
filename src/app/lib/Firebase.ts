import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCa7FawBaWVmBpIk-N01ut1kqUKXLq3vBI",
    authDomain: "hustlers-24e35.firebaseapp.com",
    projectId: "hustlers-24e35",
    storageBucket: "hustlers-24e35.appspot.com",
    messagingSenderId: "309522873513",
    appId: "1:309522873513:web:8ec7d4b9d38f686df7fdb8"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();