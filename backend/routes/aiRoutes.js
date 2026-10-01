const express = require("express");
const { getAIHint, getAIComplexity } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/hint", authMiddleware, getAIHint);
router.post("/complexity", authMiddleware, getAIComplexity);

module.exports = router;
