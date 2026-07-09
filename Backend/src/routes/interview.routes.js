const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")


const interviewRouter = express.Router()
/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description
 * @access private 
 * because access is private we will use a middleware
 */

// this middleware authuser will forward the request only when the user is loggedIn
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController)

module.exports = interviewRouter