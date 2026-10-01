const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            default: 1000
        },

        xp: {
            type: Number,
            default: 0
        },

        problemsSolved: {
            type: Number,
            default: 0
        },

        battlesPlayed: {
            type: Number,
            default: 0
        },

        battlesWon: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;