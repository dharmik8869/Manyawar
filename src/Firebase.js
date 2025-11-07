// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn4uDLIY0wZDSI8pFADs2G8vOq3n4l_wo",
  authDomain: "dharmik-6b629.firebaseapp.com",
  projectId: "dharmik-6b629",
  storageBucket: "dharmik-6b629.firebasestorage.app",
  messagingSenderId: "355839031524",
  appId: "1:355839031524:web:479f17552be63b497b94f1",
  measurementId: "G-2GX4P3JC4Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);