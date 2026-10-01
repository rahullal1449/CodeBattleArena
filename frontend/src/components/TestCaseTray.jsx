import { useState } from "react";

function TestCaseTray({ testResults, verdictData, output, running, submitLoading }) {
    const [activeTab, setActiveTab] = useState(0);

    if (running || submitLoading) {
        return (
            <div className="glass-card" style={{ padding: "16px", minHeight: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1rem", color: "var(--accent-cyan)", fontWeight: "bold" }}>
                    ⏳ {running ? "Running sample test cases..." : "Executing full test suite & submitting..."}
                </span>
            </div>
        );
    }

    if (verdictData) {
        const isAccepted = verdictData.verdict === "Accepted";
        return (
            <div className="glass-card" style={{
                padding: "16px",
                border: isAccepted ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)",
                backgroundColor: isAccepted ? "rgba(0, 255, 136, 0.08)" : "rgba(255, 71, 87, 0.08)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, color: isAccepted ? "var(--accent-green)" : "var(--accent-red)", fontSize: "1.2rem", fontWeight: "bold" }}>
                        {isAccepted ? "🎉 Accepted" : "❌ Wrong Answer"}
                    </h3>
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold", padding: "4px 10px", borderRadius: "12px", backgroundColor: "var(--bg-secondary)", color: "var(--text-main)" }}>
                        Passed {verdictData.passedCount ?? verdictData.results?.filter(r => r.status === "Passed").length} / {verdictData.totalCount ?? verdictData.results?.length} Test Cases
                    </span>
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                    {isAccepted ? "All test cases passed successfully! Submission saved." : "Your code produced incorrect output for some test cases."}
                </p>

                {verdictData.results && verdictData.results.length > 0 && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {verdictData.results.map((res, i) => (
                            <span key={i} style={{
                                fontSize: "0.8rem",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                backgroundColor: res.status === "Passed" ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 71, 87, 0.2)",
                                color: res.status === "Passed" ? "var(--accent-green)" : "var(--accent-red)",
                                border: res.status === "Passed" ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)"
                            }}>
                                Test {i + 1}: {res.status}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (testResults && testResults.length > 0) {
        const currentCase = testResults[activeTab] || testResults[0];
        const allPassed = testResults.every(t => t.status === "Passed");

        return (
            <div className="glass-card" style={{ padding: "16px" }}>
                {/* Header Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0, color: "var(--text-main)", fontSize: "0.95rem" }}>
                        🧪 Sample Test Cases Result:
                    </h4>
                    <span style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        backgroundColor: allPassed ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 183, 3, 0.2)",
                        color: allPassed ? "var(--accent-green)" : "var(--accent-yellow)",
                        border: allPassed ? "1px solid var(--accent-green)" : "1px solid var(--accent-yellow)"
                    }}>
                        {allPassed ? "✅ All Samples Passed — Ready to Submit!" : "⚠️ Fix Sample Errors Before Submit"}
                    </span>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                    {testResults.map((tc, idx) => {
                        const isSelected = activeTab === idx;
                        const isPassed = tc.status === "Passed";
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                style={{
                                    padding: "5px 12px",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    borderRadius: "6px",
                                    backgroundColor: isSelected ? "var(--bg-card)" : "var(--bg-secondary)",
                                    color: isPassed ? "var(--accent-green)" : "var(--accent-red)",
                                    border: isSelected ? (isPassed ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)") : "1px solid var(--border-color)",
                                    cursor: "pointer"
                                }}
                            >
                                Case {idx + 1} {isPassed ? "✅" : "❌"}
                            </button>
                        );
                    })}
                </div>

                {/* Case Details */}
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "bold" }}>INPUT:</span>
                        <pre style={{ margin: "2px 0 0", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                            {currentCase.input}
                        </pre>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "bold" }}>YOUR OUTPUT:</span>
                        <pre style={{ margin: "2px 0 0", color: currentCase.status === "Passed" ? "var(--accent-green)" : "var(--accent-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                            {currentCase.actualOutput || "(empty output)"}
                        </pre>
                    </div>

                    <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "bold" }}>EXPECTED OUTPUT:</span>
                        <pre style={{ margin: "2px 0 0", color: "var(--accent-yellow)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                            {currentCase.expectedOutput}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ minHeight: "110px", padding: "14px" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "6px", fontSize: "0.9rem" }}>Console & Execution Output:</h4>
            <pre style={{ color: "var(--accent-green)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", fontSize: "0.9rem", margin: 0 }}>
                {output || "Click ▶️ Run to execute sample test cases or 🚀 Submit to test full suite."}
            </pre>
        </div>
    );
}

export default TestCaseTray;
