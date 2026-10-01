import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/problems")
            .then((response) => {
                setProblems(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching problems:", error);
                setLoading(false);
            });
    }, []);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesDiff = difficulty === "All" || p.difficulty.toLowerCase() === difficulty.toLowerCase();
        return matchesSearch && matchesDiff;
    });

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "80px" }}><h2>⏳ Loading Problems Database...</h2></div>;
    }

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <div className="glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h1 style={{ fontSize: "2.2rem", margin: 0 }}>💻 PRACTICE PROBLEMS</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Enhance your algorithmic skills with LeetCode-style problem challenges.</p>
                    </div>
                    <div style={{ background: "var(--bg-secondary)", padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        Total Problems: <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>{problems.length}</span>
                    </div>
                </div>

                {/* Search & Filter Controls */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "25px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="🔍 Search problems by title or tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 2, minWidth: "250px" }}
                    />
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{ flex: 1, minWidth: "150px" }}
                    >
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                {/* LeetCode-style Problems Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid var(--border-color)", color: "var(--text-muted)" }}>
                                <th style={{ padding: "12px 16px" }}>Title</th>
                                <th style={{ padding: "12px 16px" }}>Difficulty</th>
                                <th style={{ padding: "12px 16px" }}>Tags</th>
                                <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                                        No problems match your search filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredProblems.map((problem) => (
                                    <tr
                                        key={problem._id}
                                        style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }}
                                    >
                                        <td style={{ padding: "16px", fontWeight: "bold", fontSize: "1.05rem" }}>
                                            {problem.title}
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <span
                                                style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "4px",
                                                    fontSize: "0.85rem",
                                                    fontWeight: "bold",
                                                    backgroundColor: problem.difficulty === "Easy" ? "rgba(0, 255, 136, 0.15)" : problem.difficulty === "Medium" ? "rgba(255, 183, 3, 0.15)" : "rgba(255, 71, 87, 0.15)",
                                                    color: problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-yellow)" : "var(--accent-red)"
                                                }}
                                            >
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                {problem.tags.map((t, idx) => (
                                                    <span key={idx} style={{ background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <button
                                                onClick={() => navigate(`/problems/${problem._id}`)}
                                                style={{
                                                    padding: "8px 20px",
                                                    backgroundColor: "var(--accent-green)",
                                                    color: "#000",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                Solve ▶
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Problems;
