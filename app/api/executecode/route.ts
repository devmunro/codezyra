import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, testCases, functionName } = await req.json();

    const results = [];

    for (const testCase of testCases) {
      const completeScript = `
        ${code}
        console.log(JSON.stringify(${functionName}(${JSON.stringify(testCase.input[0])}, ${testCase.input[1]})));
      `;

      const requestBody = {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: completeScript,
        language: 'nodejs',
        versionIndex: '4',
      };

      console.log('Request Body:', requestBody);

      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('JDoodle API response:', data);

      let resultOutput;
      try {
        resultOutput = JSON.parse(data.output.trim());
      } catch (parseError) {
        resultOutput = data.output.trim();
      }

      console.log('Parsed result:', resultOutput);

      const result = {
        input: testCase.input,
        expected: testCase.output,
        result: resultOutput,
        passed: JSON.stringify(testCase.output) === JSON.stringify(resultOutput),
      };

      results.push(result);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
