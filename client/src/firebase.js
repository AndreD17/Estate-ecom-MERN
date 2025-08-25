// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-f77bf.firebaseapp.com",
  projectId: "mern-real-estate-f77bf",
  storageBucket: "mern-real-estate-f77bf.firebasestorage.app",
  messagingSenderId: "1070443107262",
  appId: "1:1070443107262:web:7e22bc3e7c5eb99d96dfef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);