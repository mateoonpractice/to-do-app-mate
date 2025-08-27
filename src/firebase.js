// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzPUmC_SZL7FHqnPguIxNHwv3ANbDG40A",
  authDomain: "todo-mate-app.firebaseapp.com",
  projectId: "todo-mate-app",
  storageBucket: "todo-mate-app.firebasestorage.app",
  messagingSenderId: "252969490954",
  appId: "1:252969490954:web:becaad13f1a88bc1729df3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la base de datos Firestore
export const db = getFirestore(app);
