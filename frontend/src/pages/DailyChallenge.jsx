import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { SUPPORTED_LANGUAGES, getTemplateCode } from "../utils/languageTemplates";
import TestCaseTray from "../components/TestCaseTray";

function DailyChallenge() {
    const navigate = useNavigate();

    const [dailyData, setDailyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Test Case Results & Verdict Data State
    const [testResults, setTestResults] = useState(null);
    const [verdictData, setVerdictData] = useState(null);

    const token = localStorage.getItem("token");

    const fetchDailyChallenge = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await axios.get(`${apiUrl}/api/daily/today`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDailyData(response.data);
            if (response.data.problem) {
                setCode(response.data.problem.starterCode || getTemplateCode("javascript", response.data.problem));
            }
            setLoading(false);
        } catch (err) {
            console.error("Daily challenge error:", err);
            setError(err.response?.data?.message || "Failed to load daily challenge");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyChallenge();
    }, [token]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getTemplateCode(newLang, dailyData?.problem));
    };

    const runCode = async () => {
        try {
            setRunning(true);
            setOutput("");
            setVerdictData(null);
            setTestResults(null);
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await axios.post(`${apiUrl}/api/code/run`, {
                code,
                problemId: dailyData?.problem?._id,
                language
            });

            if (response.data.testCaseResults) {
                setTestResults(response.data.testCaseResults);
            }
            setOutput(response.data.output || response.data.error || "Execution completed.");
        } catch (err) {
            console.error("Run error:", err);
            setOutput("Execution error: " + (err.response?.data?.message || err.message));
        } finally {
            setRunning(false);
        }
    };

    const submitCode = async () => {
        if (!dailyData?.problem) return;
        try {
            setSubmitting(true);
            setVerdictData(null);
            setTestResults(null);
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await axios.post(
                `${apiUrl}/api/code/submit`,
                {
                    code,
                    problemId: dailyData.problem._id,
                    language
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVerdictData(response.data);
            if (response.data.verdict === "Accepted") {
                fetchDailyChallenge(); // Refresh daily challenge status
            }
        } catch (err) {
            console.error("Submit error:", err);
            setOutput("Submission failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "100px" }}><h2>⏳ Loading Today's Daily Challenge...</h2></div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", color: "var(--accent-red)" }}>
                <h2>⚠️ Error: {error}</h2>
                <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px", padding: "10px 20px" }}>Back to Dashboard</button>
            </div>
        );
    }

    const { problem, date, completedToday, streak } = dailyData;

    return (
        <div style={{ padding: "20px", color: "#fff", backgroundColor: "var(--bg-primary)", minHeight: "calc(100vh - 70px)" }}>
            {/* Banner Header */}
            <div className="glass-card glow-green" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", marginBottom: "20px", border: "1px solid var(--accent-green)" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <h1 style={{ margin: 0, fontSize: "1.8rem", color: "var(--accent-green)" }}>🔥 DAILY CODING CHALLENGE</h1>
                        <span style={{ background: "var(--bg-secondary)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                            DATE: {date}
                        </span>
                    </div>
                    <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Solve today's featured problem to claim <strong>+50 Bonus XP</strong> & build your coding streak!</p>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div style={{ background: "var(--bg-secondary)", padding: "10px 20px", borderRadius: "10px", border: "1px solid var(--accent-yellow)", textAlign: "center" }}>
                        <span style={{ fontSize: "1.2rem", color: "var(--accent-yellow)", fontWeight: "bold" }}>🔥 {streak} Day Streak</span>
                    </div>

                    <div style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        backgroundColor: completedToday ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 183, 3, 0.2)",
                        color: completedToday ? "var(--accent-green)" : "var(--accent-yellow)",
                        border: completedToday ? "1px solid var(--accent-green)" : "1px solid var(--accent-yellow)"
                    }}>
                        {completedToday ? "✅ COMPLETED TODAY (+50 XP CLAIMED)" : "🎯 UNCOMPLETED (+50 XP)"}
                    </div>
                </div>
            </div>

            {/* Split Workspace */}
            <div style={{ display: "flex", gap: "16px" }}>
                {/* Left Pane */}
                <div className="glass-card" style={{ flex: 1, height: "76vh", overflowY: "auto" }}>
                    <h2 style={{ color: "var(--accent-green)", fontSize: "1.5rem" }}>{problem.title}</h2>
                    <span style={{ padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(255, 183, 3, 0.15)", color: "var(--accent-yellow)", border: "1px solid var(--accent-yellow)", fontSize: "0.8rem", fontWeight: "bold" }}>
                        {problem.difficulty}
                    </span>

                    <h3 style={{ marginTop: "20px", color: "var(--text-main)", fontSize: "1.1rem" }}>Problem Description</h3>
                    <p style={{ lineHeight: "1.6", color: "var(--text-muted)", fontSize: "0.95rem" }}>{problem.description}</p>

                    <h3 style={{ marginTop: "20px", color: "var(--text-main)", fontSize: "1.1rem" }}>Constraints</h3>
                    <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", lineHeight: "1.8", fontSize: "0.9rem" }}>
                        {problem.constraints?.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>

                    <h3 style={{ marginTop: "20px", color: "var(--text-main)", fontSize: "1.1rem" }}>Examples</h3>
                    {problem.examples?.map((ex, i) => (
                        <div key={i} style={{ background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "8px", marginBottom: "12px", border: "1px solid var(--border-color)" }}>
                            <p style={{ color: "var(--text-main)", fontSize: "0.9rem" }}><strong>Input:</strong> <code style={{ color: "var(--accent-cyan)" }}>{ex.input}</code></p>
                            <p style={{ color: "var(--text-main)", marginTop: "4px", fontSize: "0.9rem" }}><strong>Output:</strong> <code style={{ color: "var(--accent-green)" }}>{ex.output}</code></p>
                            {ex.explanation && <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "0.85rem" }}><strong>Explanation:</strong> {ex.explanation}</p>}
                        </div>
                    ))}
                </div>

                {/* Right Pane */}
                <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="glass-card" style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {/* Language Selector Dropdown */}
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--accent-cyan)",
                                border: "1px solid var(--accent-cyan)",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                fontSize: "0.88rem",
                                cursor: "pointer",
                                outline: "none"
                            }}
                        >
                            {SUPPORTED_LANGUAGES.map(lang => (
                                <option key={lang.id} value={lang.id} style={{ backgroundColor: "#151921", color: "#fff" }}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={runCode} disabled={running} style={{ padding: "8px 18px", backgroundColor: "#2ed47e", color: "#fff", fontSize: "0.9rem" }}>
                                {running ? "Running..." : "▶️ Run"}
                            </button>
                            <button onClick={submitCode} disabled={submitting} style={{ padding: "8px 18px", backgroundColor: "var(--accent-red)", color: "#fff", fontSize: "0.9rem" }}>
                                {submitting ? "Submitting..." : "🚀 Submit Challenge"}
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: "10px" }}>
                        <Editor
                            height="420px"
                            language={SUPPORTED_LANGUAGES.find(l => l.id === language)?.monacoLang || "javascript"}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                        />
                    </div>

                    {/* LeetCode Test Case Tray */}
                    <TestCaseTray
                        testResults={testResults}
                        verdictData={verdictData}
                        output={output}
                        running={running}
                        submitLoading={submitting}
                    />
                </div>
            </div>
        </div>
    );
}

export default DailyChallenge;
