// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr-Zs5eOMX5eS4bLaQDwrSflnsu8oGM6w",
  authDomain: "socialchatapp-77be0.firebaseapp.com",
  projectId: "socialchatapp-77be0",
  storageBucket: "socialchatapp-77be0.appspot.com",
  messagingSenderId: "206484351281",
  appId: "1:206484351281:web:fcb78d58923e8fd5a1a810",
  measurementId: "G-HEWV68RERB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authFirebase = getAuth(app)
export const dbFirebase = getFirestore(app);
