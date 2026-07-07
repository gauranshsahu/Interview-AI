const mongoose = require('mongoose');

/**
 * - job description Schema : String 
 * - resume text : String 
 * - self description : String 
 * 
 * - matchScore : Number
 * 
 * - Technical questions : 
 * [{
 * question: "",
 * intention: "",
 * answer: "",
 * }]
 * - Behavioral questions :
 *  * [{
 * question: "",
 * intention: "",
 * answer: "",
 * }]
 * - Skill Gaps :
 *  * [{
 * skill: "",
 * (Time taken to learn skills) severity: {
 * type:String,
 * enum : ["low","medium","high"]
 * },
 * answer: "",
 * }]
 * - Preparation plan : [{
 * day: Number,
 * focus: String,
 * tasks : [String]
 * }] 
 */

// created the another schema to make the code clean and structured.
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    // here we are not stroing the tehnical questions differently that is why we dont need ID
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    // here also we are not stroing the tehnical questions differently that is why we dont need ID
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "severity is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestion: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema]
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);
module.exports = interviewReportModel