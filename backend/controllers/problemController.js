const Problem = require("../models/Problem");

const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().select(
            "title difficulty tags"
        );

        res.json(problems);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch problems"
        });
    }
};

const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        res.json(problem);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch problem"
        });
    }
};

module.exports = {
    getProblems,
    getProblemById
};