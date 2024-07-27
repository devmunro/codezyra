"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";
import Editor from "@monaco-editor/react";
import { submitCode } from "../../../../utils/submitCode";
import { useUser } from "../../../context/UserContext";

interface TestCase {
  input: any[];
  output: any[];
}

interface Problem {
  title: string;
  description: string;
  functionTemplate: string;
  functionName: string;
  types: string[];
  testCases: TestCase[];
}

const ProblemPage: React.FC = () => {
  const params = useParams();
  const { problemId } = params as { problemId: string };
  const { user, userData } = useUser();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const language = "nodejs";

  useEffect(() => {
    const fetchProblem = async () => {
      if (problemId) {
        const docRef = doc(db, "problems", problemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Problem;
          data.testCases = data.testCases.map((testCase: any) => ({
            ...testCase,
            input: JSON.parse(testCase.input),
          }));
          setProblem(data);
          setCode(data.functionTemplate);
        } else {
          console.error("No such problem!");
        }
      } else {
        console.error("Problem ID is missing");
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleSubmit = async () => {
    if (problem) {
      console.log("Submitting code:", code);
      const results = await submitCode(
        code,
        language,
        problem.testCases,
        problem.functionName
      );
      if (results && results.results) {
        setResults(results.results);
        await updateUserBadges(results.results);
      } else {
        console.error("No results returned from submitCode");
      }
      console.log("Results:", results);
    }
  };

  const updateUserBadges = async (results: any[]) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);

            // Update problems solved and add badge if all test cases passed
      const allPassed = results.every((result) => result.passed);
      if (allPassed) {
        const newProblemsSolved = (userData.badgeProgression.problemSolver) + 1;
        await updateDoc(userRef, {
          'badgeProgression.problemSolver': newProblemsSolved,

        });
      }
    }
  };

  return (
    <div className="">
      {problem ? (
        <main className="flex gap-4 bg-gray-800 p-8 m-2 rounded shadow-md ml-8">
          <div className="w-1/2">
            <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
            <p className="mb-6">{problem.description}</p>
            <div className="mb-4">
              <Editor
                height="40vh"
                defaultLanguage="javascript"
                value={code}
                onChange={handleCodeChange}
                className="border rounded"
                theme="vs-dark"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
            >
              Submit
            </button>
          </div>
          <div className="w-1/2 ">
            {" "}
            <div className="bg-gray-100 p-4 rounded text-black">
              <h2 className="text-xl font-bold mb-2">Results:</h2>
              {results && results.length > 0 &&
                results.map((result, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 ${
                      result.passed ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <p>
                      <strong>Input:</strong> {JSON.stringify(result.input)}
                    </p>
                    <p>
                      <strong>Expected:</strong>{" "}
                      {JSON.stringify(result.expected)}
                    </p>
                    <p>
                      <strong>Result:</strong> {JSON.stringify(result.result)}
                    </p>
                    <p>
                      <strong>Passed:</strong> {result.passed ? "Yes" : "No"}
                    </p>
                    {!result.passed && (
                      <div className="text-red-500">
                        <p>
                          <strong>Error Message:</strong>
                        </p>
                        <pre>{result.result}</pre>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProblemPage;
