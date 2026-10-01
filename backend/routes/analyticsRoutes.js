const express = require("express");
const { getUserAnalytics } = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getUserAnalytics);

module.exports = router;
