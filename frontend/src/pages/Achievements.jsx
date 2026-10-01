import { useEffect, useState } from "react";
import axios from "axios";

function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [unlockedCount, setUnlockedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get("http://localhost:3000/api/achievements/my", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setAchievements(response.data.achievements || []);
            setUnlockedCount(response.data.unlockedCount || 0);
            setTotalCount(response.data.totalCount || 0);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Achievements error:", err);
            setError(err.response?.data?.message || "Failed to load achievements");
            setLoading(false);
        });
    }, [token]);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Badges & Achievements...</h2></div>;
    }

    const percentage = totalCount ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 style={{ fontSize: "2.2rem", margin: 0 }}>🎖️ BADGES & ACHIEVEMENTS</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Complete coding milestones, 1v1 battle victories, and rating ranks to earn badges.</p>
                    </div>

                    <div style={{ background: "var(--bg-secondary)", padding: "12px 24px", borderRadius: "10px", border: "1px solid var(--border-color)", textAlign: "center", minWidth: "200px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--accent-green)" }}>{unlockedCount} / {totalCount} Badges</h3>
                        <div style={{ background: "var(--bg-primary)", height: "8px", borderRadius: "4px", marginTop: "8px", overflow: "hidden" }}>
                            <div style={{ width: `${percentage}%`, background: "var(--accent-green)", height: "100%" }}></div>
                        </div>
                    </div>
                </div>

                {error && <div style={{ color: "var(--accent-red)", marginBottom: "20px" }}>⚠️ {error}</div>}

                {/* Badges Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {achievements.map((a) => (
                        <div
                            key={a.id}
                            className={a.unlocked ? "glass-card glow-green" : "glass-card"}
                            style={{
                                opacity: a.unlocked ? 1 : 0.65,
                                border: a.unlocked ? "1px solid var(--accent-green)" : "1px solid var(--border-color)",
                                position: "relative",
                                padding: "24px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ fontSize: "2.5rem", filter: a.unlocked ? "none" : "grayscale(100%)" }}>
                                    {a.icon}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: a.unlocked ? "var(--accent-green)" : "var(--text-main)" }}>
                                        {a.title}
                                    </h3>
                                    <span style={{ fontSize: "0.75rem", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>
                                        {a.category}
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "15px" }}>
                                {a.description}
                            </p>

                            {/* Progress bar or Unlocked badge */}
                            {a.unlocked ? (
                                <div style={{ color: "var(--accent-green)", fontWeight: "bold", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                    ✅ UNLOCKED
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                                        <span>Progress</span>
                                        <span>{a.progress} / {a.maxProgress}</span>
                                    </div>
                                    <div style={{ background: "var(--bg-secondary)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${Math.min(100, (a.progress / a.maxProgress) * 100)}%`, background: "var(--accent-yellow)", height: "100%" }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Achievements;
