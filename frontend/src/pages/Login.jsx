import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setMessage(data.message || "Invalid credentials");
            }

        } catch (error) {
            console.error(error);
            setMessage("Failed to connect to backend server");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        alert("Google OAuth Sign-In Initialized! (Simulated for Prototype)");
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
                <p style={{ color: "var(--accent-yellow)", fontSize: "0.85rem", fontWeight: "bold", letterSpacing: "1.2px", marginBottom: "30px", textTransform: "uppercase" }}>
                    WHERE CODERS CLASH
                </p>

                {message && (
                    <div style={{
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        backgroundColor: message.includes("successful") ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 71, 87, 0.15)",
                        color: message.includes("successful") ? "var(--accent-green)" : "var(--accent-red)",
                        border: message.includes("successful") ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)",
                        fontSize: "0.9rem"
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                        type="email"
                        placeholder="Email Address"
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
                        {loading ? "Authenticating..." : "🚀 Sign In to Arena"}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", margin: "25px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }}></div>
                    <span style={{ padding: "0 10px" }}>OR</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }}></div>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleAuth}
                    type="button"
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-main)",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                    }}
                >
                    <span style={{ fontSize: "1.1rem" }}>🌐</span> Continue with Google
                </button>

                <p style={{ marginTop: "25px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Don't have an account? <Link to="/signup" style={{ color: "var(--accent-cyan)", fontWeight: "bold", textDecoration: "none" }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;