const User = require("../models/User");

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({}, "username rating xp problemsSolved battlesWon battlesPlayed")
            .sort({ rating: -1, xp: -1 })
            .limit(50);

        res.json({ leaderboard });
    } catch (error) {
        console.error("Leaderboard error:", error.message);
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
};

module.exports = {
    getLeaderboard
};
