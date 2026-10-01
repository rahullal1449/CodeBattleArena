const express = require("express");
const { getTodayDailyChallenge } = require("../controllers/dailyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/today", authMiddleware, getTodayDailyChallenge);

module.exports = router;
