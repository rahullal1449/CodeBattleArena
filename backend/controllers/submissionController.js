const Submission = require("../models/Submission");

const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            user: req.user.userId
        })
            .populate("problem", "title difficulty")
            .sort({ createdAt: -1 });

        res.json(submissions);

    } catch (error) {
        console.error("Get submissions error:", error.message);

        res.status(500).json({
            message: "Failed to fetch submissions"
        });
    }
};

module.exports = {
    getMySubmissions
};