"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Editor from '@monaco-editor/react';

interface TestCase {
  input: any[];
  output: any[];
}

interface Problem {
  title: string;
  description: string;
  testCases: TestCase[];
}

const ProblemPage: React.FC = () => {
  const params = useParams();
  const { level, problemId } = params as { level: string; problemId: string };

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchProblem = async () => {
      if (level && problemId) {
        const docRef = doc(db, 'problems', problemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProblem(docSnap.data() as Problem);
        } else {
          console.error('No such problem!');
        }
      } else {
        console.error('Level or problemId is missing');
      }
    };

    fetchProblem();
  }, [level, problemId]);

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleSubmit = async () => {
  
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {problem ? (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="mb-6">{problem.description}</p>
          <div className="mb-4">
            <Editor
              height="40vh"
              defaultLanguage="javascript"
              defaultValue="// write your code here"
              onChange={handleCodeChange}
              className="border rounded"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
          >
            Submit
          </button>
          {results.length > 0 && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Results:</h2>
              {results.map((result, index) => (
                <div key={index} className={`mb-2 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                  <p>Input: {JSON.stringify(result.input)}</p>
                  <p>Expected: {JSON.stringify(result.expected)}</p>
                  <p>Result: {JSON.stringify(result.result)}</p>
                  <p>Passed: {result.passed ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProblemPage;
