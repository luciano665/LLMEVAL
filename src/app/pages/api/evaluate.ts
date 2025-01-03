import type { NextApiRequest, NextApiResponse } from "next";
import { getGroqResponse } from "./groq";
import { getGeminiReponse } from "./gemini";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userPrompt, systemPrompt, modelGroq, modelGemini } = req.body;

  if (!userPrompt || !systemPrompt || !modelGroq || !modelGemini) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch responses from both Groq and Gemini models
    const [groqResult, geminiResult] = await Promise.all([
      getGroqResponse(userPrompt, systemPrompt, modelGroq),
      getGeminiReponse(userPrompt, systemPrompt, modelGemini),
    ]);

    // Use Gemini as an evaluator to compare responses
    const evaluationPrompt = `
      System Instruction: Use the following responses from two models to determine which is better and why.
      Include a comparative analysis of accuracy, relevancy, coherence, and overall quality.

      User Prompt: "${userPrompt}"

      Groq Response: "${groqResult.response}"
      Gemini Response: "${geminiResult.response}"
    `;

    const evaluationResult = await getGeminiReponse(
      evaluationPrompt,
      systemPrompt,
      modelGemini
    );

    // Combine the results
    const response = {
      groq: {
        responseTime: groqResult.responseTime,
        response: groqResult.response,
      },
      gemini: {
        responseTime: geminiResult.responseTime,
        response: geminiResult.response,
      },
      evaluation: {
        responseTime: evaluationResult.responseTime,
        response: evaluationResult.response,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error during evaluation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
