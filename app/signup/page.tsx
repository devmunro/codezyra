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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
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
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Signup
        </button>
        <button
          onClick={handleGitHubSignup}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Github Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
