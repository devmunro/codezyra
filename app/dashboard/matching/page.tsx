"use client"
import React, { useState } from 'react';

const codeSnippets = [
  { code: 'for (let i = 0; i < 10; i++) {}', description: 'Loop from 0 to 9' },
  { code: 'if (x > y) {}', description: 'Check if x is greater than y' },
];

const SyntaxMatchingGame = () => {
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState("");

  const handleDrop = (event, description) => {
    event.preventDefault();
    const code = event.dataTransfer.getData('text');
    setMatches({ ...matches, [description]: code });
  };

  const handleDragStart = (event, code) => {
    event.dataTransfer.setData('text', code);
  };

  const checkAnswers = () => {
    const correct = codeSnippets.every(
      snippet => matches[snippet.description] === snippet.code
    );
    setFeedback(correct ? 'All matches are correct!' : 'Some matches are incorrect.');
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="flex justify-between">
        <div className="w-1/2">
          {codeSnippets.map(snippet => (
            <div
              key={snippet.code}
              draggable
              onDragStart={event => handleDragStart(event, snippet.code)}
              className="p-4 mb-4 border rounded bg-gray-100 cursor-move"
            >
              {snippet.code}
            </div>
          ))}
        </div>
        <div className="w-1/2">
          {codeSnippets.map(snippet => (
            <div
              key={snippet.description}
              onDragOver={event => event.preventDefault()}
              onDrop={event => handleDrop(event, snippet.description)}
              className="p-4 mb-4 border rounded bg-gray-100"
            >
              {snippet.description}
              {matches[snippet.description] && (
                <div className="mt-2 p-2 bg-green-100 rounded">{matches[snippet.description]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={checkAnswers}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Check Answers
      </button>
      {feedback && (
        <div className="mt-4 p-4 border rounded bg-yellow-100">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default SyntaxMatchingGame;
