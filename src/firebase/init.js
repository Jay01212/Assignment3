// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpKSdbtfusLPEVubwZyPrTXDeI2oPGEy8",
  authDomain: "a3-jiayuan.firebaseapp.com",
  projectId: "a3-jiayuan",
  storageBucket: "a3-jiayuan.appspot.com",
  messagingSenderId: "48036248961",
  appId: "1:48036248961:web:13d2347787033b5e533c80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, functions };