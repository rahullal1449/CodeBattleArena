import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
        try {
            user = JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            console.error(e);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!token) return null;

    const navItems = [
        { path: "/dashboard", label: "📊 Dashboard" },
        { path: "/problems", label: "💻 Problems" },
        { path: "/daily-challenge", label: "🔥 Daily" },
        { path: "/submissions", label: "📜 Submissions" },
        { path: "/battle-history", label: "⚔️ Battles" },
        { path: "/leaderboard", label: "🏆 Leaderboard" },
        { path: "/analytics", label: "📈 Analytics" },
        { path: "/achievements", label: "🎖️ Badges" }
    ];

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 28px",
                backgroundColor: "rgba(21, 25, 33, 0.95)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
            }}
        >
            {/* Logo & Tagline */}
            <div
                onClick={() => navigate("/dashboard")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer"
                }}
            >
                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #00ff88, #00e5ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        boxShadow: "0 0 15px rgba(0, 255, 136, 0.4)"
                    }}
                >
                    ⚔️
                </div>
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "1.4rem",
                            fontWeight: "900",
                            letterSpacing: "1px",
                            background: "linear-gradient(90deg, #00ff88, #00e5ff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        CodeBattleArena
                    </h2>
                    <span style={{ fontSize: "0.7rem", color: "var(--accent-yellow)", fontWeight: "bold", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                        WHERE CODERS CLASH
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "6px", backgroundColor: "rgba(11, 14, 20, 0.6)", padding: "5px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                padding: "8px 14px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                borderRadius: "7px",
                                backgroundColor: active ? "var(--bg-card)" : "transparent",
                                color: active ? "var(--accent-green)" : "var(--text-muted)",
                                border: active ? "1px solid rgba(0, 255, 136, 0.3)" : "1px solid transparent",
                                boxShadow: active ? "0 0 10px rgba(0, 255, 136, 0.15)" : "none",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div
                    style={{
                        background: "rgba(28, 33, 44, 0.9)",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <span>👤</span>
                    <span style={{ fontWeight: "bold", color: "var(--text-main)" }}>{user?.username || "Coder"}</span>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "rgba(255, 71, 87, 0.12)",
                        color: "var(--accent-red)",
                        border: "1px solid var(--accent-red)",
                        fontSize: "0.85rem",
                        borderRadius: "8px"
                    }}
                >
                    🚪 Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
