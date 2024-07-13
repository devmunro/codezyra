"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface Problem {
  id: string;
  title: string;
}

const ProblemsByLevel: React.FC = () => {
  const router = useRouter();
  const level  = "easy"
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const q = query(collection(db, 'problems'), where('level', '==', level));
      const querySnapshot = await getDocs(q);
      const problemsList: Problem[] = [];
      querySnapshot.forEach((doc) => {
        problemsList.push({ id: doc.id, ...doc.data() } as Problem);
      });
      setProblems(problemsList);
    };

    if (level) fetchProblems();
  }, [level]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Problems: {level}</h1>
        {problems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => router.push(`/problems/${level}/${problem.id}`)}
            className="cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            {problem.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemsByLevel;
