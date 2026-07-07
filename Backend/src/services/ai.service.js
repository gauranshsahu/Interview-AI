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
    technicalQuestions: z.array(z.object({
        question: z.string().description("The technical question can be asked in the interview"),
        intention: z.string().description("The intention of interviewer behind asking this question"),
        answer: z.string().description("How to answer this question, what points to cover, what approach to take etc.")
    })).description("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().description("The technical question can be asked in the interview"),
        intention: z.string().description("The intention of interviewer behind asking this question"),
        answer: z.string().description("How to answer this question, what points to cover, what approach to take etc.")
    })).description("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().description("The skill which the candidate is lacking"),
        severity: z.enum(["low","medium","high"]).description("The severity of this skill gap, i.e. low,medium and high")
    }))
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }){

}

module.exports = invokeGeminiAi