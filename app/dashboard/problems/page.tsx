"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

interface Problem {
  id: string;
  title: string;
  type: string[];
  level: string;
}

const ProblemList: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [sortedProblems, setSortedProblems] = useState<Problem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchProblems = async () => {
      const q = query(collection(db, "problems"));
      const querySnapshot = await getDocs(q);
      const problemsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Problem[];
      setProblems(problemsList);
      setSortedProblems(problemsList);

      // Extract unique types for the dropdown
      const typesSet = new Set<string>();
      problemsList.forEach(problem => problem.type.forEach(type => typesSet.add(type)));
      setAvailableTypes(Array.from(typesSet));
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    if (problems.length === 0) return;

    let filteredProblems = [...problems];
    if (selectedType) {
      filteredProblems = filteredProblems.filter(problem => problem.type.includes(selectedType));
    }

    const sorted = filteredProblems.sort((a, b) => {
      if (sortCriteria === "level") return a.level.localeCompare(b.level);
      return a.title.localeCompare(b.title);
    });

    setSortedProblems(sorted);
  }, [sortCriteria, selectedType, problems]);

  const handleSortChange = (criteria: string) => {
    setSortCriteria(criteria);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleProblemClick = (problemId: string) => {
    router.push(`/dashboard/problems/${problemId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto flex flex-1 py-8">
      <main className="flex-1 bg-gray-600 p-8 rounded shadow-md ml-8 border-2">
        <h2 className="text-2xl font-bold mb-4 ">|List of Problems|</h2>
        <div className="flex justify-end items-center text-sm mb-4 space-x-4 ">
          <button
            onClick={() => handleSortChange("level")}
            className="p-2 hover:bg-white hover:text-black border-r-2"
          >
            Sort by Difficulty
          </button>
          <button
            onClick={() => handleSortChange("title")}
            className="p-2 hover:bg-white hover:text-black"
          >
            Sort by Name
          </button>
          <select onChange={handleTypeChange} className="p-2 bg-gray-700 text-white border-none rounded">
            <option value="">Filter by Type</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <ul className="border-1">
          {sortedProblems.map((problem) => (
            <li
              key={problem.id}
              className=" p-2 m-2 cursor-pointer hover:bg-gray-500"
              onClick={() => handleProblemClick(problem.id)}
            >
              <div className="flex justify-between gap-2 items-center text-center">
                <h3 className="text-base font-semibold">{problem.title}</h3>
                <div className="flex space-x-8">
                  <p className="text-sm text-gray-300 p-2">{problem.type.join(', ')}</p>
                  <p className="text-sm p-2 uppercase">{problem.level}</p>
                </div>
              </div>
              <hr></hr>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default ProblemList;
