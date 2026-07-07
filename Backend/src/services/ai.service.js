const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// async function invokeGeminiAi() {
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: "Hello Gemini ! Explain what is Interview ?"
//     })

//     console.log(response.text);
// }

const interviewReportSchema = z.object({
    technicalQuestions: z.array(z.object({}))
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }){

}

module.exports = invokeGeminiAi