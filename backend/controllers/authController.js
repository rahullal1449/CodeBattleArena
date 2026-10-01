const Submission = require("../models/Submission");
const SolvedProblem = require("../models/SolvedProblem");

const bcrypt = require("bcryptjs");
const User = require("../models/User");



const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                rating: user.rating,
                xp: user.xp
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "username email rating xp battlesPlayed battlesWon"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const totalSubmissions = await Submission.countDocuments({
            user: req.user.userId
        });

        const acceptedSubmissions = await Submission.countDocuments({
            user: req.user.userId,
            verdict: "Accepted"
        });

        const problemsSolved = await SolvedProblem.countDocuments({
            user: req.user.userId
        });

        res.json({
            username: user.username,
            email: user.email,
            rating: user.rating,
            xp: user.xp,
            problemsSolved,
            totalSubmissions,
            acceptedSubmissions,
            battlesPlayed: user.battlesPlayed,
            battlesWon: user.battlesWon
        });

    } catch (error) {
        console.error("Get stats error:", error.message);

        res.status(500).json({
            message: "Failed to fetch user stats"
        });
    }
};


module.exports = {
    signup,
    login, 
    getMyStats
};