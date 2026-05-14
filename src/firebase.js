import firebase from 'firebase/compat/app'; // Tego brakowało
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx1MKwkvdo9PgdRByd0WOtJeh6Ek_fmoQ",
  authDomain: "ewidencja-czasu-pracy-1d36f.firebaseapp.com",
  projectId: "ewidencja-czasu-pracy-1d36f",
  storageBucket: "ewidencja-czasu-pracy-1d36f.firebasestorage.app",
  messagingSenderId: "1002044998643",
  appId: "1:1002044998643:web:583f78ffa05e797e450886"
};

// Inicjalizacja (sprawdzamy, czy aplikacja już nie jest zainicjowana)
const firebaseApp = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();