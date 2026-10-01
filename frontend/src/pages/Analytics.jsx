import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get("http://localhost:3000/api/analytics/my", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setData(response.data.analytics);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Analytics fetch error:", err);
            setError(err.response?.data?.message || "Failed to load performance analytics");
            setLoading(false);
        });
    }, [token]);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Performance Analytics...</h2></div>;
    }

    if (error) {
        return <div style={{ textAlign: "center", marginTop: "80px", color: "var(--accent-red)" }}><h2>⚠️ {error}</h2></div>;
    }

    const {
        username,
        rating,
        xp,
        problemsSolved,
        totalProblemsInPlatform,
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate,
        battlesPlayed,
        battlesWon,
        winRate,
        difficultyBreakdown,
        topicAnalysis,
        weakTopics,
        recentSubmissions
    } = data;

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
                    <div>
                        <h1 style={{ fontSize: "2.2rem", margin: 0 }}>📈 PERFORMANCE ANALYTICS</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Detailed Insights into your coding speed, accuracy, and topic strengths for <strong>{username}</strong>.</p>
                    </div>
                    <div style={{ background: "var(--bg-secondary)", padding: "10px 20px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <span style={{ fontSize: "1.2rem", color: "var(--accent-green)", fontWeight: "bold" }}>⚡ {rating} Rating</span>
                        <span style={{ marginLeft: "15px", color: "var(--accent-yellow)" }}>🔥 {xp} XP</span>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "35px" }}>
                    <div className="glass-card" style={{ textAlign: "center", padding: "20px" }}>
                        <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>ACCEPTED SUBMISSIONS</h3>
                        <h2 style={{ fontSize: "2rem", color: "var(--accent-green)", margin: 0 }}>{acceptedSubmissions} / {totalSubmissions}</h2>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{acceptanceRate}% Acceptance Rate</span>
                    </div>

                    <div className="glass-card" style={{ textAlign: "center", padding: "20px" }}>
                        <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>PROBLEMS SOLVED</h3>
                        <h2 style={{ fontSize: "2rem", color: "var(--accent-cyan)", margin: 0 }}>{problemsSolved} / {totalProblemsInPlatform}</h2>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Platform Total</span>
                    </div>

                    <div className="glass-card" style={{ textAlign: "center", padding: "20px" }}>
                        <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>1v1 BATTLE WIN RATE</h3>
                        <h2 style={{ fontSize: "2rem", color: "var(--accent-yellow)", margin: 0 }}>{winRate}%</h2>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{battlesWon} Wins / {battlesPlayed} Played</span>
                    </div>
                </div>

                {/* WEAK TOPIC RECOMMENDATION ALERT BOX */}
                {weakTopics && weakTopics.length > 0 ? (
                    <div style={{ background: "rgba(255, 71, 87, 0.12)", border: "1px solid var(--accent-red)", padding: "20px", borderRadius: "10px", marginBottom: "35px" }}>
                        <h3 style={{ color: "var(--accent-red)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px" }}>
                            ⚠️ IDENTIFIED WEAK TOPICS (RECOMMENDED PRACTICE)
                        </h3>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>
                            Based on your failed submission history, focus practicing more problems in: <strong>{weakTopics.join(", ")}</strong>.
                        </p>
                    </div>
                ) : (
                    <div style={{ background: "rgba(0, 255, 136, 0.12)", border: "1px solid var(--accent-green)", padding: "20px", borderRadius: "10px", marginBottom: "35px" }}>
                        <h3 style={{ color: "var(--accent-green)", margin: "0 0 8px" }}>
                            🎯 GREAT ACCURACY!
                        </h3>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>
                            No major weak topics identified. Keep practicing medium and hard level problems!
                        </p>
                    </div>
                )}

                {/* Split Section: Difficulty Breakdown & Topic Matrix */}
                <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", marginBottom: "35px" }}>
                    {/* Difficulty Breakdown */}
                    <div className="glass-card" style={{ flex: 1, minWidth: "300px" }}>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Difficulty Breakdown</h3>
                        
                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>Easy</span>
                                <span>{difficultyBreakdown.easy} Solved</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(100, (difficultyBreakdown.easy / 10) * 100)}%`, background: "var(--accent-green)", height: "100%" }}></div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ color: "var(--accent-yellow)", fontWeight: "bold" }}>Medium</span>
                                <span>{difficultyBreakdown.medium} Solved</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(100, (difficultyBreakdown.medium / 10) * 100)}%`, background: "var(--accent-yellow)", height: "100%" }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ color: "var(--accent-red)", fontWeight: "bold" }}>Hard</span>
                                <span>{difficultyBreakdown.hard} Solved</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(100, (difficultyBreakdown.hard / 10) * 100)}%`, background: "var(--accent-red)", height: "100%" }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Topic Analysis Table */}
                    <div className="glass-card" style={{ flex: 1.5, minWidth: "300px" }}>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Topic Strength Matrix</h3>
                        {topicAnalysis.length === 0 ? (
                            <p style={{ color: "var(--text-muted)" }}>Submit solutions to analyze your topic accuracy.</p>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                                        <th style={{ padding: "8px 12px" }}>Topic / Tag</th>
                                        <th style={{ padding: "8px 12px" }}>Attempts</th>
                                        <th style={{ padding: "8px 12px" }}>Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topicAnalysis.map((t, idx) => (
                                        <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                            <td style={{ padding: "10px 12px", fontWeight: "bold" }}>{t.tag}</td>
                                            <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{t.accepted} / {t.total}</td>
                                            <td style={{ padding: "10px 12px" }}>
                                                <span style={{
                                                    color: t.acceptanceRate >= 70 ? "var(--accent-green)" : t.acceptanceRate >= 40 ? "var(--accent-yellow)" : "var(--accent-red)",
                                                    fontWeight: "bold"
                                                }}>
                                                    {t.acceptanceRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Recent Activity Feed</h3>
                    {recentSubmissions.length === 0 ? (
                        <p style={{ color: "var(--text-muted)" }}>No recent submissions.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {recentSubmissions.map((s) => (
                                <div key={s._id} style={{ background: "var(--bg-secondary)", padding: "12px 18px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <strong>{s.problem?.title || "Problem"}</strong>
                                        <span style={{ marginLeft: "12px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(s.createdAt).toLocaleString()}</span>
                                    </div>
                                    <span style={{
                                        color: s.verdict === "Accepted" ? "var(--accent-green)" : "var(--accent-red)",
                                        fontWeight: "bold",
                                        fontSize: "0.9rem"
                                    }}>
                                        {s.verdict}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analytics;
