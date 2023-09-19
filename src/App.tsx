import React from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

import { firebaseConfig } from "../src/firebase";

import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export default function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  console.log(database, "##$$database");

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const token = credential?.accessToken;
        console.log(token, "##$$token");
        const user = res.user;
        console.log(user, "##$$user");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth) //
      .then(() => {
        alert("Sign-out Successful.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='App'>
      <button onClick={handleSignIn}>SignIn</button>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  );
}
