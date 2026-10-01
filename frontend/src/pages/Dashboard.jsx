import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../services/socket";
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joinRoomCode, setJoinRoomCode] = useState("");
    const [battleError, setBattleError] = useState("");
    const [creatingBattle, setCreatingBattle] = useState(false);
    const [joiningBattle, setJoiningBattle] = useState(false);

    // Matchmaking Searching Overlay State
    const [searchingMatch, setSearchingMatch] = useState(false);

    const token = localStorage.getItem("token");
    let currentUserId = null;
    if (token) {
        try {
            currentUserId = JSON.parse(atob(token.split('.')[1])).userId;
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch stats");
                }

                setStats(data);
            } catch (error) {
                console.error("Stats error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Socket Registration & Matchmaking Listener
        if (currentUserId) {
            const handleConnect = () => {
                socket.emit("registerUser", currentUserId);
            };

            const handleMatchFound = (data) => {
                console.log("Match Found via socket! Navigating to:", data.roomCode);
                setSearchingMatch(false);
                navigate(`/battle/${data.roomCode}`);
            };

            socket.on("connect", handleConnect);
            socket.on("matchFound", handleMatchFound);

            if (socket.connected) {
                handleConnect();
            }

            return () => {
                socket.off("connect", handleConnect);
                socket.off("matchFound", handleMatchFound);
            };
        }
    }, [token, currentUserId, navigate]);

    // Create Battle Handler
    const handleCreateBattle = async () => {
        try {
            setCreatingBattle(true);
            setBattleError("");

            const response = await axios.post(
                "http://localhost:3000/api/battles/create",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const roomCode = response.data.battle.roomCode;
            navigate(`/battle/${roomCode}`);
        } catch (err) {
            console.error("Create battle error:", err);
            setBattleError(err.response?.data?.message || "Failed to create battle room");
        } finally {
            setCreatingBattle(false);
        }
    };

    // Join Battle Handler
    const handleJoinBattle = async (e) => {
        e.preventDefault();
        if (!joinRoomCode.trim()) {
            setBattleError("Please enter a valid room code");
            return;
        }

        try {
            setJoiningBattle(true);
            setBattleError("");

            const response = await axios.post(
                "http://localhost:3000/api/battles/join",
                { roomCode: joinRoomCode.trim().toUpperCase() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const roomCode = response.data.battle.roomCode;
            navigate(`/battle/${roomCode}`);
        } catch (err) {
            console.error("Join battle error:", err);
            setBattleError(err.response?.data?.message || "Failed to join battle room");
        } finally {
            setJoiningBattle(false);
        }
    };

    // Quick Matchmaking Handler
    const handleFindMatch = async () => {
        try {
            setBattleError("");
            setSearchingMatch(true);

            const res = await axios.post(
                "http://localhost:3000/api/matchmaking/join",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.matched) {
                setSearchingMatch(false);
                navigate(`/battle/${res.data.roomCode}`);
            }
        } catch (e) {
            setSearchingMatch(false);
            setBattleError(e.response?.data?.message || "Matchmaking failed");
        }
    };

    // Cancel Matchmaking
    const handleCancelMatchmaking = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/matchmaking/leave",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (e) {
            console.error(e);
        } finally {
            setSearchingMatch(false);
        }
    };

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading Dashboard...</h2>;
    }

    return (
        <div className="dashboard" style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            {/* SEARCHING MATCHMAKING OVERLAY MODAL */}
            {searchingMatch && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(11, 14, 20, 0.95)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    zIndex: 9999
                }}>
                    <div className="glass-card glow-green" style={{ textAlign: "center", padding: "40px", maxWidth: "450px", width: "100%" }}>
                        <h2 className="pulsing" style={{ fontSize: "2rem", color: "var(--accent-green)", margin: 0 }}>🔍 MATCHMAKING</h2>
                        <h3 style={{ margin: "20px 0 10px", fontSize: "1.3rem" }}>Searching for 1v1 Opponent...</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Finding players near <strong>⚡ {stats?.rating || 1000} Rating (±150)</strong></p>

                        <div style={{ margin: "30px 0" }}>
                            <div className="pulsing" style={{ fontSize: "3rem" }}>⚔️</div>
                        </div>

                        <button
                            onClick={handleCancelMatchmaking}
                            style={{
                                padding: "10px 24px",
                                backgroundColor: "rgba(255, 71, 87, 0.2)",
                                color: "var(--accent-red)",
                                border: "1px solid var(--accent-red)",
                                fontWeight: "bold"
                            }}
                        >
                            ❌ Cancel Search
                        </button>
                    </div>
                </div>
            )}

            <div className="dashboard-header" style={{ marginBottom: "30px" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2.2rem" }}>CodeBattleArena</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Practice. Challenge. Compete.</p>
                </div>

                <h2>Welcome, <span style={{ color: "var(--accent-green)" }}>{stats?.username}</span> 👋</h2>
            </div>

            <div className="dashboard-section" style={{ marginBottom: "35px" }}>
                <h2>Your Performance</h2>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Rating</h3>
                        <p style={{ color: "var(--accent-green)" }}>⚡ {stats?.rating}</p>
                    </div>

                    <div className="stat-card">
                        <h3>XP</h3>
                        <p style={{ color: "var(--accent-yellow)" }}>🔥 {stats?.xp}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Problems Solved</h3>
                        <p style={{ color: "var(--accent-cyan)" }}>💻 {stats?.problemsSolved}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Submissions</h3>
                        <p>{stats?.totalSubmissions}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Accepted</h3>
                        <p style={{ color: "var(--accent-green)" }}>{stats?.acceptedSubmissions}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Battles Played</h3>
                        <p>{stats?.battlesPlayed}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Battles Won</h3>
                        <p style={{ color: "var(--accent-green)" }}>⚔️ {stats?.battlesWon}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Win Rate</h3>
                        <p style={{ color: "var(--accent-yellow)" }}>
                            {stats?.battlesPlayed
                                ? Math.round((stats.battlesWon / stats.battlesPlayed) * 100)
                                : 0}%
                        </p>
                    </div>
                </div>
            </div>

            {/* BATTLE ARENA ACTIONS */}
            <div className="glass-card" style={{ padding: "24px", margin: "30px 0" }}>
                <h2 style={{ color: "var(--accent-green)", margin: "0 0 20px" }}>⚔️ 1v1 Battle Arena</h2>

                {battleError && (
                    <div style={{ color: "var(--accent-red)", marginBottom: "15px", fontWeight: "bold" }}>
                        ⚠️ {battleError}
                    </div>
                )}

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Automated Matchmaking Card */}
                    <div style={{ flex: 1, minWidth: "240px", background: "var(--bg-secondary)", padding: "20px", borderRadius: "10px", border: "1px solid var(--accent-green)" }}>
                        <h3 style={{ color: "var(--accent-green)", margin: "0 0 8px" }}>🎮 Quick Matchmaking</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Auto-find an online opponent with similar rating (±150).</p>
                        <button
                            onClick={handleFindMatch}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "var(--accent-green)",
                                color: "#000",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                        >
                            ⚡ Find 1v1 Match
                        </button>
                    </div>

                    {/* Create Room Button */}
                    <div style={{ flex: 1, minWidth: "240px", background: "var(--bg-secondary)", padding: "20px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <h3 style={{ margin: "0 0 8px" }}>Create Private Room</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Start a private 1v1 battle as Host & invite a friend.</p>
                        <button
                            onClick={handleCreateBattle}
                            disabled={creatingBattle}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "var(--accent-red)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                        >
                            {creatingBattle ? "Creating..." : "👑 Create Room"}
                        </button>
                    </div>

                    {/* Join Room Form */}
                    <div style={{ flex: 1, minWidth: "240px", background: "var(--bg-secondary)", padding: "20px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <h3 style={{ margin: "0 0 8px" }}>Join Existing Room</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Enter 6-character room code shared by Host.</p>
                        <form onSubmit={handleJoinBattle} style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="e.g. UV8NBB"
                                value={joinRoomCode}
                                onChange={(e) => setJoinRoomCode(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border-color)",
                                    backgroundColor: "var(--bg-primary)",
                                    color: "#fff",
                                    fontSize: "1rem",
                                    textTransform: "uppercase"
                                }}
                            />
                            <button
                                type="submit"
                                disabled={joiningBattle}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "var(--accent-cyan)",
                                    color: "#000",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                {joiningBattle ? "Joining..." : "⚔️ Join"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Quick Actions</h2>

                <div className="dashboard-actions">
                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/problems")}
                    >
                        💻 Practice Problems
                    </button>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/submissions")}
                    >
                        📜 Submission History
                    </button>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/analytics")}
                    >
                        📈 View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
