import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ← Dodaj to!

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjz-_pPnHiJT4XuawphLyh9jIxhinhw7g",
  authDomain: "loginapp-4e958.firebaseapp.com",
  projectId: "loginapp-4e958",
  storageBucket: "loginapp-4e958.appspot.com", // ← Poprawiona wartość
  messagingSenderId: "1026400065478",
  appId: "1:1026400065478:web:6f55d128ca8124b40204c7",
  measurementId: "G-JD6FVJLC8E",
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ← Dodaj to!

export { app, analytics, db }; // ← Eksportujemy `db`
