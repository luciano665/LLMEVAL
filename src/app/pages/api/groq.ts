import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API
});

export async function getGroqResponse(prompt:string,systemPrompt:string, model:string){
    const startTime = performance.now();

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: prompt,
            }
        ],
        model: model,
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
        responseTime: responseTime,
        response: chatCompletion.choices[0]?.message?.content,
    };
}