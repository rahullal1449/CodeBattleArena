import { useEffect, useState } from "react";
import axios from "axios";

function BattleHistory() {
    const [battles, setBattles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    let currentUserId = null;
    if (token) {
        try {
            currentUserId = JSON.parse(atob(token.split(".")[1])).userId;
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/battles/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBattles(response.data.battles || []);
            } catch (err) {
                console.error("Error fetching history:", err);
                setError(err.response?.data?.message || "Failed to load battle history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token]);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Battle History...</h2></div>;
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", margin: 0 }}>📜 BATTLE HISTORY</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Track your 1v1 competitive matches, ratings, and performance.</p>
                    </div>
                    <div style={{ background: "var(--bg-secondary)", padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--border-color)", fontWeight: "bold" }}>
                        Total Battles: <span style={{ color: "var(--accent-green)" }}>{battles.length}</span>
                    </div>
                </div>

                {error && <div style={{ color: "var(--accent-red)", marginBottom: "20px" }}>⚠️ {error}</div>}

                {battles.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                        <h3>No battle matches found yet!</h3>
                        <p>Go to the Dashboard to create or join a 1v1 Battle.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {battles.map((b) => {
                            const isPlayer1 = String(b.player1?._id || b.player1) === String(currentUserId);
                            const opponent = isPlayer1 ? b.player2 : b.player1;
                            const opponentName = opponent?.username || "Opponent";
                            
                            const winnerId = b.winner?._id || b.winner;
                            const isWinner = winnerId && String(winnerId) === String(currentUserId);
                            const isDraw = b.status === "completed" && !b.winner;

                            return (
                                <div
                                    key={b._id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "var(--bg-secondary)",
                                        padding: "18px 24px",
                                        borderRadius: "10px",
                                        border: isWinner ? "1px solid var(--accent-green)" : b.status === "completed" ? "1px solid var(--accent-red)" : "1px solid var(--border-color)"
                                    }}
                                >
                                    {/* Left Details */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                        <div style={{ fontSize: "2rem" }}>
                                            {isWinner ? "🏆" : b.status === "completed" ? "💀" : "⏳"}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                                                vs <span style={{ color: "var(--accent-cyan)" }}>{opponentName}</span>
                                            </h3>
                                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                                                Problem: <strong>{b.problem?.title || "Custom Problem"}</strong> ({b.problem?.difficulty || "Medium"})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Room & Date */}
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "0.85rem", background: "var(--bg-primary)", padding: "4px 10px", borderRadius: "4px", color: "var(--text-muted)" }}>
                                            ROOM: {b.roomCode}
                                        </span>
                                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px" }}>
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Status / Rating Badge */}
                                    <div>
                                        {b.status === "completed" ? (
                                            isWinner ? (
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ padding: "6px 14px", background: "rgba(0, 255, 136, 0.15)", color: "var(--accent-green)", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                                        VICTORY (+25 Rating)
                                                    </span>
                                                    <p style={{ fontSize: "0.8rem", color: "var(--accent-green)", marginTop: "4px" }}>+25 XP Earned</p>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ padding: "6px 14px", background: "rgba(255, 71, 87, 0.15)", color: "var(--accent-red)", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                                        DEFEAT (-15 Rating)
                                                    </span>
                                                    <p style={{ fontSize: "0.8rem", color: "var(--accent-yellow)", marginTop: "4px" }}>+5 XP Earned</p>
                                                </div>
                                            )
                                        ) : (
                                            <span style={{ padding: "6px 14px", background: "rgba(255, 183, 3, 0.15)", color: "var(--accent-yellow)", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                                {b.status.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BattleHistory;
