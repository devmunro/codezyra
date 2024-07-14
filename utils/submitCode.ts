export const submitCode = async (
  code: string,
  language: string,
  testCases: { input: any[]; output: any[] }[],
  functionName: string,
) => {
  const response = await fetch("/api/executecode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, testCases, functionName }),
  });
  const data = await response.json();
  return data; 
};
