import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM0u7Rtkusa_RKkhH1XCzQ0qAkdKdJE0I",
  authDomain: "netflix-clone-4e146.firebaseapp.com",
  projectId: "netflix-clone-4e146",
  storageBucket: "netflix-clone-4e146.appspot.com",
  messagingSenderId: "791969300645",
  appId: "1:791969300645:web:df43682ea7314a9b2c8d4c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { db, auth };
