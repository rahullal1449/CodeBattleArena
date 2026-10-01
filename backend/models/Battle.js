const mongoose = require("mongoose");

const battleSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true
        },

        player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            default: null
        },

        status: {
            type: String,
            enum: [
                "waiting",
                "ready",
                "active",
                "completed",
                "cancelled"
            ],
            default: "waiting"
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        startedAt: {
            type: Date,
            default: null
        },

        endedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Battle = mongoose.model("Battle", battleSchema);

module.exports = Battle;