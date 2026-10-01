import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Account created successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setMessage(data.message || "Failed to register account");
            }

        } catch (error) {
            console.error(error);
            setMessage("Failed to connect to backend server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--bg-primary)",
            padding: "20px"
        }}>
            <div className="glass-card glow-green" style={{ maxWidth: "420px", width: "100%", padding: "40px", textAlign: "center" }}>
                {/* Logo & Tagline */}
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⚔️</div>
                <h1 style={{
                    margin: "0 0 6px",
                    fontSize: "2.2rem",
                    fontWeight: "900",
                    background: "linear-gradient(90deg, #00ff88, #00e5ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    CodeBattleArena
                </h1>
                <p style={{ color: "var(--accent-yellow)", fontSize: "0.85rem", fontWeight: "bold", letterSpacing: "1.2px", marginBottom: "25px", textTransform: "uppercase" }}>
                    WHERE CODERS CLASH
                </p>

                <h3 style={{ color: "var(--text-main)", fontSize: "1.1rem", marginBottom: "20px", fontWeight: "600" }}>
                    📧 Register with Gmail / Email
                </h3>

                {message && (
                    <div style={{
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        backgroundColor: message.includes("successfully") ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 71, 87, 0.15)",
                        color: message.includes("successfully") ? "var(--accent-green)" : "var(--accent-red)",
                        border: message.includes("successfully") ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)",
                        fontSize: "0.9rem"
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                        type="text"
                        placeholder="Username (e.g. CodeMaster)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 16px" }}
                    />

                    <input
                        type="email"
                        placeholder="Gmail / Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 16px" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 16px" }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "14px",
                            backgroundColor: "var(--accent-green)",
                            color: "#000",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            marginTop: "10px"
                        }}
                    >
                        {loading ? "Creating Account..." : "⚡ Register Account"}
                    </button>
                </form>

                <p style={{ marginTop: "25px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--accent-cyan)", fontWeight: "bold", textDecoration: "none" }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;