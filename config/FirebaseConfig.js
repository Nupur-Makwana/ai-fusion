// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-fusion-nupur-makwana.firebaseapp.com",
  projectId: "ai-fusion-nupur-makwana",
  storageBucket: "ai-fusion-nupur-makwana.firebasestorage.app",
  messagingSenderId: "762774722926",
  appId: "1:762774722926:web:2a0a555f555c76f580497f",
  measurementId: "G-GQHB0XW2CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app,'default')
