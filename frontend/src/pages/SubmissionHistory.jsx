import { useEffect, useState } from "react";
import axios from "axios";

function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:3000/api/submissions/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSubmissions(response.data || []);
            } catch (err) {
                console.error("Submission history error:", err);
                setError(err.response?.data?.message || "Failed to load submission history");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Submissions...</h2></div>;
    }

    return (
        <div style={{ maxWidth: "1050px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h1 style={{ fontSize: "2.2rem", margin: 0 }}>📜 SUBMISSION HISTORY</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Track all your practice and battle code submissions.</p>
                    </div>
                    <div style={{ background: "var(--bg-secondary)", padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        Total Submissions: <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>{submissions.length}</span>
                    </div>
                </div>

                {error && <div style={{ color: "var(--accent-red)", marginBottom: "20px" }}>⚠️ {error}</div>}

                {submissions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                        <h3>No code submissions recorded yet!</h3>
                        <p>Go to Practice Problems or 1v1 Battle to submit code.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid var(--border-color)", color: "var(--text-muted)" }}>
                                    <th style={{ padding: "14px 16px" }}>Problem</th>
                                    <th style={{ padding: "14px 16px" }}>Difficulty</th>
                                    <th style={{ padding: "14px 16px" }}>Language</th>
                                    <th style={{ padding: "14px 16px" }}>Verdict</th>
                                    <th style={{ padding: "14px 16px" }}>Test Cases</th>
                                    <th style={{ padding: "14px 16px" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((s) => (
                                    <tr key={s._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                        <td style={{ padding: "16px", fontWeight: "bold" }}>
                                            {s.problem?.title || "Unknown Problem"}
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                backgroundColor: s.problem?.difficulty === "Easy" ? "rgba(0, 255, 136, 0.15)" : s.problem?.difficulty === "Medium" ? "rgba(255, 183, 3, 0.15)" : "rgba(255, 71, 87, 0.15)",
                                                color: s.problem?.difficulty === "Easy" ? "var(--accent-green)" : s.problem?.difficulty === "Medium" ? "var(--accent-yellow)" : "var(--accent-red)"
                                            }}>
                                                {s.problem?.difficulty || "Medium"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--accent-cyan)" }}>
                                            {s.language}
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <span style={{
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                fontWeight: "bold",
                                                backgroundColor: s.verdict === "Accepted" ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 71, 87, 0.15)",
                                                color: s.verdict === "Accepted" ? "var(--accent-green)" : "var(--accent-red)"
                                            }}>
                                                {s.verdict}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--text-muted)" }}>
                                            {s.testCasesPassed} / {s.totalTestCases}
                                        </td>
                                        <td style={{ padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                            {new Date(s.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubmissionHistory;