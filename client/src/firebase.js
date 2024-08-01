// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sellerpost-1f211.firebaseapp.com",
  projectId: "sellerpost-1f211",
  storageBucket: "sellerpost-1f211.appspot.com",
  messagingSenderId: "1036650800831",
  appId: "1:1036650800831:web:9da60a29d789b98347480a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);