const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req,res){
    try {
        if(!req.file){
            return res.status(400).json({
                message: "Please upload your resume as a PDF"
            })
        }

        const { selfDescription, jobDescription } = req.body

        if(!jobDescription){
            return res.status(400).json({
                message: "Please provide a job description"
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        // AI result first, so it can never overwrite the user's own fields
        const interviewReport = await interviewReportModel.create({
            ...interviewReportByAi,
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        res.status(201).json({
            message:"Interview report generated successfully",
            interviewReport
        })
    } catch(err) {
        console.error("Generate interview report error:", err)
        res.status(500).json({
            message: "Failed to generate interview report"
        })
    }
}

// to handle a file in pdf format we use a package called multer npm i multer and to read the content of the pdf we require a one more package npm i pdf-parse
module.exports = { generateInterviewReportController }