import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQwQiqu_sQ7-Kw25e-oPwsXhtrAzwEfdM",
  authDomain: "task-8d-12a23.firebaseapp.com",
  projectId: "task-8d-12a23",
  storageBucket: "task-8d-12a23.appspot.com",
  messagingSenderId: "585489430604",
  appId: "1:585489430604:web:172a1558423b7291b15ce9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

