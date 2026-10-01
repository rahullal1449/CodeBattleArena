const User = require("../models/User");

const ALL_ACHIEVEMENTS = [
    {
        id: "first_problem",
        title: "🐣 First Step",
        description: "Solve your first practice coding problem",
        icon: "🐣",
        category: "Practice",
        check: (user) => user.problemsSolved >= 1,
        maxProgress: 1,
        getProgress: (user) => Math.min(1, user.problemsSolved || 0)
    },
    {
        id: "problem_warrior",
        title: "💻 Code Warrior",
        description: "Solve 5 practice coding problems",
        icon: "💻",
        category: "Practice",
        check: (user) => user.problemsSolved >= 5,
        maxProgress: 5,
        getProgress: (user) => Math.min(5, user.problemsSolved || 0)
    },
    {
        id: "algo_master",
        title: "🧠 Algo Master",
        description: "Solve 10 practice coding problems",
        icon: "🧠",
        category: "Practice",
        check: (user) => user.problemsSolved >= 10,
        maxProgress: 10,
        getProgress: (user) => Math.min(10, user.problemsSolved || 0)
    },
    {
        id: "first_blood",
        title: "⚔️ First Blood",
        description: "Win your first 1v1 coding battle",
        icon: "⚔️",
        category: "Battle",
        check: (user) => user.battlesWon >= 1,
        maxProgress: 1,
        getProgress: (user) => Math.min(1, user.battlesWon || 0)
    },
    {
        id: "arena_champion",
        title: "👑 Arena Champion",
        description: "Win 5 1v1 coding battles",
        icon: "👑",
        category: "Battle",
        check: (user) => user.battlesWon >= 5,
        maxProgress: 5,
        getProgress: (user) => Math.min(5, user.battlesWon || 0)
    },
    {
        id: "rating_veteran",
        title: "⚡ Rating Veteran",
        description: "Reach a rating of 1050 or higher",
        icon: "⚡",
        category: "Rating",
        check: (user) => user.rating >= 1050,
        maxProgress: 1050,
        getProgress: (user) => Math.min(1050, user.rating || 1000)
    },
    {
        id: "xp_hunter",
        title: "🔥 XP Hunter",
        description: "Accumulate 100 XP points",
        icon: "🔥",
        category: "XP",
        check: (user) => user.xp >= 100,
        maxProgress: 100,
        getProgress: (user) => Math.min(100, user.xp || 0)
    }
];

const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const achievements = ALL_ACHIEVEMENTS.map(ach => {
            const unlocked = ach.check(user);
            const currentProgress = ach.getProgress(user);
            return {
                id: ach.id,
                title: ach.title,
                description: ach.description,
                icon: ach.icon,
                category: ach.category,
                unlocked,
                progress: currentProgress,
                maxProgress: ach.maxProgress
            };
        });

        const unlockedCount = achievements.filter(a => a.unlocked).length;

        res.json({
            achievements,
            unlockedCount,
            totalCount: achievements.length
        });
    } catch (error) {
        console.error("Achievements Error:", error.message);
        res.status(500).json({ message: "Failed to fetch achievements" });
    }
};

module.exports = {
    getUserAchievements
};
