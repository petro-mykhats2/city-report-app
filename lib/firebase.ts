// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA4XbrhY4ndQCEBrn-gJOcoO8oc5rI8Uk",
  authDomain: "city-report-app-e75a2.firebaseapp.com",
  projectId: "city-report-app-e75a2",
  storageBucket: "city-report-app-e75a2.firebasestorage.app",
  messagingSenderId: "697766901020",
  appId: "1:697766901020:web:e403f6daca6ac85a9976d9",
  measurementId: "G-EC0ZXG6VCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
let analytics = null

// Ініціалізація Analytics лише в браузері
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

const db = getFirestore(app)

export { app, analytics, db }