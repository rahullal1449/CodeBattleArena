const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const codeRoutes = require("./routes/codeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const battleRoutes = require("./routes/battleRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const matchmakingRoutes = require("./routes/matchmakingRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const dailyRoutes = require("./routes/dailyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const apiLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// Apply API Rate Limiting
app.use("/api", apiLimiter(150, 15 * 60 * 1000));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/matchmaking", matchmakingRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/daily", dailyRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "CodeBattleArena Backend is running!",
    });
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Map to store connected User IDs to Socket IDs
const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (userId) => {
        if (userId) {
            userSockets.set(String(userId), socket.id);
            socket.userId = String(userId);
            console.log(`Registered User ${userId} with Socket ${socket.id}`);
        }
    });

    socket.on("joinBattleRoom", (roomCode) => {
        socket.join(roomCode);
        console.log(`Socket ${socket.id} joined battle room: ${roomCode}`);

        const room = io.sockets.adapter.rooms.get(roomCode);
        const playerCount = room ? room.size : 0;
        console.log(`Players in room ${roomCode}: ${playerCount}`);

        if (playerCount >= 2) {
            io.to(roomCode).emit("opponentJoined", {
                message: "Opponent joined the battle!",
            });
        }
    });

    socket.on("startBattle", ({ roomCode, battle }) => {
        console.log(`Battle start requested for room: ${roomCode}`);
        let countdown = 3;
        io.to(roomCode).emit("battleCountdown", { countdown });

        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                io.to(roomCode).emit("battleCountdown", { countdown });
            } else {
                clearInterval(timer);
                io.to(roomCode).emit("battleStarted", { battle });
            }
        }, 1000);
    });

    socket.on("updateOpponentStatus", ({ roomCode, username, statusText }) => {
        socket.to(roomCode).emit("opponentStatusUpdated", { username, statusText });
    });

    socket.on("battleEnded", ({ roomCode, winnerUsername, battleResult }) => {
        io.to(roomCode).emit("battleCompleted", { winnerUsername, battleResult });
    });

    // WebRTC Peer-to-Peer Signaling Handlers
    socket.on("webrtcOffer", ({ roomCode, offer }) => {
        socket.to(roomCode).emit("webrtcOffer", { offer });
    });

    socket.on("webrtcAnswer", ({ roomCode, answer }) => {
        socket.to(roomCode).emit("webrtcAnswer", { answer });
    });

    socket.on("webrtcIceCandidate", ({ roomCode, candidate }) => {
        socket.to(roomCode).emit("webrtcIceCandidate", { candidate });
    });

    socket.on("toggleMedia", ({ roomCode, type, enabled }) => {
        socket.to(roomCode).emit("opponentMediaToggled", { type, enabled });
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            userSockets.delete(socket.userId);
        }
        console.log("User disconnected:", socket.id);
    });
});

// Attach io and userSockets to app for use in controllers
app.set("io", io);
app.set("userSockets", userSockets);

server.listen(PORT, () => {
    console.log(`CodeBattleArena server running on port ${PORT}`);
});
