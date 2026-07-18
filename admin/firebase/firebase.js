// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnOVab4rmcr1QzUy8z9sj01mzEujNAcKw",
  authDomain: "store-one-dripe-2766a.firebaseapp.com",
  projectId: "store-one-dripe-2766a",
  storageBucket: "store-one-dripe-2766a.firebasestorage.app",
  messagingSenderId: "845635604631",
  appId: "1:845635604631:web:37b13ed9ee4f2827d759d2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);