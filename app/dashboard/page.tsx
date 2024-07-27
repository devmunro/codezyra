"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";


const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user, userData, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null; 
  }

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="container mx-auto flex flex-1 py-8 flex-col space-y-8">
        {/* Badges and Daily Streak Section */}
        <div className="bg-gray-700 p-6 rounded shadow-md flex  items-start gap-4">
          <div className="flex flex-col items-center border-2 w-1/3 bg-gray-900 p-2">
            <img
              src="https://avatar.iran.liara.run/public/24"
              className="w-48"
              alt="User Avatar"
            />
            <h1>Welcome {user.email}</h1>
          </div>
          <div className="bg-gray-900 p-8 rounded shadow-md w-1/3">
            
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
              <h3 className="text-xl font-bold mb-2 ">TOTAL PROBLEMS SOLVED = {userData.badgeProgression.problemSolver}</h3>

         
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
            <p>Practice and improve your coding skills by solving LeetCode problems.</p>
            <Image
              src="/images/code.png"
              width={500}
              height={500}
              alt="LeetCode Problems"
            />
          </div>
          <div
            onClick={() => router.push("/dashboard/projects")}
            className="cursor-pointer bg-gray-700 p-6 rounded hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold mb-2">Projects</h3>
            <p>Engage in small projects to apply and test your coding knowledge.</p>
            <Image
              src="/images/projects.png"
              width={500}
              height={500}
              alt="Projects"
            />
          </div>
          <div
            onClick={() => router.push("/dashboard/quizzes")}
            className="cursor-pointer bg-gray-700 p-6 rounded hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold mb-2">Quizzes</h3>
            <p>Test your coding knowledge through interactive quizzes.</p>
            <Image
              src="/images/quizzes.png"
              width={500}
              height={500}
              alt="Quizzes"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
