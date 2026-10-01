const Battle = require("../models/Battle");

const generateRoomCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
};

const createBattle = async (req, res) => {
    try {
        let roomCode;
        let existingBattle;

        do {
            roomCode = generateRoomCode();

            existingBattle = await Battle.findOne({
                roomCode
            });

        } while (existingBattle);

        const battle = await Battle.create({
            roomCode,
            player1: req.user.userId,
            status: "waiting"
        });

        res.status(201).json({
            message: "Battle room created successfully",
            battle: {
                id: battle._id,
                roomCode: battle.roomCode,
                status: battle.status
            }
        });

    } catch (error) {
        console.error("Create battle error:", error.message);

        res.status(500).json({
            message: "Failed to create battle"
        });
    }
};

const joinBattle = async (req, res) => {
    try {
        const { roomCode } = req.body;

        if (!roomCode) {
            return res.status(400).json({
                message: "Room code is required"
            });
        }

        const battle = await Battle.findOne({
            roomCode: roomCode.toUpperCase()
        });

        if (!battle) {
            return res.status(404).json({
                message: "Battle room not found"
            });
        }

        if (battle.status !== "waiting") {
            return res.status(400).json({
                message: "Battle room is not available"
            });
        }

        if (battle.player1.toString() === req.user.userId) {
            return res.status(400).json({
                message: "You cannot join your own battle"
            });
        }

        if (battle.player2) {
            return res.status(400).json({
                message: "Battle room is already full"
            });
        }

        battle.player2 = req.user.userId;
        battle.status = "ready";

        await battle.save();

        res.json({
            message: "Joined battle successfully",
            battle: {
                id: battle._id,
                roomCode: battle.roomCode,
                player1: battle.player1,
                player2: battle.player2,
                status: battle.status
            }
        });

    } catch (error) {
        console.error("Join battle error:", error.message);

        res.status(500).json({
            message: "Failed to join battle"
        });
    }
};

const Problem = require("../models/Problem");

const getBattle = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const battle = await Battle.findOne({
            roomCode: roomCode.toUpperCase()
        })
            .populate("player1", "username rating")
            .populate("player2", "username rating")
            .populate("problem");

        if (!battle) {
            return res.status(404).json({
                message: "Battle room not found"
            });
        }

        res.json({
            battle
        });

    } catch (error) {
        console.error("Get battle error:", error.message);

        res.status(500).json({
            message: "Failed to get battle"
        });
    }
};

const startBattle = async (req, res) => {
    try {
        const { roomCode } = req.body;

        const battle = await Battle.findOne({
            roomCode: roomCode.toUpperCase()
        });

        if (!battle) {
            return res.status(404).json({ message: "Battle room not found" });
        }

        if (battle.player1.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Only Host (Player 1) can start the battle" });
        }

        if (battle.status !== "ready") {
            return res.status(400).json({ message: "Battle is not ready to start" });
        }

        // Randomly pick a problem from DB if not already picked
        if (!battle.problem) {
            const count = await Problem.countDocuments();
            if (count === 0) {
                return res.status(400).json({ message: "No coding problems found in database" });
            }
            const randomIndex = Math.floor(Math.random() * count);
            const randomProblem = await Problem.findOne().skip(randomIndex);
            battle.problem = randomProblem._id;
        }

        battle.status = "active";
        battle.startedAt = new Date();
        await battle.save();

        const populatedBattle = await Battle.findById(battle._id)
            .populate("player1", "username rating")
            .populate("player2", "username rating")
            .populate("problem");

        res.json({
            message: "Battle started successfully",
            battle: populatedBattle
        });
    } catch (error) {
        console.error("Start battle error:", error.message);
        res.status(500).json({ message: "Failed to start battle" });
    }
};

const getBattleHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const battles = await Battle.find({
            $or: [{ player1: userId }, { player2: userId }]
        })
            .populate("player1", "username rating")
            .populate("player2", "username rating")
            .populate("problem", "title difficulty")
            .populate("winner", "username")
            .sort({ createdAt: -1 });

        res.json({ battles });
    } catch (error) {
        console.error("Get battle history error:", error.message);
        res.status(500).json({ message: "Failed to fetch battle history" });
    }
};

module.exports = {
    createBattle, 
    joinBattle,
    getBattle,
    startBattle,
    getBattleHistory
};