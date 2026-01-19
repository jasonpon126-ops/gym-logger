import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// You can get this from the Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyDXvimc9C1MWTBTZDeLhxvgl76C3zAw3lE",
    authDomain: "gymlog-bc2ad.firebaseapp.com",
    projectId: "gymlog-bc2ad",
    storageBucket: "gymlog-bc2ad.firebasestorage.app",
    messagingSenderId: "323054702750",
    appId: "1:323054702750:web:1ba3b3c0e1332c8c66ab8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

export { auth, googleProvider, db };
