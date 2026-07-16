import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkvbL0jsSDpM0sCBgbuSUtv5ExnfgD86E",
  authDomain: "quiz-app-2d9e0.firebaseapp.com",
  projectId: "quiz-app-2d9e0",
  storageBucket: "quiz-app-2d9e0.firebasestorage.app",
  messagingSenderId: "1039875015981",
  appId: "1:1039875015981:web:07518e6e6c44238ff8bfa4",
  measurementId: "G-V91E0L35F6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);