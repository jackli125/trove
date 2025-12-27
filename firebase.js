import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCfeI7aYf_n7Jbl50IDI6gpN--c7KBYKaI",
    authDomain: "trove-7a0f2.firebaseapp.com",
    projectId: "trove-7a0f2",
    storageBucket: "trove-7a0f2.firebasestorage.app",
    messagingSenderId: "297257846236",
    appId: "1:297257846236:web:efb117dff2cd08e3e0bb19",
    measurementId: "G-MVQ8T6HJ3F"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
