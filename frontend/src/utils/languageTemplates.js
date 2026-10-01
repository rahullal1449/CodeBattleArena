export const SUPPORTED_LANGUAGES = [
    { id: "javascript", name: "⚡ JavaScript (Node.js)", monacoLang: "javascript" },
    { id: "python", name: "🐍 Python 3 (3.11)", monacoLang: "python" },
    { id: "cpp", name: "⚙️ C++ (GCC 12)", monacoLang: "cpp" },
    { id: "c", name: "🔧 C (GCC 12)", monacoLang: "c" },
    { id: "java", name: "☕ Java (OpenJDK 17)", monacoLang: "java" }
];

export const getTemplateCode = (language, problem) => {
    const fnName = problem?.functionName || "solution";

    // Extract signature line if starterCode exists
    let jsSig = `function ${fnName}(input) {\n    // Write your solution here\n\n}`;
    if (problem?.starterCode) {
        const firstLine = problem.starterCode.split('\n')[0].trim();
        if (firstLine.startsWith("function ")) {
            jsSig = `${firstLine}\n    // Write your solution here\n\n}`;
        }
    }

    switch (language) {
        case "javascript":
            return jsSig;

        case "python":
            return `def ${fnName}(*args):\n    # Write your solution here\n    pass\n`;

        case "cpp":
            return `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}`;

        case "c":
            return `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}`;

        case "java":
            return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}`;

        default:
            return `// Write your solution here\n`;
    }
};
