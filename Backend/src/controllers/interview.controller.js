const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")


async function generateInterviewReportController(req,res){
    const resumeFile = req.file

    const resumeContent = pdfParse(req.file.buffer)
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })
}

// to handle a file in pdf format we use a package called multer npm i multer and to read the content of the pdf we require a one more package npm i pdf-parse
module.exports = { generateInterviewReportController }