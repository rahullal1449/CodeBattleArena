const Battle = require("../models/Battle");
const User = require("../models/User");

// In-Memory Matchmaking Queue: [{ userId, rating, timestamp }]
let queue = [];

const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const joinMatchmaking = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const io = req.app.get("io");
        const userSockets = req.app.get("userSockets");

        // Check if user is already waiting in queue
        const existingQueueIndex = queue.findIndex(q => String(q.userId) === String(userId));
        if (existingQueueIndex !== -1) {
            return res.json({ message: "Already in matchmaking queue", inQueue: true });
        }

        // Search queue for opponent within rating range (±150)
        const userRating = user.rating || 1000;
        const matchedOpponentIndex = queue.findIndex(q => Math.abs(q.rating - userRating) <= 150 && String(q.userId) !== String(userId));

        if (matchedOpponentIndex !== -1) {
            // Opponent Found! Remove opponent from queue
            const opponent = queue.splice(matchedOpponentIndex, 1)[0];

            let roomCode;
            let existingBattle;
            do {
                roomCode = generateRoomCode();
                existingBattle = await Battle.findOne({ roomCode });
            } while (existingBattle);

            const battle = await Battle.create({
                roomCode,
                player1: opponent.userId,
                player2: userId,
                status: "ready"
            });

            // Emit socket matchFound event to BOTH players
            const player1SocketId = userSockets.get(String(opponent.userId));
            const player2SocketId = userSockets.get(String(userId));

            if (player1SocketId && io) {
                io.to(player1SocketId).emit("matchFound", { roomCode: battle.roomCode });
            }
            if (player2SocketId && io) {
                io.to(player2SocketId).emit("matchFound", { roomCode: battle.roomCode });
            }

            return res.json({
                message: "Opponent found! Match created.",
                matched: true,
                roomCode: battle.roomCode
            });
        } else {
            // No immediate match found -> Add to queue
            queue.push({
                userId,
                rating: userRating,
                timestamp: Date.now()
            });

            return res.json({
                message: "Searching for a 1v1 opponent...",
                inQueue: true,
                matched: false
            });
        }
    } catch (error) {
        console.error("Matchmaking Error:", error.message);
        res.status(500).json({ message: "Matchmaking failed" });
    }
};

const leaveMatchmaking = async (req, res) => {
    try {
        const userId = req.user.userId;
        queue = queue.filter(q => String(q.userId) !== String(userId));
        res.json({ message: "Left matchmaking queue" });
    } catch (error) {
        res.status(500).json({ message: "Failed to leave queue" });
    }
};

module.exports = {
    joinMatchmaking,
    leaveMatchmaking
};
