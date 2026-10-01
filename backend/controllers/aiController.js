const Problem = require("../models/Problem");

const getAIHint = async (req, res) => {
    try {
        const { problemId, currentCode } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Contextual AI Hint generator logic
        let hint = "";
        if (problem.functionName === "twoSum") {
            hint = "💡 **AI Hint**: Consider using a Hash Map (`Map` or `{}`) to store each number and its index as you iterate through the array. This allows you to check for `target - nums[i]` in O(1) time!";
        } else if (problem.functionName === "reverseString") {
            hint = "💡 **AI Hint**: You can swap characters from both ends moving towards the center using two pointers (`left = 0`, `right = s.length - 1`), or use built-in `.reverse()`.";
        } else if (problem.functionName === "isPalindrome") {
            hint = "💡 **AI Hint**: Negative numbers can never be palindromes! For positive numbers, compare the string representation with its reversed version.";
        } else if (problem.functionName === "isValid") {
            hint = "💡 **AI Hint**: Use a Stack data structure. Push opening brackets `( { [` onto the stack, and when you see a closing bracket, check if it matches the top element of the stack.";
        } else if (problem.functionName === "search") {
            hint = "💡 **AI Hint**: Since the array is sorted, calculate `mid = Math.floor((left + right) / 2)`. If `nums[mid] < target`, move `left = mid + 1`.";
        } else {
            hint = `💡 **AI Hint**: Focus on understanding the constraints for "${problem.title}". Try breaking down the problem into smaller steps and check edge cases!`;
        }

        res.json({
            hint,
            problemTitle: problem.title
        });
    } catch (error) {
        console.error("AI Hint Error:", error.message);
        res.status(500).json({ message: "Failed to generate AI hint" });
    }
};

const getAIComplexity = async (req, res) => {
    try {
        const { code } = req.body;

        let complexityAnalysis = "🤖 **AI Complexity Analysis**:\n";
        if (code.includes("for") && code.includes("Map") || code.includes("Set")) {
            complexityAnalysis += "• **Time Complexity**: O(N) - Linear single-pass iteration.\n• **Space Complexity**: O(N) - Hash Map auxiliary space.";
        } else if ((code.match(/for/g) || []).length >= 2) {
            complexityAnalysis += "• **Time Complexity**: O(N^2) - Nested loop detected.\n• **Space Complexity**: O(1) - Constant memory.";
        } else {
            complexityAnalysis += "• **Time Complexity**: O(N) or O(1)\n• **Space Complexity**: O(1) Constant Space.";
        }

        res.json({
            analysis: complexityAnalysis
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to analyze code complexity" });
    }
};

module.exports = {
    getAIHint,
    getAIComplexity
};
