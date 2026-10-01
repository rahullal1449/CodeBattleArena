const mongoose = require("mongoose");

const solvedProblemSchema = new mongoose.Schema(
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

        solvedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Same user cannot have the same problem twice
solvedProblemSchema.index(
    { user: 1, problem: 1 },
    { unique: true }
);

const SolvedProblem = mongoose.model(
    "SolvedProblem",
    solvedProblemSchema
);

module.exports = SolvedProblem;