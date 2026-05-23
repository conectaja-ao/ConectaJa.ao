/* ============================================
   CONECTA JÁ — FIREBASE CONFIGURATION
============================================ */

const firebaseConfig = {
  apiKey: "AIzaSyA8C6FHaecrnb16MOCk5SG-dplVhOh8wug",
  authDomain: "conectaja-b1076.firebaseapp.com",
  projectId: "conectaja-b1076",
  storageBucket: "conectaja-b1076.firebasestorage.app",
  messagingSenderId: "65289995093",
  appId: "1:65289995093:web:fa24addbcbcd447e74e5dc",
  measurementId: "G-L68PY77SN8"
};

firebase.initializeApp(firebaseConfig);
window.firebaseAuth   = firebase.auth();
window.firebaseDb     = firebase.firestore();
window.firebaseStorage = (typeof firebase.storage === 'function') ? firebase.storage() : null;
