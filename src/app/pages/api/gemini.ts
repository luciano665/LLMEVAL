import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function getGeminiReponse(userPrompt:string, systemPrompt:string, model_llm:string){
    const startTime = performance.now();

    const model = genAI.getGenerativeModel({model: model_llm, systemInstruction: systemPrompt});
    const prompt = userPrompt;
    const result = await model.generateContent(prompt);

    const endTime = performance.now()
    
    const responseTime = endTime - startTime;

    return {
        responseTime: responseTime,
        response: result.response.text()
    };
}


