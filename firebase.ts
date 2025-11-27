import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDAhfbhww30v-6gAY8-u3eL7pe6mfFp1bc",
  authDomain: "mafia-e9c1b.firebaseapp.com",
  projectId: "mafia-e9c1b",
  storageBucket: "mafia-e9c1b.firebasestorage.app",
  messagingSenderId: "1041632024444",
  appId: "1:1041632024444:web:7c99abd5e10dc9e62776f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
