// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2aCMppffbJYRcBIt9AW9aCEUZVV9Rgbw",
  authDomain: "inventory-management-9fa11.firebaseapp.com",
  projectId: "inventory-management-9fa11",
  storageBucket: "inventory-management-9fa11.appspot.com",
  messagingSenderId: "261540313202",
  appId: "1:261540313202:web:e4f1b097f7e292bda66aeb",
  measurementId: "G-X08QXZ5YNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };