"use client";
import Signup from "./signup/page";
import Login from "./login/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [showTab, setShowTab] = useState("signup");

  const handleTab = (tab: string) => {
    setShowTab(tab);
  };

  return (
    <main className="bg-rose-900 h-screen">
      <div className="flex flex-col items-center bg-gray-900 md:p-8 h-full">
        <div>
          <div className="flex justify-end ">
          <button
              className={`${showTab === "signup" ? "bg-black" : "bg-gray-900"} text-white p-2`}
              onClick={() => handleTab("signup")}
            >
              Signup
            </button>
            <button
              className={`${showTab === "login" ? "bg-black" : "bg-gray-900"} text-white p-2`}
              onClick={() => handleTab("login")}
            >
              Login
            </button>
          </div>

          <div className="relative w-full h-full ">
            {showTab === "signup" && (
              <div className="animate-fadeIn">
                <Signup />
              </div>
            )}
            {showTab === "login" && (
              <div className="animate-fadeIn">
                <Login />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
