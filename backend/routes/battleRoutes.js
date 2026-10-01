const express = require("express");

const {
    createBattle,
    joinBattle,
    getBattle,
    startBattle,
    getBattleHistory
} = require("../controllers/battleController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    createBattle
);

router.post(
    "/join",
    authMiddleware,
    joinBattle
);

router.post(
    "/start",
    authMiddleware,
    startBattle
);

router.get(
    "/history",
    authMiddleware,
    getBattleHistory
);

router.get(
    "/:roomCode",
    authMiddleware,
    getBattle
);

module.exports = router;