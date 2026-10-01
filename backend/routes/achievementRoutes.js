const express = require("express");
const { getUserAchievements } = require("../controllers/achievementController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getUserAchievements);

module.exports = router;
