import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJELL5GP-efkurKsQagiq256EDhiDMpK8",
  authDomain: "healo-d41f9.firebaseapp.com",
  projectId: "healo-d41f9",
  storageBucket: "healo-d41f9.appspot.com", 
  messagingSenderId: "258996025500",
  appId: "1:258996025500:web:d8305adafaab42ac039559",
  measurementId: "G-98P08CBEDB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
