const executeCode = require("../services/codeExecutionService");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const SolvedProblem = require("../models/SolvedProblem");
const Battle = require("../models/Battle");
const User = require("../models/User");

const runCode = async (req, res) => {
    try {
        const { code, input, problemId, language = "javascript" } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required",
            });
        }

        // If problemId is provided, run LeetCode-style sample test cases
        if (problemId) {
            const problem = await Problem.findById(problemId);
            if (problem && problem.testCases && problem.testCases.length > 0) {
                const results = [];
                const langKey = (language || "javascript").toLowerCase();

                // Run up to 3 sample test cases for Run Code
                const sampleTestCases = problem.testCases.slice(0, 3);

                for (const testCase of sampleTestCases) {
                    let wrappedCode = code;

                    if (langKey === "javascript" || langKey === "js") {
                        wrappedCode = `
${code}

try {
    const fn = typeof ${problem.functionName || "solution"} === 'function' ? ${problem.functionName || "solution"} : (typeof solution === 'function' ? solution : null);
    if (fn) {
        const res = fn(${testCase.input});
        console.log(JSON.stringify(res));
    }
} catch(e) {
    console.error(e.message);
}
`;
                    } else if (langKey === "python" || langKey === "py") {
                        wrappedCode = `
${code}

try:
    import json
    fn = globals().get('${problem.functionName || "solution"}') or globals().get('solution')
    if fn:
        res = fn(${testCase.input})
        print(json.dumps(res))
except Exception as e:
    import sys
    print(str(e), file=sys.stderr)
`;
                    }

                    const result = await executeCode(wrappedCode, testCase.input, language);

                    let actualOutput = (result.stdout || "").trim();
                    let expectedOutput = (testCase.expectedOutput || "").trim();

                    const passed =
                        result.status?.id === 3 &&
                        actualOutput.replace(/\s+/g, "") === expectedOutput.replace(/\s+/g, "");

                    results.push({
                        input: testCase.input,
                        expectedOutput,
                        actualOutput,
                        status: passed ? "Passed" : "Failed",
                        error: result.stderr || result.compile_output || ""
                    });
                }

                const allPassed = results.every((test) => test.status === "Passed");

                return res.json({
                    status: allPassed ? "Accepted" : "Wrong Answer",
                    allPassed,
                    testCaseResults: results,
                    output: results.map((r, i) => `[Case ${i + 1}] ${r.status}\nInput: ${r.input}\nActual: ${r.actualOutput || "(empty)"}\nExpected: ${r.expectedOutput}`).join("\n\n")
                });
            }
        }

        // Custom direct execution
        const result = await executeCode(code, input || "", language);

        res.json({
            status: result.status?.description,
            output: result.stdout || "",
            error: result.stderr || result.compile_output || "",
        });
    } catch (error) {
        console.error("Run code error:", error.message);

        res.status(500).json({
            message: "Code execution failed",
        });
    }
};

const submitCode = async (req, res) => {
    try {
        const { code, problemId, roomCode, language = "javascript" } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required",
            });
        }

        if (!problemId) {
            return res.status(400).json({
                message: "Problem ID is required",
            });
        }

        // Get problem and test cases from database
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }

        const results = [];
        const langKey = (language || "javascript").toLowerCase();

        for (const testCase of problem.testCases) {
            let wrappedCode = code;

            if (langKey === "javascript" || langKey === "js") {
                wrappedCode = `
${code}

try {
    const fn = typeof ${problem.functionName || "solution"} === 'function' ? ${problem.functionName || "solution"} : (typeof solution === 'function' ? solution : null);
    if (fn) {
        const res = fn(${testCase.input});
        console.log(JSON.stringify(res));
    }
} catch(e) {
    console.error(e.message);
}
`;
            } else if (langKey === "python" || langKey === "py") {
                wrappedCode = `
${code}

try:
    import json
    fn = globals().get('${problem.functionName || "solution"}') or globals().get('solution')
    if fn:
        res = fn(${testCase.input})
        print(json.dumps(res))
except Exception as e:
    import sys
    print(str(e), file=sys.stderr)
`;
            }

            const result = await executeCode(wrappedCode, testCase.input, language);

            let actualOutput = (result.stdout || "").trim();
            let expectedOutput = (testCase.expectedOutput || "").trim();

            // Normalize whitespace and JSON comparison
            const passed =
                result.status?.id === 3 &&
                actualOutput.replace(/\s+/g, "") === expectedOutput.replace(/\s+/g, "");

            results.push({
                input: testCase.input,
                expectedOutput,
                actualOutput,
                status: passed ? "Passed" : "Failed",
            });
        }

        const allPassed = results.every((test) => test.status === "Passed");

        const passedCount = results.filter(
            (test) => test.status === "Passed",
        ).length;

        const verdict = allPassed ? "Accepted" : "Wrong Answer";

        await Submission.create({
            user: req.user.userId,
            problem: problem._id,
            code,
            language: language || "javascript",
            verdict,
            testCasesPassed: passedCount,
            totalTestCases: results.length,
        });

        let battleResult = null;

        if (verdict === "Accepted") {
            try {
                await SolvedProblem.create({
                    user: req.user.userId,
                    problem: problem._id,
                });
            } catch (error) {
                if (error.code !== 11000) {
                    throw error;
                }
            }

            // If inside active battle room, process Winner & Rating/XP updates
            if (roomCode) {
                const battle = await Battle.findOne({ roomCode: roomCode.toUpperCase() });
                if (battle && battle.status === "active") {
                    battle.winner = req.user.userId;
                    battle.status = "completed";
                    battle.endedAt = new Date();
                    await battle.save();

                    const winnerId = req.user.userId;
                    const loserId = battle.player1.toString() === winnerId ? battle.player2 : battle.player1;

                    // Update winner: +25 Rating, +25 XP
                    const winnerUser = await User.findByIdAndUpdate(
                        winnerId,
                        { $inc: { rating: 25, xp: 25, battlesWon: 1, battlesPlayed: 1, problemsSolved: 1 } },
                        { new: true }
                    );

                    // Update loser: -15 Rating, +5 XP
                    let loserUser = null;
                    if (loserId) {
                        const loserDoc = await User.findById(loserId);
                        if (loserDoc) {
                            loserDoc.rating = Math.max(0, loserDoc.rating - 15);
                            loserDoc.xp += 5;
                            loserDoc.battlesPlayed += 1;
                            await loserDoc.save();
                            loserUser = loserDoc;
                        }
                    }

                    battleResult = {
                        battleId: battle._id,
                        roomCode: battle.roomCode,
                        winner: winnerUser,
                        loser: loserUser
                    };
                }
            }
        }

        res.json({
            verdict,
            results,
            passedCount,
            totalCount: results.length,
            battleResult
        });
    } catch (error) {
        console.error("Submit code error:", error.message);

        res.status(500).json({
            message: "Code submission failed",
        });
    }
};

module.exports = {
    runCode,
    submitCode,
};
