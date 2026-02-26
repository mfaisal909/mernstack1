// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernstack1-f35b3.firebaseapp.com",
  projectId: "mernstack1-f35b3",
  storageBucket: "mernstack1-f35b3.firebasestorage.app",
  messagingSenderId: "519776223505",
  appId: "1:519776223505:web:47f7481169ca0b0ac6ccb0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);