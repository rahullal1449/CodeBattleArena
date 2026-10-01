const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");

const getTodayDailyChallenge = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        const problems = await Problem.find({});
        if (!problems || problems.length === 0) {
            return res.status(404).json({ message: "No problems available for daily challenge" });
        }

        // Pick daily problem based on current date string YYYY-MM-DD
        const todayStr = new Date().toISOString().split('T')[0];
        let dateHash = 0;
        for (let i = 0; i < todayStr.length; i++) {
            dateHash = (dateHash << 5) - dateHash + todayStr.charCodeAt(i);
            dateHash |= 0;
        }
        const dailyIndex = Math.abs(dateHash) % problems.length;
        const dailyProblem = problems[dailyIndex];

        // Check if user already completed today's daily challenge
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todaySubmission = await Submission.findOne({
            user: userId,
            problem: dailyProblem._id,
            verdict: "Accepted",
            createdAt: { $gte: startOfDay }
        });

        res.json({
            date: todayStr,
            problem: dailyProblem,
            completedToday: !!todaySubmission,
            streak: user.xp ? Math.floor(user.xp / 50) : 0,
            bonusXpReward: 50
        });
    } catch (error) {
        console.error("Daily Challenge Error:", error.message);
        res.status(500).json({ message: "Failed to load daily challenge" });
    }
};

module.exports = {
    getTodayDailyChallenge
};
