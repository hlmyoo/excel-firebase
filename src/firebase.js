// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTGaZTEy8o55axXn7yiV486hfv57BRKt8",
    authDomain: "vue-firebase-424c6.firebaseapp.com",
    projectId: "vue-firebase-424c6",
    storageBucket: "vue-firebase-424c6.appspot.com",
    messagingSenderId: "975668536090",
    appId: "1:975668536090:web:54111531d2f7fae1cbc2a3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)