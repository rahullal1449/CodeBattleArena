const User = require("../models/User");
const Submission = require("../models/Submission");
const SolvedProblem = require("../models/SolvedProblem");
const Problem = require("../models/Problem");
const Battle = require("../models/Battle");

const getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch submissions & solved problems
        const submissions = await Submission.find({ user: userId }).populate("problem", "title difficulty tags");
        const solvedProblems = await SolvedProblem.find({ user: userId }).populate("problem", "difficulty tags");
        const totalProblemsCount = await Problem.countDocuments();

        // Calculate Submission Stats
        const totalSubmissions = submissions.length;
        const acceptedSubmissions = submissions.filter(s => s.verdict === "Accepted").length;
        const acceptanceRate = totalSubmissions ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

        // Calculate Difficulty Distribution
        const solvedEasy = solvedProblems.filter(s => s.problem?.difficulty === "Easy").length;
        const solvedMedium = solvedProblems.filter(s => s.problem?.difficulty === "Medium").length;
        const solvedHard = solvedProblems.filter(s => s.problem?.difficulty === "Hard").length;

        // Calculate Topic Performance & Identify Weak Topics
        const tagMap = {};
        submissions.forEach(s => {
            if (s.problem && s.problem.tags) {
                s.problem.tags.forEach(tag => {
                    if (!tagMap[tag]) {
                        tagMap[tag] = { total: 0, accepted: 0, failed: 0 };
                    }
                    tagMap[tag].total += 1;
                    if (s.verdict === "Accepted") {
                        tagMap[tag].accepted += 1;
                    } else {
                        tagMap[tag].failed += 1;
                    }
                });
            }
        });

        // Weak topics are those with highest failed submissions or low acceptance
        const topicAnalysis = Object.keys(tagMap).map(tag => {
            const data = tagMap[tag];
            const accRate = data.total ? Math.round((data.accepted / data.total) * 100) : 0;
            return {
                tag,
                total: data.total,
                accepted: data.accepted,
                failed: data.failed,
                acceptanceRate: accRate,
                isWeak: accRate < 50 && data.total >= 2
            };
        });

        const weakTopics = topicAnalysis.filter(t => t.isWeak).map(t => t.tag);

        // Win Rate
        const winRate = user.battlesPlayed ? Math.round((user.battlesWon / user.battlesPlayed) * 100) : 0;

        res.json({
            analytics: {
                username: user.username,
                rating: user.rating,
                xp: user.xp,
                problemsSolved: user.problemsSolved,
                totalProblemsInPlatform: totalProblemsCount,
                totalSubmissions,
                acceptedSubmissions,
                acceptanceRate,
                battlesPlayed: user.battlesPlayed,
                battlesWon: user.battlesWon,
                winRate,
                difficultyBreakdown: {
                    easy: solvedEasy,
                    medium: solvedMedium,
                    hard: solvedHard
                },
                topicAnalysis,
                weakTopics,
                recentSubmissions: submissions.slice(-5).reverse()
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error.message);
        res.status(500).json({ message: "Failed to load analytics" });
    }
};

module.exports = {
    getUserAnalytics
};
