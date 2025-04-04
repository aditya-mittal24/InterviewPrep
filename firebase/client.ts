// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnEcodJGyUFxSFt0Xfqz3I8V-vHkHhVOs",
  authDomain: "interviewprep-9ea2d.firebaseapp.com",
  projectId: "interviewprep-9ea2d",
  storageBucket: "interviewprep-9ea2d.firebasestorage.app",
  messagingSenderId: "885203959949",
  appId: "1:885203959949:web:981b0d1d4ae5277c64e2c4",
  measurementId: "G-0M88TZ8BE0"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
