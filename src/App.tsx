import React, { useState } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

import { firebaseConfig } from "../src/firebase";

import { getDatabase, ref, set } from "firebase/database";

const STRING_NORMAL = "normal";

export default function App() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  console.log(auth, "##$$auth");
  console.log(database, "##$$database");

  const writeUserData = (
    userId: string | undefined,
    username: string | null,
    email: string | null,
    imageUrl?: string | undefined | null,
    role?: string,
  ) => {
    const db = getDatabase();
    set(ref(db, "users/" + userId), {
      username,
      email,
      imageUrl,
      role: STRING_NORMAL,
    })
      .then(() => alert("Data saved successfully!"))
      .catch((error) =>
        console.error("Something wrong.. please check your code\n", error),
      );
  };

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        // console.log(credential, "##$$credential");
        const token = credential?.accessToken;
        // console.log(token, "##$$token");
        const user = res.user;
        // console.log(user, "##$$user");
        const userId = res.user.email?.split("@")[0];
        console.log(userId, "##$$userId");
        const { displayName: username, email, photoURL: imageUrl } = user;
        writeUserData(userId, username, email, imageUrl);
      })
      .catch((error) => {
        console.error(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
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

  const [testVal, setTestVal] = useState("");

  const handleChagne = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestVal(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = getDatabase();
    set(ref(db, `test/${testVal}`), {
      username: "testname",
      email: "testemail",
    })
      .then(() => {
        setTestVal("");
        console.log("Data seved successfully!");
      })
      .catch((error) => console.error("Something wrong", error));
  };

  return (
    <div className='App'>
      <button onClick={handleSignIn}>SignIn</button>
      <button onClick={handleSignOut}>SignOut</button>
      <hr />

      <form onSubmit={handleSubmit}>
        <input type='text' value={testVal} onChange={handleChagne} />
        <button>Save</button>
      </form>
    </div>
  );
}
