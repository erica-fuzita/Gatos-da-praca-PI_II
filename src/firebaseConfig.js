// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDh64FuXSmQ6BeoZaz242n5DdBXReSOays",
  authDomain: "gatos-da-praca-2.firebaseapp.com",
  projectId: "gatos-da-praca-2",
  storageBucket: "gatos-da-praca-2.appspot.com",
  messagingSenderId: "443194057043",
  appId: "1:443194057043:web:577462a001755c2f2981a6",
  measurementId: "G-HJ5L0R4RTR",
};

// 🧩 Garante que o Firebase é inicializado apenas uma vez
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("🔥 Firebase inicializado com sucesso!");
} else {
  app = getApps()[0];
  console.log("⚡ Firebase já estava inicializado.");
}

// 🔥 Exporta tanto o banco quanto o app
export const db = getFirestore(app);
export { app };
