const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        constraints: {
            type: [String],
            default: [],
        },

        examples: [
            {
                input: String,
                output: String,
                explanation: String,
            },
        ],

        starterCode: {
            type: String,
            default: "",
        },

        functionName: {
            type: String,
            default: "",
        },

        testCases: [
            {
                input: String,
                expectedOutput: String,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
