import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { SUPPORTED_LANGUAGES, getTemplateCode } from "../utils/languageTemplates";

function ProblemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [verdict, setVerdict] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    // AI Assistant States
    const [aiHint, setAiHint] = useState("");
    const [aiComplexity, setAiComplexity] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        axios.get(`${apiUrl}/api/problems/${id}`)
            .then((response) => {
                setProblem(response.data);
                setCode(response.data.starterCode || getTemplateCode("javascript", response.data));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading problem:", error);
                setLoading(false);
            });
    }, [id]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getTemplateCode(newLang, problem));
    };

    const runCode = async () => {
        try {
            setRunning(true);
            setOutput("");
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await axios.post(`${apiUrl}/api/code/run`, {
                code,
                input: "",
                language
            });

            setOutput(response.data.output || response.data.error || "Execution completed.");
        } catch (error) {
            console.error("Run error:", error);
            setOutput("Execution error: " + (error.response?.data?.message || error.message));
        } finally {
            setRunning(false);
        }
    };

    const submitCode = async () => {
        try {
            setSubmitLoading(true);
            setVerdict("");
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await axios.post(
                `${apiUrl}/api/code/submit`,
                {
                    code,
                    problemId: problem._id,
                    language
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVerdict(response.data.verdict);
        } catch (error) {
            console.error("Submit error:", error);
            setVerdict("Submission failed: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitLoading(false);
        }
    };

    // AI Hint Handler
    const handleAskAiHint = async () => {
        try {
            setAiLoading(true);
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const res = await axios.post(
                `${apiUrl}/api/ai/hint`,
                { problemId: problem._id, currentCode: code },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAiHint(res.data.hint);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    // AI Complexity Handler
    const handleExplainComplexity = async () => {
        try {
            setAiLoading(true);
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const res = await axios.post(
                `${apiUrl}/api/ai/complexity`,
                { code },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAiComplexity(res.data.analysis);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "100px" }}><h2>⏳ Loading Problem Details...</h2></div>;
    }

    if (!problem) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", color: "var(--accent-red)" }}>
                <h2>⚠️ Problem Not Found</h2>
                <button onClick={() => navigate("/problems")} style={{ marginTop: "20px", padding: "10px 20px" }}>Back to Problems</button>
            </div>
        );
    }

    const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];

    return (
        <div style={{ padding: "20px", color: "#fff", backgroundColor: "var(--bg-primary)", minHeight: "calc(100vh - 70px)" }}>
            {/* Header Navigation */}
            <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button onClick={() => navigate("/problems")} style={{ padding: "6px 14px", backgroundColor: "var(--bg-secondary)", color: "var(--text-main)", border: "1px solid var(--border-color)" }}>
                        ← Back to Problems
                    </button>
                    <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{problem.title}</h2>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button onClick={handleAskAiHint} disabled={aiLoading} style={{ padding: "6px 14px", backgroundColor: "rgba(168, 85, 247, 0.2)", color: "var(--accent-purple)", border: "1px solid var(--accent-purple)", fontSize: "0.85rem", fontWeight: "bold" }}>
                        💡 Ask AI Hint
                    </button>
                    <button onClick={handleExplainComplexity} disabled={aiLoading} style={{ padding: "6px 14px", backgroundColor: "rgba(0, 229, 255, 0.2)", color: "var(--accent-cyan)", border: "1px solid var(--accent-cyan)", fontSize: "0.85rem", fontWeight: "bold" }}>
                        🤖 AI Complexity
                    </button>
                    <span style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        backgroundColor: problem.difficulty === "Easy" ? "rgba(0, 255, 136, 0.15)" : problem.difficulty === "Medium" ? "rgba(255, 183, 3, 0.15)" : "rgba(255, 71, 87, 0.15)",
                        color: problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-yellow)" : "var(--accent-red)"
                    }}>
                        {problem.difficulty}
                    </span>
                </div>
            </div>

            {/* AI Assistant Banner */}
            {(aiHint || aiComplexity) && (
                <div className="glass-card glow-green" style={{ marginBottom: "16px", padding: "16px 20px", border: "1px solid var(--accent-purple)", background: "rgba(168, 85, 247, 0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <h4 style={{ margin: 0, color: "var(--accent-purple)" }}>🤖 AI ASSISTANT RESPONSE</h4>
                        <button onClick={() => { setAiHint(""); setAiComplexity(""); }} style={{ background: "transparent", color: "var(--text-muted)", fontSize: "0.8rem" }}>✕ Close</button>
                    </div>
                    {aiHint && <p style={{ color: "#fff", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{aiHint}</p>}
                    {aiComplexity && <pre style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", marginTop: "8px" }}>{aiComplexity}</pre>}
                </div>
            )}

            {/* LeetCode Split Layout */}
            <div style={{ display: "flex", gap: "16px" }}>
                {/* Left Pane */}
                <div className="glass-card" style={{ flex: 1, height: "78vh", overflowY: "auto" }}>
                    <h2 style={{ color: "var(--accent-green)", fontSize: "1.5rem" }}>{problem.title}</h2>
                    <div style={{ display: "flex", gap: "8px", margin: "10px 0" }}>
                        {problem.tags?.map((t, i) => (
                            <span key={i} style={{ background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                                {t}
                            </span>
                        ))}
                    </div>

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
                            <button onClick={submitCode} disabled={submitLoading} style={{ padding: "8px 18px", backgroundColor: "var(--accent-red)", color: "#fff", fontSize: "0.9rem" }}>
                                {submitLoading ? "Submitting..." : "🚀 Submit"}
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: "10px" }}>
                        <Editor
                            height="450px"
                            language={currentLangObj.monacoLang}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                        />
                    </div>

                    <div className="glass-card" style={{ minHeight: "120px" }}>
                        <h4 style={{ color: "var(--text-muted)", marginBottom: "6px", fontSize: "0.9rem" }}>Console & Execution Output:</h4>
                        <pre style={{ color: "var(--accent-green)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{output || "Run your solution to view output."}</pre>
                        {verdict && (
                            <div style={{ marginTop: "10px", padding: "10px 14px", borderRadius: "8px", backgroundColor: verdict === "Accepted" ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 71, 87, 0.15)", border: verdict === "Accepted" ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)" }}>
                                <h4 style={{ margin: 0, color: verdict === "Accepted" ? "var(--accent-green)" : "var(--accent-red)", fontSize: "1rem" }}>Verdict: {verdict}</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetails;
