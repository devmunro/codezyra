"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { User, signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface Problem {
  id: string;
  title: string;
}

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

 

  if (!user) {
    return <p>Loading...</p>;
  }

  const renderCalendar = () => {
    const daysInMonth = new Date().getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day}
            className={`p-2 text-center rounded ${
              day % 2 === 0 ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="container mx-auto flex flex-1 py-8 flex-col space-y-8 ">
        {/* Badges and Daily Streak Section */}

        <div className="bg-gray-700 p-6 rounded shadow-md flex justify-between items-start gap-4 ">
          <div className="flex flex-col items-center border-2 w-1/3 bg-gray-900 p-2">
            {" "}
            <img
              src="https://avatar.iran.liara.run/public/24"
              className="w-48"
            ></img>
            <h1>Welcome {user.email}</h1>
          </div>
          <div className="bg-gray-900 p-8 rounded shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-2">Daily Activity Streak</h3>
            {renderCalendar()}
          </div>

          <div className="w-1/3">
            <h3 className="text-xl font-bold mb-2">Badges</h3>
            <p>Display and track your achievements through badges.</p>
            <div className="flex space-x-4 mt-4">
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faTrophy} size="3x" />
                <span className="mt-2">Top Coder</span>
              </div>
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faMedal} size="3x" />
                <span className="mt-2">Quiz Master</span>
              </div>
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faStar} size="3x" />
                <span className="mt-2">Project Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div
            onClick={() => router.push("/dashboard/problems")}
            className="cursor-pointer bg-gray-700 p-6 rounded hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold mb-2">LeetCode Problems</h3>
            <p>
              Practice and improve your coding skills by solving LeetCode
              problems.
            </p>
            <Image
              src="/images/code.png"
              width={500}
              height={500}
              alt="picture of code laptop"
            />
          </div>

          <div
            onClick={() => router.push("/dashboard/projects")}
            className="cursor-pointer bg-gray-700 p-6 rounded hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold mb-2">Projects</h3>
            <p>
              Engage in small projects to apply and test your coding knowledge.
            </p>
          </div>

          <div
            onClick={() => router.push("/dashboard/quizzes")}
            className="cursor-pointer bg-gray-700 p-6 rounded hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold mb-2">Quizzes</h3>
            <p>Test your coding knowledge through interactive quizzes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
