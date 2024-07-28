"use client";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>(""); // New state for name
  const router = useRouter();
  const provider = new GithubAuthProvider();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        badgeProgression: {
          problemSolver: 0,
          speedCoder: 0,
          quizMaster: 0,
          projectBuilder: 0,
        },
        createdAt: new Date(),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const handleGitHubSignup = async () => {
    try {
      const credential = await signInWithPopup(auth, provider);
      const user = credential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        badgeProgression: {
          codingStreak: 0,
          problemSolver: 0,
          speedCoder: 0,
          quizMaster: 0,
          projectBuilder: 0,
        },
        createdAt: new Date(),
      });

      router.push("/dashboard");
    } catch (error) {
      // Handle Errors here.
      console.log(error);
    }
  };

  return (
    <div className="p-8 rounded shadow-md w-full max-w-md bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Signup</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded mb-6"
      />
      <div className="space-y-8">
        <button
          onClick={handleSignup}
          className="w-full bg-indigo-900 p-2 rounded hover:bg-rose-900"
        >
          Signup
        </button>
        <div className=" flex flex-col items-center">
          <h2 className="text-center text-xs m-2">Sign up via GITHUB</h2>
          <button
            onClick={handleGitHubSignup}
            className=" bg-white hover:bg-rose-900 p-2  rounded w-12"
          >
            <img src="/images/github-logo.png" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
