const express = require("express");
const { joinMatchmaking, leaveMatchmaking } = require("../controllers/matchmakingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/join", authMiddleware, joinMatchmaking);
router.post("/leave", authMiddleware, leaveMatchmaking);

module.exports = router;
