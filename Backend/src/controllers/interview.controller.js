const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * 
 * @description controller to generate interview report based on user self description, resume and job description
 */

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

/**
 * 
 * @description Controller to get interview report by interviewId.
 */
async function generateInterViewReportByIdController(req,res){
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId , user:req.user.id })

    if(!interviewReport)
    {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


// to handle a file in pdf format we use a package called multer npm i multer and to read the content of the pdf we require a one more package npm i pdf-parse
module.exports = { generateInterviewReportController , generateInterViewReportByIdController}