
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
//const firebaseConfig = {
 // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  //storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  //messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  //appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
//};
const firebaseConfig = {
  apiKey: "AIzaSyCiszUFdFto-6Umzd_jgAuMyu_vICKPcb8",
  authDomain: "neuroscope-476a0.firebaseapp.com",
  projectId: "neuroscope-476a0",
  storageBucket: "neuroscope-476a0.firebasestorage.app",
  messagingSenderId: "886783322339",
  appId: "1:886783322339:web:a258bbd27cf59d41523dd6",
  measurementId: "G-BDJJ81QQNG"
};



// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
