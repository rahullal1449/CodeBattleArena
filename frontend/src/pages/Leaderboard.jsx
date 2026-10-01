import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    let currentUsername = "";
    if (token) {
        try {
            currentUsername = JSON.parse(atob(token.split(".")[1])).username;
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        axios.get("http://localhost:3000/api/leaderboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setLeaderboard(response.data.leaderboard || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Leaderboard error:", err);
            setError(err.response?.data?.message || "Failed to load leaderboard");
            setLoading(false);
        });
    }, [token]);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Global Leaderboard...</h2></div>;
    }

    const top1 = leaderboard[0];
    const top2 = leaderboard[1];
    const top3 = leaderboard[2];

    return (
        <div style={{ maxWidth: "1050px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                <div style={{ textAlign: "center", marginBottom: "35px" }}>
                    <h1 style={{ fontSize: "2.4rem", margin: 0 }}>🏆 GLOBAL LEADERBOARD</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Top competitive coders ranked by rating, XP, and 1v1 battle victories.</p>
                </div>

                {error && <div style={{ color: "var(--accent-red)", textAlign: "center", marginBottom: "20px" }}>⚠️ {error}</div>}

                {/* Top 3 Podium Display */}
                {leaderboard.length >= 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "20px", marginBottom: "45px" }}>
                        {/* Rank 2 - Silver */}
                        {top2 && (
                            <div className="glass-card" style={{ flex: 1, maxWidth: "220px", textAlign: "center", border: "1px solid #c0c0c0", padding: "20px" }}>
                                <div style={{ fontSize: "2.5rem" }}>🥈</div>
                                <h3 style={{ margin: "10px 0 4px", fontSize: "1.2rem" }}>{top2.username}</h3>
                                <p style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}>⚡ {top2.rating} Rating</p>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>🔥 {top2.xp} XP</span>
                            </div>
                        )}

                        {/* Rank 1 - Gold */}
                        <div className="glass-card glow-green" style={{ flex: 1, maxWidth: "240px", textAlign: "center", border: "2px solid var(--accent-green)", padding: "25px", transform: "scale(1.05)" }}>
                            <div style={{ fontSize: "3.5rem" }}>👑 🥇</div>
                            <h2 style={{ margin: "10px 0 4px", fontSize: "1.4rem", color: "var(--accent-green)" }}>{top1.username}</h2>
                            <p style={{ color: "var(--accent-green)", fontSize: "1.2rem", fontWeight: "bold" }}>⚡ {top1.rating} Rating</p>
                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>🔥 {top1.xp} XP</span>
                        </div>

                        {/* Rank 3 - Bronze */}
                        {top3 && (
                            <div className="glass-card" style={{ flex: 1, maxWidth: "220px", textAlign: "center", border: "1px solid #cd7f32", padding: "20px" }}>
                                <div style={{ fontSize: "2.5rem" }}>🥉</div>
                                <h3 style={{ margin: "10px 0 4px", fontSize: "1.2rem" }}>{top3.username}</h3>
                                <p style={{ color: "var(--accent-yellow)", fontWeight: "bold" }}>⚡ {top3.rating} Rating</p>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>🔥 {top3.xp} XP</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Full Leaderboard Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid var(--border-color)", color: "var(--text-muted)" }}>
                                <th style={{ padding: "14px 16px" }}>Rank</th>
                                <th style={{ padding: "14px 16px" }}>User</th>
                                <th style={{ padding: "14px 16px" }}>Rating</th>
                                <th style={{ padding: "14px 16px" }}>XP</th>
                                <th style={{ padding: "14px 16px" }}>Problems Solved</th>
                                <th style={{ padding: "14px 16px" }}>Battles Won</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user, index) => {
                                const isCurrentUser = user.username === currentUsername;
                                return (
                                    <tr
                                        key={user._id || index}
                                        style={{
                                            borderBottom: "1px solid var(--border-color)",
                                            backgroundColor: isCurrentUser ? "rgba(0, 255, 136, 0.08)" : "transparent",
                                            fontWeight: isCurrentUser ? "bold" : "normal"
                                        }}
                                    >
                                        <td style={{ padding: "16px", fontSize: "1.1rem" }}>
                                            {index === 0 ? "🥇 1" : index === 1 ? "🥈 2" : index === 2 ? "🥉 3" : `#${index + 1}`}
                                        </td>
                                        <td style={{ padding: "16px", fontSize: "1.05rem", color: isCurrentUser ? "var(--accent-green)" : "var(--text-main)" }}>
                                            {user.username} {isCurrentUser && " (You)"}
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--accent-cyan)", fontWeight: "bold" }}>
                                            ⚡ {user.rating}
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--accent-yellow)" }}>
                                            🔥 {user.xp}
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            💻 {user.problemsSolved}
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--accent-green)" }}>
                                            ⚔️ {user.battlesWon} / {user.battlesPlayed}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
