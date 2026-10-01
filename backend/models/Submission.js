const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            default: "javascript"
        },

        verdict: {
            type: String,
            enum: [
                "Accepted",
                "Wrong Answer",
                "Compilation Error",
                "Runtime Error",
                "Time Limit Exceeded"
            ],
            required: true
        },

        testCasesPassed: {
            type: Number,
            default: 0
        },

        totalTestCases: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model(
    "Submission",
    submissionSchema
);

module.exports = Submission;