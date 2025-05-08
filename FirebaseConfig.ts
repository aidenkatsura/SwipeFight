// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgw97kvQW4mpXQmK9T_Nzcspt9Uhz9Lj4",
  authDomain: "swipefight.firebaseapp.com",
  projectId: "swipefight",
  storageBucket: "swipefight.firebasestorage.app",
  messagingSenderId: "290566485369",
  appId: "1:290566485369:web:1d19edee5e81d6a9886ba8",
  measurementId: "G-V7H4XXP2QJ"
};

// const firebaseConfig = {

//   apiKey: "AIzaSyBo8e0FPmKsjDSpUyjGQptuet9gV-Luw3w",

//   authDomain: "swipefight-ex.firebaseapp.com",

//   projectId: "swipefight-ex",

//   storageBucket: "swipefight-ex.firebasestorage.app",

//   messagingSenderId: "244800262464",

//   appId: "1:244800262464:web:b728b9f2a82a8777ac6aa5"

// };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);