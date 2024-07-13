"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { User, signOut } from "firebase/auth";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDifficultySelection = () => {
    router.push(`/problem/very-easy`);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleSignout = () => {
    try {
        signOut(auth);
        router.push('/login');
    } catch (error) {
    }

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.email}</h1>
        <h2 className="text-xl mb-6">Select Difficulty Level</h2>
        <button
          onClick={handleDifficultySelection}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          Very Easy
        </button>
        <span><button onClick={handleSignout}>Sign-out</button></span>

        {/* Add more buttons for other difficulty levels if needed */}
      </div>
    </div>
  );
};

export default Dashboard;
