const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getLeaderboard);

module.exports = router;
