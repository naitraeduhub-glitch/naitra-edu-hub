import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-OZUb3eYtVdpBwry2TZ5r44czgYL_iqw",
  authDomain: "naitra-edu-hub.firebaseapp.com",
  projectId: "naitra-edu-hub",
  storageBucket: "naitra-edu-hub.firebasestorage.app",
  messagingSenderId: "813234434377",
  appId: "1:813234434377:web:bd9938fe1204f3f3dcaa98"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);