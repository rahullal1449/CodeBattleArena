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
                }, 1200);
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
            padding: "20px",
            background: "radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)"
        }}>
            <div className="glass-card glow-green" style={{
                maxWidth: "420px",
                width: "100%",
                padding: "40px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Top Subtle Neon Highlight Bar */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #10b981, #06b6d4)"
                }}></div>

                {/* Top Header Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 14px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "var(--accent-green)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    letterSpacing: "0.5px"
                }}>
                    ⚡ REGISTER NEW ACCOUNT
                </div>

                {/* Logo & Brand Header */}
                <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>⚔️</div>
                <h1 style={{
                    margin: "0 0 4px",
                    fontSize: "2.1rem",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    background: "linear-gradient(90deg, #10b981, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    CodeBattleArena
                </h1>
                <p style={{
                    color: "var(--accent-yellow)",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    letterSpacing: "1.4px",
                    marginBottom: "30px",
                    textTransform: "uppercase"
                }}>
                    WHERE CODERS CLASH
                </p>

                {/* Notification Message Banner */}
                {message && (
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        marginBottom: "22px",
                        backgroundColor: message.includes("successfully") ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: message.includes("successfully") ? "var(--accent-green)" : "var(--accent-red)",
                        border: message.includes("successfully") ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                        fontSize: "0.88rem",
                        fontWeight: "500"
                    }}>
                        {message}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="CodeMaster"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px 16px" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                            Email or Gmail Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px 16px" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px 16px" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "13px",
                            backgroundColor: "var(--accent-green)",
                            color: "#0f172a",
                            fontSize: "1rem",
                            fontWeight: "800",
                            marginTop: "8px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                        }}
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                {/* Bottom Login Link */}
                <p style={{ marginTop: "28px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--accent-cyan)", fontWeight: "700", textDecoration: "none" }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;