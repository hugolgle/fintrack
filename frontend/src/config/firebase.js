import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnr2dQdV2JcX8CNbxTuE0RLtwQ_PtNHAA",
  authDomain: "fintrack-fd8eb.firebaseapp.com",
  projectId: "fintrack-fd8eb",
  storageBucket: "fintrack-fd8eb.appspot.com",
  messagingSenderId: "1006313316421",
  appId: "1:1006313316421:web:1e8e129cb902610a13432c",
  measurementId: "G-J8TJYKNNQ9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Erreur d'authentification :", error);
    throw error;
  }
};

export { auth, provider };
